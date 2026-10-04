import React, { useState } from 'react';
import { PrivateEventType } from '../types';
import { inquiryService } from '../services/inquiryService';
import {
  Calendar,
  Users,
  Check,
  Send,
  Building,
  Cake,
  HeartHandshake
} from 'lucide-react';

const EVENT_TYPES: PrivateEventType[] = [
  'Private Workshop',
  'Birthday Celebration',
  'Corporate Retreat',
  'Bridal Gathering',
  'Photo / Film Shoot',
  'Custom Experience'
];

export const PrivateEvents: React.FC = () => {
  const [eventType, setEventType] = useState<PrivateEventType>('Private Workshop');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(10);
  const [budgetRange, setBudgetRange] = useState<string>('8,000 - 15,000 EGP');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!preferredDate) {
      setError('Please select a preferred date for your event.');
      return;
    }

    try {
      setSubmitting(true);
      await inquiryService.submitInquiry({
        eventType,
        preferredDate,
        guestCount,
        budgetRange,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        notes: notes.trim() || undefined
      });
      setSubmitted(true);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again or call us.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#F6F3EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#577057] block">
            PRIVATE EVENTS
          </span>
          <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#28231F] tracking-tight">
            Private Events at Clayton
          </h1>
          <p className="text-base text-[#5C544D] font-normal leading-relaxed">
            Host birthdays, team gatherings, or custom workshops in our Kafr Abdo villa and garden.
          </p>
        </div>

        {/* 3 Formats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          <div className="bg-white p-6 sm:p-8 border border-[#E8E2D6] space-y-3 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F6F3EF] border border-[#E8E2D6] flex items-center justify-center text-[#577057]">
              <Cake className="w-5 h-5" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-[#28231F]">Birthdays & Celebrations</h3>
            <p className="text-sm text-[#5C544D] leading-relaxed">
              Celebrate by molding pottery or painting together, followed by cake in our garden courtyard.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 border border-[#E8E2D6] space-y-3 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F6F3EF] border border-[#E8E2D6] flex items-center justify-center text-[#577057]">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-[#28231F]">Team Events & Offsites</h3>
            <p className="text-sm text-[#5C544D] leading-relaxed">
              Step away from screens and connect over a relaxed, hands-on workshop led by our artists.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 border border-[#E8E2D6] space-y-3 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F6F3EF] border border-[#E8E2D6] flex items-center justify-center text-[#577057]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-montserrat text-xl font-semibold text-[#28231F]">Private Gatherings</h3>
            <p className="text-sm text-[#5C544D] leading-relaxed">
              Bridal showers, family reunions, and photo shoots tailored completely to your schedule.
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 border border-[#E8E2D6] rounded-xl shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto rounded-full">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="font-montserrat text-2xl font-semibold text-[#28231F]">Inquiry Received</h2>
              <p className="text-sm text-[#5C544D] max-w-md mx-auto">
                Thank you! We will check availability for {preferredDate} and get in touch within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-clayton-outline text-xs mt-4"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="font-montserrat text-2xl font-semibold text-[#28231F]">
                  Request a Private Event
                </h2>
                <p className="text-sm text-[#5C544D] mt-1">
                  Tell us about your event and we will get back to you with options and pricing.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
                  {error}
                </div>
              )}

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-[#28231F] mb-2">
                  Event Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EVENT_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setEventType(type)}
                      className={`p-2.5 text-xs text-center border rounded-lg transition-colors ${
                        eventType === type
                          ? 'border-[#577057] bg-[#F6F3EF] text-[#577057] font-semibold'
                          : 'border-[#E8E2D6] text-[#5C544D] hover:border-[#577057]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#28231F] mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="input-editorial text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#28231F] mb-1.5">
                    Expected Number of Guests
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={40}
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="input-editorial text-sm"
                  />
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-[#28231F] mb-1.5">
                  Approximate Budget
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="input-editorial text-sm"
                >
                  <option value="5,000 - 8,000 EGP">5,000 – 8,000 EGP</option>
                  <option value="8,000 - 15,000 EGP">8,000 – 15,000 EGP</option>
                  <option value="15,000 - 25,000 EGP">15,000 – 25,000 EGP</option>
                  <option value="25,000+ EGP">25,000+ EGP (Full Studio Buyout)</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#28231F] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-editorial text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#28231F] mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="010..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-editorial text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#28231F] mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-editorial text-sm"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#28231F] mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your event, timing preferences, or questions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-editorial text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-clayton-green w-full text-center"
              >
                {submitting ? 'Submitting...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
