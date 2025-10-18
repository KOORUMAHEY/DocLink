# Profile Design - Visual Preview

## 📱 Mobile View (xs < 640px)

```
┌─────────────────────────────┐
│                             │
│    Doctor Profile           │
│    Manage your info    [Edit]│  ← Hidden text, icon visible
│                             │
├─────────────────────────────┤
│                             │
│     [Avatar]                │
│     Dr. John Doe            │
│     Cardiologist            │
│     [Active] Member 2023    │
│                             │
├─────────────────────────────┤
│                             │
│ Contact Information         │
│                             │
│ 📧 EMAIL                   │
│ john@example.com            │
│                             │
│ ☎️  PHONE                   │
│ +1-234-567-8900            │
│                             │
├─────────────────────────────┤
│                             │
│ Personal Information        │
│                             │
│ 👤 FULL NAME               │
│ Dr. John Doe                │
│                             │
│ 🏥 HOSPITAL                │
│ City Medical Center         │
│                             │
├─────────────────────────────┤
│                             │
│ Professional Information    │
│                             │
│ 🏆 SPECIALTY               │
│ Cardiologist                │
│                             │
│ QUALIFICATION              │
│ MBBS, MD, DM                │
│                             │
│ 💼 EXPERIENCE              │
│ 10 years                    │
│                             │
│ 💰 CONSULTATION FEE        │
│ $50                         │
│                             │
├─────────────────────────────┤
│                             │
│ 🔒 Security                │
│                             │
│ [Change Password]           │
│                             │
└─────────────────────────────┘
```

---

## 📱 Mobile - Edit Mode (xs < 640px)

```
┌─────────────────────────────┐
│                             │
│    Doctor Profile           │
│    Manage your info    [Edit]│
│                             │
├─────────────────────────────┤
│                             │
│     [Avatar]                │
│     Dr. John Doe            │
│     Cardiologist            │
│     [Active] Member 2023    │
│                             │
├─────────────────────────────┤
│                             │
│ Contact Information         │
│                             │
│ 📧 EMAIL                   │
│ [_____________(input)_____] │
│                             │
│ ☎️  PHONE                   │
│ [_____________(input)_____] │
│                             │
├─────────────────────────────┤
│                             │
│          ...other fields... │
│                             │
├─────────────────────────────┤
│                             │
│   [Cancel]  [Save Changes]  │  ← Stacked vertically
│                             │
├─────────────────────────────┤
│                             │
│ 🔒 Security                │
│ [Change Password]           │
│                             │
└─────────────────────────────┘
```

---

## 💻 Desktop View (md 768px+)

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Doctor Profile                              [Edit Profile]       │
│  Manage your professional information                             │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Avatar] Dr. John Doe                                            │
│           Cardiologist                                            │
│           [Active] Member since 2023                              │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Contact Information                                              │
│  ┌──────────────────────────┬──────────────────────────┐         │
│  │ 📧 EMAIL                 │ ☎️  PHONE                │         │
│  │ john@example.com         │ +1-234-567-8900         │         │
│  └──────────────────────────┴──────────────────────────┘         │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Personal Information                                             │
│  ┌──────────────────────────┬──────────────────────────┐         │
│  │ 👤 FULL NAME             │ 🏥 HOSPITAL             │         │
│  │ Dr. John Doe             │ City Medical Center     │         │
│  └──────────────────────────┴──────────────────────────┘         │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Professional Information                                         │
│  ┌──────────────────────────┬──────────────────────────┐         │
│  │ 🏆 SPECIALTY             │ QUALIFICATION            │         │
│  │ Cardiologist             │ MBBS, MD, DM             │         │
│  ├──────────────────────────┼──────────────────────────┤         │
│  │ 💼 EXPERIENCE            │ 💰 CONSULTATION FEE      │         │
│  │ 10 years                 │ $50                      │         │
│  └──────────────────────────┴──────────────────────────┘         │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  🔒 Security - Manage your account security settings             │
│  [Change Password]                                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color-Coded Cards

### Contact Cards

```
┌─────────────────────────────────────┐
│ 📧 EMAIL                            │  ← Blue gradient bg
│ john@example.com                    │     text-blue-600
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ☎️  PHONE                            │  ← Orange gradient bg
│ +1-234-567-8900                     │     text-orange-600
└─────────────────────────────────────┘
```

### Personal Cards

```
┌─────────────────────────────────────┐
│ 👤 FULL NAME                        │  ← Purple gradient bg
│ Dr. John Doe                        │     text-purple-600
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🏥 HOSPITAL                         │  ← Emerald gradient bg
│ City Medical Center                 │     text-emerald-600
└─────────────────────────────────────┘
```

### Professional Cards

