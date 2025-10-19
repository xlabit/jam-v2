/**
 * Our Manufacturing Categories Component - Premium Design
 * 
 * Assets: Place category images in /public/media/categories/ as:
 * - trailers.jpg (16:9 aspect ratio, optimized WebP <120KB)
 * - tippers.jpg
 * - tankers.jpg
 * - bodybuilding.jpg
 * - container.jpg
 * - tiptrailers.jpg
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
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'category_click',
        category_slug: slug,
        category_name: title,
      });
      
      console.log(`Analytics: category_click_${slug}`, { title, slug });
    }
  };

  return (
    <section 
      id="our-manufacturing-category" 
      className="w-full bg-[#f9fafb] pt-[100px] pb-[120px]"
    >
      <div className="container mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 
            className="font-bold text-[28px] lg:text-[40px] leading-[1.2] text-[#002b4f] mb-2"
            style={{ fontFamily: 'Poppins, Inter, system-ui, sans-serif' }}
            data-cms-key="section-title"
          >
            Our Manufacturing Categories
          </h2>
          
          {/* Accent Bar */}
          <div className="w-[60px] h-[4px] bg-[#ffb629] mx-auto mt-4 mb-3"></div>
          
          <p 
            className="text-[#6b6b6b] text-[16px] leading-relaxed"
            data-cms-key="section-subtitle"
          >
            Explore our expertise across industry-leading vehicle builds.
          </p>
        </div>

        {/* Categories Grid */}
        <ul 
          role="list" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
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
                className="group relative block bg-white rounded-[20px] border border-[rgba(0,0,0,0.04)] p-7 lg:p-8 min-h-[300px] lg:min-h-[340px] transition-all duration-300 ease-out hover:-translate-y-2 shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-[3px] focus:ring-[#ffb629] overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(180deg, rgba(255,182,41,0) 0%, #ffffff 100%)',
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,182,41,0.05)] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[20px]"></div>
                
                {/* Content wrapper with relative positioning */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Image Area - 16:9 aspect ratio */}
                  <div className="relative w-full mb-6 overflow-hidden rounded-lg" style={{ aspectRatio: '16/9' }}>
                    <div className="absolute inset-0 bg-[#f5f6fa] rounded-lg"></div>
                    <div className="relative w-full h-full transition-transform duration-[250ms] ease-out group-hover:scale-105">
                      <Image
                        src={category.image}
                        alt={`${category.title} - ${category.description.toLowerCase()}`}
                        fill
                        className="object-contain drop-shadow-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        data-cms-key={`category-${index + 1}-image`}
                      />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="text-center md:text-left flex-1 flex flex-col">
                    <h3 
                      className="font-bold text-[18px] text-[#002b4f] mb-1.5"
                      style={{ fontFamily: 'Poppins, Inter, system-ui, sans-serif' }}
                      data-cms-key={`category-${index + 1}-title`}
                    >
                      {category.title}
                    </h3>
                    <p 
                      className="text-[#6b6b6b] text-[15px] leading-[1.6] mb-4"
                      data-cms-key={`category-${index + 1}-desc`}
                    >
                      {category.description}
                    </p>
                    
                    {/* CTA Text - Fades in on hover */}
                    <div className="mt-auto text-[#ffb629] font-semibold text-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore Now →
                    </div>
                  </div>
                </div>

                {/* Bottom accent bar - slides in on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#ffb629] to-[#da251c] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-b-[20px]"></div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
