import Link from 'next/link';
import { Sparkles, Phone, Mail, MapPin, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <Link href="/" className="font-bold text-gray-900 text-xl">DocLink Healthcare</Link>
            </div>
            <p className="text-sm text-gray-600 text-center sm:text-left max-w-sm leading-relaxed">
              Modern healthcare platform connecting patients with quality medical care. 
              Simple, secure, and professional.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/appointments/book" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <span>Book Appointment</span>
              </Link>
              <Link href="/appointments" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <span>Manage Bookings</span>
              </Link>
              <Link href="/login" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <span>Healthcare Providers</span>
              </Link>
              <Link href="/privacy" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <span>Privacy Policy</span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-gray-900 mb-4">Contact & Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>contact@doclink.health</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Medical District, Chennai</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} DocLink Healthcare. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Professional healthcare platform with enterprise-grade security
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-gray-500">
              <span>Office Hours: Friday 9:00 AM - 2:00 PM</span>
              <span>Emergency: Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
