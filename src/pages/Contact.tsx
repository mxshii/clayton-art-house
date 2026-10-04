import React, { useState } from 'react';
import { PageContainer } from '../components/common/LayoutPrimitives';
import { MapPin, Phone, Mail, Clock, Check, Navigation, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#F6F3EF] min-h-screen">
      <PageContainer>
        {/* Simple Header */}
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="font-courgette text-2xl sm:text-3xl text-[#DFA363] block">
            Contact us
          </span>
          <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold text-[#577057] tracking-tight">
            Contact & Studio Location
          </h1>
          <p className="font-montserrat text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
            Have questions about workshops, private bookings, or visiting us in Kafr Abdo? We are always happy to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start font-montserrat">
          {/* Left Column: Contact Info Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="clayton-card-diagonal p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#577057] pb-3 border-b border-stone-100">
                Kafr Abdo Studio
              </h2>

              <div className="space-y-4 text-sm text-stone-700">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#577057] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-stone-900">Address</h3>
                    <p className="text-stone-600 mt-0.5">
                      14 Rue Ahmed Zulfikar, Kafr Abdo, Alexandria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#577057] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-stone-900">Opening Hours</h3>
                    <p className="text-stone-600 mt-0.5">
                      Tuesday – Sunday: 10:00 AM – 10:00 PM<br />
                      Mondays: Closed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#577057] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-stone-900">Direct Phones</h3>
                    <p className="text-[#577057] font-semibold mt-0.5 space-x-2">
                      <a href="tel:042780500" className="hover:underline">042780500</a>
                      <span className="text-stone-300">·</span>
                      <a href="tel:+201023456789" className="hover:underline">+20 102 345 6789</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#577057] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-stone-900">Email</h3>
                    <a href="mailto:hello@claytonarthouse.com" className="text-[#577057] font-semibold hover:underline mt-0.5 block">
                      hello@claytonarthouse.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <a
                  href="https://maps.google.com/?q=Kafr+Abdo+Alexandria+Egypt"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-clayton-outline w-full text-center flex items-center justify-center gap-2 text-xs"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="clayton-card-diagonal p-8 sm:p-10 border border-stone-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-[#577057] border border-emerald-200 flex items-center justify-center mx-auto rounded-full">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900">Message Received</h2>
                  <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Clayton Art House. Our studio team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-clayton-outline text-xs mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900">
                      Send Us a Message
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      We usually reply within a few hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="010..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-editorial text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email Address *
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

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can our studio team assist you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="input-editorial text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-clayton-green w-full text-center flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
