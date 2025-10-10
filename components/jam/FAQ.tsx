'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'How does vehicle financing work at Jain Automart?',
    answer: 'We partner with leading banks and NBFCs to offer competitive financing options. You can get pre-approved online, and our team will help you with the documentation. Loan amounts up to 90% of vehicle value with tenure up to 7 years.',
  },
  {
    id: 2,
    question: 'What does RC verification include?',
    answer: 'Our RC verification process includes checking the vehicle registration certificate authenticity, verifying ownership details, checking for any outstanding loans or legal issues, and confirming the vehicle\'s history and documents are genuine.',
  },
  {
    id: 3,
    question: 'Do you provide pan-India delivery?',
    answer: 'Yes, we deliver vehicles across India. Our logistics partners ensure safe and timely delivery to your location. Delivery charges vary based on distance and are communicated upfront during the purchase process.',
  },
  {
    id: 4,
    question: 'What warranty options are available?',
    answer: 'We offer extended warranty options for both new and used vehicles. New vehicles come with manufacturer warranty, while used vehicles can be covered with our comprehensive warranty packages ranging from 6 months to 2 years.',
  },
  {
    id: 5,
    question: 'How is the vehicle inspection done?',
    answer: 'Every vehicle undergoes a rigorous 200+ point inspection by certified technicians. The inspection covers engine, transmission, brakes, suspension, electrical systems, body condition, and more. You receive a detailed inspection report.',
  },
  {
    id: 6,
    question: 'Can I exchange my old vehicle?',
    answer: 'Yes, we accept old commercial vehicles in exchange. Our team will evaluate your vehicle and offer a fair exchange value that can be adjusted against your new purchase. The process is quick and hassle-free.',
  },
  {
    id: 7,
    question: 'What documents are required for purchase?',
    answer: 'For individual buyers: Aadhaar, PAN card, driving license, and address proof. For businesses: Company registration, GST certificate, authorized signatory documents. Our team will guide you through the complete documentation process.',
  },
  {
    id: 8,
    question: 'How long does the purchase process take?',
    answer: 'Once you select a vehicle, the entire process from documentation to delivery typically takes 5-7 working days. If financing is involved, it may take an additional 2-3 days for loan approval and disbursal.',
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="jam-section bg-[hsl(var(--jam-neutral-50))]">
      <div className="jam-container">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="jam-h2 text-[hsl(var(--jam-neutral-900))] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="jam-body text-[hsl(var(--jam-neutral-700))] max-w-2xl mx-auto">
            Got questions? We've got answers
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-[var(--jam-elev-1)] overflow-hidden"
              data-test-id={`faq-${faq.id}`}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[hsl(var(--jam-neutral-50))] transition-colors jam-focus-ring"
                aria-expanded={openId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="jam-h4 text-[hsl(var(--jam-neutral-900))] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-[hsl(var(--jam-primary))] flex-shrink-0 transition-transform ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openId === faq.id && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="px-6 pb-4 jam-body text-[hsl(var(--jam-neutral-700))]"
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
