'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  onOpenLeadModal?: () => void;
}

export function Footer({ onOpenLeadModal }: FooterProps) {
  const categories = ['Trucks', 'Trailers', 'Tippers', 'Tankers', 'Reefers', 'Containers'];
  const brands = ['Tata', 'Ashok Leyland', 'Mahindra', 'Bharat Benz', 'Eicher', 'Volvo'];
  const quickLinks = ['About Us', 'Contact', 'Careers', 'Privacy Policy', 'Terms & Conditions', 'Sitemap'];

  return (
    <footer className="bg-[hsl(var(--jam-neutral-900))] text-white">
      <div className="jam-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-4">
            <Image
              src="/media/logo-jam.png"
              alt="Jain Automart"
              width={180}
              height={54}
              className="h-12 w-auto mb-6 brightness-0 invert"
            />
            <p className="jam-body text-white/80 mb-6">
              India's most trusted platform for buying and selling commercial vehicles. Verified vehicles, transparent pricing, easy financing.
            </p>

            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[hsl(var(--jam-primary))] transition-colors flex items-center justify-center jam-focus-ring"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[hsl(var(--jam-primary))] transition-colors flex items-center justify-center jam-focus-ring"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[hsl(var(--jam-primary))] transition-colors flex items-center justify-center jam-focus-ring"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[hsl(var(--jam-primary))] transition-colors flex items-center justify-center jam-focus-ring"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[hsl(var(--jam-primary))] transition-colors flex items-center justify-center jam-focus-ring"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="jam-h4 mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/vehicles?category=${category.toLowerCase()}`}
                    className="jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="jam-h4 mb-4">Popular Brands</h3>
            <ul className="space-y-2">
              {brands.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/vehicles?brand=${brand.toLowerCase().replace(' ', '-')}`}
                    className="jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="jam-h4 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vehicles?condition=new" className="jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring">
                  New Vehicles
                </Link>
              </li>
              <li>
                <Link href="/vehicles?condition=used" className="jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring">
                  Used Vehicles
                </Link>
              </li>
              <li>
                <Link href="/service-centers" className="jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring">
                  Service Centers
                </Link>
              </li>
              <li>
                <Link href="/finance" className="jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring">
                  Finance
                </Link>
              </li>
              <li>
                <Link href="/blog" className="jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="jam-h4 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+918800123456" className="flex items-center gap-2 jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring">
                  <Phone className="w-4 h-4" />
                  +91 88001 23456
                </a>
              </li>
              <li>
                <a href="mailto:info@jainautomart.com" className="flex items-center gap-2 jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring">
                  <Mail className="w-4 h-4" />
                  info@jainautomart.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/918800123456" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 jam-body text-white/80 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 jam-body text-white/80">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
            <button onClick={onOpenLeadModal} className="jam-btn-primary" data-test-id="footer-cta-price">
              Get Best Price
            </button>
            <a
              href="tel:+918800123456"
              className="jam-btn-secondary flex items-center gap-2"
              data-test-id="footer-cta-call"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href="https://wa.me/918800123456"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-all flex items-center gap-2 jam-focus-ring"
              data-test-id="footer-cta-whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="jam-small text-white/60">
              © {new Date().getFullYear()} Jain Automart. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="jam-small text-white/60 hover:text-[hsl(var(--jam-accent))] transition-colors jam-focus-ring"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
