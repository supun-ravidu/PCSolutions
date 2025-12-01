'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, TrendingUp, Eye, Heart, Filter, X, Check, Grid3x3, List, SortAsc, ChevronDown, Star, Package, Truck, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../components/CartContext';
import { formatCurrency } from '../../lib/dashboard';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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

const categoryIcons = {
  laptops: '💻',
  desktops: '🖥️',
  monitors: '🖼️',
  accessories: '🎮',
  all: '✨'
};

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    // Real-time Firebase listener
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
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
      setAllProducts(products);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = useMemo(() => [
    { id: 'all', name: 'All Products', icon: '✨', count: allProducts.length },
    { id: 'laptops', name: 'Laptops', icon: '💻', count: allProducts.filter(p => p.category === 'laptops').length },
    { id: 'desktops', name: 'Desktops', icon: '🖥️', count: allProducts.filter(p => p.category === 'desktops').length },
    { id: 'monitors', name: 'Monitors', icon: '🖼️', count: allProducts.filter(p => p.category === 'monitors').length },
    { id: 'accessories', name: 'Accessories', icon: '🎮', count: allProducts.filter(p => p.category === 'accessories').length }
  ], [allProducts]);

  const brands = useMemo(() => {
    const brandSet = new Set(allProducts.map(p => p.brand));
    return Array.from(brandSet).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [allProducts, searchTerm, selectedCategory, selectedBrands, priceRange, sortBy]);

  const addToCart = (product: Product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        brand: product.brand
      }
    });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 500000]);
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const activeFiltersCount = selectedBrands.length + (selectedCategory !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-32 h-32 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-4xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🚀
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 30 - 15, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-4xl">
                {['💻', '🖥️', '⚡', '🚀', '✨', '💎', '🎯'][i % 7]}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.div
                className="inline-block mb-4"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  🔥 HOT DEALS AVAILABLE
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
                Discover
                <motion.span
                  className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Tech Magic
                </motion.span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-6 text-purple-100 font-medium">
                Premium PC components & accessories for gamers, creators & professionals
              </p>

              {/* Trust Badges - Cards Style */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Truck, title: 'Fast', subtitle: 'Free Delivery', color: 'from-blue-500 to-cyan-500' },
                  { icon: Shield, title: 'Secure', subtitle: '1 Year Warranty', color: 'from-green-500 to-emerald-500' },
                  { icon: Package, title: 'Easy', subtitle: '30-Day Returns', color: 'from-orange-500 to-pink-500' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className={`bg-gradient-to-br ${item.color} w-10 h-10 rounded-lg flex items-center justify-center mb-2`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-sm font-bold">{item.title}</div>
                    <div className="text-xs text-purple-200">{item.subtitle}</div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <motion.div
                className="flex gap-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex-1">
                  <div className="text-3xl font-bold text-yellow-300">{allProducts.length}+</div>
                  <div className="text-sm text-purple-200">Products</div>
                </div>
                <div className="flex-1 border-l border-white/20">
                  <div className="text-3xl font-bold text-yellow-300">50+</div>
                  <div className="text-sm text-purple-200">Brands</div>
                </div>
                <div className="flex-1 border-l border-white/20">
                  <div className="text-3xl font-bold text-yellow-300">5K+</div>
                  <div className="text-sm text-purple-200">Happy Customers</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Search & Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:pl-8"
            >
              {/* Enhanced Search Bar */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Search className="h-6 w-6" />
                  Find Your Perfect Match
                </h3>
                
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products, brands, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white text-gray-800 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400 text-base placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Popular Searches */}
                <div className="mb-4">
                  <p className="text-sm text-purple-200 mb-2">🔥 Trending Searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Gaming Laptop', 'RTX 4090', 'RGB Keyboard', 'Monitors'].map((term, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setSearchTerm(term)}
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-all border border-white/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Special Offer Banner */}
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-purple-900"
                  animate={{ 
                    boxShadow: ['0 0 20px rgba(251, 191, 36, 0.5)', '0 0 40px rgba(251, 191, 36, 0.8)', '0 0 20px rgba(251, 191, 36, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎁</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">Limited Time Offer!</div>
                      <div className="text-xs">Up to 50% off on selected items</div>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <TrendingUp className="h-6 w-6" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <motion.path
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="#f9fafb"
              animate={{
                d: [
                  "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                  "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,69.3C672,75,768,85,864,80C960,75,1056,53,1152,48C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                  "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Category Pills & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2 text-xl">{category.icon}</span>
                <span>{category.name}</span>
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </motion.button>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-purple-600 underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium cursor-pointer transition-colors"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sidebar Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="bg-white h-full w-80 p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Brands Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Brands</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </p>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Desktop Only */}
          <motion.div
            className="hidden lg:block w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Filters</h3>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm text-gray-600">BRANDS</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm text-gray-600">PRICE RANGE</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </p>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              className="mb-6 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-lg font-semibold text-gray-700">
                <TrendingUp className="inline mr-2 h-5 w-5 text-purple-600" />
                Showing {filteredProducts.length} of {allProducts.length} products
              </p>
            </motion.div>

            <AnimatePresence mode="popLayout">
              <motion.div
                className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
                }
                layout
              >
                {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  layout: { duration: 0.3 }
                }}
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
                className="group relative"
              >
                <motion.div
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden relative hover:shadow-2xl transition-shadow ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Badges Container */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.originalPrice > product.price && (
                      <motion.div
                        className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </motion.div>
                    )}
                    {!product.inStock && (
                      <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>

                  {/* Like Button */}
                  <motion.button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        likedProducts.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </motion.button>

                  {/* Product Image */}
                  <Link href={`/products/${product.id}`} className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                    <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group ${
                      viewMode === 'list' ? 'h-full' : 'h-56'
                    }`}>
                      <motion.img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x224?text=No+Image'; }}
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                          <Package className="h-12 w-12 text-white opacity-50" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className={`p-5 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    {/* Category Badge */}
                    <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md mb-2 w-fit">
                      {product.category.toUpperCase()}
                    </span>

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-bold text-lg mb-1 text-gray-900 hover:text-purple-600 transition-colors line-clamp-2 cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-500 text-sm mb-3 font-medium">{product.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600 font-medium">
                        {product.rating} <span className="text-gray-400">({product.reviews} reviews)</span>
                      </span>
                    </div>

                    {/* Specs Preview */}
                    {viewMode === 'list' && product.specs.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.specs.slice(0, 3).join(' • ')}
                        </p>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-lg text-gray-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                        <motion.button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                            product.inStock
                              ? addedToCart === product.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          whileHover={product.inStock ? { scale: 1.02 } : {}}
                          whileTap={product.inStock ? { scale: 0.98 } : {}}
                        >
                          {addedToCart === product.id ? (
                            <>
                              <Check className="h-5 w-5" />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-5 w-5" />
                              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </>
                          )}
                        </motion.button>

                        <Link href={`/products/${product.id}`} className={viewMode === 'list' ? 'w-32' : ''}>
                          <motion.button
                            className="w-full py-3 px-4 rounded-xl font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="h-5 w-5" />
                            Details
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-9xl mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔍
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">No Products Found</h3>
                <p className="text-gray-600 text-lg mb-3">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}