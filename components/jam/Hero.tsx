'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Phone, MessageCircle, ShieldCheck, DollarSign, Truck, Award } from 'lucide-react';

interface HeroProps {
  onOpenLeadModal?: () => void;
}

export function Hero({ onOpenLeadModal }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'used'>('new');
  const [searchForm, setSearchForm] = useState({
    bodyType: '',
    make: '',
    city: '',
    state: '',
  });

  const bodyTypes = [
    'Truck', 'Trailer', 'Tipper', 'Tanker', 'Reefer', 'Container', 'Tractor', 'Bus'
  ];

  const makes = [
    'Tata', 'Ashok Leyland', 'Mahindra', 'Bharat Benz', 'Eicher', 'Volvo', 'Scania'
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'
  ];

  const states = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Gujarat'
  ];

  const handleSearch = () => {
    console.log('Search:', { ...searchForm, condition: activeTab });
  };

  return (
    <section className="relative bg-gradient-to-br from-[hsl(var(--jam-primary))] to-[hsl(var(--jam-primary))]/80 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/media/images/600x400/truck-pattern.svg')] bg-repeat opacity-50"></div>
      </div>

      <div className="jam-container relative">
        <div className="py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <h1 className="jam-h1 text-white mb-4" data-test-id="hero-headline">
              Heavy Vehicles. Verified. Delivered.
            </h1>
            <p className="jam-body md:text-lg text-white/90 max-w-2xl mx-auto" data-test-id="hero-subhead">
              Buy new & used trucks, trailers, and tippers with transparent pricing, inspection, and easy finance.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-[var(--jam-elev-3)] p-4 md:p-6">
              <div className="flex gap-2 mb-4 border-b border-[hsl(var(--jam-neutral-200))]">
                <button
                  onClick={() => setActiveTab('new')}
                  className={`px-6 py-3 rounded-t-lg font-semibold transition-all jam-focus-ring ${
                    activeTab === 'new'
                      ? 'bg-[hsl(var(--jam-primary))] text-white'
                      : 'text-[hsl(var(--jam-neutral-700))] hover:bg-[hsl(var(--jam-neutral-100))]'
                  }`}
                  data-test-id="hero-tab-new"
                  aria-selected={activeTab === 'new'}
                  role="tab"
                >
                  New Vehicles
                </button>
                <button
                  onClick={() => setActiveTab('used')}
                  className={`px-6 py-3 rounded-t-lg font-semibold transition-all jam-focus-ring ${
                    activeTab === 'used'
                      ? 'bg-[hsl(var(--jam-primary))] text-white'
                      : 'text-[hsl(var(--jam-neutral-700))] hover:bg-[hsl(var(--jam-neutral-100))]'
                  }`}
                  data-test-id="hero-tab-used"
                  aria-selected={activeTab === 'used'}
                  role="tab"
                >
                  Used Vehicles
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label htmlFor="bodyType" className="block jam-small font-medium text-[hsl(var(--jam-neutral-700))] mb-2">
                    Body Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="bodyType"
                    value={searchForm.bodyType}
                    onChange={(e) => setSearchForm({ ...searchForm, bodyType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--jam-neutral-300))] text-[hsl(var(--jam-neutral-700))] jam-focus-ring"
                    data-test-id="hero-body-type-select"
                    required
                  >
                    <option value="">Select Body Type</option>
                    {bodyTypes.map((type) => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="make" className="block jam-small font-medium text-[hsl(var(--jam-neutral-700))] mb-2">
                    Make (Optional)
                  </label>
                  <select
                    id="make"
                    value={searchForm.make}
                    onChange={(e) => setSearchForm({ ...searchForm, make: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--jam-neutral-300))] text-[hsl(var(--jam-neutral-700))] jam-focus-ring"
                    data-test-id="hero-make-select"
                  >
                    <option value="">All Makes</option>
                    {makes.map((make) => (
                      <option key={make} value={make.toLowerCase()}>{make}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block jam-small font-medium text-[hsl(var(--jam-neutral-700))] mb-2">
                    City (Optional)
                  </label>
                  <select
                    id="city"
                    value={searchForm.city}
                    onChange={(e) => setSearchForm({ ...searchForm, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--jam-neutral-300))] text-[hsl(var(--jam-neutral-700))] jam-focus-ring"
                    data-test-id="hero-city-select"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city.toLowerCase()}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="state" className="block jam-small font-medium text-[hsl(var(--jam-neutral-700))] mb-2">
                    State (Optional)
                  </label>
                  <select
                    id="state"
                    value={searchForm.state}
                    onChange={(e) => setSearchForm({ ...searchForm, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--jam-neutral-300))] text-[hsl(var(--jam-neutral-700))] jam-focus-ring"
                    data-test-id="hero-state-select"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state.toLowerCase()}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!searchForm.bodyType}
                className="w-full md:w-auto px-8 py-4 bg-[hsl(var(--jam-accent))] text-[hsl(var(--jam-accent-foreground))] rounded-lg font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[var(--jam-elev-1)] hover:shadow-[var(--jam-elev-2)] jam-focus-ring flex items-center justify-center gap-2"
                data-test-id="hero-search-btn"
              >
                <Search className="w-5 h-5" />
                Find Vehicles
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={onOpenLeadModal}
              className="jam-btn-primary flex items-center gap-2"
              data-test-id="hero-best-price-btn"
            >
              <DollarSign className="w-5 h-5" />
              Get Best Price
            </button>
            <button
              onClick={onOpenLeadModal}
              className="jam-btn-secondary flex items-center gap-2"
              data-test-id="hero-callback-btn"
            >
              <Phone className="w-5 h-5" />
              Request Callback
            </button>
            <a
              href="https://wa.me/918800123456"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-all shadow-[var(--jam-elev-1)] hover:shadow-[var(--jam-elev-2)] flex items-center gap-2 jam-focus-ring"
              data-test-id="hero-whatsapp-btn"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <ShieldCheck className="w-8 h-8 text-[hsl(var(--jam-accent))]" />
              <div>
                <div className="jam-small font-semibold">RC Verified</div>
                <div className="jam-tiny text-white/80">Authentic Docs</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <DollarSign className="w-8 h-8 text-[hsl(var(--jam-accent))]" />
              <div>
                <div className="jam-small font-semibold">Financing</div>
                <div className="jam-tiny text-white/80">Easy Approval</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <Truck className="w-8 h-8 text-[hsl(var(--jam-accent))]" />
              <div>
                <div className="jam-small font-semibold">Pan-India</div>
                <div className="jam-tiny text-white/80">Delivery</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <Award className="w-8 h-8 text-[hsl(var(--jam-accent))]" />
              <div>
                <div className="jam-small font-semibold">Warranty</div>
                <div className="jam-tiny text-white/80">Options Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
