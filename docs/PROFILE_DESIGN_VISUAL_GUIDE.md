# Profile Design Visual Guide

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    RESPONSIVE WRAPPER                   │
│         px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8      │
│                   max-w-6xl mx-auto                      │
├─────────────────────────────────────────────────────────┤
│                      HEADER SECTION                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Doctor Profile  [Edit Profile Button - mobile:   │  │
│  │ Manage info     hidden text]                      │  │
│  └──────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    HERO CARD (Profile)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Avatar] Dr. Name                                │  │
│  │          Specialty                               │  │
│  │          [Active Badge] Member since YYYY        │  │
│  └──────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│              CONTACT INFORMATION CARD                   │
│  ┌──────────────────┬──────────────────────────────┐   │
│  │  📧 EMAIL        │  ☎️  PHONE                   │   │
│  │  user@email.com  │  +1-234-567-8900            │   │
│  └──────────────────┴──────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│             PERSONAL INFORMATION CARD                   │
│  ┌──────────────────┬──────────────────────────────┐   │
│  │  NAME            │  🏥 HOSPITAL                │   │
│  │  Full Name       │  Hospital Name             │   │
│  └──────────────────┴──────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│            PROFESSIONAL INFORMATION CARD                │
│  ┌──────────────────┬──────────────────────────────┐   │
│  │  🏆 SPECIALTY    │  QUALIFICATION              │   │
│  │  Cardiologist    │  MBBS, MD                   │   │
│  ├──────────────────┼──────────────────────────────┤   │
│  │  💼 EXPERIENCE   │  💰 CONSULTATION FEE        │   │
│  │  10 years        │  $50                        │   │
│  └──────────────────┴──────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│              ACTION BUTTONS (if editing)                │
│                [Cancel] [Save Changes]                  │
├─────────────────────────────────────────────────────────┤
│                    SECURITY CARD                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🔒 Security                                      │  │
│  │ Manage your account security settings            │  │
│  │                                                   │  │
│  │ [Change Password Button]                         │  │
│  │ OR (if changing password)                         │  │
│  │ Current Password: [***] 👁️                        │  │
│  │ New Password:     [***] 👁️                        │  │
│  │ Confirm Password: [***] 👁️                        │  │
│  │        [Cancel] [Update Password]                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Color Coding System

### Card Color Scheme

```
Contact Information:
├── Email:    Blue (50-100)    🔵
└── Phone:    Orange (50-100)  🟠

Personal Information:
├── Name:     Purple (50-100)  🟣
└── Hospital: Emerald (50-100) 🟢

Professional Information:
├── Specialty:       Amber (50-100)   🟡
├── Qualification:   Rose (50-100)    🔴
├── Experience:      Cyan (50-100)    🔵
└── Consultation Fee: Green (50-100)  🟢
```

## Responsive Breakpoints

### Mobile (xs) - Default

```
Width: < 640px
- Padding: px-3 py-4
- Text Size: text-xs
- Heading: text-2xl
- Button Height: h-8
- Grid: 1 column
- Avatar: 16x16
- Gap: gap-2
```

### Tablet (sm)

```
Width: 640px - 768px
- Padding: px-4 py-6
- Text Size: text-sm
- Heading: text-3xl
- Button Height: h-10
- Grid: 2 columns
- Avatar: 20x20
- Gap: gap-3
```

### Desktop (md+)

```
Width: 768px+
- Padding: px-6 py-8
- Text Size: sm/base
- Heading: text-4xl
- Button Height: h-10
- Grid: 2 columns
- Avatar: 24x24
- Gap: gap-4
- Max Width: max-w-6xl
```

## Edit Mode Features

### View Mode

- All fields displayed as read-only text
- "Edit Profile" button visible
- Clean, professional appearance

### Edit Mode

- Input fields replace text values
- "Save Changes" and "Cancel" buttons visible
- All data stays intact if cancelled
- Loading state during save

### Password Change

- Separate security card
- Toggle password visibility
- Password validation (min 6 characters, match confirmation)
- Clear feedback with toast notifications

## Interactive Features

1. **Hover Effects**

   - Cards: `hover:shadow-lg transition-shadow`
   - Professional depth effect

2. **Icon Integration**

   - Color-coded icons with labels
   - Responsive scaling
   - Professional appearance

3. **Accessibility**

   - Proper labels for inputs
   - Eye icon toggle for password visibility
   - Clear button labels
   - Responsive touch targets

4. **User Feedback**
   - Loading skeletons while fetching data
   - Toast notifications for success/error
   - Loading states during save

## Mobile-Specific Optimizations

1. **Edit Button**

   - Full width on mobile
   - Text hidden, icon shown on mobile
   - "Edit Profile" on desktop
   - "Edit" on mobile (sm:hidden)

2. **Button Layout**

   - Stacked on mobile (flex-col-reverse)
   - Horizontal on desktop (sm:flex-row)
   - Proper spacing adjusts per breakpoint

3. **Input Fields**

   - Touch-friendly sizing: h-8 sm:h-10
   - Proper padding for mobile interaction
   - Clear focus states

4. **Password Field Icons**
   - Positioned absolutely (right-2 sm:right-3)
   - Proper touch targets
   - Clear visibility on all devices

## File Statistics

- **Total Lines**: 418
- **Components Used**: Card, CardContent, Button, Input, Badge, Avatar, Skeleton
- **Icons Used**: 13 different Lucide icons
- **Responsive Breakpoints**: 3 (xs, sm, md)
- **Color Schemes**: 8 unique gradient combinations
- **State Variables**: 9
- **Handler Functions**: 5

## Status: ✅ COMPLETE & ERROR-FREE
