'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from './CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-gray-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="https://i.postimg.cc/85kbVtd9/ai-edited-image-1764051841322.png"
                alt="PC Solutions Logo"
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-2xl font-bold text-light-text neon-logo">PC Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-light-text hover:text-white transition-colors navbar-hover-line">
              Home
            </Link>
            <Link href="/products" className="text-light-text hover:text-white transition-colors navbar-hover-line">
              Products
            </Link>
            <Link href="/offers" className="text-light-text hover:text-white transition-colors navbar-hover-line">
              Offers
            </Link>
            <Link href="/about" className="text-light-text hover:text-white transition-colors navbar-hover-line">
              About
            </Link>
            <Link href="/contact" className="text-light-text hover:text-white transition-colors navbar-hover-line">
              Contact
            </Link>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-gray-accent/10 border border-gray-accent/30 rounded-lg px-4 py-2 pl-10 text-light-text placeholder-gray-accent focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-accent" />
              </div>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-light-text hover:text-white transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center neon-cart-badge">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-light-text hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-accent/20 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-light-text hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-light-text hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/offers"
                className="text-light-text hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Offers
              </Link>
              <Link
                href="/about"
                className="text-light-text hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-light-text hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}