'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Cpu, Star, Send, ShoppingBag, Percent, TrendingUp, Package, Play, ExternalLink, Tag, Clock, Flame, Gift, Sparkles, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatCurrency } from '@/lib/dashboard';

type NewsletterForm = {
  email: string;
};

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  category: string;
  rating: number;
  inStock: boolean;
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

export default function Home() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterForm>();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topOffers, setTopOffers] = useState<Offer[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeal[]>([]);
  const [hotDeals, setHotDeals] = useState<HotDeal[]>([]);
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Fetch featured products
    const fetchData = async () => {
      try {
        // Get top 4 products
        const productsQuery = query(collection(db, 'products'), limit(4));
        const productsSnapshot = await getDocs(productsQuery);
        const products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setFeaturedProducts(products);

        // Get active offers
        const offersQuery = query(
          collection(db, 'offers'),
          where('isActive', '==', true),
          limit(3)
        );
        const offersSnapshot = await getDocs(offersQuery);
        const offers = offersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Offer[];
        setTopOffers(offers);

        // Get featured deals
        const featuredQuery = query(
          collection(db, 'featuredDeals'),
          where('isActive', '==', true),
          limit(4)
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        const featured = featuredSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FeaturedDeal[];
        setFeaturedDeals(featured);

        // Get hot deals
        const hotQuery = query(
          collection(db, 'hotDeals'),
          where('isActive', '==', true),
          limit(3)
        );
        const hotSnapshot = await getDocs(hotQuery);
        const hot = hotSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as HotDeal[];
        setHotDeals(hot);

        // Get coupon codes
        const couponsQuery = query(
          collection(db, 'couponCodes'),
          where('isActive', '==', true),
          limit(4)
        );
        const couponsSnapshot = await getDocs(couponsQuery);
        const couponData = couponsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CouponCode[];
        setCoupons(couponData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = (data: NewsletterForm) => {
    console.log('Newsletter signup:', data);
    reset();
    // Here you would typically send to your API
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

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Experience blazing-fast performance with our optimized hardware solutions.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Reliable',
      description: 'Built with security in mind, ensuring your data stays safe and protected.',
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: 'Cutting-Edge Tech',
      description: 'Stay ahead with the latest technology and innovative computing solutions.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Background Video */}
      <section className="relative overflow-hidden py-20 px-4 min-h-screen flex items-center">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90 z-20"></div>
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] md:w-[200%] md:h-[200%] pointer-events-none"
            src="https://www.youtube.com/embed/f5vKxPA43lM?autoplay=1&mute=1&loop=1&playlist=f5vKxPA43lM&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3"
            title="PC Solutions Background"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>

        <div className="relative max-w-7xl mx-auto z-30 w-full">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
              >
                PC Solutions
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Unleash the power of technology with our premium gaming and computing solutions.
                Elevate your experience to the next level.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  <Link href="/products">
                    Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>



          {/* Floating Elements */}
          <motion.div
            className="absolute top-10 right-10 hidden md:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              🚀 New Arrivals
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-10 hidden md:block"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Star className="h-12 w-12 text-yellow-400" />
          </motion.div>
        </div>
      </section>

      {/* Hot Offers Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900/20 via-orange-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Hot Deals & Offers
                </h2>
                <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Limited time offers on the best gaming gear. Grab them before they're gone!
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">Loading amazing deals...</div>
          ) : topOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {topOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 overflow-hidden group">
                    <div className="relative overflow-hidden">
                      <img 
                        src={offer.imageUrl} 
                        alt={offer.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg animate-pulse">
                        {offer.discount}% OFF
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white text-xl flex items-center gap-2">
                        <Tag className="h-5 w-5 text-orange-400" />
                        {offer.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {offer.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-orange-300">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Valid until {new Date(offer.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">No active offers at the moment. Check back soon!</div>
          )}

          <div className="text-center mt-8" data-aos="fade-up">
            <Button asChild size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 shadow-lg">
              <Link href="/offers">
                View All Offers <Percent className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Deals Section - Spotlight Style */}
      {featuredDeals.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-blue-900/30 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -40, 0],
                y: [0, -50, 0]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12" data-aos="fade-up">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Featured Deals
                  </h2>
                  <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Handpicked exclusive deals on premium products - Don't miss out!
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                  whileHover={{ scale: 1.08, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative group"
                >
                  <Link href={`/products/${deal.productId}`}>
                    <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/70 transition-all duration-300 overflow-hidden h-full relative">
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      <div className="relative overflow-hidden">
                        <img 
                          src={deal.imageUrl} 
                          alt={deal.productName}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg animate-pulse">
                          {deal.discount}% OFF
                        </div>
                        <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          FEATURED
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-base line-clamp-2 min-h-[3rem]">
                          {deal.productName}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-purple-400">
                              {formatCurrency(deal.dealPrice)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(deal.originalPrice)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getTimeRemaining(deal.validUntil)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10" data-aos="fade-up">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-3 shadow-lg">
                <Link href="/offers">
                  View All Featured Deals <Sparkles className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Hot Deals Section - Urgency Style */}
      {hotDeals.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-r from-red-900/20 via-orange-900/30 to-yellow-900/20 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12" data-aos="fade-up">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Flame className="h-10 w-10 text-red-500 animate-bounce" />
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    🔥 HOT DEALS 🔥
                  </h2>
                  <Flame className="h-10 w-10 text-red-500 animate-bounce" />
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Lightning deals with limited stock - Act fast before they're gone!
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {hotDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  data-aos="flip-left"
                  data-aos-delay={index * 150}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link href={`/products/${deal.productId}`}>
                    <Card className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-sm border-red-500/50 hover:border-red-400 transition-all duration-300 overflow-hidden relative h-full group">
                      {/* Pulsing Border Effect */}
                      <div className="absolute inset-0 border-2 border-red-500 rounded-lg opacity-0 group-hover:opacity-100 animate-pulse" />
                      
                      <div className="relative overflow-hidden">
                        <img 
                          src={deal.imageUrl} 
                          alt={deal.productName}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-2xl transform rotate-3">
                          -{deal.discount}%
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 animate-pulse text-red-400" />
                          Only {deal.stockLeft} left!
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-white text-lg line-clamp-2">
                          {deal.productName}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-red-400">
                              {formatCurrency(deal.dealPrice)}
                            </span>
                            <span className="text-base text-gray-400 line-through">
                              {formatCurrency(deal.originalPrice)}
                            </span>
                          </div>
                          
                          {/* Stock Progress Bar */}
                          <div className="space-y-1">
                            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                              <motion.div 
                                className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((deal.stockLeft / 20) * 100, 100)}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Selling Fast!</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getTimeRemaining(deal.validUntil)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10" data-aos="fade-up">
              <Button asChild size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 shadow-lg animate-pulse">
                <Link href="/offers">
                  Grab Hot Deals Now <Flame className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Coupon Codes Section - Interactive Cards */}
      {coupons.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-green-900/20 via-teal-900/20 to-blue-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12" data-aos="fade-up">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Tag className="h-8 w-8 text-green-400" />
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                    Coupon Codes
                  </h2>
                  <Gift className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Save more with our exclusive coupon codes - Click to copy!
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coupons.map((coupon, index) => {
                const remaining = coupon.usageLimit - coupon.usedCount;
                const percentUsed = (coupon.usedCount / coupon.usageLimit) * 100;
                
                return (
                  <motion.div
                    key={coupon.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(coupon.code)}
                    className="cursor-pointer"
                  >
                    <Card className="bg-gradient-to-br from-green-900/40 to-teal-900/40 backdrop-blur-sm border-green-500/30 hover:border-green-400/70 transition-all duration-300 overflow-hidden relative group h-full">
                      {/* Decorative Pattern */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/5 rounded-full -ml-12 -mb-12" />
                      
                      <CardHeader className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="bg-green-600/80 text-white px-3 py-1 rounded-lg text-xs font-bold">
                            {coupon.discountType === 'percentage' 
                              ? `${coupon.discountValue}% OFF` 
                              : `${formatCurrency(coupon.discountValue)} OFF`}
                          </div>
                          {copiedCode === coupon.code ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-1 text-green-400 text-xs"
                            >
                              <Check className="h-4 w-4" />
                              Copied!
                            </motion.div>
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                          )}
                        </div>
                        
                        <CardTitle className="text-white text-xl">
                          <div className="bg-white/10 border-2 border-dashed border-green-400/50 rounded-lg px-4 py-3 text-center font-mono group-hover:bg-white/20 transition-colors">
                            {coupon.code}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="relative z-10">
                        <CardDescription className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {coupon.description}
                        </CardDescription>
                        
                        <div className="space-y-3 text-xs text-gray-400">
                          {coupon.minPurchase > 0 && (
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-3 w-3 text-green-400" />
                              Min purchase: {formatCurrency(coupon.minPurchase)}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-green-400" />
                            Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{remaining} uses left</span>
                              <span>{Math.round(percentUsed)}% claimed</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                              <motion.div 
                                className="bg-gradient-to-r from-green-500 to-teal-500 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentUsed}%` }}
                                transition={{ duration: 1, delay: index * 0.15 }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-center text-xs text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                          Click to copy code
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-10" data-aos="fade-up">
              <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 shadow-lg">
                <Link href="/offers">
                  View All Coupons <Tag className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-purple-400" />
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Featured Products
                </h2>
                <Package className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Handpicked selection of our top-performing gaming and computing solutions
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">Loading products...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={`/products/${product.id}`}>
                    <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                      <div className="relative overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.originalPrice > product.price && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </div>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg line-clamp-2 min-h-[3.5rem]">
                          {product.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < product.rating ? 'fill-current' : 'stroke-current fill-transparent'}`} />
                          ))}
                          <span className="text-gray-400 text-sm ml-1">({product.rating})</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-purple-400">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 capitalize">
                            {product.category}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">No products available at the moment.</div>
          )}

          <div className="text-center mt-8" data-aos="fade-up">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 shadow-lg">
              <Link href="/products">
                Browse All Products <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose PC Solutions?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the features that make us the premier choice for gaming and computing enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 200}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-purple-600 rounded-full text-white w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" data-aos="fade-up">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl md:text-6xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-300">Products</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl md:text-6xl font-bold text-purple-400 mb-2">10k+</div>
              <div className="text-gray-300">Happy Customers</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl md:text-6xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl md:text-6xl font-bold text-purple-400 mb-2">5★</div>
              <div className="text-gray-300">Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest updates on new products, exclusive deals, and tech insights delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1">
              <Input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-purple-400/50 text-white placeholder-gray-400 focus:border-purple-400"
              />
              {errors.email?.message && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6">
              <Send className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          data-aos="fade-up"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Upgrade?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who trust PC Solutions for their tech needs.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3">
            <Link href="/products">
              Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
