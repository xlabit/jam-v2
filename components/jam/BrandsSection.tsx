'use client';

import { useState } from 'react';
import Image from 'next/image';

const brands = [
  { name: 'Tata', logo: '/media/brand-logos/tata.png', count: 1200 },
  { name: 'Ashok Leyland', logo: '/media/brand-logos/ashok-leyland.png', count: 980 },
  { name: 'Mahindra', logo: '/media/brand-logos/mahindra.png', count: 850 },
  { name: 'Bharat Benz', logo: '/media/brand-logos/bharat-benz.png', count: 720 },
  { name: 'Eicher', logo: '/media/brand-logos/eicher.png', count: 650 },
  { name: 'Volvo', logo: '/media/brand-logos/volvo.png', count: 420 },
  { name: 'Scania', logo: '/media/brand-logos/scania.png', count: 280 },
  { name: 'MAN', logo: '/media/brand-logos/man.png', count: 180 },
];

export function BrandsSection() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <section className="jam-section bg-[hsl(var(--color-jam-neutral-50))]">
      <div className="jam-container">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="jam-h2 text-[hsl(var(--color-jam-neutral-900))] mb-4">
            Popular Brands
          </h2>
          <p className="jam-body text-[hsl(var(--color-jam-neutral-700))] max-w-2xl mx-auto">
            Explore vehicles from trusted manufacturers
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedBrand(null)}
            className={`jam-chip ${selectedBrand === null ? 'active' : ''}`}
            data-test-id="brand-filter-all"
          >
            All Brands
          </button>
          {brands.slice(0, 6).map((brand) => (
            <button
              key={brand.name}
              onClick={() => setSelectedBrand(brand.name)}
              className={`jam-chip ${selectedBrand === brand.name ? 'active' : ''}`}
              data-test-id={`brand-filter-${brand.name.toLowerCase().replace(' ', '-')}`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-8 animate-marquee">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-none w-40 h-24 bg-white rounded-lg shadow-[var(--jam-elev-1)] hover:shadow-[var(--jam-elev-2)] transition-shadow p-4 flex flex-col items-center justify-center gap-2 cursor-pointer"
                data-test-id={`brand-logo-${brand.name.toLowerCase().replace(' ', '-')}`}
              >
                <div className="relative w-full h-12">
                  <div className="w-full h-full flex items-center justify-center text-[hsl(var(--color-jam-neutral-700))] font-bold">
                    {brand.name}
                  </div>
                </div>
                <span className="jam-tiny text-[hsl(var(--color-jam-neutral-700))]">
                  {brand.count} vehicles
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
