/**
 * Our Manufacturing Categories Component
 * 
 * Assets: Place category images in /public/media/categories/ as:
 * - trailers.png/jpg (transparent background preferred)
 * - tippers.png/jpg
 * - tankers-bulkers.png/jpg
 * - body-building.png/jpg
 * - container.png/jpg
 * - tip-trailers.png/jpg
 * 
 * CMS Integration: Pass custom categories array as prop to override defaults
 * Analytics: onClick sends event to window.dataLayer (configure GTM/analytics)
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Category {
  title: string;
  description: string;
  slug: string;
  link: string;
  image: string;
}

interface OurManufacturingCategoriesProps {
  categories?: Category[];
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    title: 'Trailers',
    description: 'Heavy-duty trailers for long-haul transport.',
    slug: 'trailers',
    link: '/category/trailers',
    image: '/media/categories/trailers.jpg',
  },
  {
    title: 'Tippers',
    description: 'Durable tippers for mining & construction.',
    slug: 'tippers',
    link: '/category/tippers',
    image: '/media/categories/tippers.jpg',
  },
  {
    title: 'Tankers & Bulkers',
    description: 'Safe transport for liquids & bulk materials.',
    slug: 'tankers-bulkers',
    link: '/category/tankers-bulkers',
    image: '/media/categories/tankers.jpg',
  },
  {
    title: 'Body Building',
    description: 'Custom body solutions for diverse payloads.',
    slug: 'body-building',
    link: '/category/body-building',
    image: '/media/categories/bodybuilding.jpg',
  },
  {
    title: 'Container',
    description: 'Standard & specialized containers for logistics.',
    slug: 'container',
    link: '/category/container',
    image: '/media/categories/container.jpg',
  },
  {
    title: 'Tip Trailers',
    description: 'High-strength tip trailers for heavy loads.',
    slug: 'tip-trailers',
    link: '/category/tip-trailers',
    image: '/media/categories/tiptrailers.jpg',
  },
];

export default function OurManufacturingCategories({ 
  categories = DEFAULT_CATEGORIES 
}: OurManufacturingCategoriesProps) {
  
  const handleCategoryClick = (slug: string, title: string) => {
    // Analytics event - integrate with your tracking solution
    if (typeof window !== 'undefined') {
      // GTM dataLayer push
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'category_click',
        category_slug: slug,
        category_name: title,
      });
      
      // Development logging
      console.log(`Analytics: category_click_${slug}`, { title, slug });
    }
  };

  return (
    <section 
      id="our-manufacturing-category" 
      className="bg-[#F9FAFB] py-20 lg:py-[80px] pb-[100px]"
    >
      <div className="container mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 
            className="font-bold text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] leading-tight mb-3"
            style={{ fontFamily: 'Poppins, Inter, system-ui, sans-serif' }}
            data-cms-key="section-title"
          >
            Our Manufacturing Categories
          </h2>
          <p 
            className="text-[#6B6B6B] text-base md:text-lg"
            data-cms-key="section-subtitle"
          >
            Explore our expertise across industry-leading vehicle builds.
          </p>
        </div>

        {/* Categories Grid */}
        <ul 
          role="list" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category, index) => (
            <li key={category.slug} role="listitem">
              <Link
                href={category.link}
                onClick={() => handleCategoryClick(category.slug, category.title)}
                aria-label={`View ${category.title} category`}
                data-event={`category_click_${category.slug}`}
                data-test-id={`cat_${category.slug}`}
                data-cms-key={`category-${index + 1}-link`}
                className="group block bg-white rounded-2xl border border-[#EAEAF0] p-6 lg:p-6 min-h-[280px] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus:outline-none focus:ring-[3px] focus:ring-[#FFB629]"
              >
                {/* Image Area */}
                <div className="relative w-full h-40 mb-6 overflow-hidden rounded-lg flex items-center justify-center">
                  <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={category.image}
                      alt={`${category.title} - ${category.description.toLowerCase()}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      data-cms-key={`category-${index + 1}-image`}
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div className="text-center md:text-left">
                  <h3 
                    className="font-semibold text-[1.2rem] text-[#1A1A1A] mb-2"
                    style={{ fontFamily: 'Poppins, Inter, system-ui, sans-serif' }}
                    data-cms-key={`category-${index + 1}-title`}
                  >
                    {category.title}
                  </h3>
                  <p 
                    className="text-[#6B6B6B] text-[0.95rem] mb-3"
                    data-cms-key={`category-${index + 1}-desc`}
                  >
                    {category.description}
                  </p>
                  
                  {/* CTA Text - Shows on Hover */}
                  <div className="text-[#DA251C] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore Now →
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
