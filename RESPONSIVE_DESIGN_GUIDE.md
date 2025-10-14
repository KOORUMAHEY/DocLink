# Admin Dashboard - Responsive Design Guide

## 📱 Visual Layout Examples

### Mobile View (< 640px)

```
┌─────────────────────────┐
│ ☰ DocLink Admin    🔔   │ ← Fixed header
├─────────────────────────┤
│                         │
│ [Icon] Appointments     │
│        Manage bookings  │
│                         │
│ ┌─────────┬───────────┐ │ ← 2 column stats
│ │ Total   │ Scheduled │ │
│ │  156    │    42     │ │
│ └─────────┴───────────┘ │
│ ┌─────────┬───────────┐ │
│ │Complete │ Cancelled │ │
│ │  108    │     6     │ │
│ └─────────┴───────────┘ │
│                         │
│ 🔍 Search...  [▼][▼]   │ ← Stacked filters
│                         │
│ ┌─────────────────────┐ │
│ │ Patient  │ Date │ > │ │ ← Compact table
│ ├─────────────────────┤ │
│ │ John Doe │12/15│ > │ │
│ └─────────────────────┘ │
│                         │
│ [Filter] [+ New]        │ ← Full width buttons
│                         │
└─────────────────────────┘
```

### Tablet View (640px - 1023px)

```
┌────────────────────────────────────────┐
│ ☰ DocLink Admin                  🔔    │
├────────────────────────────────────────┤
│                                        │
│ [Icon] Appointments      [Filter][New] │
│        Manage all scheduled appts      │
│                                        │
│ ┌─────────┬──────────┬──────────┐     │ ← 3-4 col stats
│ │ Total   │Scheduled │ Complete │     │
│ │  156    │   42     │   108    │     │
│ └─────────┴──────────┴──────────┘     │
│ ┌─────────┬──────────┬──────────┐     │
│ │Cancelled│  Active  │ Pending  │     │
│ │    6    │    35    │    12    │     │
│ └─────────┴──────────┴──────────┘     │
│                                        │
│ 🔍 Search...        [Status▼] [Sort▼] │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │Patient│Doctor│Date│Status│Actions │ │
│ ├────────────────────────────────────┤ │
│ │J.Doe │Dr.Smith│12/15│✓│  View  │ │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Desktop View (1024px+)

```
┌─────────────────┬──────────────────────────────────────────────────┐
│                 │ DocLink Admin Dashboard                  🔔   ⚙️ │
│  DocLink        ├──────────────────────────────────────────────────┤
│  Admin Portal   │                                                  │
│                 │  [Icon] Appointments              [Filter] [New] │
│ ┌─────────────┐ │         Manage and monitor appointments          │
│ │ 👤 Admin    │ │                                                  │
│ │ 🛡️ Super    │ │  ┌──────┬──────┬──────┬──────┐                 │
│ └─────────────┘ │  │Total │Sched │Compl │Cancel│                 │
│                 │  │ 156  │  42  │ 108  │  6   │                 │
│ 🏠 Dashboard    │  └──────┴──────┴──────┴──────┘                 │
│                 │                                                  │
│ 📅 Appointments │  🔍 Search patients/doctors... [Status▼][Sort▼] │
│    Manage       │                                                  │
│                 │  ┌────────────────────────────────────────────┐ │
│ 🩺 Doctors      │  │Patient│Doctor│Date Time│Status│Actions    │ │
│    Staff        │  ├────────────────────────────────────────────┤ │
│                 │  │J.Doe │Dr.S  │12/15 2pm│✓    │View Edit  │ │
│ 👥 Patients     │  │M.Smith│Dr.J  │12/15 3pm│⏰   │View Edit  │ │
│    Records      │  │S.Jones│Dr.S  │12/16 9am│✓    │View Edit  │ │
│                 │  └────────────────────────────────────────────┘ │
│ ⚙️  Settings    │                                                  │
│    Config       │  [← Previous] [1][2][3] [Next →]               │
│                 │                                                  │
├─────────────────┤                                                  │
│ [Online] [3]    │                                                  │
│ 🌙 Dark Mode    │                                                  │
│ 🚪 Logout       │                                                  │
└─────────────────┴──────────────────────────────────────────────────┘
```

## 🎯 Responsive Patterns

### Header Patterns

#### Mobile (< 640px)

- Icon + Title stacked or inline
- Buttons full width below
- Smaller text (text-xl)

#### Tablet (640px+)

- Icon + Title inline
- Buttons inline right
- Medium text (text-2xl)

#### Desktop (1024px+)

- Full layout with icon
- All features visible
- Large text (text-3xl)

### Stats Cards Pattern

```jsx
// Mobile: 2 columns
grid-cols-2

