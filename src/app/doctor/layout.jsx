'use client';

import PropTypes from 'prop-types';
import DoctorLayout from '@/doctor/layout/DoctorLayout';

// Doctor routes use a standalone layout similar to admin
export default function DoctorRouteLayout({ children }) {
  return <DoctorLayout>{children}</DoctorLayout>;
}

DoctorRouteLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
