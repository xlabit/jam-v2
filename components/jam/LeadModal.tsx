'use client';

import { useState } from 'react';
import { X, CheckCircle, MessageCircle } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function LeadModal({ isOpen, onClose, title = 'Get Best Price' }: LeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    interest: '',
    notes: '',
    consent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const interests = ['New Vehicle', 'Used Vehicle', 'Service', 'Finance'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Gujarat'];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.interest) newErrors.interest = 'Please select your interest';
    if (!formData.consent) newErrors.consent = 'Please accept the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      console.log('Lead submitted:', formData);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      city: '',
      state: '',
      interest: '',
      notes: '',
      consent: false,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      data-test-id="lead-modal-overlay"
    >
      <div
        className="bg-white rounded-2xl shadow-[var(--jam-elev-3)] max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="sticky top-0 bg-white border-b border-[hsl(var(--color-jam-neutral-200))] px-6 py-4 flex items-center justify-between">
          <h2 id="modal-title" className="jam-h3 text-[hsl(var(--color-jam-neutral-900))]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-[hsl(var(--color-jam-neutral-100))] transition-colors flex items-center justify-center jam-focus-ring"
            aria-label="Close modal"
            data-test-id="lead-modal-close"
          >
            <X className="w-6 h-6 text-[hsl(var(--color-jam-neutral-700))]" />
          </button>
        </div>

        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-name" className="block jam-small font-medium text-[hsl(var(--color-jam-neutral-700))] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lead-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-[hsl(var(--color-jam-neutral-300))]'
                  } text-[hsl(var(--color-jam-neutral-900))] jam-focus-ring`}
                  placeholder="Enter your full name"
                  data-test-id="lead-name-input"
                />
                {errors.name && <p className="jam-tiny text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="lead-phone" className="block jam-small font-medium text-[hsl(var(--color-jam-neutral-700))] mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="w-16 px-3 py-3 rounded-lg border border-[hsl(var(--color-jam-neutral-300))] bg-[hsl(var(--color-jam-neutral-50))] text-[hsl(var(--color-jam-neutral-700))] flex items-center justify-center">
                    +91
                  </div>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`flex-1 px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-[hsl(var(--color-jam-neutral-300))]'
                    } text-[hsl(var(--color-jam-neutral-900))] jam-focus-ring`}
                    placeholder="98765 43210"
                    data-test-id="lead-phone-input"
                  />
                </div>
                {errors.phone && <p className="jam-tiny text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lead-city" className="block jam-small font-medium text-[hsl(var(--color-jam-neutral-700))] mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.city ? 'border-red-500' : 'border-[hsl(var(--color-jam-neutral-300))]'
                    } text-[hsl(var(--color-jam-neutral-900))] jam-focus-ring`}
                    placeholder="Your city"
                    data-test-id="lead-city-input"
                  />
                  {errors.city && <p className="jam-tiny text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="lead-state" className="block jam-small font-medium text-[hsl(var(--color-jam-neutral-700))] mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="lead-state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.state ? 'border-red-500' : 'border-[hsl(var(--color-jam-neutral-300))]'
                    } text-[hsl(var(--color-jam-neutral-900))] jam-focus-ring`}
                    data-test-id="lead-state-select"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="jam-tiny text-red-500 mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="lead-interest" className="block jam-small font-medium text-[hsl(var(--color-jam-neutral-700))] mb-2">
                  I'm interested in <span className="text-red-500">*</span>
                </label>
                <select
                  id="lead-interest"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.interest ? 'border-red-500' : 'border-[hsl(var(--color-jam-neutral-300))]'
                  } text-[hsl(var(--color-jam-neutral-900))] jam-focus-ring`}
                  data-test-id="lead-interest-select"
                >
                  <option value="">Select your interest</option>
                  {interests.map((interest) => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
                {errors.interest && <p className="jam-tiny text-red-500 mt-1">{errors.interest}</p>}
              </div>

              <div>
                <label htmlFor="lead-notes" className="block jam-small font-medium text-[hsl(var(--color-jam-neutral-700))] mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="lead-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--color-jam-neutral-300))] text-[hsl(var(--color-jam-neutral-900))] jam-focus-ring"
                  placeholder="Any specific requirements or questions..."
                  data-test-id="lead-notes-input"
                />
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className={`mt-0.5 w-5 h-5 rounded border ${
                      errors.consent ? 'border-red-500' : 'border-[hsl(var(--color-jam-neutral-300))]'
                    } text-[hsl(var(--color-jam-primary))] jam-focus-ring`}
                    data-test-id="lead-consent-checkbox"
                  />
                  <span className="jam-small text-[hsl(var(--color-jam-neutral-700))]">
                    I agree to be contacted by Jain Automart and accept the{' '}
                    <a href="/terms" className="text-[hsl(var(--color-jam-primary))] hover:underline">
                      Terms & Conditions
                    </a>
                  </span>
                </label>
                {errors.consent && <p className="jam-tiny text-red-500 mt-1">{errors.consent}</p>}
              </div>

              <button
                type="submit"
                className="w-full jam-btn-primary py-4"
                data-test-id="lead-submit-btn"
              >
                Submit Request
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 text-[hsl(var(--color-jam-primary))] mx-auto mb-6" />
              <h3 className="jam-h3 text-[hsl(var(--color-jam-neutral-900))] mb-4">
                Request Submitted Successfully!
              </h3>
              <p className="jam-body text-[hsl(var(--color-jam-neutral-700))] mb-8">
                Thank you for your interest. Our team will contact you shortly via phone or WhatsApp.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/918800123456?text=Hi, I just submitted a request for ${formData.interest}. My name is ${formData.name}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 jam-focus-ring"
                  data-test-id="lead-success-whatsapp"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
                <button
                  onClick={handleReset}
                  className="jam-btn-outline"
                  data-test-id="lead-success-close"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
