'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, DollarSign, SlidersHorizontal } from 'lucide-react';

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`jam-sticky-bar md:hidden ${!isVisible ? 'hidden' : ''}`}
      data-test-id="sticky-mobile-cta"
    >
      <a
        href="tel:+918800123456"
        className="flex flex-col items-center justify-center px-3 py-2 hover:bg-[hsl(var(--jam-neutral-50))] transition-colors rounded-lg jam-focus-ring"
        aria-label="Call us"
        data-test-id="sticky-cta-call"
      >
        <Phone className="w-5 h-5 text-[hsl(var(--jam-primary))]" />
        <span className="jam-tiny text-[hsl(var(--jam-neutral-700))] mt-1">Call</span>
      </a>

      <a
        href="https://wa.me/918800123456"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center px-3 py-2 hover:bg-[hsl(var(--jam-neutral-50))] transition-colors rounded-lg jam-focus-ring"
        aria-label="WhatsApp us"
        data-test-id="sticky-cta-whatsapp"
      >
        <MessageCircle className="w-5 h-5 text-[#25D366]" />
        <span className="jam-tiny text-[hsl(var(--jam-neutral-700))] mt-1">WhatsApp</span>
      </a>

      <button
        className="flex flex-col items-center justify-center px-3 py-2 bg-[hsl(var(--jam-accent))] text-[hsl(var(--jam-accent-foreground))] rounded-lg hover:brightness-110 transition-all jam-focus-ring"
        data-test-id="sticky-cta-price"
      >
        <DollarSign className="w-5 h-5" />
        <span className="jam-tiny font-medium mt-1">Best Price</span>
      </button>

      <button
        className="flex flex-col items-center justify-center px-3 py-2 hover:bg-[hsl(var(--jam-neutral-50))] transition-colors rounded-lg jam-focus-ring"
        aria-label="Open filters"
        data-test-id="sticky-cta-filters"
      >
        <SlidersHorizontal className="w-5 h-5 text-[hsl(var(--jam-primary))]" />
        <span className="jam-tiny text-[hsl(var(--jam-neutral-700))] mt-1">Filters</span>
      </button>
    </div>
  );
}
