# T9 Digital - Creative Digital Marketing Agency Website

A modern, responsive one-page website for a creative digital marketing agency built with vanilla HTML5, CSS3, and JavaScript.

## 🚀 Features

### Design System
- **Dark Theme**: Professional dark background with electric blue (#00d4ff) and neon green (#39ff14) accents
- **Typography**: Google Fonts integration with Inter and Space Grotesk
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Modern CSS**: Custom properties, clamp(), min(), max() for responsive scaling

### User Experience
- **Smooth Scrolling**: Enhanced navigation between sections
- **Mobile Navigation**: Hamburger menu with smooth animations
- **Loading Animation**: Professional loading screen with progress bar
- **Scroll Effects**: Header hide/show, parallax, and intersection observer animations
- **Form Validation**: Client-side validation with user feedback
- **Cursor Trail**: Interactive cursor effect on desktop

### Performance
- **Optimized Assets**: Efficient CSS with custom properties
- **Debounced Events**: Optimized scroll and resize handlers
- **Modern JavaScript**: ES6+ features with performance monitoring
- **Semantic HTML5**: Proper structure for SEO and accessibility

## 📁 Project Structure

```
T9 website/
├── index.html          # Main HTML file with semantic structure
├── styles.css          # Complete CSS with design system
├── script.js           # JavaScript for interactions and animations
└── README.md           # Project documentation
```

## 🎨 Enhanced Design System

### Advanced Color System
The design system features a comprehensive color palette with semantic variations:

**Primary Colors (Electric Blue)**
```css
--primary-50: #e6f9ff    /* Lightest */
--primary-500: #00d4ff   /* Main Primary */
--primary-900: #002a35   /* Darkest */
```

**Secondary Colors (Neon Green)**
```css
--secondary-50: #f0ffe6  /* Lightest */
--secondary-500: #39ff14 /* Main Secondary */
--secondary-900: #0a3504 /* Darkest */
```

**Neutral Colors**
```css
--neutral-50: #f8f8f8    /* Near White */
--neutral-500: #666666   /* Mid Gray */
--neutral-900: #0a0a0a   /* Near Black */
```

**Surface Colors**
```css
--surface-elevated: #2a2a2a  /* Raised surfaces */
--surface-base: #1a1a1a      /* Base surface */
--surface-sunken: #141414    /* Recessed surfaces */
```

**Gradient System**
```css
--gradient-primary: linear-gradient(135deg, var(--primary-500), var(--secondary-500))
--gradient-primary-vertical: linear-gradient(180deg, var(--primary-500), var(--secondary-500))
--gradient-primary-radial: radial-gradient(circle, var(--primary-500), var(--secondary-500))
```

### Typography System
**Font Families**
- **Primary**: Inter (with system font fallbacks)
- **Display**: Space Grotesk (with system font fallbacks)
- **Mono**: SF Mono, Monaco, Roboto Mono

**Fluid Typography Scale**
```css
--fs-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
--fs-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem)
--fs-6xl: clamp(3.5rem, 3rem + 4vw, 6.5rem)
```

**Typography Classes**
- `.h1`, `.h2`, `.h3`, `.h4`, `.h5`, `.h6` - Heading styles
- `.display-1`, `.display-2` - Large display text
- `.body`, `.body-lg`, `.body-sm` - Body text variants
- `.caption` - Small caption text

**Font Utilities**
- `.font-light`, `.font-medium`, `.font-bold`, `.font-extrabold`
- `.tracking-tight`, `.tracking-wide`, `.tracking-widest`
- `.uppercase`, `.lowercase`, `.capitalize`

### 8px Grid Spacing System
Built on an 8px base unit for perfect visual rhythm:

**Fixed Spacing**
```css
--space-1: 0.125rem  /* 2px */
--space-4: 0.5rem    /* 8px - Base unit */
--space-8: 1rem      /* 16px */
--space-16: 2rem     /* 32px */
--space-64: 8rem     /* 128px */
```

**Fluid Spacing** (for responsive layouts)
```css
--space-xs: clamp(var(--space-4), 0.4rem + 0.5vw, var(--space-6))
--space-3xl: clamp(var(--space-32), 3.2rem + 4vw, var(--space-48))
```

**Spacing Utilities**
- Margin: `.m-4`, `.mx-8`, `.my-12`, `.mt-16`, `.mb-20`
- Padding: `.p-4`, `.px-8`, `.py-12`
- Gap: `.gap-4`, `.gap-8`, `.gap-16`

### Layout System
**Container Classes**
- `.container` - Max-width 1280px with responsive padding
- `.container-sm` - Max-width 640px
- `.container-lg` - Max-width 1024px
- `.container-fluid` - Full width with padding

**Flexbox Utilities**
- `.flex`, `.flex-col`, `.flex-wrap`
- `.items-center`, `.items-start`, `.items-end`
- `.justify-center`, `.justify-between`, `.justify-around`

**Grid Utilities**
- `.grid`, `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4`
- `.col-span-2`, `.col-span-3`, `.col-span-full`

### Color Utilities
**Text Colors**
- `.text-primary-500`, `.text-secondary-400`, `.text-neutral-300`
- `.text-white`, `.text-success`, `.text-error`
- `.text-gradient` - Applies primary gradient to text

**Background Colors**
- `.bg-primary-500`, `.bg-surface-elevated`, `.bg-neutral-900`
- `.bg-gradient-primary`, `.bg-gradient-dark`

**Border Colors**
- `.border-primary-500`, `.border-neutral-700`

### Interactive States
**Hover Effects**
- `.hover:bg-primary-500:hover`
- `.hover:text-primary-400:hover`
- `.hover:shadow-glow:hover`
- `.hover:scale-105:hover`
- `.hover:-translate-y-2:hover`

**Focus States**
- `.focus:outline-none:focus`
- `.focus:ring-primary:focus`

### Responsive Design
**Mobile-First Breakpoints**
- `xs:` 480px and up
- `sm:` 640px and up
- `md:` 768px and up
- `lg:` 1024px and up
- `xl:` 1280px and up

**Responsive Utilities**
- `.md:grid-cols-3`, `.lg:text-left`, `.xl:px-16`

### Enhanced Components
**Button Variants**
- `.btn-sm`, `.btn-md`, `.btn-lg`, `.btn-xl`
- `.btn--primary`, `.btn--secondary`

**Card System**
- `.card` - Base card with hover effects
- `.card-header`, `.card-body`, `.card-footer`

### Shadow System
```css
--shadow-sm: Subtle shadow for cards
--shadow-lg: Prominent shadow for modals
--shadow-glow: Electric blue glow effect
--shadow-glow-strong: Intense glow for focus states
```

### Border Radius
```css
--radius-sm: 4px    /* Buttons */
--radius-lg: 8px    /* Cards */
--radius-xl: 12px   /* Containers */
--radius-full: 9999px /* Circular elements */
```

## 🌟 Sections

### 1. Header
- Fixed navigation with scroll effects
- Mobile-responsive hamburger menu
- Active section highlighting

### 2. Hero Section
- Animated typography with typing effect
- Gradient call-to-action buttons
- Floating animation graphics

### 3. Services Section
- Three-column grid layout
- Hover effects and animations
- Service feature lists with checkmarks

### 4. Portfolio Section
- Case study cards with metrics
- Hover animations and transformations
- Grid layout with alternating designs

### 5. About Section
- Company statistics with animated counters
- Morphing shape animations
- Two-column responsive layout

### 6. Contact Section
- Contact form with validation
- Contact information display
- Success/error notification system

### 7. Footer
- Company links and information
- Social media links
- Copyright information

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern features including:
  - CSS Grid & Flexbox
  - Custom Properties (CSS Variables)
  - Advanced selectors and pseudo-elements
  - Responsive functions (clamp, min, max)
  - CSS animations and transforms
- **JavaScript ES6+**:
  - Intersection Observer API
  - Modern DOM manipulation
  - Event delegation
  - Performance optimization
  - Modular code structure

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Customize** content, colors, and branding as needed

### Local Development
For local development with live reload, you can use:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have live-server installed)
npx live-server

# Using PHP
php -S localhost:8000
```

## ✨ Customization

### Colors
Update the CSS custom properties in `styles.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... other variables */
}
```

### Content
1. Replace placeholder text in `index.html`
2. Update company information and contact details
3. Add real project images and case studies

### Fonts
Change Google Fonts in the HTML `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📈 Performance

- **Optimized CSS**: Efficient selectors and minimal redundancy
- **Debounced Events**: Scroll and resize handlers optimized
- **Modern JavaScript**: ES6+ features for better performance
- **Semantic HTML**: Proper structure for SEO

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or support regarding this template:
- Email: hello@t9digital.com
- Website: [T9 Digital](#)

---

**Built with ❤️ by T9 Digital Team**