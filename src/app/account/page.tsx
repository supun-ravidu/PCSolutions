'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Package, Heart, Settings, CreditCard, LogOut } from 'lucide-react';

// Mock user data
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  joinDate: 'January 2024',
  avatar: '👤'
};

// Mock order history
const orderHistory = [
  {
    id: 'PC-20241125001',
    date: '2024-11-25',
    status: 'Delivered',
    total: 1299.00,
    items: [
      { name: 'Gaming Laptop RTX 4070', quantity: 1, price: 1299.00 }
    ]
  },
  {
    id: 'PC-20241120002',
    date: '2024-11-20',
    status: 'Shipped',
    total: 349.00,
    items: [
      { name: 'Gaming Monitor 144Hz', quantity: 1, price: 349.00 }
    ]
  },
  {
    id: 'PC-20241115003',
    date: '2024-11-15',
    status: 'Processing',
    total: 199.00,
    items: [
      { name: 'Mechanical Keyboard RGB', quantity: 1, price: 149.00 },
      { name: 'Wireless Gaming Mouse', quantity: 1, price: 50.00 }
    ]
  }
];

const menuItems = [
  { id: 'profile', label: 'Profile', icon: User, href: '/account/profile' },
  { id: 'orders', label: 'Order History', icon: Package, href: '/account/orders' },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/account/wishlist' },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard, href: '/account/payment' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/account/settings' }
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  {userData.avatar}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-gray-600 text-sm">{userData.email}</p>
                <p className="text-gray-500 text-xs mt-1">Member since {userData.joinDate}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
                <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors w-full">
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Account Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Overview</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {orderHistory.length}
                  </div>
                  <p className="text-gray-600">Total Orders</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                  <p className="text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    2
                  </div>
                  <p className="text-gray-600">Wishlist Items</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link
                  href="/account/orders"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Orders →
                </Link>
              </div>

              <div className="space-y-4">
                {orderHistory.slice(0, 3).map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="font-semibold text-gray-900 mt-1">${order.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.name} × {item.quantity}</span>
                          <span className="text-gray-900">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {orderHistory.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <Link
                    href="/products"
                    className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
                  >
                    Start shopping →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}