'use client';

import { useState } from 'react';
import { Star, Quote, ThumbsUp, Filter, Search } from 'lucide-react';

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'San Francisco, CA',
    avatar: '👩‍💻',
    rating: 5,
    date: '2024-11-15',
    title: 'Exceptional Customer Service',
    review: 'PC Solutions helped me build my first gaming PC. Their technical expertise and patience made the process so much easier. The final build exceeded my expectations and performs flawlessly. Highly recommend!',
    product: 'Custom Gaming PC Build',
    helpful: 24,
    verified: true
  },
  {
    id: 2,
    name: 'Mike Chen',
    location: 'Los Angeles, CA',
    avatar: '👨‍💼',
    rating: 5,
    date: '2024-11-10',
    title: 'Fast Shipping & Quality Products',
    review: 'Ordered a new RTX 4070 graphics card and it arrived the next day! The packaging was excellent and the card performs perfectly. Their website is easy to navigate and prices are competitive.',
    product: 'RTX 4070 Graphics Card',
    helpful: 18,
    verified: true
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    location: 'Austin, TX',
    avatar: '👩‍🎨',
    rating: 4,
    date: '2024-11-08',
    title: 'Great for Beginners',
    review: 'As someone new to PC gaming, I was nervous about buying components. The staff at PC Solutions took the time to explain everything and helped me choose the right parts for my budget. Very satisfied!',
    product: 'Gaming Laptop RTX 4060',
    helpful: 15,
    verified: true
  },
  {
    id: 4,
    name: 'David Kim',
    location: 'Seattle, WA',
    avatar: '👨‍🔬',
    rating: 5,
    date: '2024-11-05',
    title: 'Outstanding Warranty Support',
    review: 'Had an issue with my mechanical keyboard after 6 months. PC Solutions honored their warranty and replaced it immediately with no questions asked. This level of customer service is rare these days.',
    product: 'Mechanical Keyboard RGB',
    helpful: 31,
    verified: true
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    location: 'Chicago, IL',
    avatar: '👩‍🏫',
    rating: 5,
    date: '2024-11-01',
    title: 'Perfect for Content Creation',
    review: 'I needed a workstation for video editing and PC Solutions delivered exactly what I needed. The build quality is excellent and the performance is outstanding. Worth every penny!',
    product: 'Content Creation PC Build',
    helpful: 22,
    verified: true
  },
  {
    id: 6,
    name: 'Alex Martinez',
    location: 'Miami, FL',
    avatar: '👨‍🎮',
    rating: 4,
    date: '2024-10-28',
    title: 'Good Value for Money',
    review: 'Got a great deal on a gaming monitor during their flash sale. The 144Hz refresh rate makes gaming so smooth. Minor quibble about the stand, but overall very happy with the purchase.',
    product: 'Gaming Monitor 144Hz',
    helpful: 12,
    verified: true
  },
  {
    id: 7,
    name: 'Rachel Green',
    location: 'Boston, MA',
    avatar: '👩‍🎤',
    rating: 5,
    date: '2024-10-25',
    title: 'Reliable and Trustworthy',
    review: 'Have been a customer for over 2 years now. Every purchase has been smooth and the products are always genuine. Their technical support is knowledgeable and responsive.',
    product: 'Various Accessories',
    helpful: 28,
    verified: true
  },
  {
    id: 8,
    name: 'Tom Wilson',
    location: 'Denver, CO',
    avatar: '👨‍🚀',
    rating: 5,
    date: '2024-10-20',
    title: 'Custom Build Perfection',
    review: 'Commissioned a custom workstation for 3D rendering. PC Solutions worked with me through every step of the process. The final result handles all my workloads with ease. Professional and reliable.',
    product: 'Custom Workstation Build',
    helpful: 19,
    verified: true
  }
];

const stats = [
  { label: 'Total Reviews', value: '2,847', icon: '⭐' },
  { label: 'Average Rating', value: '4.8/5', icon: '📊' },
  { label: 'Verified Buyers', value: '98%', icon: '✅' },
  { label: 'Response Time', value: '< 2hrs', icon: '⚡' }
];

export default function TestimonialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTestimonials = testimonials
    .filter(testimonial => {
      const matchesSearch = testimonial.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          testimonial.product.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = ratingFilter === 'all' || testimonial.rating === parseInt(ratingFilter);
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  const averageRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: testimonials.filter(t => t.rating === rating).length,
    percentage: Math.round((testimonials.filter(t => t.rating === rating).length / testimonials.length) * 100)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Customer Reviews & Testimonials</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              See what our satisfied customers have to say about their PC Solutions experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Rating Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Rating</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-bold text-yellow-500">{averageRating}</div>
                <div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.floor(parseFloat(averageRating))
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">Based on {testimonials.length} reviews</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    {testimonial.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{testimonial.location}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{testimonial.date}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">{testimonial.title}</h4>
                <Quote className="h-5 w-5 text-gray-400 mb-2" />
                <p className="text-gray-700 leading-relaxed">{testimonial.review}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">{testimonial.product}</span>
                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({testimonial.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Write a Review CTA */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Help other customers make informed decisions by sharing your experience with PC Solutions products and services.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
}