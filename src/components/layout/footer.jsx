
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <Link href="/" className="font-bold text-gray-900">DocLink</Link>
          </div>
          <p className="text-sm text-gray-600 text-center sm:text-left">
            © {new Date().getFullYear()} DocLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
