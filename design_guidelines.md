# Restaurant Management System Design Guidelines

## Design Approach

**Dual-Interface Strategy:**
- **Admin Dashboard**: Material Design principles for efficient data management
- **Digital Menu**: Inspired by Toast POS, Uber Eats, and modern restaurant apps with emphasis on visual appetite appeal

**Key Design Principle**: Performance-first with visual richness - optimize images aggressively while maintaining food photography impact.

## Typography

**Admin Dashboard:**
- Primary: Inter (400, 500, 600)
- Headings: 24px/600, Body: 16px/400, Labels: 14px/500

**Digital Menu:**
- Primary: Poppins (400, 500, 600) for modern, friendly feel
- Restaurant name: 32px/600
- Category headers: 20px/600
- Menu item names: 18px/500
- Descriptions: 14px/400
- Prices: 18px/600

## Layout System

**Spacing Units**: Tailwind 2, 4, 6, 8, 12, 16 units
- Component padding: p-4, p-6
- Section spacing: py-8, py-12
- Card gaps: gap-4, gap-6

## Admin Dashboard Components

**Sidebar Navigation** (240px fixed width):
- Dashboard, Restaurant Info, Categories, Menu Items, Settings
- Active state with left border accent
- Icons from Heroicons

**Data Tables**:
- Striped rows for readability
- Action buttons (Edit/Delete) right-aligned
- Search and filter bar above table
- Pagination at bottom

**Forms**:
- Two-column layout on desktop, stacked on mobile
- Clear labels above inputs
- Image upload with preview thumbnails
- Primary CTA buttons right-aligned

## Digital Menu (QR Code Interface)

**Header Section**:
- Restaurant logo centered (100px height)
- Restaurant name and tagline
- Language selector (flag icons + dropdown) top-right
- Sticky on scroll

**Restaurant Info Section**:
- Full-width card with restaurant description
- Hours, address, phone in icon-row format
- Collapsible for space efficiency

**Category Navigation**:
- Horizontal scrollable tabs below header
- Sticky positioning
- Active category highlighted with underline indicator
- Smooth scroll to category sections

**Menu Items Layout** (Row Style):
- Each item: horizontal card with left-aligned image (120px square, rounded corners)
- Content area: name (top), description (middle, 2-line truncate), price (bottom right, bold)
- 16px spacing between items
- Subtle dividers between items
- Tap anywhere on card for potential item detail modal

**Performance Optimizations**:
- Lazy load images below fold
- Use next-gen formats (WebP with JPG fallback)
- Compress images to <50KB each
- Implement skeleton loading states

## Images

**Admin Dashboard**:
- No hero image needed
- Upload placeholder icons for menu item images (camera icon)
- Small thumbnail previews in tables (60px square)

**Digital Menu**:
- No hero image - immediate menu focus
- **Menu Item Images**: Professional food photography, well-lit, appetizing close-ups (square format, min 400px). Show finished dish plating. Each item MUST have an image.
- **Restaurant Logo**: Simple, recognizable mark suitable for small sizes
- **Placeholder**: Use elegant utensil/plate icon for items without photos

## Component Specifications

**Language Selector**:
- Dropdown with flag icons + language names
- Smooth transition when switching languages
- Persists selection in localStorage

**Category Filter**:
- All, Appetizers, Mains, Desserts, Beverages (standard set)
- Smooth fade transitions when filtering
- Active filter visually distinct

**Modal (Item Details - if tapped)**:
- Larger image at top
- Full description
- Allergen information
- Close button top-right

**Loading States**:
- Skeleton screens for initial load
- Shimmer effect on image placeholders
- Spinner for data updates in admin

## Responsive Behavior

**Desktop (1024px+)**:
- Admin: Sidebar + content area
- Menu: Two-column item layout possible for tablets

**Mobile (<768px)**:
- Admin: Hamburger menu, single column forms
- Menu: Single column mandatory, optimized for one-hand use
- Larger tap targets (minimum 44px)
- Category tabs scroll horizontally

## Accessibility

- Clear focus states on all interactive elements
- Proper heading hierarchy (h1 > h2 > h3)
- Alt text for all food images
- Minimum contrast ratio 4.5:1 for text
- Skip-to-content link for screen readers