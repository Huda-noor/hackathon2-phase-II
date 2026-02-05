---
name: frontend-skill
description: Build responsive pages, reusable components, and flexible layouts with modern styling. Use for web apps and landing pages.
---

# Frontend Layout & Components

## Instructions

1. **Page Structure**
   - Use semantic HTML elements (`header`, `main`, `footer`, `section`, `article`)
   - Responsive grid or flex layouts
   - Mobile-first approach

2. **Components**
   - Create reusable components (buttons, cards, forms, modals)
   - Isolate styles using CSS Modules, Tailwind, or styled-components
   - Props-driven design for dynamic content

3. **Styling**
   - Use modern CSS (Flexbox, Grid, transitions)
   - Maintain consistent spacing, colors, and typography
   - Apply hover, focus, and active states

4. **Layout Patterns**
   - Hero section
   - Feature section (cards or grids)
   - Form section
   - Footer with links and social icons

## Best Practices
- Keep components small and focused
- Avoid inline styles; use classes or styled-components
- Use semantic and accessible HTML
- Ensure responsiveness and accessibility
- Use animations sparingly to enhance UX, not distract

## Example Component Structure
```html
<section class="feature-section">
  <div class="container grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="card animate-fade-in">
      <h2>Feature 1</h2>
      <p>Short description of the feature.</p>
      <button class="cta-button">Learn More</button>
    </div>
    <div class="card animate-fade-in-delay">
      <h2>Feature 2</h2>
      <p>Short description of the feature.</p>
      <button class="cta-button">Learn More</button>
    </div>
    <div class="card animate-fade-in-delay-2">
      <h2>Feature 3</h2>
      <p>Short description of the feature.</p>
      <button class="cta-button">Learn More</button>
    </div>
  </div>
</section>
