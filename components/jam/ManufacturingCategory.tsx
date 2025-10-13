'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const categories = [
  {
    id: 'trailers',
    title: 'Trailers',
    description: 'Heavy-duty trailers for long-haul transport.',
    image: '/media/categories/trailers.jpg',
    href: '/vehicles?category=trailers',
    dataEvent: 'category_click_trailers',
    testId: 'cat-trailers',
  },
  {
    id: 'tippers',
    title: 'Tippers',
    description: 'Durable tippers for mining & construction.',
    image: '/media/categories/tippers.jpg',
    href: '/vehicles?category=tippers',
    dataEvent: 'category_click_tippers',
    testId: 'cat-tippers',
  },
  {
    id: 'tankers',
    title: 'Tankers & Bulkers',
    description: 'Safe transport for liquids & bulk materials.',
    image: '/media/categories/tankers.jpg',
    href: '/vehicles?category=tankers',
    dataEvent: 'category_click_tankers',
    testId: 'cat-tankers',
  },
  {
    id: 'bodybuilding',
    title: 'Body Building',
    description: 'Custom body solutions for diverse payloads.',
    image: '/media/categories/bodybuilding.jpg',
    href: '/vehicles?category=bodybuilding',
    dataEvent: 'category_click_bodybuilding',
    testId: 'cat-bodybuilding',
  },
  {
    id: 'container',
    title: 'Container',
    description: 'Standard & specialized containers for logistics.',
    image: '/media/categories/container.jpg',
    href: '/vehicles?category=container',
    dataEvent: 'category_click_container',
    testId: 'cat-container',
  },
  {
    id: 'tiptrailers',
    title: 'Tip Trailers',
    description: 'High-strength tip trailers for heavy loads.',
    image: '/media/categories/tiptrailers.jpg',
    href: '/vehicles?category=tiptrailers',
    dataEvent: 'category_click_tiptrailers',
    testId: 'cat-tiptrailers',
  },
];

export function ManufacturingCategory() {
  return (
    <section 
      id="our-manufacturing-category" 
      className="container mx-auto max-w-7xl px-6 py-12 md:py-16"
    >
      {/* Section Header */}
      <div className="text-center lg:text-left mb-10 md:mb-12">
        <h2 
          className="jam-h2 text-[#0b2f4d] mb-2"
          data-cms-key="manufacturing-category-title"
        >
          Our Manufacturing Category
        </h2>
        <p 
          className="jam-small text-[#566375]"
          data-cms-key="manufacturing-category-subtitle"
        >
          Discover the core categories we manufacture & supply.
        </p>
      </div>

      {/* Category Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <li key={category.id} className="list-none">
            <Link
              href={category.href}
              className="group block bg-white rounded-xl border border-[#e8edf3] p-6 min-h-[200px] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] shadow-sm hover:shadow-xl jam-focus-ring"
              data-event={category.dataEvent}
              data-test-id={category.testId}
              data-cms-key={`category-${index + 1}-link`}
              aria-labelledby={`category-title-${category.id}`}
            >
              <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Image Area - 48% on desktop */}
                <div className="w-full md:w-[48%] relative overflow-hidden rounded-lg">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={category.image}
                      alt={`${category.title} - ${category.description}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      data-cms-key={`category-${index + 1}-image`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                    {/* Hover overlay with brand tint */}
                    <div className="absolute inset-0 bg-[#1e4a7c]/0 group-hover:bg-[#1e4a7c]/12 transition-colors duration-300"></div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <h3 
                    id={`category-title-${category.id}`}
                    className="jam-h3 text-[#0b2f4d] mb-2"
                    data-cms-key={`category-${index + 1}-title`}
                  >
                    {category.title}
                  </h3>
                  <p 
                    className="jam-small text-[#566375] mb-4"
                    data-cms-key={`category-${index + 1}-desc`}
                  >
                    {category.description}
                  </p>
                  
                  {/* CTA Chevron */}
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[var(--jam-primary)] font-semibold jam-small group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
