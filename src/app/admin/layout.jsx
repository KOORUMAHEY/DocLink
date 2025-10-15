'use client';

import PropTypes from 'prop-types';
import AdminLayout from '@/admin/layout/AdminLayout';

// Admin routes use a standalone layout without the main app's Navbar/Footer
export default function AdminRouteLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}

AdminRouteLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

