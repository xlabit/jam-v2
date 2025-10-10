'use client';

import Link from 'next/link';
import { Truck, Container, MoveVertical, Droplet, Snowflake, Box, Tractor, Bus } from 'lucide-react';

const categories = [
  { name: 'Truck', icon: Truck, listings: 2500, href: '/vehicles?category=truck' },
  { name: 'Trailer', icon: Container, listings: 1800, href: '/vehicles?category=trailer' },
  { name: 'Tipper', icon: MoveVertical, listings: 1200, href: '/vehicles?category=tipper' },
  { name: 'Tanker', icon: Droplet, listings: 800, href: '/vehicles?category=tanker' },
  { name: 'Reefer', icon: Snowflake, listings: 600, href: '/vehicles?category=reefer' },
  { name: 'Container', icon: Box, listings: 500, href: '/vehicles?category=container' },
  { name: 'Tractor', icon: Tractor, listings: 400, href: '/vehicles?category=tractor' },
  { name: 'Bus', icon: Bus, listings: 300, href: '/vehicles?category=bus' },
];

export function CategoryNavigator() {
  return (
    <section className="jam-section bg-[hsl(var(--color-jam-neutral-50))]">
      <div className="jam-container">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="jam-h2 text-[hsl(var(--color-jam-neutral-900))] mb-4">
            Browse by Category
          </h2>
          <p className="jam-body text-[hsl(var(--color-jam-neutral-700))] max-w-2xl mx-auto">
            Find the perfect heavy vehicle for your business needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="jam-card group p-6 flex flex-col items-center text-center gap-4"
                data-test-id={`category-${category.name.toLowerCase()}`}
              >
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--color-jam-primary))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--color-jam-primary))] transition-colors">
                  <IconComponent className="w-8 h-8 text-[hsl(var(--color-jam-primary))] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="jam-h4 text-[hsl(var(--color-jam-neutral-900))] mb-1">{category.name}</h3>
                  <p className="jam-small text-[hsl(var(--color-jam-neutral-700))]">
                    {category.listings.toLocaleString()} Listings
                  </p>
                </div>
                <button className="jam-btn-outline text-sm px-4 py-2">
                  View All
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
