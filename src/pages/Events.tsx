import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { inquiryService } from '../services/inquiryService';
import { PrivateEventType } from '../types';
import {
  Calendar,
  Users,
  Check,
  Send,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const RAABTA_IMAGES = [
  '/assets/clayton/events/d0e97474-5e5b-4df7-8b28-3e4415e191ab-01KZYYZ3Z22V0BF8KFP94C95ST.webp',
  '/assets/clayton/events/a22c4c9c-34a6-482e-8bd6-8657b1abdef0-01M0TJRW4A98C8K3HN75KC7SN8.webp',
  '/assets/clayton/events/930e14ac-1361-4c12-a1be-115f5c091932-01KZYYZ5XCYT7E4X7C467R8SQ5.webp',
  '/assets/clayton/events/c92ebff7-90ff-4e7d-a193-4a6406981882-01KZYYZ6Y11CRZ0CSG423D197N.webp',
  '/assets/clayton/events/92e8cf78-5945-4f1b-bb8b-dcd790b3362b-01KZYYZ84VTFHNTQZW4JW1NPSQ.webp',
  '/assets/clayton/events/8d99042c-0e78-433b-8d07-cbf65e493e87-01M0TJSD211475A1A8Z3C92J6V.webp'
];

const EVENT_TYPES: PrivateEventType[] = [
  'Private Workshop',
  'Birthday Celebration',
  'Corporate Retreat',
  'Bridal Gathering',
  'Photo / Film Shoot',
  'Custom Experience'
];

export const Events: React.FC = () => {
  const [activeRaabtaImg, setActiveRaabtaImg] = useState(0);

  // Inquiry state
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
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#F6F3EF] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-2">
          <span className="font-courgette text-2xl sm:text-3xl text-[#DFA363] block">
            Our events
          </span>
          <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold text-[#577057] tracking-tight">
            Events & Special Collaborations
          </h1>
          <p className="font-montserrat text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
            From our annual Red Sea residency at Raabta Wellness Festival in El Gouna to private celebrations and corporate ateliers in Kafr Abdo.
          </p>
        </div>

        {/* ========================================================= */}
        {/* EVENT 1: Raabta Wellness Festival (El Gouna 2023 & 2024) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual: Clayton Arched Frame with Image Carousel */}
            <div className="lg:col-span-6 flex flex-col items-center gap-4">
              <div className="w-full max-w-[420px] aspect-[4/5] border-[3px] border-[#577057] rounded-t-[180px] lg:rounded-t-[220px] overflow-hidden shadow-sm bg-stone-100 relative">
                <img
                  src={RAABTA_IMAGES[activeRaabtaImg]}
                  alt="Clayton at Raabta Wellness Festival"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 max-w-full">
                {RAABTA_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveRaabtaImg(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeRaabtaImg === idx ? 'border-[#577057] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Narrative & Details */}
            <div className="lg:col-span-6 space-y-6 font-montserrat">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#DFA363] block mb-1">
                  Official Partnership · El Gouna, Egypt
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#577057] tracking-tight">
                  Raabta Wellness Festival
                </h2>
                <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#577057]" /> 2023 & 2024 Partner
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#577057]" /> El Gouna, Red Sea
                  </span>
                </div>
              </div>

              <div className="text-sm sm:text-base text-stone-600 space-y-3 leading-relaxed">
                <p>
                  Raabta Wellness Festival is an annual three-day event held in El Gouna that serves as a collective reset for mind and soul.
                </p>
                <p>
                  Clayton became a loved part of this experience over the last two years, attending in both <strong>2023 and 2024</strong> to host continuous open-air pottery throwing, hand-sculpting, and expressive painting stations right by the water.
                </p>
                <p>
                  These sessions gave festival attendees a chance to slow down, feel natural raw clay on the wheel, and leave with a handmade piece of art.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="#inquiry-form"
                  className="btn-clayton-green w-full sm:w-auto text-center"
                >
                  Collaborate With Us!
                </a>
                <Link
                  to="/workshops"
                  className="btn-clayton-outline w-full sm:w-auto text-center"
                >
                  View Our Workshops
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* EVENT 2: Community Painting Sessions & Pop-ups */}
        {/* ========================================================= */}
        <div className="bg-[#E5D2C2] rounded-3xl p-8 sm:p-12 border border-white/60 shadow-sm mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrative */}
            <div className="lg:col-span-6 space-y-6 font-montserrat order-2 lg:order-1">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#577057] block mb-1">
                  Community Pop-ups & Gatherings
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
                  Painting Workshops & Creative Circles
                </h2>
              </div>

              <div className="text-sm sm:text-base text-stone-700 space-y-3 leading-relaxed">
                <p>
                  Welcome to our painting workshops, where creative exploration has no limits. Hosted both in our Kafr Abdo garden courtyard and at pop-up spaces across Alexandria.
                </p>
                <p>
                  Whether you are picking up a brush for the first time or returning to a forgotten passion, our guided sessions explore acrylic texturing, color theory, and expressive freestyle painting with all artist materials included.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/workshops/painting"
                  className="btn-clayton-green !py-3 !px-7 text-xs font-semibold"
                >
                  Book a Painting Session (240 EGP)
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
              <div className="w-full max-w-[420px] aspect-[4/5] border-[3px] border-[#577057] rounded-t-[180px] lg:rounded-t-[220px] overflow-hidden shadow-sm bg-white">
                <img
                  src="/assets/clayton/events/a22c4c9c-34a6-482e-8bd6-8657b1abdef0-01M0TJRW4A98C8K3HN75KC7SN8.webp"
                  alt="Clayton Painting Workshop Gathering"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* EVENT 3: Private Gathering & Atelier Inquiry Form */}
        {/* ========================================================= */}
        <div id="inquiry-form" className="clayton-card-diagonal-lg p-8 sm:p-14 border border-stone-200">
          <div className="max-w-2xl mb-10 space-y-2 font-montserrat">
            <span className="font-courgette text-2xl text-[#DFA363] block">
              Host your gathering
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#577057] tracking-tight">
              Plan a Private Event at Clayton
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Book our villa ateliers or garden courtyard exclusively for your group. Ideal for birthdays, team building, bridal circles, and customized creative masterclasses.
            </p>
          </div>

          {submitted ? (
            <div className="p-10 text-center bg-[#f9f8f6] rounded-2xl border border-stone-200 space-y-4 max-w-lg mx-auto">
              <CheckCircle2 className="w-12 h-12 text-[#577057] mx-auto" />
              <h3 className="font-montserrat font-bold text-2xl text-stone-900">Inquiry Received</h3>
              <p className="font-montserrat text-stone-600 text-sm leading-relaxed">
                Thank you! Our studio coordinator will review your preferred date and reach out directly with availability and customized pricing.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-clayton-outline text-xs !py-2.5 !px-5"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-montserrat max-w-3xl">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                  {error}
                </div>
              )}

              {/* Event Type */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                  Event Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EVENT_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setEventType(t)}
                      className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        eventType === t
                          ? 'bg-[#577057] text-white border-[#577057] shadow-sm'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-[#577057]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Estimated Guests ({guestCount})
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="50"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                    className="w-full mt-3 accent-[#577057]"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+20 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Tell us about your event / specific requests
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Birthday pottery workshop for 12 friends with cake and tea..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-clayton-green !py-3.5 !px-8 text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Inquiry...' : 'Submit Event Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
