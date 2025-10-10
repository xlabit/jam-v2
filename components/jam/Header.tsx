'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Phone, MessageCircle, GitCompare, Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onOpenLeadModal?: () => void;
}

export function Header({ onOpenLeadModal }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const categories = [
    { name: 'Trucks', href: '/vehicles?category=truck', count: 2500 },
    { name: 'Trailers', href: '/vehicles?category=trailer', count: 1800 },
    { name: 'Tippers', href: '/vehicles?category=tipper', count: 1200 },
    { name: 'Tankers', href: '/vehicles?category=tanker', count: 800 },
    { name: 'Reefers', href: '/vehicles?category=reefer', count: 600 },
    { name: 'Containers', href: '/vehicles?category=container', count: 500 },
    { name: 'Tractors', href: '/vehicles?category=tractor', count: 400 },
    { name: 'Buses', href: '/vehicles?category=bus', count: 300 },
  ];

  return (
    <header className="bg-white border-b border-[hsl(var(--color-jam-neutral-200))] sticky top-0 z-50">
      <div className="jam-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0" aria-label="Jain Automart Home">
              <Image
                src="/media/logo-jam.png"
                alt="Jain Automart"
                width={160}
                height={48}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
              <div className="relative group">
                <button
                  className="flex items-center gap-1 text-[hsl(var(--color-jam-neutral-700))] hover:text-[hsl(var(--color-jam-primary))] jam-body font-medium transition-colors jam-focus-ring"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  aria-expanded={isCategoriesOpen}
                  aria-haspopup="true"
                  data-test-id="header-categories-btn"
                >
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isCategoriesOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-[var(--jam-elev-3)] py-2"
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                    role="menu"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-2 hover:bg-[hsl(var(--color-jam-neutral-100))] text-[hsl(var(--color-jam-neutral-700))] hover:text-[hsl(var(--color-jam-primary))] transition-colors"
                        role="menuitem"
                      >
                        <div className="flex justify-between items-center">
                          <span className="jam-body">{category.name}</span>
                          <span className="jam-small text-[hsl(var(--color-jam-neutral-500))]">
                            {category.count}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/brands"
                className="text-[hsl(var(--color-jam-neutral-700))] hover:text-[hsl(var(--color-jam-primary))] jam-body font-medium transition-colors jam-focus-ring"
                data-test-id="header-brands-link"
              >
                Brands
              </Link>
              <Link
                href="/vehicles?condition=new"
                className="text-[hsl(var(--color-jam-neutral-700))] hover:text-[hsl(var(--color-jam-primary))] jam-body font-medium transition-colors jam-focus-ring"
                data-test-id="header-new-link"
              >
                New
              </Link>
              <Link
                href="/vehicles?condition=used"
                className="text-[hsl(var(--color-jam-neutral-700))] hover:text-[hsl(var(--color-jam-primary))] jam-body font-medium transition-colors jam-focus-ring"
                data-test-id="header-used-link"
              >
                Used
              </Link>
              <Link
                href="/service-centers"
                className="text-[hsl(var(--color-jam-neutral-700))] hover:text-[hsl(var(--color-jam-primary))] jam-body font-medium transition-colors jam-focus-ring"
                data-test-id="header-service-link"
              >
                Service Centers
              </Link>
              <Link
                href="/finance"
                className="text-[hsl(var(--color-jam-neutral-700))] hover:text-[hsl(var(--color-jam-primary))] jam-body font-medium transition-colors jam-focus-ring"
                data-test-id="header-finance-link"
              >
                Finance
              </Link>
              <Link
                href="/blog"
                className="text-[hsl(var(--color-jam-neutral-700))] hover:text-[hsl(var(--color-jam-primary))] jam-body font-medium transition-colors jam-focus-ring"
                data-test-id="header-blog-link"
              >
                Blog
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[hsl(var(--color-jam-neutral-100))] transition-colors jam-focus-ring"
              aria-label="Search"
              data-test-id="header-search-btn"
            >
              <Search className="w-5 h-5 text-[hsl(var(--color-jam-neutral-700))]" />
            </button>
            
            <button
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[hsl(var(--color-jam-neutral-100))] transition-colors jam-focus-ring"
              aria-label="Compare vehicles"
              data-test-id="header-compare-btn"
            >
              <GitCompare className="w-5 h-5 text-[hsl(var(--color-jam-neutral-700))]" />
            </button>

            <a
              href="tel:+918800123456"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--color-jam-primary))] text-white hover:bg-[hsl(var(--color-jam-primary))]/90 transition-colors jam-focus-ring"
              data-test-id="header-call-btn"
            >
              <Phone className="w-4 h-4" />
              <span className="jam-small font-medium">Call</span>
            </a>

            <a
              href="https://wa.me/918800123456"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] text-white hover:brightness-110 transition-all jam-focus-ring"
              data-test-id="header-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="jam-small font-medium">WhatsApp</span>
            </a>

            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[hsl(var(--color-jam-neutral-100))] transition-colors jam-focus-ring"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              data-test-id="header-mobile-menu-btn"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[hsl(var(--color-jam-neutral-700))]" />
              ) : (
                <Menu className="w-6 h-6 text-[hsl(var(--color-jam-neutral-700))]" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-[hsl(var(--color-jam-neutral-200))]" aria-label="Mobile navigation">
            <div className="flex flex-col gap-2">
              <Link
                href="/vehicles"
                className="px-4 py-2 text-[hsl(var(--color-jam-neutral-700))] hover:bg-[hsl(var(--color-jam-neutral-100))] rounded-lg transition-colors jam-body font-medium"
              >
                Categories
              </Link>
              <Link
                href="/brands"
                className="px-4 py-2 text-[hsl(var(--color-jam-neutral-700))] hover:bg-[hsl(var(--color-jam-neutral-100))] rounded-lg transition-colors jam-body font-medium"
              >
                Brands
              </Link>
              <Link
                href="/vehicles?condition=new"
                className="px-4 py-2 text-[hsl(var(--color-jam-neutral-700))] hover:bg-[hsl(var(--color-jam-neutral-100))] rounded-lg transition-colors jam-body font-medium"
              >
                New Vehicles
              </Link>
              <Link
                href="/vehicles?condition=used"
                className="px-4 py-2 text-[hsl(var(--color-jam-neutral-700))] hover:bg-[hsl(var(--color-jam-neutral-100))] rounded-lg transition-colors jam-body font-medium"
              >
                Used Vehicles
              </Link>
              <Link
                href="/service-centers"
                className="px-4 py-2 text-[hsl(var(--color-jam-neutral-700))] hover:bg-[hsl(var(--color-jam-neutral-100))] rounded-lg transition-colors jam-body font-medium"
              >
                Service Centers
              </Link>
              <Link
                href="/finance"
                className="px-4 py-2 text-[hsl(var(--color-jam-neutral-700))] hover:bg-[hsl(var(--color-jam-neutral-100))] rounded-lg transition-colors jam-body font-medium"
              >
                Finance
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2 text-[hsl(var(--color-jam-neutral-700))] hover:bg-[hsl(var(--color-jam-neutral-100))] rounded-lg transition-colors jam-body font-medium"
              >
                Blog
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
