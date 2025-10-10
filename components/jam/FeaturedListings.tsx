'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, MessageCircle, Eye, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const listings = [
  {
    id: 1,
    image: '/media/products/product1.jpg',
    year: 2023,
    make: 'Tata',
    model: 'LPT 3118',
    variant: 'TC Diesel',
    axle: '6x2',
    gvw: '31T',
    emission: 'BS6',
    city: 'Mumbai',
    price: 3250000,
    negotiable: true,
    verified: true,
  },
  {
    id: 2,
    image: '/media/products/product2.jpg',
    year: 2022,
    make: 'Ashok Leyland',
    model: 'AVTR 2820',
    variant: '6x4 Tipper',
    axle: '6x4',
    gvw: '28T',
    emission: 'BS6',
    city: 'Delhi',
    price: 2850000,
    negotiable: true,
    verified: true,
  },
  {
    id: 3,
    image: '/media/products/product3.jpg',
    year: 2023,
    make: 'Mahindra',
    model: 'Blazo X 49',
    variant: 'Sleeper Cab',
    axle: '6x4',
    gvw: '49T',
    emission: 'BS6',
    city: 'Pune',
    price: 4100000,
    negotiable: false,
    verified: true,
  },
  {
    id: 4,
    image: '/media/products/product4.jpg',
    year: 2021,
    make: 'Bharat Benz',
    model: '3143R',
    variant: 'Rigid Truck',
    axle: '6x4',
    gvw: '31T',
    emission: 'BS6',
    city: 'Bangalore',
    price: 3500000,
    negotiable: true,
    verified: true,
  },
];

export function FeaturedListings() {
  const [activeTab, setActiveTab] = useState<'new' | 'used'>('new');
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('listings-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="jam-section">
      <div className="jam-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="jam-h2 text-[hsl(var(--jam-neutral-900))] mb-2">
              Featured Listings
            </h2>
            <p className="jam-body text-[hsl(var(--jam-neutral-700))]">
              Handpicked verified vehicles ready for delivery
            </p>
          </div>

          <div className="flex gap-2 bg-[hsl(var(--jam-neutral-100))] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-6 py-2 rounded-md font-semibold transition-all jam-focus-ring ${
                activeTab === 'new'
                  ? 'bg-white text-[hsl(var(--jam-primary))] shadow-sm'
                  : 'text-[hsl(var(--jam-neutral-700))]'
              }`}
              data-test-id="listings-tab-new"
            >
              New
            </button>
            <button
              onClick={() => setActiveTab('used')}
              className={`px-6 py-2 rounded-md font-semibold transition-all jam-focus-ring ${
                activeTab === 'used'
                  ? 'bg-white text-[hsl(var(--jam-primary))] shadow-sm'
                  : 'text-[hsl(var(--jam-neutral-700))]'
              }`}
              data-test-id="listings-tab-used"
            >
              Used
            </button>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-[var(--jam-elev-2)] items-center justify-center hover:bg-[hsl(var(--jam-neutral-100))] transition-colors jam-focus-ring"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-[hsl(var(--jam-neutral-700))]" />
          </button>

          <div
            id="listings-container"
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="jam-listing-card flex-none w-[320px]"
                data-test-id={`listing-${listing.id}`}
              >
                <div className="jam-listing-card-image">
                  <Image
                    src={listing.image}
                    alt={`${listing.year} ${listing.make} ${listing.model}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  {listing.verified && (
                    <div className="absolute top-3 right-3 jam-badge-verified bg-white">
                      <ShieldCheck className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="jam-h4 text-[hsl(var(--jam-neutral-900))] mb-2 line-clamp-1">
                    {listing.year} {listing.make} {listing.model}
                  </h3>
                  <p className="jam-small text-[hsl(var(--jam-neutral-700))] mb-3">
                    {listing.variant}
                  </p>

                  <div className="flex items-center gap-2 text-[hsl(var(--jam-neutral-700))] jam-small mb-4">
                    <span>{listing.axle}</span>
                    <span>•</span>
                    <span>{listing.gvw}</span>
                    <span>•</span>
                    <span>{listing.emission}</span>
                    <span>•</span>
                    <span>{listing.city}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="jam-h3 text-[hsl(var(--jam-primary))]">
                        ₹{(listing.price / 100000).toFixed(2)}L
                      </div>
                      {listing.negotiable && (
                        <span className="jam-tiny text-[hsl(var(--jam-neutral-700))] bg-[hsl(var(--jam-neutral-100))] px-2 py-1 rounded-full">
                          Negotiable
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="w-full jam-btn-primary flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <div className="flex gap-2">
                      <button className="flex-1 jam-btn-outline flex items-center justify-center gap-2 text-sm py-2">
                        <DollarSign className="w-4 h-4" />
                        Best Price
                      </button>
                      <button className="flex-1 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm jam-focus-ring">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-[var(--jam-elev-2)] items-center justify-center hover:bg-[hsl(var(--jam-neutral-100))] transition-colors jam-focus-ring"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-[hsl(var(--jam-neutral-700))]" />
          </button>
        </div>
      </div>
    </section>
  );
}
