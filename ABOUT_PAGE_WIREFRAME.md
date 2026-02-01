# About Page - Bento Grid Wireframe Structure
## High-Conversion Layout for FranchisePlus Coffee

---

## Overview
This wireframe follows the **Bento Box Grid** style (#39, #53 from UI/UX Pro Max) - an Apple-inspired modular card layout optimized for high information density, visual hierarchy, and conversion optimization.

### Design Principles
- **Asymmetric Grid**: Varied card sizes create visual interest
- **Modular Cards**: Each card tells a focused story
- **Clean Hierarchy**: Clear visual flow guides user attention
- **Conversion-Focused**: Strategic CTA placement and social proof
- **Coffee Theme**: Maintains brand colors (#6D4C41, #5D4037, #3E2723, #FAF8F5)

---

## Layout Structure

### Section 1: Hero Mission Statement
**Layout**: Full-width, centered content
**Height**: ~60vh (viewport height)
**Background**: Gradient from `#FAF8F5` to `#F5F1EB`

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              [Coffee Bean Icon/Logo]                   │
│                                                         │
│              "Our Story Begins with                    │
│               a Simple Passion"                         │
│                                                         │
│    [Subheading: 2-3 sentence mission statement]        │
│                                                         │
│    [Primary CTA Button: "Explore Our Journey"]         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Content**:
- Large headline (text-5xl to text-7xl)
- Mission statement (2-3 sentences)
- Primary CTA button
- Subtle background pattern or coffee bean illustration

---

### Section 2: Bento Grid - Our Story
**Layout**: CSS Grid with asymmetric spans
**Container**: max-w-7xl, centered
**Padding**: py-20 px-4
**Grid Template**: 
```css
grid-template-columns: repeat(12, 1fr);
gap: 1.5rem;
```

#### Grid Layout (Desktop - 12 columns):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐ │
│  │                      │  │                      │  │                 │ │
│  │   Card 1: Origin     │  │   Card 2: Values     │  │  Card 3:        │ │
│  │   (span 5)           │  │   (span 4)           │  │  Impact         │ │
│  │                      │  │                      │  │  (span 3)       │ │
│  │   [Image/Icon]       │  │   [Icon Grid]        │  │  [Stats]        │ │
│  │   Heading            │  │   Heading            │  │  Heading        │ │
│  │   Description        │  │   Value List         │  │  Numbers        │ │
│  │                      │  │                      │  │                 │ │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘ │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │   Card 4: Journey Timeline                                          │ │
│  │   (span 12 - full width)                                           │ │
│  │                                                                      │ │
│  │   [Timeline with milestones: 2010, 2015, 2020, 2024]               │ │
│  │   Horizontal or vertical timeline with icons                        │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────────────────────┐   │
│  │                      │  │                                          │   │
│  │   Card 5: Quality    │  │   Card 6: Sustainability                │   │
│  │   (span 4)           │  │   (span 8)                              │   │
│  │                      │  │                                          │   │
│  │   [Icon]             │  │   [Large Image/Video]                   │   │
│  │   Heading            │  │   Heading                                │   │
│  │   Description        │  │   Description + Stats                    │   │
│  │                      │  │   [CTA: Learn More]                     │   │
│  └──────────────────────┘  └──────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Card Specifications:

**Card 1: Our Origin** (span 5 columns)
- **Content**: Founding story, year established, founder quote
- **Visual**: Coffee bean illustration or founder photo
- **Style**: `bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300`
- **Padding**: `p-8`
- **Hover**: `scale-[1.02]` transform

**Card 2: Core Values** (span 4 columns)
- **Content**: 3-4 core values with icons (Quality, Sustainability, Community, Innovation)
- **Visual**: Icon grid layout
- **Style**: `bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-xl border border-[#E8DFD6]`
- **Padding**: `p-8`

**Card 3: Impact Stats** (span 3 columns)
- **Content**: Key metrics (e.g., "50+ Locations", "1M+ Cups Served", "100+ Awards")
- **Visual**: Large numbers with icons
- **Style**: `bg-[#6D4C41] text-white rounded-xl`
- **Padding**: `p-8`
- **Typography**: Large numbers (text-4xl), labels (text-sm)

**Card 4: Journey Timeline** (span 12 columns - full width)
- **Content**: Company milestones in horizontal timeline
- **Visual**: Horizontal line with milestone markers
- **Style**: `bg-white rounded-xl shadow-md p-8`
- **Layout**: Flex or Grid for timeline items

**Card 5: Quality Promise** (span 4 columns)
- **Content**: Quality assurance process
- **Visual**: Icon + short description
- **Style**: `bg-white rounded-xl shadow-md hover:shadow-xl`

**Card 6: Sustainability** (span 8 columns)
- **Content**: Environmental commitment, certifications
- **Visual**: Large background image with overlay text
- **Style**: `bg-gradient-to-r from-[#8D6E63] to-[#6D4C41] text-white rounded-xl relative overflow-hidden`
- **Image**: Background image with `opacity-30` overlay
- **CTA**: "Learn More" button

---

### Section 3: Team & Leadership
**Layout**: Grid of team member cards
**Container**: max-w-7xl, centered
**Padding**: py-20 px-4
**Background**: `bg-[#FAF8F5]`

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         "Meet the People Behind the Passion"            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │          │  │          │  │          │  │        ││
│  │  Founder │  │   CEO    │  │ Head of  │  │  Head  ││
│  │          │  │          │  │ Quality  │  │  of    ││
│  │ [Avatar] │  │ [Avatar] │  │ [Avatar] │  │Sustainability│
│  │  Name    │  │  Name    │  │  Name    │  │ [Avatar]│
│  │  Title   │  │  Title   │  │  Title   │  │  Name  ││
│  │  Bio     │  │  Bio     │  │  Bio     │  │  Title ││
│  │          │  │          │  │          │  │  Bio   ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Card Style**:
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`
- `bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all`
- Avatar: `w-24 h-24 rounded-full mx-auto mb-4`
- Hover: `scale-[1.02]`

---

### Section 4: Social Proof - Testimonials & Awards
**Layout**: Bento Grid with testimonials and awards
**Container**: max-w-7xl, centered
**Padding**: py-20 px-4
**Background**: `bg-white`

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         "Trusted by Coffee Lovers Worldwide"            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │   Testimonial Carousel (span 8)                  │  │
│  │                                                  │  │
│  │   [Large testimonial card with quote,            │  │
│  │    customer photo, name, location]              │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │          │  │          │  │          │  │        ││
│  │  Award   │  │  Award   │  │  Award   │  │  Award ││
│  │  Badge   │  │  Badge   │  │  Badge   │  │  Badge  ││
│  │  2024    │  │  2023    │  │  2022    │  │  2021  ││
│  │          │  │          │  │          │  │        ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │   Partner Logos / Certifications (span 12)       │  │
│  │   [Logo grid: Fair Trade, Organic, etc.]        │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Testimonial Card**:
- Large quote text (text-2xl)
- Customer photo (rounded-full)
- Name, location, rating stars
- Background: `bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB]`

**Award Cards**:
- Icon/image of award
- Year and award name
- `bg-white rounded-xl shadow-md p-6`

---

### Section 5: Call-to-Action
**Layout**: Full-width CTA section
**Background**: Gradient `from-[#6D4C41] to-[#5D4037]`
**Text**: White
**Padding**: py-20 px-4

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         "Join Our Coffee Community"                     │
│                                                         │
│    [Subheading: Invitation to visit, order, or          │
│     become a franchise partner]                         │
│                                                         │
│    [Primary CTA: "Visit a Location"]                    │
│    [Secondary CTA: "Become a Partner"]                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

### Mobile (< 768px)
- **Grid**: Single column, all cards stack vertically
- **Cards**: Full width, `span 12`
- **Padding**: Reduced to `p-6`
- **Typography**: Smaller sizes (text-3xl for headings)

### Tablet (768px - 1024px)
- **Grid**: 2-column layout for smaller cards
- **Large cards**: Still full width
- **Timeline**: Horizontal scroll or stacked

### Desktop (> 1024px)
- **Grid**: Full 12-column asymmetric layout
- **Max width**: `max-w-7xl`
- **Spacing**: Full padding and gaps

---

## Card Styling Details

### Base Card Styles
```css
/* Standard Card */
.bento-card {
  background: white;
  border-radius: 1rem; /* rounded-xl */
  padding: 2rem; /* p-8 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 300ms ease;
}

.bento-card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Accent Card */
.bento-card-accent {
  background: linear-gradient(to bottom right, #FAF8F5, #F5F1EB);
  border: 1px solid #E8DFD6;
}

/* Dark Card */
.bento-card-dark {
  background: #6D4C41;
  color: white;
}
```

### Grid Spans (Tailwind)
- `col-span-3` = 3 columns (25%)
- `col-span-4` = 4 columns (33%)
- `col-span-5` = 5 columns (~42%)
- `col-span-8` = 8 columns (~67%)
- `col-span-12` = 12 columns (100%)

---

## Conversion Optimization Elements

### 1. **Above-the-Fold Hero**
- Clear value proposition
- Primary CTA visible without scrolling
- Emotional connection through mission statement

### 2. **Visual Storytelling**
- Bento Grid creates scannable content
- Images/icons break up text
- Varied card sizes guide eye movement

### 3. **Social Proof Placement**
- Testimonials after story (trust building)
- Awards showcase credibility
- Partner logos reinforce quality

### 4. **Multiple CTAs**
- Hero: "Explore Our Journey" (engagement)
- Sustainability card: "Learn More" (education)
- Final CTA: "Visit Location" / "Become Partner" (conversion)

### 5. **Trust Signals**
- Timeline shows longevity
- Stats demonstrate scale
- Team photos add humanity
- Certifications prove quality

---

## Content Recommendations

### Hero Section
- **Headline**: "Our Story Begins with a Simple Passion"
- **Subheading**: "From a small coffee shop to a beloved franchise, we've stayed true to our mission: bringing exceptional coffee to every cup."

### Origin Card
- **Heading**: "Where It All Started"
- **Content**: Founding year, founder's vision, first location story
- **CTA**: None (informational)

### Values Card
- **Heading**: "What We Stand For"
- **Values**: 
  - Quality (icon: Award)
  - Sustainability (icon: Leaf)
  - Community (icon: Users)
  - Innovation (icon: Lightbulb)

### Impact Stats Card
- **Metrics**:
  - "50+ Locations"
  - "1M+ Cups Served"
  - "100+ Awards Won"
  - "25+ Years"

### Timeline Card
- **Milestones**:
  - 1999: First location opened
  - 2010: First franchise partner
  - 2015: 25 locations milestone
  - 2020: Sustainability certification
  - 2024: 50+ locations nationwide

### Team Section
- **Headline**: "Meet the People Behind the Passion"
- **Members**: Founder, CEO, Head of Quality, Head of Sustainability
- **Format**: Photo, name, title, 1-2 sentence bio

### Testimonials
- **Format**: Large quote, customer photo, name, location, 5-star rating
- **Quantity**: 3-5 testimonials in carousel
- **Topics**: Quality, experience, community feel

### Final CTA
- **Headline**: "Join Our Coffee Community"
- **Subheading**: "Visit us in person, order online, or explore franchise opportunities"
- **Buttons**: 
  - Primary: "Find a Location"
  - Secondary: "Become a Partner"

---

## Animation & Interactions

### Hover Effects
- **Cards**: `scale-[1.02]` with shadow increase
- **Buttons**: Color shift + slight scale
- **Icons**: Rotate or pulse on hover

### Scroll Animations
- **Cards**: Fade in on scroll (Intersection Observer)
- **Timeline**: Animate progress bar
- **Stats**: Count-up animation

### Performance
- **Images**: Lazy loading with `loading="lazy"`
- **Animations**: Respect `prefers-reduced-motion`
- **Transitions**: 200-300ms for smooth feel

---

## Accessibility Considerations

1. **Color Contrast**: All text meets WCAG AA (4.5:1 minimum)
2. **Focus States**: Visible focus rings on all interactive elements
3. **Alt Text**: All images have descriptive alt text
4. **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
5. **ARIA Labels**: Icon-only buttons have labels
6. **Keyboard Navigation**: All interactive elements accessible via keyboard

---

## Implementation Notes

### CSS Grid Setup
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}
```

### Tailwind Classes
- Container: `container mx-auto px-4 max-w-7xl`
- Grid: `grid grid-cols-12 gap-6`
- Cards: `bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300`
- Responsive: `col-span-12 md:col-span-6 lg:col-span-4`

---

## Success Metrics

This layout is optimized for:
- **Time on Page**: Varied content keeps users engaged
- **Scroll Depth**: Progressive disclosure encourages scrolling
- **CTA Clicks**: Multiple strategic CTA placements
- **Trust Building**: Social proof and credentials visible
- **Mobile Engagement**: Responsive design maintains experience

---

## Next Steps

1. **Content Creation**: Gather founder story, team bios, testimonials
2. **Asset Collection**: High-quality images, award badges, partner logos
3. **Implementation**: Build components following this wireframe
4. **Testing**: A/B test CTA placements and card arrangements
5. **Optimization**: Monitor analytics and iterate based on user behavior

---

*This wireframe follows UI/UX Pro Max Bento Grid principles (#39, #53) and landing page pattern #28 for optimal conversion rates.*
