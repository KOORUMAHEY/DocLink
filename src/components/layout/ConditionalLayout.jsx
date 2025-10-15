'use client';

import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Check if we're on an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // For admin routes, don't show Navbar and Footer
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // For all other routes, show the standard layout
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

ConditionalLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
