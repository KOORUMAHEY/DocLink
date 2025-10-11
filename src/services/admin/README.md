# Admin Services

This directory contains all admin-related services for the DocLink healthcare management system.

## Services

### `adminService.js`

Core admin functionality including:

- `getDashboardStats()` - Get dashboard statistics (appointments, doctors, patients)
- `getSystemLogs(options)` - Get system logs and security events
- `getRecentActivities(limit)` - Get recent system activities
- `getUpcomingAppointments(limit)` - Get upcoming scheduled appointments
- `getSecurityStatus()` - Get security and compliance status

### `adminUserService.js`

Admin user management:

- `getAdminUsers()` - Get all admin users
- `getAdminUserById(userId)` - Get admin user by ID
- `getAdminUserByEmail(email)` - Get admin user by email
- `createAdminUser(userData)` - Create new admin user
- `updateAdminUser(userId, updates)` - Update admin user
- `deleteAdminUser(userId)` - Delete admin user
- `getAdminUserPermissions(userId)` - Get user permissions
- `updateAdminUserPermissions(userId, permissions)` - Update user permissions

### `systemSettingsService.js`

System configuration management:

- `getSystemSettings()` - Get all system settings
- `updateSystemSettings(updates)` - Update system settings
- `getNotificationSettings()` - Get notification settings
- `updateNotificationSettings(settings)` - Update notification settings
- `getSecuritySettings()` - Get security settings
- `updateSecuritySettings(settings)` - Update security settings
- `getBackupSettings()` - Get backup settings
- `updateBackupSettings(settings)` - Update backup settings
- `getClinicSettings()` - Get clinic information settings
- `updateClinicSettings(settings)` - Update clinic settings

## Usage

```javascript
import { getDashboardStats, getAdminUsers } from "@/services/admin";

// Get dashboard statistics
const stats = await getDashboardStats();

// Get admin users
const adminUsers = await getAdminUsers();
```

## Data Structure

All services follow Firebase Firestore conventions and include fallback mock data for development and testing purposes.

## Error Handling

All services include comprehensive error handling and return appropriate fallback data when Firebase operations fail.