// Tablet: 2-3 columns
sm:grid-cols-2 lg:grid-cols-3

// Desktop: 4 columns
lg:grid-cols-4
```

### Table Patterns

```jsx
// Mobile: Essential columns only
<TableHead>Patient</TableHead>
<TableHead>Date</TableHead>
<TableHead>Actions</TableHead>

// Tablet: More columns
<TableHead className="hidden md:table-cell">Doctor</TableHead>

// Desktop: All columns
<TableHead className="hidden lg:table-cell">Status</TableHead>
<TableHead className="hidden xl:table-cell">Notes</TableHead>
```

### Button Patterns

```jsx
// Mobile: Icon only or full width
<Button className="w-full sm:w-auto">
  <Plus className="mr-2" />
  <span className="hidden sm:inline">Add New</span>
  <span className="sm:hidden">Add</span>
</Button>

// Desktop: Full text with icon
```

## 📊 Spacing Scale

### Mobile

```css
gap: 0.75rem (gap-3)
padding: 0.75rem - 1rem (p-3, p-4)
margin: 0.75rem - 1rem (m-3, m-4)
```

### Tablet

```css
gap: 1rem (gap-4)
padding: 1rem - 1.5rem (p-4, p-6)
margin: 1rem - 1.5rem (m-4, m-6)
```

### Desktop

```css
gap: 1.5rem (gap-6)
padding: 1.5rem - 2rem (p-6, p-8)
margin: 1.5rem - 2rem (m-6, m-8)
```

## 🎨 Typography Scale

```jsx
// Headings
text-xl sm:text-2xl lg:text-3xl        // H1
text-lg sm:text-xl lg:text-2xl         // H2
text-base sm:text-lg lg:text-xl        // H3

// Body
text-xs sm:text-sm lg:text-base        // Small text
text-sm sm:text-base                   // Body text
text-base sm:text-lg                   // Large text
```

## 🔧 Component Examples

### Responsive Card

```jsx
<Card className="p-4 sm:p-6 lg:p-8">
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
    <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
    </div>
    <div>
      <h3 className="text-base sm:text-lg lg:text-xl">Title</h3>
      <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
    </div>
  </div>
</Card>
```

### Responsive Grid

```jsx
<div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

### Responsive Navigation

```jsx
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 lg:gap-6">
  <div className="flex items-center gap-2 sm:gap-3">
    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    <h1 className="text-xl sm:text-2xl lg:text-3xl">Title</h1>
  </div>
  <div className="flex gap-2 w-full sm:w-auto">
    <Button size="sm" className="flex-1 sm:flex-initial">
      Action
    </Button>
  </div>
</div>
```

## 🎯 Best Practices

1. **Mobile First**: Start with mobile layout, then add larger breakpoints
2. **Touch Targets**: Minimum 44x44px for buttons on mobile
3. **Text Readability**: Minimum 16px for body text on mobile
4. **Spacing**: More compact on mobile, generous on desktop
5. **Hide Intelligently**: Hide non-essential info on mobile
6. **Stack Vertically**: On mobile, prefer vertical stacking
7. **Full Width**: Buttons and inputs full width on mobile
8. **Truncate Text**: Use truncate class for long text
9. **Conditional Display**: Show/hide based on screen size
10. **Test Real Devices**: Always test on actual mobile devices

## 🚀 Quick Tips

- Use `hidden sm:block` to hide on mobile
- Use `block sm:hidden` to show only on mobile
- Use `w-full sm:w-auto` for responsive widths
- Use `flex-col sm:flex-row` for responsive flex direction
- Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for grids
- Use `text-sm sm:text-base lg:text-lg` for text
- Use `p-3 sm:p-4 lg:p-6` for padding
- Use `gap-2 sm:gap-3 lg:gap-4` for spacing

## ✅ Checklist

Before deploying, verify:

- [ ] Works on iPhone SE (375px)
- [ ] Works on iPhone 12/13 (390px)
- [ ] Works on iPad (768px)
- [ ] Works on iPad Pro (1024px)
- [ ] Works on Desktop (1280px+)
- [ ] No horizontal scrolling
- [ ] All buttons clickable
- [ ] Text readable
- [ ] Images responsive
- [ ] Forms usable
- [ ] Navigation accessible

---

**Your admin dashboard is now fully responsive! 🎉**
