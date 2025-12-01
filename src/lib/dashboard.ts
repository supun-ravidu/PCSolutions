import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './firebase';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_registered' | 'order_placed' | 'product_updated';
  description: string;
  timestamp: Date;
  user?: string;
  orderId?: string;
  productName?: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total users (assuming users collection exists)
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;

    // Get total products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const totalProducts = productsSnapshot.size;

    // Get total orders and calculate revenue from bookings collection
    const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
    const totalOrders = bookingsSnapshot.size;

    let totalRevenue = 0;
    bookingsSnapshot.forEach((doc) => {
      const booking = doc.data();
      if (booking.total && typeof booking.total === 'number') {
        totalRevenue += booking.total;
      }
    });

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return empty data as fallback
    return {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0
    };
  }
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    const activities: RecentActivity[] = [];

    // Get recent user registrations
    try {
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const usersSnapshot = await getDocs(usersQuery);
      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        activities.push({
          id: doc.id,
          type: 'user_registered',
          description: 'New user registered',
          timestamp: user.createdAt?.toDate() || new Date(),
          user: user.email || 'Unknown'
        });
      });
    } catch (err) {
      console.log('Users collection query error:', err);
    }

    // Get recent bookings/orders
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      bookingsSnapshot.forEach((doc) => {
        const booking = doc.data();
        const customerName = booking.customerInfo?.firstName 
          ? `${booking.customerInfo.firstName} ${booking.customerInfo.lastName || ''}`.trim()
          : 'Customer';
        activities.push({
          id: doc.id,
          type: 'order_placed',
          description: `Order placed by ${customerName}`,
          timestamp: booking.createdAt?.toDate() || new Date(),
          orderId: `#${doc.id.slice(-6).toUpperCase()}`
        });
      });
    } catch (err) {
      console.log('Bookings collection query error:', err);
    }

    // Get recent product updates
    try {
      const productsQuery = query(
        collection(db, 'products'),
        orderBy('updatedAt', 'desc'),
        limit(3)
      );
      const productsSnapshot = await getDocs(productsQuery);
      productsSnapshot.forEach((doc) => {
        const product = doc.data();
        if (product.updatedAt) {
          activities.push({
            id: doc.id,
            type: 'product_updated',
            description: 'Product updated',
            timestamp: product.updatedAt?.toDate() || new Date(),
            productName: product.name || 'Unknown Product'
          });
        }
      });
    } catch (err) {
      console.log('Products collection query error:', err);
    }

    // Sort by timestamp and take latest 10
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activities.slice(0, 10);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    // Return empty array as fallback
    return [];
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(amount);
}

export async function getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  try {
    const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
    const monthlyData: { [key: string]: number } = {};

    // Initialize last 12 months with 0
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = 0;
    }

    bookingsSnapshot.forEach((doc) => {
      const booking = doc.data();
      // Check for both createdAt and bookingDate
      const dateField = booking.createdAt || booking.bookingDate;
      if (dateField && booking.total && typeof booking.total === 'number') {
        const bookingDate = dateField.toDate();
        const monthKey = bookingDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        if (monthlyData[monthKey] !== undefined) {
          monthlyData[monthKey] += booking.total;
        }
      }
    });

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }));
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    // Return empty data for last 12 months
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return {
        month: date.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
        revenue: 0
      };
    });
  }
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}