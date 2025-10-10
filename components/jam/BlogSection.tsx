'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

const blogs = [
  {
    id: 1,
    category: 'Finance',
    title: 'How to Get the Best Financing Rates for Your Commercial Vehicle',
    image: '/media/images/600x400/1.jpg',
    readTime: '5 min read',
    href: '/blog/financing-rates-commercial-vehicle',
  },
  {
    id: 2,
    category: 'Maintenance',
    title: 'Top 10 Maintenance Tips to Extend Your Truck\'s Lifespan',
    image: '/media/images/600x400/2.jpg',
    readTime: '7 min read',
    href: '/blog/truck-maintenance-tips',
  },
  {
    id: 3,
    category: 'Buying Guide',
    title: 'New vs Used: Which Commercial Vehicle Should You Buy?',
    image: '/media/images/600x400/3.jpg',
    readTime: '6 min read',
    href: '/blog/new-vs-used-vehicles',
  },
  {
    id: 4,
    category: 'Industry News',
    title: 'Latest BS6 Emission Norms: What Fleet Owners Need to Know',
    image: '/media/images/600x400/4.jpg',
    readTime: '4 min read',
    href: '/blog/bs6-emission-norms',
  },
  {
    id: 5,
    category: 'Technology',
    title: 'How IoT is Transforming Fleet Management in 2024',
    image: '/media/images/600x400/5.jpg',
    readTime: '8 min read',
    href: '/blog/iot-fleet-management',
  },
  {
    id: 6,
    category: 'Regulations',
    title: 'Complete Guide to Commercial Vehicle Registration and RC Transfer',
    image: '/media/images/600x400/6.jpg',
    readTime: '6 min read',
    href: '/blog/vehicle-registration-guide',
  },
];

export function BlogSection() {
  return (
    <section className="jam-section">
      <div className="jam-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="jam-h2 text-[hsl(var(--color-jam-neutral-900))] mb-2">
              Latest from Our Blog
            </h2>
            <p className="jam-body text-[hsl(var(--color-jam-neutral-700))]">
              Insights, tips, and news for commercial vehicle owners
            </p>
          </div>

          <Link
            href="/blog"
            className="jam-btn-outline flex items-center gap-2"
            data-test-id="blog-view-all"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={blog.href}
              className="jam-card group"
              data-test-id={`blog-${blog.id}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={600}
                  height={375}
                  className="w-full h-full object-cover transition-transform duration-[var(--jam-transition-slow)] group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="jam-tiny font-semibold px-3 py-1 rounded-full bg-[hsl(var(--color-jam-primary))] text-white">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="jam-h4 text-[hsl(var(--color-jam-neutral-900))] mb-3 line-clamp-2 group-hover:text-[hsl(var(--color-jam-primary))] transition-colors">
                  {blog.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[hsl(var(--color-jam-neutral-700))]">
                    <Clock className="w-4 h-4" />
                    <span className="jam-small">{blog.readTime}</span>
                  </div>

                  <span className="jam-small text-[hsl(var(--color-jam-primary))] font-semibold group-hover:underline flex items-center gap-1">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
