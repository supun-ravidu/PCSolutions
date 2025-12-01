'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, Search, Filter } from 'lucide-react';

// Mock order data (same as in account page but more detailed)
const orders = [
  {
    id: 'PC-20241125001',
    date: '2024-11-25',
    status: 'Delivered',
    total: 1299.00,
    shipping: 0,
    tax: 103.92,
    finalTotal: 1402.92,
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    items: [
      {
        id: 1,
        name: 'Gaming Laptop RTX 4070',
        emoji: '💻',
        price: 1299.00,
        quantity: 1,
        brand: 'ASUS'
      }
    ],
    tracking: {
      number: 'TRK123456789',
      carrier: 'FedEx',
      estimatedDelivery: '2024-11-27'
    }
  },
  {
    id: 'PC-20241120002',
    date: '2024-11-20',
    status: 'Shipped',
    total: 349.00,
    shipping: 0,
    tax: 27.92,
    finalTotal: 376.92,
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    items: [
      {
        id: 3,
        name: 'Gaming Monitor 144Hz',
        emoji: '🖥️',
        price: 349.00,
        quantity: 1,
        brand: 'LG'
      }
    ],
    tracking: {
      number: 'TRK987654321',
      carrier: 'UPS',
      estimatedDelivery: '2024-11-25'
    }
  },
  {
    id: 'PC-20241115003',
    date: '2024-11-15',
    status: 'Processing',
    total: 199.00,
    shipping: 29.99,
    tax: 15.92,
    finalTotal: 244.91,
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    items: [
      {
        id: 2,
        name: 'Mechanical Keyboard RGB',
        emoji: '⌨️',
        price: 149.00,
        quantity: 1,
        brand: 'Corsair'
      },
      {
        id: 4,
        name: 'Wireless Gaming Mouse',
        emoji: '🖱️',
        price: 50.00,
        quantity: 1,
        brand: 'Logitech'
      }
    ]
  }
];

const statusOptions = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'total-desc':
          return b.finalTotal - a.finalTotal;
        case 'total-asc':
          return a.finalTotal - b.finalTotal;
        default:
          return 0;
      }
    });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/account" className="hover:text-blue-600">Account</Link>
            <span>/</span>
            <span className="text-gray-900">Order History</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search orders by ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="total-desc">Highest Total</option>
                <option value="total-asc">Lowest Total</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">Placed on {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">${order.finalTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl rounded-lg">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.name}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t border-gray-200 pt-1 mt-2">
                          <span>Total:</span>
                          <span>${order.finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Order Details
                        </button>
                        {order.tracking && (
                          <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Track Package
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Write Review
                          </button>
                        )}
                        {order.status === 'Processing' && (
                          <button className="w-full text-left text-red-600 hover:text-red-800 text-sm font-medium">
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.tracking && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Tracking Information</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        <strong>Carrier:</strong> {order.tracking.carrier} |
                        <strong> Tracking Number:</strong> {order.tracking.number} |
                        <strong> Estimated Delivery:</strong> {order.tracking.estimatedDelivery}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t placed any orders yet.'}
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}