import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-bg text-light-text border-t border-gray-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://i.postimg.cc/85kbVtd9/ai-edited-image-1764051841322.png"
                alt="PC Solutions Logo"
                className="h-8 w-8 rounded-lg"
              />
              <h3 className="text-2xl font-bold text-light-text">PC Solutions</h3>
            </div>
            <p className="text-gray-accent mb-4">
              PC Solutions has been a provider of IT solutions and services for over three decades,
              focusing on delivering comprehensive digital transformation journeys for enterprise customers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-accent hover:text-light-text transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-accent hover:text-light-text transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-accent hover:text-light-text transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-light-text">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-accent hover:text-light-text transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-accent hover:text-light-text transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-accent hover:text-light-text transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-accent hover:text-light-text transition-colors">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-accent hover:text-light-text transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-accent hover:text-light-text transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-light-text">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-light-text" />
                <span className="text-gray-accent">0774301436 / 0662224650</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-light-text" />
                <span className="text-gray-accent">info@pcsolutions.lk</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-light-text" />
                <span className="text-gray-accent">
                  47A/1, King Street<br />
                  Matale, Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-accent/30 mt-8 pt-8 text-center">
          <p className="text-gray-accent">
            © 2024 PC Solutions. All rights reserved. |
            <Link href="/privacy" className="hover:text-light-text transition-colors ml-1">
              Privacy Policy
            </Link> |
            <Link href="/terms" className="hover:text-light-text transition-colors ml-1">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}