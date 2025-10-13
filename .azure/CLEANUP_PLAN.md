# 🧹 Cleanup Plan - Remove Old Files

## Files to Remove (Old Monolithic Structure)

### Services (Now in features/)
- [ ] `src/services/appointmentService.js` - Migrated to `features/appointments/services/`

### Actions (Now in features/)
- [ ] `src/actions/appointments.js` - Migrated to `features/appointments/actions/`

### Components (Now in features/)
- [ ] `src/components/appointment-search.jsx` - Migrated to `features/appointments/components/AppointmentSearch.jsx`
- [ ] `src/components/appointments-page-client.jsx` - Migrated to `features/appointments/components/AppointmentsPageClient.jsx`

**Note:** Keep `src/components/appointment-form.jsx` and `src/app/appointments/appointments-display.jsx` as they may still be referenced.

## Before Removal Checklist
- [x] All pages updated to use new imports
- [x] Build successful
- [x] No import errors

## Removal Commands
```bash
# Services
rm src/services/appointmentService.js

# Actions
rm src/actions/appointments.js

# Components (migrated ones)
rm src/components/appointment-search.jsx
rm src/components/appointments-page-client.jsx
```

## After Removal
- [ ] Run build to verify no broken imports
- [ ] Test dev server
- [ ] Update documentation
