
import Link from 'next/link';
import { Sparkles, MessageSquare, Hash, Briefcase } from 'lucide-react';

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
            <div className="space-y-2">
              <Link href="/contact" className="block text-sm text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block text-sm text-gray-700 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-gray-700 hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center sm:items-start sm:col-span-1 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <button className="text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-200 transition-all">
                <MessageSquare className="h-5 w-5" />
              </button>
              <button className="text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-200 transition-all">
                <Hash className="h-5 w-5" />
              </button>
              <button className="text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-200 transition-all">
                <Briefcase className="h-5 w-5" />
              </button>
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
