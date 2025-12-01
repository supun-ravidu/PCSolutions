'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { getDashboardStats, getRecentActivity, getMonthlyRevenue, formatCurrency, formatTimeAgo, DashboardStats, RecentActivity, MonthlyRevenue } from '../../../lib/dashboard';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { BarChart3, Users, Package, ShoppingCart, LogOut, TrendingUp, Activity, RefreshCw, Plus, Edit, Trash2, Zap, Settings, Bell, Star, Rocket, Tag, Gift, Flame, Ticket, MessageSquare, Eye, Check, Trash, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  specs: string[];
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  imageUrl: string;
  validUntil: string;
  isActive: boolean;
}

interface FeaturedDeal {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  validUntil: string;
  isActive: boolean;
}

interface HotDeal {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  validUntil: string;
  stockLeft: number;
  isActive: boolean;
}

interface CouponCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
  status: 'unread' | 'read' | 'responded' | 'archived';
  priority: 'normal' | 'high' | 'urgent';
  submittedAt: any;
  readAt: any;
  respondedAt: any;
  notes: string;
}

interface Booking {
  id: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    id: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: any;
  createdAt: any;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'offers' | 'featured' | 'hot' | 'coupons' | 'contacts'>('products');
  
  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    category: '',
    brand: '',
    specs: ''
  });

  // Offers
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    imageUrl: '',
    validUntil: '',
    isActive: true
  });

  // Featured Deals
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeal[]>([]);
  const [showAddFeatured, setShowAddFeatured] = useState(false);
  const [editingFeatured, setEditingFeatured] = useState<FeaturedDeal | null>(null);
  const [newFeatured, setNewFeatured] = useState({
    productId: '',
    productName: '',
    imageUrl: '',
    originalPrice: '',
    dealPrice: '',
    discount: '',
    validUntil: '',
    isActive: true
  });

  // Hot Deals
  const [hotDeals, setHotDeals] = useState<HotDeal[]>([]);
  const [showAddHot, setShowAddHot] = useState(false);
  const [editingHot, setEditingHot] = useState<HotDeal | null>(null);
  const [newHot, setNewHot] = useState({
    productId: '',
    productName: '',
    imageUrl: '',
    originalPrice: '',
    dealPrice: '',
    discount: '',
    validUntil: '',
    stockLeft: '',
    isActive: true
  });

  // Coupon Codes
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponCode | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    validUntil: '',
    usageLimit: '',
    isActive: true
  });

  // Contact Submissions
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [contactFilter, setContactFilter] = useState<'all' | 'unread' | 'read' | 'responded' | 'archived'>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setUser({ email: 'Admin@gmail.com' });
      setLoading(false);
      fetchDashboardData();
      fetchProducts();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'Admin@gmail.com') {
        setUser(user);
        fetchDashboardData();
        fetchProducts();
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Real-time listeners for live dashboard updates
  useEffect(() => {
    if (!user) return;

    // Real-time listener for bookings
    const bookingsUnsubscribe = onSnapshot(
      query(collection(db, 'bookings'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const bookingsData: Booking[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          bookingsData.push({
            id: doc.id,
            customerInfo: data.customerInfo || {},
            items: data.items || [],
            total: data.total || 0,
            currency: data.currency || 'Rs',
            status: data.status || 'pending',
            bookingDate: data.bookingDate,
            createdAt: data.createdAt
          });
        });
        setBookings(bookingsData);
        // Update stats in real-time
        updateStatsFromBookings(bookingsData);
      },
      (error) => {
        console.error('Error listening to bookings:', error);
      }
    );

    // Real-time listener for products
    const productsUnsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productsData: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: doc.id,
            name: data.name || '',
            price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0,
            originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : parseFloat(data.originalPrice) || 0,
            imageUrl: data.imageUrl || '',
            category: data.category || '',
            brand: data.brand || '',
            rating: typeof data.rating === 'number' ? data.rating : parseFloat(data.rating) || 0,
            reviews: typeof data.reviews === 'number' ? data.reviews : parseInt(data.reviews) || 0,
            inStock: typeof data.inStock === 'boolean' ? data.inStock : data.inStock === 'true',
            specs: Array.isArray(data.specs) ? data.specs : (typeof data.specs === 'string' ? data.specs.split(',').map(s => s.trim()) : [])
          });
        });
        setProducts(productsData);
      },
      (error) => {
        console.error('Error listening to products:', error);
      }
    );

    // Real-time listener for contact submissions
    const contactsUnsubscribe = onSnapshot(
      query(collection(db, 'contactSubmissions'), orderBy('submittedAt', 'desc')),
      (snapshot) => {
        const contactsData: ContactSubmission[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          contactsData.push({
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            subject: data.subject || '',
            category: data.category || 'general',
            message: data.message || '',
            status: data.status || 'unread',
            priority: data.priority || 'normal',
            submittedAt: data.submittedAt,
            readAt: data.readAt,
            respondedAt: data.respondedAt,
            notes: data.notes || ''
          });
        });
        setContacts(contactsData);
        setUnreadCount(contactsData.filter(c => c.status === 'unread').length);
      },
      (error) => {
        console.error('Error listening to contacts:', error);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      bookingsUnsubscribe();
      productsUnsubscribe();
      contactsUnsubscribe();
    };
  }, [user]);

  // Helper function to update stats from bookings data
  const updateStatsFromBookings = async (bookingsData: Booking[]) => {
    try {
      const totalOrders = bookingsData.length;
      const totalRevenue = bookingsData.reduce((sum, booking) => sum + (booking.total || 0), 0);
      
      // Get products count
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const totalProducts = productsSnapshot.size;

      // Get users count
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      });

      // Update monthly revenue
      const monthlyData: { [key: string]: number } = {};
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[monthKey] = 0;
      }

      bookingsData.forEach((booking) => {
        const dateField = booking.createdAt || booking.bookingDate;
        if (dateField && booking.total) {
          const bookingDate = dateField.toDate();
          const monthKey = bookingDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
          if (monthlyData[monthKey] !== undefined) {
            monthlyData[monthKey] += booking.total;
          }
        }
      });

      const revenueData = Object.entries(monthlyData).map(([month, revenue]) => ({
        month,
        revenue
      }));
      setMonthlyRevenue(revenueData);

      // Update recent activities
      const activitiesData = await getRecentActivity();
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [statsData, activitiesData, revenueData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
        getMonthlyRevenue(),
        fetchProducts(),
        fetchOffers(),
        fetchFeaturedDeals(),
        fetchHotDeals(),
        fetchCoupons(),
        fetchContactSubmissions(),
        fetchBookings()
      ]);
      setStats(statsData);
      setActivities(activitiesData);
      setMonthlyRevenue(revenueData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          name: data.name || '',
          price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0,
          originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : parseFloat(data.originalPrice) || 0,
          imageUrl: data.imageUrl || '',
          category: data.category || '',
          brand: data.brand || '',
          rating: typeof data.rating === 'number' ? data.rating : parseFloat(data.rating) || 0,
          reviews: typeof data.reviews === 'number' ? data.reviews : parseInt(data.reviews) || 0,
          inStock: typeof data.inStock === 'boolean' ? data.inStock : data.inStock === 'true',
          specs: Array.isArray(data.specs) ? data.specs : (typeof data.specs === 'string' ? data.specs.split(',').map(s => s.trim()) : [])
        });
      });
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price),
        imageUrl: newProduct.imageUrl,
        category: newProduct.category,
        brand: newProduct.brand,
        rating: 0,
        reviews: 0,
        inStock: true,
        specs: newProduct.specs.split(',').map(spec => spec.trim()),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'products'), productData);

      // Reset form
      setNewProduct({
        name: '',
        price: '',
        originalPrice: '',
        imageUrl: '',
        category: '',
        brand: '',
        specs: ''
      });
      setShowAddProduct(false);

      // Refresh data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      brand: product.brand,
      specs: product.specs.join(', ')
    });
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        await fetchDashboardData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const productRef = doc(db, 'products', editingProduct.id);
      const updateData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price),
        imageUrl: newProduct.imageUrl,
        category: newProduct.category,
        brand: newProduct.brand,
        specs: newProduct.specs.split(',').map(spec => spec.trim()),
        updatedAt: Timestamp.now()
      };

      await updateDoc(productRef, updateData);

      // Reset form
      setNewProduct({
        name: '',
        price: '',
        originalPrice: '',
        imageUrl: '',
        category: '',
        brand: '',
        specs: ''
      });
      setEditingProduct(null);
      setShowAddProduct(false);

      // Refresh data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setNewProduct({
      name: '',
      price: '',
      originalPrice: '',
      imageUrl: '',
      category: '',
      brand: '',
      specs: ''
    });
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  // ============ OFFERS MANAGEMENT ============
  const fetchOffers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'offers'));
      const offersData: Offer[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        offersData.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          discount: typeof data.discount === 'number' ? data.discount : parseFloat(data.discount) || 0,
          imageUrl: data.imageUrl || '',
          validUntil: data.validUntil || '',
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true
        });
      });
      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const offerData = {
        title: newOffer.title,
        description: newOffer.description,
        discount: parseFloat(newOffer.discount),
        imageUrl: newOffer.imageUrl,
        validUntil: newOffer.validUntil,
        isActive: newOffer.isActive,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'offers'), offerData);
      setNewOffer({ title: '', description: '', discount: '', imageUrl: '', validUntil: '', isActive: true });
      setShowAddOffer(false);
      await fetchOffers();
    } catch (error) {
      console.error('Error adding offer:', error);
      alert('Error adding offer. Please try again.');
    }
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setNewOffer({
      title: offer.title,
      description: offer.description,
      discount: offer.discount.toString(),
      imageUrl: offer.imageUrl,
      validUntil: offer.validUntil,
      isActive: offer.isActive
    });
    setShowAddOffer(true);
  };

  const handleUpdateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    try {
      const offerRef = doc(db, 'offers', editingOffer.id);
      await updateDoc(offerRef, {
        title: newOffer.title,
        description: newOffer.description,
        discount: parseFloat(newOffer.discount),
        imageUrl: newOffer.imageUrl,
        validUntil: newOffer.validUntil,
        isActive: newOffer.isActive,
        updatedAt: Timestamp.now()
      });

      setNewOffer({ title: '', description: '', discount: '', imageUrl: '', validUntil: '', isActive: true });
      setEditingOffer(null);
      setShowAddOffer(false);
      await fetchOffers();
    } catch (error) {
      console.error('Error updating offer:', error);
      alert('Error updating offer. Please try again.');
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteDoc(doc(db, 'offers', offerId));
        await fetchOffers();
      } catch (error) {
        console.error('Error deleting offer:', error);
        alert('Error deleting offer. Please try again.');
      }
    }
  };

  // ============ FEATURED DEALS MANAGEMENT ============
  const fetchFeaturedDeals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'featuredDeals'));
      const dealsData: FeaturedDeal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dealsData.push({
          id: doc.id,
          productId: data.productId || '',
          productName: data.productName || '',
          imageUrl: data.imageUrl || '',
          originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : parseFloat(data.originalPrice) || 0,
          dealPrice: typeof data.dealPrice === 'number' ? data.dealPrice : parseFloat(data.dealPrice) || 0,
          discount: typeof data.discount === 'number' ? data.discount : parseFloat(data.discount) || 0,
          validUntil: data.validUntil || '',
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true
        });
      });
      setFeaturedDeals(dealsData);
    } catch (error) {
      console.error('Error fetching featured deals:', error);
    }
  };

  const handleAddFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dealData = {
        productId: newFeatured.productId,
        productName: newFeatured.productName,
        imageUrl: newFeatured.imageUrl,
        originalPrice: parseFloat(newFeatured.originalPrice),
        dealPrice: parseFloat(newFeatured.dealPrice),
        discount: parseFloat(newFeatured.discount),
        validUntil: newFeatured.validUntil,
        isActive: newFeatured.isActive,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'featuredDeals'), dealData);
      setNewFeatured({ productId: '', productName: '', imageUrl: '', originalPrice: '', dealPrice: '', discount: '', validUntil: '', isActive: true });
      setShowAddFeatured(false);
      await fetchFeaturedDeals();
    } catch (error) {
      console.error('Error adding featured deal:', error);
      alert('Error adding featured deal. Please try again.');
    }
  };

  const handleEditFeatured = (deal: FeaturedDeal) => {
    setEditingFeatured(deal);
    setNewFeatured({
      productId: deal.productId,
      productName: deal.productName,
      imageUrl: deal.imageUrl,
      originalPrice: deal.originalPrice.toString(),
      dealPrice: deal.dealPrice.toString(),
      discount: deal.discount.toString(),
      validUntil: deal.validUntil,
      isActive: deal.isActive
    });
    setShowAddFeatured(true);
  };

  const handleUpdateFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeatured) return;

    try {
      const dealRef = doc(db, 'featuredDeals', editingFeatured.id);
      await updateDoc(dealRef, {
        productId: newFeatured.productId,
        productName: newFeatured.productName,
        imageUrl: newFeatured.imageUrl,
        originalPrice: parseFloat(newFeatured.originalPrice),
        dealPrice: parseFloat(newFeatured.dealPrice),
        discount: parseFloat(newFeatured.discount),
        validUntil: newFeatured.validUntil,
        isActive: newFeatured.isActive,
        updatedAt: Timestamp.now()
      });

      setNewFeatured({ productId: '', productName: '', imageUrl: '', originalPrice: '', dealPrice: '', discount: '', validUntil: '', isActive: true });
      setEditingFeatured(null);
      setShowAddFeatured(false);
      await fetchFeaturedDeals();
    } catch (error) {
      console.error('Error updating featured deal:', error);
      alert('Error updating featured deal. Please try again.');
    }
  };

  const handleDeleteFeatured = async (dealId: string) => {
    if (window.confirm('Are you sure you want to delete this featured deal?')) {
      try {
        await deleteDoc(doc(db, 'featuredDeals', dealId));
        await fetchFeaturedDeals();
      } catch (error) {
        console.error('Error deleting featured deal:', error);
        alert('Error deleting featured deal. Please try again.');
      }
    }
  };

  // ============ HOT DEALS MANAGEMENT ============
  const fetchHotDeals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'hotDeals'));
      const dealsData: HotDeal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dealsData.push({
          id: doc.id,
          productId: data.productId || '',
          productName: data.productName || '',
          imageUrl: data.imageUrl || '',
          originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : parseFloat(data.originalPrice) || 0,
          dealPrice: typeof data.dealPrice === 'number' ? data.dealPrice : parseFloat(data.dealPrice) || 0,
          discount: typeof data.discount === 'number' ? data.discount : parseFloat(data.discount) || 0,
          validUntil: data.validUntil || '',
          stockLeft: typeof data.stockLeft === 'number' ? data.stockLeft : parseInt(data.stockLeft) || 0,
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true
        });
      });
      setHotDeals(dealsData);
    } catch (error) {
      console.error('Error fetching hot deals:', error);
    }
  };

  const handleAddHot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dealData = {
        productId: newHot.productId,
        productName: newHot.productName,
        imageUrl: newHot.imageUrl,
        originalPrice: parseFloat(newHot.originalPrice),
        dealPrice: parseFloat(newHot.dealPrice),
        discount: parseFloat(newHot.discount),
        validUntil: newHot.validUntil,
        stockLeft: parseInt(newHot.stockLeft),
        isActive: newHot.isActive,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'hotDeals'), dealData);
      setNewHot({ productId: '', productName: '', imageUrl: '', originalPrice: '', dealPrice: '', discount: '', validUntil: '', stockLeft: '', isActive: true });
      setShowAddHot(false);
      await fetchHotDeals();
    } catch (error) {
      console.error('Error adding hot deal:', error);
      alert('Error adding hot deal. Please try again.');
    }
  };

  const handleEditHot = (deal: HotDeal) => {
    setEditingHot(deal);
    setNewHot({
      productId: deal.productId,
      productName: deal.productName,
      imageUrl: deal.imageUrl,
      originalPrice: deal.originalPrice.toString(),
      dealPrice: deal.dealPrice.toString(),
      discount: deal.discount.toString(),
      validUntil: deal.validUntil,
      stockLeft: deal.stockLeft.toString(),
      isActive: deal.isActive
    });
    setShowAddHot(true);
  };

  const handleUpdateHot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHot) return;

    try {
      const dealRef = doc(db, 'hotDeals', editingHot.id);
      await updateDoc(dealRef, {
        productId: newHot.productId,
        productName: newHot.productName,
        imageUrl: newHot.imageUrl,
        originalPrice: parseFloat(newHot.originalPrice),
        dealPrice: parseFloat(newHot.dealPrice),
        discount: parseFloat(newHot.discount),
        validUntil: newHot.validUntil,
        stockLeft: parseInt(newHot.stockLeft),
        isActive: newHot.isActive,
        updatedAt: Timestamp.now()
      });

      setNewHot({ productId: '', productName: '', imageUrl: '', originalPrice: '', dealPrice: '', discount: '', validUntil: '', stockLeft: '', isActive: true });
      setEditingHot(null);
      setShowAddHot(false);
      await fetchHotDeals();
    } catch (error) {
      console.error('Error updating hot deal:', error);
      alert('Error updating hot deal. Please try again.');
    }
  };

  const handleDeleteHot = async (dealId: string) => {
    if (window.confirm('Are you sure you want to delete this hot deal?')) {
      try {
        await deleteDoc(doc(db, 'hotDeals', dealId));
        await fetchHotDeals();
      } catch (error) {
        console.error('Error deleting hot deal:', error);
        alert('Error deleting hot deal. Please try again.');
      }
    }
  };

  // ============ COUPON CODES MANAGEMENT ============
  const fetchCoupons = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'couponCodes'));
      const couponsData: CouponCode[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        couponsData.push({
          id: doc.id,
          code: data.code || '',
          description: data.description || '',
          discountType: data.discountType || 'percentage',
          discountValue: typeof data.discountValue === 'number' ? data.discountValue : parseFloat(data.discountValue) || 0,
          minPurchase: typeof data.minPurchase === 'number' ? data.minPurchase : parseFloat(data.minPurchase) || 0,
          maxDiscount: typeof data.maxDiscount === 'number' ? data.maxDiscount : parseFloat(data.maxDiscount) || 0,
          validUntil: data.validUntil || '',
          usageLimit: typeof data.usageLimit === 'number' ? data.usageLimit : parseInt(data.usageLimit) || 0,
          usedCount: typeof data.usedCount === 'number' ? data.usedCount : parseInt(data.usedCount) || 0,
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true
        });
      });
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const couponData = {
        code: newCoupon.code.toUpperCase(),
        description: newCoupon.description,
        discountType: newCoupon.discountType,
        discountValue: parseFloat(newCoupon.discountValue),
        minPurchase: parseFloat(newCoupon.minPurchase),
        maxDiscount: parseFloat(newCoupon.maxDiscount),
        validUntil: newCoupon.validUntil,
        usageLimit: parseInt(newCoupon.usageLimit),
        usedCount: 0,
        isActive: newCoupon.isActive,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'couponCodes'), couponData);
      setNewCoupon({ code: '', description: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', validUntil: '', usageLimit: '', isActive: true });
      setShowAddCoupon(false);
      await fetchCoupons();
    } catch (error) {
      console.error('Error adding coupon:', error);
      alert('Error adding coupon. Please try again.');
    }
  };

  const handleEditCoupon = (coupon: CouponCode) => {
    setEditingCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minPurchase: coupon.minPurchase.toString(),
      maxDiscount: coupon.maxDiscount.toString(),
      validUntil: coupon.validUntil,
      usageLimit: coupon.usageLimit.toString(),
      isActive: coupon.isActive
    });
    setShowAddCoupon(true);
  };

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    try {
      const couponRef = doc(db, 'couponCodes', editingCoupon.id);
      await updateDoc(couponRef, {
        code: newCoupon.code.toUpperCase(),
        description: newCoupon.description,
        discountType: newCoupon.discountType,
        discountValue: parseFloat(newCoupon.discountValue),
        minPurchase: parseFloat(newCoupon.minPurchase),
        maxDiscount: parseFloat(newCoupon.maxDiscount),
        validUntil: newCoupon.validUntil,
        usageLimit: parseInt(newCoupon.usageLimit),
        isActive: newCoupon.isActive,
        updatedAt: Timestamp.now()
      });

      setNewCoupon({ code: '', description: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', validUntil: '', usageLimit: '', isActive: true });
      setEditingCoupon(null);
      setShowAddCoupon(false);
      await fetchCoupons();
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Error updating coupon. Please try again.');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteDoc(doc(db, 'couponCodes', couponId));
        await fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert('Error deleting coupon. Please try again.');
      }
    }
  };

  // ============ CONTACT SUBMISSIONS MANAGEMENT ============
  const fetchContactSubmissions = async () => {
    try {
      const q = query(collection(db, 'contactSubmissions'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const contactsData: ContactSubmission[] = [];
      let unreadCounter = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'unread') unreadCounter++;
        
        contactsData.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          subject: data.subject || '',
          category: data.category || '',
          message: data.message || '',
          status: data.status || 'unread',
          priority: data.priority || 'normal',
          submittedAt: data.submittedAt,
          readAt: data.readAt,
          respondedAt: data.respondedAt,
          notes: data.notes || ''
        });
      });
      
      setContacts(contactsData);
      setUnreadCount(unreadCounter);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    }
  };

  const handleMarkAsRead = async (contactId: string) => {
    try {
      const contactRef = doc(db, 'contactSubmissions', contactId);
      await updateDoc(contactRef, {
        status: 'read',
        readAt: Timestamp.now()
      });
      await fetchContactSubmissions();
    } catch (error) {
      console.error('Error marking contact as read:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleMarkAsResponded = async (contactId: string) => {
    try {
      const contactRef = doc(db, 'contactSubmissions', contactId);
      await updateDoc(contactRef, {
        status: 'responded',
        respondedAt: Timestamp.now()
      });
      await fetchContactSubmissions();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error marking contact as responded:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleArchiveContact = async (contactId: string) => {
    try {
      const contactRef = doc(db, 'contactSubmissions', contactId);
      await updateDoc(contactRef, {
        status: 'archived'
      });
      await fetchContactSubmissions();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error archiving contact:', error);
      alert('Error archiving contact. Please try again.');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await deleteDoc(doc(db, 'contactSubmissions', contactId));
        await fetchContactSubmissions();
        setSelectedContact(null);
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
      }
    }
  };

  // ============ BOOKINGS MANAGEMENT ============
  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('bookingDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const bookingsData: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookingsData.push({
          id: doc.id,
          customerInfo: data.customerInfo || {},
          items: data.items || [],
          total: data.total || 0,
          currency: data.currency || 'Rs',
          status: data.status || 'pending',
          bookingDate: data.bookingDate,
          createdAt: data.createdAt
        });
      });
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: status
      });
      await fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status. Please try again.');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        await fetchBookings();
        setSelectedBooking(null);
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error deleting booking. Please try again.');
      }
    }
  };

  const getFilteredContacts = () => {
    if (contactFilter === 'all') return contacts;
    return contacts.filter(contact => contact.status === contactFilter);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-yellow-100 text-yellow-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('adminLoggedIn');
    await auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Rocket className="h-8 w-8 mr-3 animate-bounce" />
                Admin Dashboard
                <span className="ml-4 flex items-center text-sm font-normal bg-green-500/20 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Live Updates
                </span>
              </h1>
              <p className="text-blue-100">Welcome back, {user.email} 👋</p>
              <p className="text-blue-200 text-sm mt-1">Ready to conquer the day? 🚀</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('contacts')}
                className="relative p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 transition-all duration-300">{stats?.totalUsers.toLocaleString() || '0'}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live tracking
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl group-hover:scale-110 transition-transform">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 transition-all duration-300">{stats?.totalProducts.toLocaleString() || '0'}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live tracking
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 transition-all duration-300">{stats?.totalOrders.toLocaleString() || '0'}</p>
                <p className="text-xs text-orange-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Real-time updates
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 transition-all duration-300">{stats ? formatCurrency(stats.totalRevenue) : formatCurrency(0)}</p>
                <p className="text-xs text-purple-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Real-time tracking
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Messages Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/contacts"
            className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden group block"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    {unreadCount} New!
                  </span>
                )}
              </div>
              <p className="text-pink-100 text-sm font-medium mb-1">Contact Messages</p>
              <p className="text-4xl font-bold text-white mb-2">{contacts.length}</p>
              <p className="text-pink-200 text-sm">View all messages →</p>
            </div>
          </Link>          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
                <Check className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Responded</p>
            <p className="text-3xl font-bold text-gray-900">{contacts.filter(c => c.status === 'responded').length}</p>
            <p className="text-sm text-green-600 mt-2">
              {contacts.length > 0 ? Math.round((contacts.filter(c => c.status === 'responded').length / contacts.length) * 100) : 0}% Response Rate
            </p>
          </div>

          <Link
            href="/admin/bookings"
            className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden group block"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                {bookings.filter(b => b.status === 'pending').length > 0 && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    {bookings.filter(b => b.status === 'pending').length} Pending
                  </span>
                )}
              </div>
              <p className="text-cyan-100 text-sm font-medium mb-1">Customer Bookings</p>
              <p className="text-4xl font-bold text-white mb-2">{bookings.length}</p>
              <p className="text-cyan-200 text-sm">View all orders →</p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">High Priority</p>
            <p className="text-3xl font-bold text-gray-900">{contacts.filter(c => c.priority === 'high' || c.priority === 'urgent').length}</p>
            <p className="text-sm text-orange-600 mt-2">Requires immediate attention</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-yellow-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 group"
            >
              <Plus className="h-8 w-8 text-blue-600 mb-2 group-hover:animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Add Product</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 group">
              <Users className="h-8 w-8 text-green-600 mb-2 group-hover:animate-pulse" />
              <span className="text-sm font-medium text-gray-700">View Users</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 group">
              <ShoppingCart className="h-8 w-8 text-purple-600 mb-2 group-hover:animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Orders</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105 group">
              <Settings className="h-8 w-8 text-orange-600 mb-2 group-hover:animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </button>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative">
          <div className="absolute top-4 right-4 flex items-center text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Connected to Firebase
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-purple-600" />
            Revenue Overview
          </h2>
          <p className="text-sm text-gray-600 mb-6">Last 12 months revenue from bookings</p>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyRevenue.length > 0 ? monthlyRevenue.map((data, index) => {
              const maxRevenue = Math.max(...monthlyRevenue.map(d => d.revenue));
              const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all duration-500 hover:from-purple-600 hover:to-purple-500 relative group cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatCurrency(data.revenue)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                    {data.month.split(' ')[0]}
                  </span>
                </div>
              );
            }) : (
              <div className="w-full text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No revenue data available</p>
                <p className="text-xs text-gray-400 mt-2">Data will appear as orders are placed</p>
              </div>
            )}
          </div>
          {monthlyRevenue.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600">Total Revenue</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Average/Month</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / 12)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">This Month</p>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-green-600" />
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-spin" style={{animationDuration: '3s'}}></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Firebase Connected</h3>
              <p className="text-sm text-green-700 font-medium">All systems operational</p>
              <p className="text-xs text-gray-500 mt-2">Real-time sync active</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping" style={{animationDuration: '2s'}}></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Firestore Database</h3>
              <p className="text-sm text-blue-700 font-medium">Performing optimally</p>
              <p className="text-xs text-gray-500 mt-2">Live listeners active</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-purple-300 animate-bounce" style={{animationDuration: '1.5s'}}></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Real-time Updates</h3>
              <p className="text-sm text-purple-700 font-medium">Lightning fast</p>
              <p className="text-xs text-gray-500 mt-2">Auto-refresh enabled</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative">
          <div className="absolute top-4 right-4 flex items-center text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live Feed
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Activity className="h-6 w-6 mr-2 text-blue-600" />
                Recent Activity
              </h2>
              <p className="text-sm text-gray-600 mt-1">Real-time updates from Firebase</p>
            </div>
            {refreshing && (
              <div className="flex items-center text-sm text-blue-600">
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                Syncing...
              </div>
            )}
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between py-3 px-4 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 rounded-lg transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center ${
                      activity.type === 'user_registered' ? 'bg-blue-100' :
                      activity.type === 'order_placed' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'user_registered' ? (
                        <Users className="h-5 w-5 text-blue-600" />
                      ) : activity.type === 'order_placed' ? (
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                      ) : (
                        <Package className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-600 truncate">
                        {activity.user || activity.orderId || activity.productName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center ml-4">
                    <span className="text-xs text-gray-500 bg-gray-100 group-hover:bg-white px-3 py-1 rounded-full whitespace-nowrap transition-colors">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Activity className="h-16 w-16 text-gray-300" />
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200 animate-pulse"></div>
                </div>
                <p className="text-gray-500 font-medium">No recent activity</p>
                <p className="text-xs text-gray-400 mt-2">Activity will appear here as events occur</p>
              </div>
            )}
          </div>
          {activities.length > 5 && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Showing {activities.length} recent activities
              </p>
            </div>
          )}
        </div>

        {/* Tabbed Management Interface */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Package className="h-5 w-5 mr-2" />
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'offers'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Tag className="h-5 w-5 mr-2" />
              Offers ({offers.length})
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'featured'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className="h-5 w-5 mr-2" />
              Featured Deals ({featuredDeals.length})
            </button>
            <button
              onClick={() => setActiveTab('hot')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'hot'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Flame className="h-5 w-5 mr-2" />
              Hot Deals ({hotDeals.length})
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'coupons'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Ticket className="h-5 w-5 mr-2" />
              Coupon Codes ({coupons.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 relative ${
                activeTab === 'contacts'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Messages ({contacts.length})
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                  {unreadCount} new
                </span>
              )}
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Package className="h-6 w-6 mr-2 text-green-600" />
                  Product Management
                </h2>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Product
                </button>
              </div>

          {/* Add/Edit Product Form */}
          {showAddProduct && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200 animate-pulse">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {editingProduct ? '✏️ Edit Product' : '🚀 Add New Product'}
              </h3>
              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="laptops">Laptops</option>
                    <option value="desktops">Desktops</option>
                    <option value="monitors">Monitors</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specifications (comma-separated)</label>
                  <input
                    type="text"
                    value={newProduct.specs}
                    onChange={(e) => setNewProduct({...newProduct, specs: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="RTX 4070, 16GB RAM, 512GB SSD"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    {editingProduct ? '✏️ Update Product' : '✨ Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

              {/* Products List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Products ({products.length})</h3>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center justify-between mb-2">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-green-600">{formatCurrency(product.price)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Tag className="h-6 w-6 mr-2 text-blue-600" />
                  Offers Management
                </h2>
                <button
                  onClick={() => setShowAddOffer(!showAddOffer)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Offer
                </button>
              </div>

              {showAddOffer && (
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {editingOffer ? '✏️ Edit Offer' : '🎉 Add New Offer'}
                  </h3>
                  <form onSubmit={editingOffer ? handleUpdateOffer : handleAddOffer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                      <input
                        type="text"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newOffer.description}
                        onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newOffer.discount}
                        onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newOffer.imageUrl}
                        onChange={(e) => setNewOffer({...newOffer, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        value={newOffer.validUntil}
                        onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newOffer.isActive}
                          onChange={(e) => setNewOffer({...newOffer, isActive: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        {editingOffer ? '✏️ Update Offer' : '✨ Add Offer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddOffer(false);
                          setEditingOffer(null);
                          setNewOffer({ title: '', description: '', discount: '', imageUrl: '', validUntil: '', isActive: true });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Offers ({offers.length})</h3>
                {offers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offers.map((offer) => (
                      <div key={offer.id} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{offer.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleEditOffer(offer)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(offer.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600">{offer.discount}% OFF</span>
                          <span className="text-xs text-gray-500">Until: {offer.validUntil}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No offers yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Featured Deals Tab */}
          {activeTab === 'featured' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-purple-600" />
                  Featured Deals Management
                </h2>
                <button
                  onClick={() => setShowAddFeatured(!showAddFeatured)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Featured Deal
                </button>
              </div>

              {showAddFeatured && (
                <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-dashed border-purple-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {editingFeatured ? '✏️ Edit Featured Deal' : '⭐ Add New Featured Deal'}
                  </h3>
                  <form onSubmit={editingFeatured ? handleUpdateFeatured : handleAddFeatured} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                      <input
                        type="text"
                        value={newFeatured.productId}
                        onChange={(e) => setNewFeatured({...newFeatured, productId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        value={newFeatured.productName}
                        onChange={(e) => setNewFeatured({...newFeatured, productName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newFeatured.imageUrl}
                        onChange={(e) => setNewFeatured({...newFeatured, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Rs.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newFeatured.originalPrice}
                        onChange={(e) => setNewFeatured({...newFeatured, originalPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deal Price (Rs.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newFeatured.dealPrice}
                        onChange={(e) => setNewFeatured({...newFeatured, dealPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newFeatured.discount}
                        onChange={(e) => setNewFeatured({...newFeatured, discount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        value={newFeatured.validUntil}
                        onChange={(e) => setNewFeatured({...newFeatured, validUntil: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFeatured.isActive}
                          onChange={(e) => setNewFeatured({...newFeatured, isActive: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                      >
                        {editingFeatured ? '✏️ Update Deal' : '✨ Add Deal'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddFeatured(false);
                          setEditingFeatured(null);
                          setNewFeatured({ productId: '', productName: '', imageUrl: '', originalPrice: '', dealPrice: '', discount: '', validUntil: '', isActive: true });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Featured Deals ({featuredDeals.length})</h3>
                {featuredDeals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredDeals.map((deal) => (
                      <div key={deal.id} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <img src={deal.imageUrl} alt={deal.productName} className="w-12 h-12 object-cover rounded-lg" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image'; }} />
                          <div className="flex gap-2">
                            <button onClick={() => handleEditFeatured(deal)} className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteFeatured(deal.id)} className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{deal.productName}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm line-through text-gray-500">{formatCurrency(deal.originalPrice)}</span>
                          <span className="font-bold text-purple-600">{formatCurrency(deal.dealPrice)}</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{deal.discount}% OFF</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Until: {deal.validUntil}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${deal.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {deal.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No featured deals yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Hot Deals Tab */}
          {activeTab === 'hot' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Flame className="h-6 w-6 mr-2 text-orange-600" />
                  Hot Deals Management
                </h2>
                <button
                  onClick={() => setShowAddHot(!showAddHot)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Hot Deal
                </button>
              </div>

              {showAddHot && (
                <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-dashed border-orange-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {editingHot ? '✏️ Edit Hot Deal' : '🔥 Add New Hot Deal'}
                  </h3>
                  <form onSubmit={editingHot ? handleUpdateHot : handleAddHot} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                      <input
                        type="text"
                        value={newHot.productId}
                        onChange={(e) => setNewHot({...newHot, productId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        value={newHot.productName}
                        onChange={(e) => setNewHot({...newHot, productName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newHot.imageUrl}
                        onChange={(e) => setNewHot({...newHot, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Rs.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newHot.originalPrice}
                        onChange={(e) => setNewHot({...newHot, originalPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deal Price (Rs.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newHot.dealPrice}
                        onChange={(e) => setNewHot({...newHot, dealPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newHot.discount}
                        onChange={(e) => setNewHot({...newHot, discount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Left</label>
                      <input
                        type="number"
                        value={newHot.stockLeft}
                        onChange={(e) => setNewHot({...newHot, stockLeft: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        value={newHot.validUntil}
                        onChange={(e) => setNewHot({...newHot, validUntil: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newHot.isActive}
                          onChange={(e) => setNewHot({...newHot, isActive: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                      >
                        {editingHot ? '✏️ Update Deal' : '✨ Add Deal'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddHot(false);
                          setEditingHot(null);
                          setNewHot({ productId: '', productName: '', imageUrl: '', originalPrice: '', dealPrice: '', discount: '', validUntil: '', stockLeft: '', isActive: true });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Hot Deals ({hotDeals.length})</h3>
                {hotDeals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotDeals.map((deal) => (
                      <div key={deal.id} className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border border-orange-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <img src={deal.imageUrl} alt={deal.productName} className="w-12 h-12 object-cover rounded-lg" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image'; }} />
                          <div className="flex gap-2">
                            <button onClick={() => handleEditHot(deal)} className="p-1 text-orange-600 hover:bg-orange-100 rounded transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteHot(deal.id)} className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{deal.productName}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm line-through text-gray-500">{formatCurrency(deal.originalPrice)}</span>
                          <span className="font-bold text-orange-600">{formatCurrency(deal.dealPrice)}</span>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">{deal.discount}% OFF</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-red-600">🔥 {deal.stockLeft} left!</span>
                          <span className="text-xs text-gray-500">Until: {deal.validUntil}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs ${deal.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {deal.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Flame className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hot deals yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Coupon Codes Tab */}
          {activeTab === 'coupons' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Ticket className="h-6 w-6 mr-2 text-yellow-600" />
                  Coupon Codes Management
                </h2>
                <button
                  onClick={() => setShowAddCoupon(!showAddCoupon)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Coupon
                </button>
              </div>

              {showAddCoupon && (
                <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-dashed border-yellow-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {editingCoupon ? '✏️ Edit Coupon' : '🎫 Add New Coupon'}
                  </h3>
                  <form onSubmit={editingCoupon ? handleUpdateCoupon : handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                      <input
                        type="text"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent uppercase"
                        placeholder="SAVE20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                      <select
                        value={newCoupon.discountType}
                        onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value as 'percentage' | 'fixed'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={newCoupon.description}
                        onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Get 20% off on all products"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Value {newCoupon.discountType === 'percentage' ? '(%)' : '(Rs.)'}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newCoupon.discountValue}
                        onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase (Rs.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newCoupon.minPurchase}
                        onChange={(e) => setNewCoupon({...newCoupon, minPurchase: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (Rs.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newCoupon.maxDiscount}
                        onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                      <input
                        type="number"
                        value={newCoupon.usageLimit}
                        onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        value={newCoupon.validUntil}
                        onChange={(e) => setNewCoupon({...newCoupon, validUntil: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newCoupon.isActive}
                          onChange={(e) => setNewCoupon({...newCoupon, isActive: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                      >
                        {editingCoupon ? '✏️ Update Coupon' : '✨ Add Coupon'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCoupon(false);
                          setEditingCoupon(null);
                          setNewCoupon({ code: '', description: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', validUntil: '', usageLimit: '', isActive: true });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Coupons ({coupons.length})</h3>
                {coupons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-lg text-yellow-700 bg-yellow-100 px-3 py-1 rounded">{coupon.code}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {coupon.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div>
                                <span className="font-semibold">Value:</span> {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                              </div>
                              <div>
                                <span className="font-semibold">Min:</span> {formatCurrency(coupon.minPurchase)}
                              </div>
                              <div>
                                <span className="font-semibold">Max:</span> {formatCurrency(coupon.maxDiscount)}
                              </div>
                              <div>
                                <span className="font-semibold">Usage:</span> {coupon.usedCount}/{coupon.usageLimit}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Valid until: {coupon.validUntil}</p>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleEditCoupon(coupon)}
                              className="p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No coupons yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Contact Submissions Tab */}
          {activeTab === 'contacts' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-pink-600" />
                  Contact Submissions
                  {unreadCount > 0 && (
                    <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full animate-pulse">
                      {unreadCount} Unread
                    </span>
                  )}
                </h2>
                
                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setContactFilter('all')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      contactFilter === 'all'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All ({contacts.length})
                  </button>
                  <button
                    onClick={() => setContactFilter('unread')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      contactFilter === 'unread'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Unread ({contacts.filter(c => c.status === 'unread').length})
                  </button>
                  <button
                    onClick={() => setContactFilter('read')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      contactFilter === 'read'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Read ({contacts.filter(c => c.status === 'read').length})
                  </button>
                  <button
                    onClick={() => setContactFilter('responded')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      contactFilter === 'responded'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Responded ({contacts.filter(c => c.status === 'responded').length})
                  </button>
                </div>
              </div>

              {getFilteredContacts().length > 0 ? (
                <div className="space-y-4">
                  {selectedContact ? (
                    // Detailed View
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border-2 border-pink-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2" />
                          Message Details
                        </h3>
                        <button
                          onClick={() => setSelectedContact(null)}
                          className="text-white hover:bg-white/20 rounded-lg px-3 py-1 transition-colors"
                        >
                          ← Back to List
                        </button>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        {/* Status and Priority Badges */}
                        <div className="flex gap-3 flex-wrap">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedContact.status)}`}>
                            {selectedContact.status.toUpperCase()}
                          </span>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getPriorityColor(selectedContact.priority)}`}>
                            {selectedContact.priority.toUpperCase()} Priority
                          </span>
                          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                            {selectedContact.category}
                          </span>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-pink-200">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Full Name</p>
                            <p className="font-semibold text-gray-900">{selectedContact.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <p className="font-semibold text-gray-900">{selectedContact.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                            <p className="font-semibold text-gray-900">{selectedContact.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Submitted</p>
                            <p className="font-semibold text-gray-900">{formatTimestamp(selectedContact.submittedAt)}</p>
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="bg-white p-4 rounded-lg border border-pink-200">
                          <p className="text-sm text-gray-500 mb-2">Subject</p>
                          <p className="font-bold text-lg text-gray-900">{selectedContact.subject}</p>
                        </div>

                        {/* Message */}
                        <div className="bg-white p-4 rounded-lg border border-pink-200">
                          <p className="text-sm text-gray-500 mb-2">Message</p>
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white p-4 rounded-lg border border-pink-200">
                          <p className="text-sm text-gray-500 mb-3 font-semibold">Timeline</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span className="text-gray-600">Submitted:</span>
                              <span className="ml-2 font-semibold text-gray-900">{formatTimestamp(selectedContact.submittedAt)}</span>
                            </div>
                            {selectedContact.readAt && (
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                                <span className="text-gray-600">Read:</span>
                                <span className="ml-2 font-semibold text-gray-900">{formatTimestamp(selectedContact.readAt)}</span>
                              </div>
                            )}
                            {selectedContact.respondedAt && (
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-gray-600">Responded:</span>
                                <span className="ml-2 font-semibold text-gray-900">{formatTimestamp(selectedContact.respondedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 flex-wrap pt-4">
                          {selectedContact.status === 'unread' && (
                            <button
                              onClick={() => handleMarkAsRead(selectedContact.id)}
                              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Mark as Read
                            </button>
                          )}
                          {(selectedContact.status === 'unread' || selectedContact.status === 'read') && (
                            <button
                              onClick={() => handleMarkAsResponded(selectedContact.id)}
                              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Mark as Responded
                            </button>
                          )}
                          <button
                            onClick={() => handleArchiveContact(selectedContact.id)}
                            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Archive
                          </button>
                          <button
                            onClick={() => handleDeleteContact(selectedContact.id)}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="space-y-3">
                      {getFilteredContacts().map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => {
                            setSelectedContact(contact);
                            if (contact.status === 'unread') {
                              handleMarkAsRead(contact.id);
                            }
                          }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                            contact.status === 'unread'
                              ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
                              : contact.status === 'responded'
                              ? 'bg-green-50 border-green-200 hover:bg-green-100'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {contact.status === 'unread' && (
                                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                )}
                                <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                                  {contact.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(contact.priority)}`}>
                                  {contact.priority}
                                </span>
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-1">
                                <span className="font-semibold">Email:</span> {contact.email} | 
                                <span className="font-semibold ml-2">Phone:</span> {contact.phone}
                              </p>
                              
                              <p className="text-gray-700 font-semibold mb-2">{contact.subject}</p>
                              
                              <p className="text-gray-600 text-sm line-clamp-2">{contact.message}</p>
                              
                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {contact.category}
                                </span>
                                <span>📅 {formatTimestamp(contact.submittedAt)}</span>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              <AlertCircle className={`h-6 w-6 ${
                                contact.priority === 'urgent' ? 'text-red-500' :
                                contact.priority === 'high' ? 'text-orange-500' :
                                'text-blue-500'
                              }`} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No contact submissions yet</p>
                  <p className="text-gray-400 text-sm mt-2">Messages from your contact form will appear here</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}