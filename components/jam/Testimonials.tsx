'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    city: 'Mumbai',
    rating: 5,
    image: '/media/avatars/300-1.jpg',
    quote: 'Excellent service! I purchased a Tata LPT 3118 and the entire process was smooth. The vehicle was exactly as described, and the financing was quick.',
  },
  {
    id: 2,
    name: 'Suresh Patel',
    city: 'Ahmedabad',
    rating: 5,
    image: '/media/avatars/300-2.jpg',
    quote: 'Best platform for commercial vehicles. Bought 3 tippers for my business. The team helped with documentation and delivery across states.',
  },
  {
    id: 3,
    name: 'Amit Sharma',
    city: 'Delhi',
    rating: 4,
    image: '/media/avatars/300-3.jpg',
    quote: 'Great experience buying my first truck. The inspection report was detailed and the price was fair. Highly recommend Jain Automart.',
  },
  {
    id: 4,
    name: 'Vijay Singh',
    city: 'Bangalore',
    rating: 5,
    image: '/media/avatars/300-4.jpg',
    quote: 'Trustworthy platform with verified vehicles. The RC verification gave me confidence. Financing options were also very helpful.',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="jam-section bg-[hsl(var(--jam-neutral-50))]">
      <div className="jam-container">
        <div className="text-center mb-12">
          <h2 className="jam-h2 text-[hsl(var(--jam-neutral-900))] mb-4">
            What Our Customers Say
          </h2>
          <p className="jam-body text-[hsl(var(--jam-neutral-700))] max-w-2xl mx-auto">
            Trusted by thousands of fleet owners and transport businesses
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-[var(--jam-elev-2)] p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonials[currentIndex].rating
                          ? 'text-[hsl(var(--jam-accent))] fill-[hsl(var(--jam-accent))]'
                          : 'text-[hsl(var(--jam-neutral-300))]'
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="jam-body text-[hsl(var(--jam-neutral-700))] mb-6 italic">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                <div>
                  <div className="jam-h4 text-[hsl(var(--jam-neutral-900))]">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="jam-small text-[hsl(var(--jam-neutral-700))]">
                    {testimonials[currentIndex].city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 bg-white rounded-full shadow-[var(--jam-elev-2)] flex items-center justify-center hover:bg-[hsl(var(--jam-neutral-100))] transition-colors jam-focus-ring"
            aria-label="Previous testimonial"
            data-test-id="testimonial-prev"
          >
            <ChevronLeft className="w-6 h-6 text-[hsl(var(--jam-neutral-700))]" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 bg-white rounded-full shadow-[var(--jam-elev-2)] flex items-center justify-center hover:bg-[hsl(var(--jam-neutral-100))] transition-colors jam-focus-ring"
            aria-label="Next testimonial"
            data-test-id="testimonial-next"
          >
            <ChevronRight className="w-6 h-6 text-[hsl(var(--jam-neutral-700))]" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all jam-focus-ring ${
                  index === currentIndex
                    ? 'w-8 bg-[hsl(var(--jam-primary))]'
                    : 'bg-[hsl(var(--jam-neutral-300))]'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                data-test-id={`testimonial-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
