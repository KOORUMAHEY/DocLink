import Link from 'next/link';
import { Sparkles, Facebook, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <Link href="/" className="font-bold text-gray-900 text-lg">DocLink</Link>
            </div>
            <p className="text-sm text-gray-700 text-center sm:text-left">
              Your health, connected. Book and manage appointments seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="flex flex-wrap gap-6">
              <Link href="/contact" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                <span className="text-blue-600">📞</span>
                <span>Contact</span>
              </Link>
              <Link href="/privacy" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                <span className="text-blue-600">🔒</span>
                <span>Privacy</span>
              </Link>
              <Link href="/terms" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                <span className="text-blue-600">📋</span>
                <span>Terms</span>
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center sm:items-start sm:col-span-1 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 p-3 rounded-full hover:bg-blue-50 transition-all duration-200 border border-gray-200 hover:border-blue-300" aria-label="Follow us on Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 p-3 rounded-full hover:bg-blue-50 transition-all duration-200 border border-gray-200 hover:border-blue-300" aria-label="Follow us on Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 p-3 rounded-full hover:bg-blue-50 transition-all duration-200 border border-gray-200 hover:border-blue-300" aria-label="Follow us on LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()} DocLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
