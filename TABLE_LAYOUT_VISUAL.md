# Table Layout Visual Guide

## Table Structure

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                          DOCTOR APPOINTMENTS TABLE                                │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  Search: [Search by patient name, email, or phone...]                            │
│                                                                                    │
│  [All Appointments] [Today] [Tomorrow]                                           │
│                                                                                    │
│  Showing 12 appointments                                                          │
│                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│ PATIENT           │ DATE          │ TIME  │ REASON         │ STATUS      │ ACTIONS│
├────────────────────────────────────────────────────────────────────────────────────┤
│ 👤 John Smith     │ 📅 Jan 15, 24 │ 10:00 │ Routine check  │ ✓ Confirmed │ 👁 ✓ 🗑│
│ john@email.com    │               │       │                │             │       │
├────────────────────────────────────────────────────────────────────────────────────┤
│ 👤 Jane Doe       │ 📅 Jan 15, 24 │ 11:30 │ Follow-up      │ ⏱ Pending   │ 👁 ✓ 🗑│
│ jane@email.com    │               │       │                │             │       │
├────────────────────────────────────────────────────────────────────────────────────┤
│ 👤 Mike Johnson   │ 📅 Jan 15, 24 │ 14:00 │ Consultation   │ ✓ Completed │ 👁 ✓ 🗑│
│ mike@email.com    │               │       │                │             │       │
├────────────────────────────────────────────────────────────────────────────────────┤
│ ...                                                                                 │
└────────────────────────────────────────────────────────────────────────────────────┘
```

## Status Badge Colors

```
┌──────────┬──────────────────┬──────────────────┐
│ Status   │ Color            │ Icon             │
├──────────┼──────────────────┼──────────────────┤
│ Pending  │ 🟨 Yellow        │ ⏱ Clock         │
│ Confirmed│ 🟩 Green         │ ✓ Check         │
│ Completed│ 🟦 Blue          │ ✓ Check Circle  │
│ Rejected │ 🟥 Red           │ ✗ X             │
└──────────┴──────────────────┴──────────────────┘
```

## Action Buttons Reference

```
┌────────────┬──────────────┬────────────────────────┐
│ Button     │ Icon Color   │ Action                 │
├────────────┼──────────────┼────────────────────────┤
│ View 👁    │ 🔵 Blue      │ Open details modal     │
│ Complete ✓ │ 🟢 Green     │ Mark as completed      │
│ Delete 🗑  │ 🔴 Red       │ Delete appointment     │
└────────────┴──────────────┴────────────────────────┘
```

## Filter Options

```
All Appointments Button
├─ Shows all appointments
├─ Default view
└─ Combined with search

Today Button
├─ Shows appointments for today
├─ Matches date comparison
└─ Combined with search

Tomorrow Button
├─ Shows appointments for tomorrow
├─ Matches date comparison
└─ Combined with search
```

## Action Flow Diagram

```
View Button
    ↓
Open Modal
    ↓
Display Full Details
(Patient info, date, time, email, phone, reason)
    ↓
Close Modal (read-only)

Complete Button
    ↓
Call API: approveAppointmentService()
    ↓
Update status in table
    ↓
Show toast: "Appointment marked as completed"
    ↓
Button disappears from row

Delete Button
    ↓
Show confirmation dialog
    ↓
If confirmed:
    Call API: rejectAppointmentService()
    Remove from table
    Show toast: "Appointment deleted"
```

## Responsive Behavior

### Mobile (< 640px)

```
┌──────────────────────────┐
│ Patient Info             │
│ Date | Time              │
│ Reason (clipped)         │
│ 🟨 Pending               │
│ [👁] [✓] [🗑]           │
└──────────────────────────┘
```

### Tablet (640px - 1024px)

```
┌────────────────────────────────────┐
│ Patient | Date | Time | Reason     │
│ Status        | Actions [👁 ✓ 🗑] │
└────────────────────────────────────┘
```

### Desktop (> 1024px)

```
┌──────────────────────────────────────────────────────┐
│ Patient | Date | Time | Reason | Status | Actions   │
│         │      │      │        │        │ [👁 ✓ 🗑]  │
└──────────────────────────────────────────────────────┘
```

## Search & Filter Example

```
User searches: "John"
    ↓
Filter matches:
  - "John Smith" (name)
  - "john@email.com" (email contains)
    ↓
Show only matching appointments
    ↓
If also filtered by "Today":
    Show only "John Smith" appointments for today

User clears search and selects "Today"
    ↓
Show all appointments for today
```

## Modal Window Layout

```
┌─────────────────────────────────────────┐
│ Close [X]                               │
│                                         │
│ 👤 John Smith        ✓ Confirmed      │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Date: Jan 15, 2024    │ Time: 10:00 AM │
│ Email: john@email.com │ Phone: 555-1234│
│                                         │
│ Reason for Appointment                  │
│ ┌─────────────────────────────────────┐ │
│ │ Routine check-up and health         │ │
│ │ assessment                          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ─────────────────────────────────────── │
│                        [Close Button]   │
└─────────────────────────────────────────┘
```

## Dark Mode Example

```
Background: Dark slate (#0f172a)
Table: Darker slate (#1e293b)
Text: Light gray (#d1d5db)
Borders: Medium slate (#475569)
Hover: Darker slate with slight highlight

Status colors remain same but with adjusted opacity
```

## Empty States

### No Appointments At All

```
┌────────────────────────────────┐
│                                │
│      ⚠️  No appointments found  │
│                                │
│   No appointments to display   │
│                                │
└────────────────────────────────┘
```

### Today Filter - No Results

```
┌────────────────────────────────┐
│                                │
│      ⚠️  No appointments found  │
│                                │
│  No appointments scheduled     │
│         for today              │
│                                │
└────────────────────────────────┘
```

### Tomorrow Filter - No Results

```
┌────────────────────────────────┐
│                                │
│      ⚠️  No appointments found  │
│                                │
│  No appointments scheduled     │
│        for tomorrow            │
│                                │
└────────────────────────────────┘
```

### Search - No Results

```
Displays filtered result based on date filter message
+ Hint: "Try searching for a different patient"
```

## Data Display Examples

### Patient Column

```
👤 John Smith
john.smith@hospital.com
```

### Date Column

```
📅 January 15, 2024
```

### Time Column

```
⏱️ 10:00 AM
```

### Reason Column

```
Routine checkup and health assessment
(line-clamped to 2 lines)
```

### Status Column

```
✓ Confirmed (green badge)
or
⏱ Pending (yellow badge)
or
✓ Completed (blue badge)
```