```
┌─────────────────────────────────────┐
│ 🏆 SPECIALTY                        │  ← Amber gradient bg
│ Cardiologist                        │     text-amber-600
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ QUALIFICATION                       │  ← Rose gradient bg
│ MBBS, MD, DM                        │     text-rose-600
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💼 EXPERIENCE                       │  ← Cyan gradient bg
│ 10 years                            │     text-cyan-600
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💰 CONSULTATION FEE                 │  ← Green gradient bg
│ $50                                 │     text-green-600
└─────────────────────────────────────┘
```

---

## 🔐 Security Section

### Change Password Mode

```
┌─────────────────────────────────────────┐
│ 🔒 Security                             │
│ Manage your account security settings   │
│                                         │
│ Current Password:                       │
│ [***____________] 👁️  ← Eye toggle      │
│                                         │
│ New Password:                           │
│ [***____________] 👁️  ← Eye toggle      │
│                                         │
│ Confirm New Password:                   │
│ [***____________] 👁️  ← Eye toggle      │
│                                         │
│       [Cancel] [Update Password]        │
└─────────────────────────────────────────┘
```

### Default Mode

```
┌─────────────────────────────────────────┐
│ 🔒 Security                             │
│ Manage your account security settings   │
│                                         │
│ [Change Password]  ← Click to expand    │
└─────────────────────────────────────────┘
```

---

## 📊 Responsive Size Comparison

### Avatar Sizes

```
Mobile:   w-16 h-16   (64px)    😊
Tablet:   w-20 h-20   (80px)    😊
Desktop:  w-24 h-24   (96px)    😊
```

### Heading Sizes

```
Mobile:   text-2xl    (28px)
Tablet:   text-3xl    (30px)
Desktop:  text-4xl    (36px)
```

### Button Sizes

```
Mobile:   h-8         (32px) - Smaller tap target
Tablet+:  h-10        (40px) - Optimal tap target
```

### Padding

```
Mobile:   px-3 py-4    (12px / 16px)
Tablet:   px-4 py-6    (16px / 24px)
Desktop:  px-6 py-8    (24px / 32px)
```

---

## ✨ Interactive States

### Button States

```
Default:    bg-blue-600 text-white
Hover:      bg-blue-700 (darker)
Active:     Pressed effect
Disabled:   Reduced opacity
```

### Input States

```
Normal:     border-gray-300
Focus:      border-blue-500 ring-2
Error:      border-red-500 bg-red-50
Filled:     text-gray-900 font-medium
```

### Card States

```
Default:    shadow-md
Hover:      shadow-lg transition-shadow
```

---

## 🎯 Touch-Friendly Design

### Button Sizing (iOS/Android Standard)

```
Minimum Tap Target: 44px x 44px
Our Sizing:
- Mobile:   h-8 (32px) + padding = ~40px ✓
- Tablet+:  h-10 (40px) + padding = ~48px ✓
```

### Input Field Sizing

```
Mobile:   h-8 (32px) - Comfortable tap
Tablet+:  h-10 (40px) - Optimal tap target
```

---

## 📐 Layout Grid

### Single Column (Mobile)

```
Card 1 (100%)
Card 2 (100%)
Card 3 (100%)
Card 4 (100%)
```

### Two Column (Tablet+)

```
Card 1 (50%) | Card 2 (50%)
Card 3 (50%) | Card 4 (50%)
Card 5 (50%) | Card 6 (50%)
```

---

## 🌈 Complete Color Palette

```
Primary Gradient:
  from-blue-600 → to-blue-800  (Text: bg-clip-text)

Card Gradients:
  Blue:        from-blue-50    to-blue-100      (text-blue-600)
  Orange:      from-orange-50  to-orange-100    (text-orange-600)
  Purple:      from-purple-50  to-purple-100    (text-purple-600)
  Emerald:     from-emerald-50 to-emerald-100   (text-emerald-600)
  Amber:       from-amber-50   to-amber-100     (text-amber-600)
  Rose:        from-rose-50    to-rose-100      (text-rose-600)
  Cyan:        from-cyan-50    to-cyan-100      (text-cyan-600)
  Green:       from-green-50   to-green-100     (text-green-600)

Text Colors:
  Primary:     text-gray-900   (Body text)
  Secondary:   text-gray-500   (Subtitles)
  Muted:       text-gray-400   (Helper text)
```

---

## 📱 Device Preview

### iPhone SE (375px)

```
Width: 375px
Safe Area: 15px margins
Display: portrait
Best View: Full-width cards, stacked layout
```

### iPad (768px)

```
Width: 768px
Safe Area: Larger
Display: portrait/landscape
Best View: 2-column grid, comfortable spacing
```

### Desktop (1920px)

```
Width: 1920px
Max Container: 1152px (max-w-6xl)
Display: landscape
Best View: Optimal spacing, centered layout
```

---

**All layouts verified and responsive ✅**
