import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const bookingNumber = `BK-${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Order Booked Successfully!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for your booking. We will contact you shortly to confirm your order and arrange delivery.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Number:</span>
                  <span className="font-semibold">{bookingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">Pending Confirmation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Booking Received</h3>
              <p className="text-sm text-gray-600">
                Your booking has been successfully recorded
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Truck className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">We'll Contact You</h3>
              <p className="text-sm text-gray-600">
                Our team will reach out to confirm and arrange delivery
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Confirmation</h3>
              <p className="text-sm text-gray-600">
                Check your email for booking confirmation details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Our team will contact you within 24 hours to confirm your order and discuss delivery arrangements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Return to Home
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@pcsolutions.com" className="text-blue-600 hover:text-blue-800">
                support@pcsolutions.com
              </a>{' '}
              or call{' '}
              <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-800">
                +1 (555) 123-4567
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}