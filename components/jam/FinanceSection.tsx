'use client';

import { useState } from 'react';
import { DollarSign, CheckCircle } from 'lucide-react';

export function FinanceSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    city: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Finance pre-approval:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const vehicleTypes = ['Truck', 'Trailer', 'Tipper', 'Tanker', 'Reefer', 'Container', 'Bus'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const partners = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Tata Capital'];

  return (
    <section className="jam-section">
      <div className="jam-container">
        <div className="bg-gradient-to-br from-[var(--jam-primary)] to-[var(--jam-primary)]/90 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--jam-accent)] flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[hsl(var(--color-jam-accent-fg)]" />
                </div>
                <h2 className="jam-h2">Get Pre-Approved</h2>
              </div>
              
              <p className="jam-body mb-8 text-white/90">
                Get instant pre-approval for vehicle financing. Quick process, competitive rates, and hassle-free documentation.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="finance-name" className="block jam-small font-medium mb-2">
                      Full Name <span className="text-[var(--jam-accent)]">*</span>
                    </label>
                    <input
                      id="finance-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-[var(--jam-neutral-900)] jam-focus-ring"
                      placeholder="Enter your name"
                      required
                      data-test-id="finance-name-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="finance-phone" className="block jam-small font-medium mb-2">
                      Phone Number <span className="text-[var(--jam-accent)]">*</span>
                    </label>
                    <input
                      id="finance-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-[var(--jam-neutral-900)] jam-focus-ring"
                      placeholder="+91 98765 43210"
                      required
                      data-test-id="finance-phone-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="finance-vehicle" className="block jam-small font-medium mb-2">
                      Vehicle Type <span className="text-[var(--jam-accent)]">*</span>
                    </label>
                    <select
                      id="finance-vehicle"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-[var(--jam-neutral-900)] jam-focus-ring"
                      required
                      data-test-id="finance-vehicle-select"
                    >
                      <option value="">Select vehicle type</option>
                      {vehicleTypes.map((type) => (
                        <option key={type} value={type.toLowerCase()}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="finance-city" className="block jam-small font-medium mb-2">
                      City <span className="text-[var(--jam-accent)]">*</span>
                    </label>
                    <select
                      id="finance-city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-[var(--jam-neutral-900)] jam-focus-ring"
                      required
                      data-test-id="finance-city-select"
                    >
                      <option value="">Select city</option>
                      {cities.map((city) => (
                        <option key={city} value={city.toLowerCase()}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--jam-accent)] text-[hsl(var(--color-jam-accent-fg)] px-6 py-4 rounded-lg font-semibold hover:brightness-110 transition-all shadow-lg jam-focus-ring"
                    data-test-id="finance-submit-btn"
                  >
                    Get Pre-Approved Now
                  </button>
                </form>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-[var(--jam-accent)] mx-auto mb-4" />
                  <h3 className="jam-h3 mb-2">Request Submitted!</h3>
                  <p className="jam-body text-white/90">
                    Our team will contact you within 24 hours.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
              <h3 className="jam-h3 text-[var(--jam-neutral-900)] mb-6">
                Finance Partners
              </h3>
              <div className="space-y-4 mb-8">
                {partners.map((partner) => (
                  <div
                    key={partner}
                    className="flex items-center gap-3 p-4 bg-[var(--jam-neutral-50)] rounded-lg"
                    data-test-id={`finance-partner-${partner.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--jam-primary)]/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-[#1e4a7c]" />
                    </div>
                    <span className="jam-body font-semibold text-[var(--jam-neutral-900)]">
                      {partner}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#1e4a7c] flex-shrink-0 mt-0.5" />
                  <span className="jam-small">Interest rates starting from 8.5% p.a.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#1e4a7c] flex-shrink-0 mt-0.5" />
                  <span className="jam-small">Tenure up to 7 years</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#1e4a7c] flex-shrink-0 mt-0.5" />
                  <span className="jam-small">Minimal documentation required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
