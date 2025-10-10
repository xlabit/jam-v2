'use client';

import { ShieldCheck, MapPin, CreditCard, ClipboardCheck } from 'lucide-react';

const valueProp = [
  {
    icon: ShieldCheck,
    title: 'Verified Documents',
    description: 'Every vehicle comes with RC verification and authentic documentation',
  },
  {
    icon: MapPin,
    title: '100+ Cities Served',
    description: 'Pan-India delivery network to get your vehicle anywhere',
  },
  {
    icon: CreditCard,
    title: 'Finance & Insurance',
    description: 'Easy financing options with partner banks and comprehensive insurance',
  },
  {
    icon: ClipboardCheck,
    title: 'Expert Inspection',
    description: '200+ point inspection by certified technicians',
  },
];

const partners = [
  'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Tata Capital', 'Mahindra Finance'
];

export function WhyJainAutomart() {
  return (
    <section className="jam-section bg-[var(--jam-neutral-50)]">
      <div className="jam-container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="jam-h2 text-[var(--jam-neutral-900)] mb-4">
            Why Jain Automart?
          </h2>
          <p className="jam-body text-gray-700 max-w-2xl mx-auto">
            India's most trusted platform for commercial vehicle transactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {valueProp.map((prop) => {
            const IconComponent = prop.icon;
            return (
              <div
                key={prop.title}
                className="bg-white rounded-2xl p-6 shadow-[var(--jam-elev-1)] hover:shadow-[var(--jam-elev-2)] transition-shadow"
                data-test-id={`value-prop-${prop.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--jam-primary)]/10 flex items-center justify-center mb-4">
                  <IconComponent className="w-7 h-7 text-[#1e4a7c]" />
                </div>
                <h3 className="jam-h4 text-[var(--jam-neutral-900)] mb-2">
                  {prop.title}
                </h3>
                <p className="jam-body text-gray-700">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-[var(--jam-primary)] to-[var(--jam-primary)]/90 rounded-2xl p-8 md:p-12 text-white mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="jam-h2 text-[var(--jam-accent)] mb-2">10K+</div>
              <div className="jam-body">Vehicles Listed</div>
            </div>
            <div>
              <div className="jam-h2 text-[var(--jam-accent)] mb-2">100+</div>
              <div className="jam-body">Cities Covered</div>
            </div>
            <div>
              <div className="jam-h2 text-[var(--jam-accent)] mb-2">1.5K+</div>
              <div className="jam-body">Fleet Owners</div>
            </div>
            <div>
              <div className="jam-h2 text-[var(--jam-accent)] mb-2">4.7★</div>
              <div className="jam-body">Avg. Rating</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="jam-h3 text-center text-[var(--jam-neutral-900)] mb-8">
            Trusted by Leading Partners
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <div
                key={partner}
                className="bg-white px-6 py-4 rounded-lg shadow-sm text-gray-700 font-semibold"
                data-test-id={`partner-${partner.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
