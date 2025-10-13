'use client';

import { useState } from 'react';
import { Header } from '@/components/jam/Header';
import { Hero } from '@/components/jam/Hero';
import { CTACards } from '@/components/jam/CTACards';
import { CategoryNavigator } from '@/components/jam/CategoryNavigator';
import { FeaturedListings } from '@/components/jam/FeaturedListings';
import { BrandsSection } from '@/components/jam/BrandsSection';
import { BodyTypeFinder } from '@/components/jam/BodyTypeFinder';
import { WhyJainAutomart } from '@/components/jam/WhyJainAutomart';
import { FinanceSection } from '@/components/jam/FinanceSection';
import { Testimonials } from '@/components/jam/Testimonials';
import { BlogSection } from '@/components/jam/BlogSection';
import { FAQ } from '@/components/jam/FAQ';
import { Footer } from '@/components/jam/Footer';
import { StickyMobileCTA } from '@/components/jam/StickyMobileCTA';
import { LeadModal } from '@/components/jam/LeadModal';

export default function HomePage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const openLeadModal = () => setIsLeadModalOpen(true);

  return (
    <div className="flex-1 w-full bg-white">
      <Header onOpenLeadModal={openLeadModal} />
      
      <main className="min-h-screen">
        <Hero onOpenLeadModal={openLeadModal} />
        <CTACards />
        <CategoryNavigator />
        <FeaturedListings onOpenLeadModal={openLeadModal} />
        <BrandsSection />
        <BodyTypeFinder />
        <WhyJainAutomart />
        <FinanceSection />
        <Testimonials />
        <BlogSection />
        <FAQ />
      </main>

      <Footer onOpenLeadModal={openLeadModal} />
      
      <StickyMobileCTA onOpenLeadModal={openLeadModal} />
      
      <LeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
      />
    </div>
  );
}
