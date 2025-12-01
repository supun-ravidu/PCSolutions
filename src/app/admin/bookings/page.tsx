'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ShoppingCart, ArrowLeft, Phone, Mail, MapPin, Package, Calendar, Loader } from 'lucide-react';

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

export default function BookingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const router = useRouter();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setUser({ email: 'Admin@gmail.com' });
      setLoading(false);
      fetchBookings();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'Admin@gmail.com') {
        setUser(user);
        fetchBookings();
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'completed':
        return '🎉';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-white/30"></div>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="h-8 w-8" />
                  Customer Bookings
                </h1>
                <p className="text-white/80 mt-1">Manage and track all customer orders</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/90 text-sm">Admin Panel</p>
              <p className="text-white font-semibold">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🎉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ Pending ({bookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'confirmed'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'completed'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎉 Completed ({bookings.filter(b => b.status === 'completed').length})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'cancelled'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ❌ Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {/* Selected Booking Details Modal */}
              {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="h-6 w-6" />
                        <h3 className="text-2xl font-bold">Booking Details</h3>
                      </div>
                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="text-white hover:text-gray-200 text-2xl"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusIcon(selectedBooking.status)} {selectedBooking.status.toUpperCase()}
                        </span>
                        <div className="text-sm text-gray-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {selectedBooking.bookingDate?.toDate ? new Date(selectedBooking.bookingDate.toDate()).toLocaleString() : 'N/A'}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
                        <h4 className="font-bold text-xl mb-4 text-blue-900 flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Customer Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700">👤 Name:</span>
                            <p className="text-gray-900">{selectedBooking.customerInfo.firstName} {selectedBooking.customerInfo.lastName}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-blue-600 mt-1" />
                            <div>
                              <span className="font-semibold text-gray-700">Email:</span>
                              <p className="text-gray-900">{selectedBooking.customerInfo.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 text-green-600 mt-1" />
                            <div>
                              <span className="font-semibold text-gray-700">Phone:</span>
                              <p className="text-gray-900">{selectedBooking.customerInfo.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-red-600 mt-1" />
                            <div>
                              <span className="font-semibold text-gray-700">Address:</span>
                              <p className="text-gray-900">
                                {selectedBooking.customerInfo.address}<br />
                                {selectedBooking.customerInfo.city}, {selectedBooking.customerInfo.state} {selectedBooking.customerInfo.zipCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          Order Items ({selectedBooking.items.length})
                        </h4>
                        <div className="space-y-3">
                          {selectedBooking.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                              <div className="flex-1">
                                <h5 className="font-semibold text-lg">{item.name}</h5>
                                <p className="text-sm text-gray-600">{item.brand}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{selectedBooking.currency} {item.price} × {item.quantity}</p>
                                <p className="text-sm text-gray-600">{selectedBooking.currency} {(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="border-t-2 border-gray-300 pt-4">
                        <div className="flex justify-between items-center text-2xl font-bold">
                          <span>Total Amount:</span>
                          <span className="text-blue-600">{selectedBooking.currency} {selectedBooking.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                          onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'confirmed')}
                          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          ✅ Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'completed')}
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          🎉 Complete
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'cancelled')}
                          className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          ❌ Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(selectedBooking.id)}
                          className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bookings Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="border-2 rounded-xl p-5 cursor-pointer hover:shadow-xl transition-all bg-gradient-to-r from-white to-gray-50 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-bold text-gray-900 text-xl">
                            {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span>{booking.customerInfo.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span>{booking.customerInfo.phone}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {booking.items.length} item(s)
                          </span>
                          <span className="font-bold text-lg text-blue-600">{booking.currency} {booking.total.toFixed(2)}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {booking.bookingDate?.toDate ? new Date(booking.bookingDate.toDate()).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-red-600" />
                          {booking.customerInfo.city}, {booking.customerInfo.state}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <ShoppingCart className={`h-8 w-8 ${
                          booking.status === 'pending' ? 'text-yellow-500' :
                          booking.status === 'confirmed' ? 'text-green-500' :
                          booking.status === 'completed' ? 'text-blue-500' :
                          'text-red-500'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings found</p>
              <p className="text-gray-400 text-sm mt-2">
                {statusFilter !== 'all' 
                  ? `No ${statusFilter} bookings available`
                  : 'Customer order bookings will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
