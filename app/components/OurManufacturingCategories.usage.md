# Our Manufacturing Categories - Usage Guide

## Basic Usage

```tsx
import OurManufacturingCategories from '@/app/components/OurManufacturingCategories';

// In your page component
export default function HomePage() {
  return (
    <main>
      {/* Other sections */}
      <OurManufacturingCategories />
      {/* Other sections */}
    </main>
  );
}
```

## With Custom Data (CMS Integration)

```tsx
import OurManufacturingCategories from '@/app/components/OurManufacturingCategories';

// Fetch from CMS or API
const customCategories = [
  {
    title: 'Custom Category',
    description: 'Custom description text.',
    slug: 'custom-category',
    link: '/category/custom-category',
    image: '/path/to/image.jpg',
  },
  // ... 5 more categories
];

export default function HomePage() {
  return (
    <main>
      <OurManufacturingCategories categories={customCategories} />
    </main>
  );
}
```

## Data Attributes Reference

Each card includes:
- `data-cms-key="category-{1-6}-title"` - For CMS title editing
- `data-cms-key="category-{1-6}-image"` - For CMS image editing
- `data-cms-key="category-{1-6}-desc"` - For CMS description editing
- `data-cms-key="category-{1-6}-link"` - For CMS link editing
- `data-event="category_click_{slug}"` - Analytics event tracking
- `data-test-id="cat_{slug}"` - QA/testing identifier

## Analytics Integration

The component pushes events to `window.dataLayer` on click:
```js
{
  event: 'category_click',
  category_slug: 'trailers',
  category_name: 'Trailers'
}
```

Configure Google Tag Manager or your analytics platform to listen for these events.
