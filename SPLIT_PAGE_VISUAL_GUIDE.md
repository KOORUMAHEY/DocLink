# Split Page Design - Visual Reference Guide

## Before vs After

### BEFORE: Tab-Based Single Page

```
┌────────────────────────────────────────────┐
│         Appointment Setup (TABS)           │
├────────────────────────────────────────────┤
│  [Form Designer] [Schedule] [Live Preview] │  ← Tabs
├────────────────────────────────────────────┤
│  Tab Content (Limited Width)               │
│                                            │
│  Either Form Designer OR Schedule visible  │
│  Preview in separate tab                   │
│                                            │
└────────────────────────────────────────────┘

Issues:
✗ Confusing tab switching
✗ No simultaneous form and preview viewing
✗ One task at a time
✗ Less efficient workflow
```

### AFTER: Two Dedicated Pages

#### Form Designer Page

```
┌────────────────────────────────────────────────────┐
│    Appointment Form Designer (Header)              │
├────────────────────────────────────────────────────┤
│  [Go to Schedule Manager →]                        │
├────────────────────────────────────────────────────┤
│  📋 Template Info Banner                           │
├─────────────────────┬──────────────────────────────┤
│  Form Designer      │  LIVE PREVIEW (Sticky)      │
│  (2/3 width)        │  (1/3 width)                │
│                     │                             │
│  - Template List    │  ┌─────────────────────┐   │
│  - Sections         │  │ Real-time Form      │   │
│  - Custom Fields    │  │ Preview             │   │
│  - Field Settings   │  │ (Updated instantly) │   │
│                     │  │                     │   │
│                     │  │ (Stays visible      │   │
│                     │  │  when scrolling)    │   │
│                     │  └─────────────────────┘   │
├─────────────────────┴──────────────────────────────┤
│  📚 Setup Guide (3 Steps)                         │
└─────────────────────────────────────────────────────┘

Benefits:
✓ Form and preview visible simultaneously
✓ Sticky preview while editing
✓ Full focus on form design
✓ Easy navigation to schedule
```

#### Schedule Manager Page

```
┌──────────────────────────────────────────────────┐
│   Schedule Manager (Header)                      │
├──────────────────────────────────────────────────┤
│  [Go to Form Designer →]                         │
├──────────────────────────────────────────────────┤
│  📅 Availability Management Banner               │
├──────────────────────────────────────────────────┤
│  Schedule Configuration (Full Width)             │
│  ┌────────────────────────────────────────────┐  │
│  │ Working Hours Setup                        │  │
│  │ ┌─ Monday ───┬─ Tuesday ───┬─ Wednesday ┐ │  │
│  │ │ 9:00-18:00 │ 9:00-18:00  │ 9:00-18:00│ │  │
│  │ └────────────┴────────────┴───────────┘ │  │
│  │                                          │  │
│  │ Time Slot Configuration                  │  │
│  │ Duration: [15 min ▼]  Interval: [0 min] │  │
│  │                                          │  │
│  │ Breaks Management                        │  │
│  │ [+ Add Break]                            │  │
│  │                                          │  │
│  │ Preview: Fri, Oct 17, 2025               │  │
│  │ ┌─ 09:00 ┬─ 10:00 ┬─ 11:00 ┬─ 12:00 ─┐ │  │
│  │ │ AVAIL  │ AVAIL  │ AVAIL  │ BREAK  │ │  │
│  │ └────────┴────────┴────────┴────────┘ │  │
│  └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│  ⏰ Setup Guide (3 Steps)                        │
└──────────────────────────────────────────────────┘

Benefits:
✓ Dedicated space for schedule configuration
✓ Full attention to availability management
✓ No form distractions
✓ Easy navigation to form designer
```

---

## Page Features Breakdown

### Form Designer Page

| Feature            | Before     | After             |
| ------------------ | ---------- | ----------------- |
| Form Editor        | ✓ In Tab   | ✓ Full Page       |
| Live Preview       | ✓ In Tab   | ✓ **Sticky Side** |
| Template Selection | ✓          | ✓                 |
| Field Management   | ✓          | ✓                 |
| Simultaneous View  | ✗          | ✓ **Enhanced**    |
| Screen Real Estate | Limited    | **Maximum**       |
| Focus              | Divided    | **Single**        |
| Navigation         | Tab Switch | **Link Button**   |

### Schedule Manager Page

| Feature            | Before     | After           |
| ------------------ | ---------- | --------------- |
| Working Hours      | ✓ In Tab   | ✓ Full Page     |
| Time Slots         | ✓ In Tab   | ✓ Full Page     |
| Breaks             | ✓ In Tab   | ✓ Full Page     |
| Holidays           | ✓ In Tab   | ✓ Full Page     |
| Preview            | ✓ In Tab   | ✓ Full Page     |
| Screen Real Estate | Limited    | **Maximum**     |
| Focus              | Divided    | **Single**      |
| Navigation         | Tab Switch | **Link Button** |

---

## User Workflows

### Workflow 1: Setting Up Appointment Form

```
1. Go to Form Designer
   └─ URL: /doctor/appointments/form?id={doctorId}

2. Choose Template
   └─ Shows template info banner with details

3. See Real-time Preview
   └─ Live preview shown in sticky right panel

4. Customize Fields
   └─ Edit fields while seeing changes instantly

5. Go to Schedule Manager
   └─ Click "Go to Schedule Manager" button
```

### Workflow 2: Managing Doctor Schedule

```
1. Go to Schedule Manager
   └─ URL: /doctor/appointments/schedule?id={doctorId}

2. Set Working Hours
   └─ Configure hours for each day

3. Configure Time Slots
   └─ Set appointment duration

4. Add Breaks
   └─ Mark unavailable times

5. Preview Schedule
   └─ See generated time slots

6. Back to Form
   └─ Click "Go to Form Designer" button
```

