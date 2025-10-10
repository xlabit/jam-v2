'use client';

import Link from 'next/link';
import { MoveVertical, Container, Snowflake, Box, Droplet } from 'lucide-react';

const bodyTypes = [
  { name: 'Tipper', icon: MoveVertical, count: 1200, href: '/vehicles?bodyType=tipper', color: 'from-blue-500 to-blue-600' },
  { name: 'Trailer', icon: Container, count: 1800, href: '/vehicles?bodyType=trailer', color: 'from-purple-500 to-purple-600' },
  { name: 'Reefer', icon: Snowflake, count: 600, href: '/vehicles?bodyType=reefer', color: 'from-cyan-500 to-cyan-600' },
  { name: 'Container', icon: Box, count: 500, href: '/vehicles?bodyType=container', color: 'from-orange-500 to-orange-600' },
  { name: 'Tanker', icon: Droplet, count: 800, href: '/vehicles?bodyType=tanker', color: 'from-green-500 to-green-600' },
];

export function BodyTypeFinder() {
  return (
    <section className="jam-section">
      <div className="jam-container">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="jam-h2 text-[var(--jam-neutral-900)] mb-4">
            Find by Body Type
          </h2>
          <p className="jam-body text-gray-700 max-w-2xl mx-auto">
            Quickly search vehicles by their body configuration
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {bodyTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Link
                key={type.name}
                href={type.href}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br bg-white border-2 border-transparent hover:border-[var(--jam-primary)] transition-all shadow-[var(--jam-elev-1)] hover:shadow-[var(--jam-elev-2)] hover:-translate-y-1"
                data-test-id={`body-type-${type.name.toLowerCase()}`}
              >
                <div className="p-6 flex flex-col items-center text-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="jam-h4 text-[var(--jam-neutral-900)] mb-1">{type.name}</h3>
                    <p className="jam-small text-gray-700">
                      {type.count.toLocaleString()} available
                    </p>
                  </div>
                  <div className="w-full pt-4 border-t border-gray-200">
                    <span className="jam-small text-[#1e4a7c] font-semibold group-hover:underline">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
