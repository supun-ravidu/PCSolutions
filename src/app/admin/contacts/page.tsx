'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { MessageSquare, ArrowLeft, Mail, Phone, Tag, Calendar, AlertCircle, Eye, Check, Trash, Loader } from 'lucide-react';

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

export default function ContactsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'responded' | 'archived'>('all');
  const router = useRouter();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setUser({ email: 'Admin@gmail.com' });
      setLoading(false);
      fetchContacts();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'Admin@gmail.com') {
        setUser(user);
        fetchContacts();
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, 'contactSubmissions'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const contactsData: ContactSubmission[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
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
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleMarkAsRead = async (contactId: string) => {
    try {
      const contactRef = doc(db, 'contactSubmissions', contactId);
      await updateDoc(contactRef, {
        status: 'read',
        readAt: new Date()
      });
      await fetchContacts();
    } catch (error) {
      console.error('Error marking as read:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleMarkAsResponded = async (contactId: string) => {
    try {
      const contactRef = doc(db, 'contactSubmissions', contactId);
      await updateDoc(contactRef, {
        status: 'responded',
        respondedAt: new Date()
      });
      await fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error marking as responded:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleArchiveContact = async (contactId: string) => {
    try {
      const contactRef = doc(db, 'contactSubmissions', contactId);
      await updateDoc(contactRef, {
        status: 'archived'
      });
      await fetchContacts();
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
        await fetchContacts();
        setSelectedContact(null);
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'read':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-500';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-500';
      case 'normal':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      return timestamp.toDate ? new Date(timestamp.toDate()).toLocaleString() : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  const filteredContacts = statusFilter === 'all' 
    ? contacts 
    : contacts.filter(c => c.status === statusFilter);

  const unreadCount = contacts.filter(c => c.status === 'unread').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 shadow-xl">
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
                  <MessageSquare className="h-8 w-8" />
                  Contact Messages
                </h1>
                <p className="text-white/80 mt-1">Manage customer inquiries and messages</p>
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
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-3xl font-bold text-red-600">
                  {unreadCount}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <span className="text-2xl">🔴</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-3xl font-bold text-green-600">
                  {contacts.filter(c => c.status === 'responded').length}
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
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-3xl font-bold text-blue-600">
                  {contacts.length > 0 ? Math.round((contacts.filter(c => c.status === 'responded').length / contacts.length) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
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
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({contacts.length})
            </button>
            <button
              onClick={() => setStatusFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'unread'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔴 Unread ({contacts.filter(c => c.status === 'unread').length})
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'read'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👁️ Read ({contacts.filter(c => c.status === 'read').length})
            </button>
            <button
              onClick={() => setStatusFilter('responded')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'responded'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Responded ({contacts.filter(c => c.status === 'responded').length})
            </button>
            <button
              onClick={() => setStatusFilter('archived')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                statusFilter === 'archived'
                  ? 'bg-gray-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 Archived ({contacts.filter(c => c.status === 'archived').length})
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {filteredContacts.length > 0 ? (
            <div className="space-y-4">
              {/* Selected Contact Details Modal */}
              {selectedContact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6" />
                        <h3 className="text-2xl font-bold">Contact Details</h3>
                      </div>
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="text-white hover:text-gray-200 text-2xl"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Status and Priority */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(selectedContact.status)}`}>
                            {selectedContact.status.toUpperCase()}
                          </span>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getPriorityColor(selectedContact.priority)}`}>
                            {selectedContact.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {formatTimestamp(selectedContact.submittedAt)}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-5 border border-pink-200">
                        <h4 className="font-bold text-xl mb-4 text-pink-900 flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Contact Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700">👤 Name:</span>
                            <p className="text-gray-900">{selectedContact.name}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-pink-600 mt-1" />
                            <div>
                              <span className="font-semibold text-gray-700">Email:</span>
                              <p className="text-gray-900">{selectedContact.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 text-green-600 mt-1" />
                            <div>
                              <span className="font-semibold text-gray-700">Phone:</span>
                              <p className="text-gray-900">{selectedContact.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Tag className="h-4 w-4 text-blue-600 mt-1" />
                            <div>
                              <span className="font-semibold text-gray-700">Category:</span>
                              <p className="text-gray-900">{selectedContact.category}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <h4 className="font-bold text-lg mb-2">Subject</h4>
                        <p className="text-gray-900 text-lg">{selectedContact.subject}</p>
                      </div>

                      {/* Message */}
                      <div>
                        <h4 className="font-bold text-lg mb-2">Message</h4>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedContact.status === 'unread' && (
                          <button
                            onClick={() => handleMarkAsRead(selectedContact.id)}
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                          >
                            👁️ Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleMarkAsResponded(selectedContact.id)}
                          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          ✅ Responded
                        </button>
                        <button
                          onClick={() => handleArchiveContact(selectedContact.id)}
                          className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                        >
                          📦 Archive
                        </button>
                        <button
                          onClick={() => handleDeleteContact(selectedContact.id)}
                          className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contacts Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      if (contact.status === 'unread') {
                        handleMarkAsRead(contact.id);
                      }
                    }}
                    className={`border-2 rounded-xl p-5 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02] ${
                      contact.status === 'unread'
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
                        : contact.status === 'responded'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                        : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {contact.status === 'unread' && (
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                          )}
                          <h3 className="font-bold text-gray-900 text-xl">
                            {contact.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(contact.status)}`}>
                            {contact.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(contact.priority)}`}>
                            {contact.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-4 w-4 text-pink-600" />
                            <span>{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>

                        <p className="text-gray-900 font-semibold mb-2">{contact.subject}</p>
                        
                        <p className="text-gray-700 text-sm line-clamp-2 mb-3">{contact.message}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {contact.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatTimestamp(contact.submittedAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <AlertCircle className={`h-8 w-8 ${
                          contact.priority === 'urgent' ? 'text-red-500' :
                          contact.priority === 'high' ? 'text-orange-500' :
                          'text-blue-500'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No contact messages found</p>
              <p className="text-gray-400 text-sm mt-2">
                {statusFilter !== 'all' 
                  ? `No ${statusFilter} messages available`
                  : 'Contact messages will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