### Workflow 3: Complete Setup (First-Time Setup)

```
Step 1: Form Designer Page
├─ Choose professional template
├─ Customize required fields
├─ Preview changes in real-time
└─ Verify form looks good

Step 2: Switch to Schedule Manager
├─ Click "Go to Schedule Manager"
├─ Set working hours
├─ Configure appointment duration
├─ Add breaks and holidays
└─ Preview available slots

Step 3: Complete!
├─ Both form and schedule configured
├─ Patient-ready for appointments
└─ Forms accessible for editing anytime
```

---

## Color Coding System

### Visual Distinction

```
📘 FORM DESIGNER PAGE
├─ Header: Blue theme (bg-blue-100)
├─ Icons: Blue gradient
├─ Preview: Green (dashed border, bg-green-50)
├─ Banner: Blue-to-indigo gradient
└─ Guide: Blue cards and icons

📗 SCHEDULE MANAGER PAGE
├─ Header: Emerald theme (bg-emerald-100)
├─ Icons: Emerald gradient
├─ Banner: Emerald-to-teal gradient
├─ Sidebar: Emerald-to-teal gradient
└─ Guide: Emerald cards and icons
```

**Why Color Coding?**

- ✓ Users instantly know which page they're on
- ✓ Consistent visual language
- ✓ Professional appearance
- ✓ Easy visual navigation

---

## Component Integration

### Form Designer Page

```
AppointmentFormPage (Main)
├─ Header Section
│  ├─ Title + Icon (Blue theme)
│  ├─ Doctor Info (Name, Specialization)
│  └─ Navigation Button (Emerald theme)
├─ Template Info Banner
│  ├─ Template Icon + Name + Description
│  └─ Section Count
├─ Content Grid (3 columns on desktop)
│  ├─ Left Column (2/3)
│  │  └─ AdvancedTemplateDesigner Component
│  └─ Right Column (1/3 sticky)
│     ├─ Preview Header
│     └─ AppointmentForm (Preview Mode)
└─ Setup Guide Section
   └─ 3 Step Cards with Icons
```

### Schedule Manager Page

```
SchedulePage (Main)
├─ Header Section
│  ├─ Title + Icon (Emerald theme)
│  ├─ Doctor Info (Name, Specialization)
│  └─ Navigation Button (Blue theme)
├─ Availability Banner
│  ├─ Banner Icon + Text
│  └─ Time slot configuration note
├─ Content Section (Full Width)
│  ├─ Section Title + Description
│  └─ ScheduleManager Component
│     ├─ Working Hours
│     ├─ Time Slots
│     ├─ Breaks Management
│     ├─ Holidays Management
│     └─ Preview Section
└─ Setup Guide Section
   └─ 3 Step Cards with Icons
```

---

## Responsive Behavior

### Desktop (lg: 1024px+)

```
Form Designer:
┌─ 3 Column Grid (2-1 split) ─┐
│ Designer (2/3) | Preview (1/3 sticky) │
└───────────────────────────────────┘

Schedule Manager:
┌─ 1 Column (Full Width) ─┐
│     Schedule Manager     │
└────────────────────────┘
```

### Tablet (md: 768px - 1023px)

```
Form Designer:
┌─ 2 Column Grid ─┐
│ Designer | Preview │  (Preview scrolls)
└──────────────────┘

Schedule Manager:
┌─ 1 Column (Full Width) ─┐
│     Schedule Manager     │
└────────────────────────┘
```

### Mobile (< 768px)

```
Form Designer:
┌─ 1 Column Stack ─┐
│   Designer       │
├──────────────────┤
│   Preview        │
└──────────────────┘

Schedule Manager:
┌─ 1 Column (Full Width) ─┐
│   Schedule Manager       │
└────────────────────────┘
```

---

## Navigation Map

```
Doctor Portal
├─ Dashboard (/doctor)
│
├─ Appointments (/doctor/appointments)
│  ├─ Main Appointments List
│  ├─ [NEW] Form Designer (/doctor/appointments/form)
│  │         └─ "Go to Schedule Manager" button
│  └─ [NEW] Schedule Manager (/doctor/appointments/schedule)
│           └─ "Go to Form Designer" button
│
├─ Patients (/doctor/patients)
├─ Profile (/doctor/profile)
└─ Settings (/doctor/settings)
```

---

## Quick Reference

### Form Designer Page

- **URL:** `/doctor/appointments/form?id={doctorId}`
- **Theme:** Blue/Green
- **Purpose:** Customize appointment form fields
- **Key Component:** AdvancedTemplateDesigner
- **Preview:** Real-time, sticky on right
- **Navigation Out:** "Go to Schedule Manager" button

### Schedule Manager Page

- **URL:** `/doctor/appointments/schedule?id={doctorId}`
- **Theme:** Emerald/Teal
- **Purpose:** Configure availability and time slots
- **Key Component:** ScheduleManager
- **Navigation Out:** "Go to Form Designer" button

### Sidebar Navigation

- **Form Designer:** "Form Designer" → custom forms
- **Schedule Manager:** "Schedule Manager" → manage availability
- **Both:** Include doctor ID in query parameter

---

## Implementation Checklist

- [x] Created dedicated form designer page
- [x] Created dedicated schedule manager page
- [x] Added sticky preview to form page
- [x] Added color-coded headers and banners
- [x] Added inter-page navigation buttons
- [x] Updated sidebar with both items
- [x] Made responsive for mobile/tablet/desktop
- [x] Added setup guides with step cards
- [x] Included doctor info in headers
- [x] Implemented doctor ID parameter passing
- [x] Error handling for missing doctor
- [x] Loading states implemented
- [x] Professional styling with Tailwind CSS
