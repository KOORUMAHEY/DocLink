
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <Link href="/" className="font-bold">JIPMER</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} JIPMER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
