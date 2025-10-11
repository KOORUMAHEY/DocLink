'use client';

import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function DoctorFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">DocLink</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure, HIPAA-compliant healthcare management platform for modern medical practices.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Shield className="h-4 w-4" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-gray-900 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-gray-900 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@doclink.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1-800-DOCLINK</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>123 Medical Center Dr<br />Healthcare City, HC 12345</span>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex gap-3 mb-4">
              <Link
                href="https://facebook.com/doclink"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com/doclink"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-400 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com/company/doclink"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Data Encrypted & Secure</div>
              <div>24/7 Support Available</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 DocLink Healthcare. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/compliance" className="text-muted-foreground hover:text-gray-900 transition-colors">
                Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}