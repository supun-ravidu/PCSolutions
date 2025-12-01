'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, Tag, Gift, Zap, Star, ShoppingCart, Copy, Check, Flame, Sparkles, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

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

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeal[]>([]);
  const [hotDeals, setHotDeals] = useState<HotDeal[]>([]);
  const [coupons, setCoupons] = useState<CouponCode[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch offers
      const offersQuery = query(collection(db, 'offers'), where('isActive', '==', true));
      const offersSnapshot = await getDocs(offersQuery);
      const offersData: Offer[] = [];
      offersSnapshot.forEach((doc) => {
        const data = doc.data();
        offersData.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          discount: typeof data.discount === 'number' ? data.discount : parseFloat(data.discount) || 0,
          imageUrl: data.imageUrl || '',
          validUntil: data.validUntil || '',
          isActive: data.isActive
        });
      });
      setOffers(offersData);

      // Fetch featured deals
      const featuredQuery = query(collection(db, 'featuredDeals'), where('isActive', '==', true));
      const featuredSnapshot = await getDocs(featuredQuery);
      const featuredData: FeaturedDeal[] = [];
      featuredSnapshot.forEach((doc) => {
        const data = doc.data();
        featuredData.push({
          id: doc.id,
          productId: data.productId || '',
          productName: data.productName || '',
          imageUrl: data.imageUrl || '',
          originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : parseFloat(data.originalPrice) || 0,
          dealPrice: typeof data.dealPrice === 'number' ? data.dealPrice : parseFloat(data.dealPrice) || 0,
          discount: typeof data.discount === 'number' ? data.discount : parseFloat(data.discount) || 0,
          validUntil: data.validUntil || '',
          isActive: data.isActive
        });
      });
      setFeaturedDeals(featuredData);

      // Fetch hot deals
      const hotQuery = query(collection(db, 'hotDeals'), where('isActive', '==', true));
      const hotSnapshot = await getDocs(hotQuery);
      const hotData: HotDeal[] = [];
      hotSnapshot.forEach((doc) => {
        const data = doc.data();
        hotData.push({
          id: doc.id,
          productId: data.productId || '',
          productName: data.productName || '',
          imageUrl: data.imageUrl || '',
          originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : parseFloat(data.originalPrice) || 0,
          dealPrice: typeof data.dealPrice === 'number' ? data.dealPrice : parseFloat(data.dealPrice) || 0,
          discount: typeof data.discount === 'number' ? data.discount : parseFloat(data.discount) || 0,
          validUntil: data.validUntil || '',
          stockLeft: typeof data.stockLeft === 'number' ? data.stockLeft : parseInt(data.stockLeft) || 0,
          isActive: data.isActive
        });
      });
      setHotDeals(hotData);

      // Fetch coupon codes
      const couponsQuery = query(collection(db, 'couponCodes'), where('isActive', '==', true));
      const couponsSnapshot = await getDocs(couponsQuery);
      const couponsData: CouponCode[] = [];
      couponsSnapshot.forEach((doc) => {
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
          isActive: data.isActive
        });
      });
      setCoupons(couponsData);

    } catch (error) {
      console.error('Error fetching offers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getTimeRemaining = (validUntil: string) => {
    const now = new Date().getTime();
    const expiry = new Date(validUntil).getTime();
    const timeLeft = expiry - now;

    if (timeLeft <= 0) return 'Expired';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading amazing offers...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Special Offers & Deals</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Don't miss out on our amazing deals! Limited time offers on premium gaming gear and components.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-red-100">
              <Clock className="h-5 w-5" />
              <span>Offers end soon - shop now!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* General Offers */}
        {offers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
              <Tag className="h-8 w-8 text-blue-600" />
              Special Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-200 hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={offer.imageUrl} 
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Special+Offer';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                      {offer.discount}% OFF
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{offer.title}</h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Valid until {offer.validUntil}
                    </div>
                    <Link
                      href="/products"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block text-center"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
              <Star className="h-8 w-8 text-purple-600" />
              Featured Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
                  <div className="relative">
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.productName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Product';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      -{deal.discount}%
                    </div>
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      FEATURED
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{deal.productName}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-purple-600">{formatCurrency(deal.dealPrice)}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{formatCurrency(deal.originalPrice)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(deal.validUntil)}
                    </div>
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hot Deals */}
        {hotDeals.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Flame className="h-8 w-8 text-orange-600" />
                Hot Deals 🔥
              </h2>
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                View All Products <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-200">
                  <div className="relative">
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.productName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Product';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold flex items-center gap-1 animate-pulse">
                      <Flame className="h-4 w-4" />
                      HOT DEAL
                    </div>
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      -{deal.discount}%
                    </div>
                    <div className="absolute bottom-2 left-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                      Only {deal.stockLeft} left!
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{deal.productName}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-orange-600">{formatCurrency(deal.dealPrice)}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{formatCurrency(deal.originalPrice)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-red-600 font-semibold mb-3 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(deal.validUntil)}
                    </div>
                    <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded hover:from-red-600 hover:to-orange-600 transition-colors flex items-center justify-center gap-2 font-semibold">
                      <ShoppingCart className="h-4 w-4" />
                      Grab Now!
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coupon Codes */}
        {coupons.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
              <Gift className="h-8 w-8 text-green-600" />
              Coupon Codes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-2 border-dashed border-yellow-300 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <Tag className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-mono font-bold text-xl text-gray-900 bg-white px-3 py-1 rounded inline-block mb-2">
                          {coupon.code}
                        </div>
                        <p className="text-sm text-gray-600">{coupon.description}</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-orange-600">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                      </div>
                      <div className="text-xs text-gray-500">OFF</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div>
                        <span className="font-semibold">Min. Purchase:</span> {formatCurrency(coupon.minPurchase)}
                      </div>
                      <div>
                        <span className="font-semibold">Max. Discount:</span> {formatCurrency(coupon.maxDiscount)}
                      </div>
                      <div>
                        <span className="font-semibold">Usage:</span> {coupon.usedCount}/{coupon.usageLimit}
                      </div>
                      <div className="text-orange-600 font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeRemaining(coupon.validUntil)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                      copiedCode === coupon.code
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-500 hover:to-orange-500'
                    }`}
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="h-5 w-5" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        Copy Coupon Code
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {offers.length === 0 && featuredDeals.length === 0 && hotDeals.length === 0 && coupons.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Active Offers Yet</h3>
            <p className="text-gray-500 mb-8">Check back soon for amazing deals and discounts!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Products
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>
        )}

        {/* Newsletter Signup */}
        <section className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <Gift className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop!</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive deals, new product launches, and special promotions.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            Get 10% off your next purchase when you subscribe!
          </p>
        </section>
      </div>
    </div>
  );
}