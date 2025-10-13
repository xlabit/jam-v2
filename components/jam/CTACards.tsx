'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Wrench, Globe, TruckIcon } from 'lucide-react';

export function CTACards() {
  const cards = [
    {
      id: 'parts',
      headline: 'Find Genuine Truck & Trailer Parts Online',
      subheadline: 'Trusted suppliers. Quick delivery. Competitive prices.',
      buttonText: 'Browse Parts',
      href: '/parts-online',
      bgColor: 'bg-[#0C2C52]',
      icon: Wrench,
      dataEvent: 'cta_parts_browse_click',
      imageSrc: '/media/cta/truck-parts.jpg',
      imageAlt: 'Truck parts and components',
    },
    {
      id: 'import',
      headline: 'Import Truck & Trailer Parts from India with Ease',
      subheadline: 'Get authentic spare parts directly from verified Indian suppliers.',
      buttonText: 'Start Import Inquiry',
      href: '/contact',
      bgColor: 'bg-gradient-to-br from-[#102F54] to-[#1B3D67]',
      icon: Globe,
      dataEvent: 'cta_import_inquiry_click',
      imageSrc: '/media/cta/import-parts.jpg',
      imageAlt: 'International truck parts import',
      badge: 'Global Shipping',
    },
    {
      id: 'sell',
      headline: 'Sell Your Truck or Trailer — Hassle Free!',
      subheadline: 'Get instant visibility, verified buyers & best value on Jain Automart.',
      buttonText: 'List Your Vehicle',
      href: '/add-listing',
      bgColor: 'bg-[#1E2F45]',
      icon: TruckIcon,
      dataEvent: 'cta_sell_listing_click',
      imageSrc: '/media/cta/sell-truck.jpg',
      imageAlt: 'Sell your truck or trailer',
      badge: 'Free Listing',
    },
  ];

  return (
    <section 
      id="home-cta-cards" 
      className="jam-section bg-gray-50"
      aria-label="Featured Services"
    >
      <div className="jam-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            
            return (
              <article 
                key={card.id}
                className="group"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <Link
                  href={card.href}
                  className={`relative block ${card.bgColor} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full`}
                  data-event={card.dataEvent}
                  aria-label={card.headline}
                >
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    {/* Icon & Badge Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-[#FFA726]" />
                      </div>
                      {card.badge && (
                        <span className="px-3 py-1 bg-[#FFA726] text-[#0C2C52] text-xs font-semibold rounded-full">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-[#FFA726] transition-colors">
                        {card.headline}
                      </h3>
                      <p className="text-base text-white/90 mb-6 leading-relaxed">
                        {card.subheadline}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFA726] hover:bg-[#FB8C00] text-[#0C2C52] font-semibold rounded-lg transition-all duration-200 group-hover:gap-3">
                        {card.buttonText}
                        <svg 
                          className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0 z-0 opacity-20">
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
