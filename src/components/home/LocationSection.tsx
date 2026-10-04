import React, { useState } from 'react';
import { PageContainer, Section } from '../common/LayoutPrimitives';
import { MapPin, Clock, Phone, Mail, Navigation, Send, CheckCircle2 } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Section bg="canvas" spacing="default">
      <PageContainer>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Clayton Signature Olive Green Box (#577057) */}
          <div className="w-full lg:w-5/12 bg-[#577057] text-white p-8 sm:p-12 rounded-tr-3xl rounded-bl-3xl shadow-lg flex flex-col justify-between gap-8 relative overflow-hidden">
            {/* Subtle decorative background circle */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div>
                <span className="font-courgette text-2xl text-[#DFA363] block mb-1">
                  Visit our villa
                </span>
                <h2 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Find Us in Kafr Abdo
                </h2>
                <p className="font-montserrat text-white/85 text-sm sm:text-base mt-2 font-normal leading-relaxed">
                  Quiet villa setting in Kafr Abdo, Alexandria. Walk-ins are welcome to tour the studio; workshops require booking.
                </p>
              </div>

              <div className="space-y-4 pt-2 font-montserrat">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#DFA363] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Studio Address</h4>
                    <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                      14 Rue Ahmed Zulfikar, Kafr Abdo, Alexandria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#DFA363] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Opening Hours</h4>
                    <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                      Tuesday – Sunday: 10:00 AM – 10:00 PM
                    </p>
                    <p className="text-white/60 text-xs">Mondays: Studio Closed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#DFA363] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Direct Phones</h4>
                    <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                      <a href="tel:042780500" className="hover:underline">042780500</a> (Landline) ·{' '}
                      <a href="tel:+201023456789" className="hover:underline">+20 102 345 6789</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#DFA363] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Email</h4>
                    <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                      hello@claytonarthouse.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4">
              <a
                href="https://maps.google.com/?q=Kafr+Abdo+Alexandria+Egypt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#DFA363] hover:bg-[#c98e4e] text-white font-montserrat font-semibold text-xs rounded-full shadow-md transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clayton Asymmetric Card with Quick Contact Form */}
          <div className="w-full lg:w-7/12 clayton-card-diagonal-lg p-8 sm:p-12 border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="font-courgette text-2xl text-[#DFA363] block mb-1">
                Contact us
              </span>
              <h3 className="font-montserrat text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Have a Question or Private Event Request?
              </h3>
              <p className="font-montserrat text-stone-600 text-xs sm:text-sm mt-1 mb-6">
                Our studio team is always happy to listen and assist with inquiries.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-[#f9f8f6] rounded-2xl border border-stone-200 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#577057] mx-auto" />
                  <h4 className="font-montserrat font-bold text-lg text-stone-900">Message Received</h4>
                  <p className="font-montserrat text-stone-600 text-sm">
                    Thank you! Our studio team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-montserrat">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+20 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Your Message *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us what workshop or event you are interested in..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[#f9f8f6] border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#577057]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-clayton-green !py-3 !px-8 text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
};
