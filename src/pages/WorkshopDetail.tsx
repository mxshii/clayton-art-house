import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Workshop, Session } from '../types';
import { workshopService } from '../services/workshopService';
import { sessionService } from '../services/sessionService';
import { formatEGP, formatDuration, formatSessionDate, formatTimeRange } from '../utils/formatters';
import {
  Clock,
  Users,
  Check,
  Calendar,
  ArrowLeft,
  Share2,
  MapPin,
  Info
} from 'lucide-react';

export const WorkshopDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const w = await workshopService.getWorkshopBySlugOrId(slug);
        if (w) {
          setWorkshop(w);
          const s = await sessionService.getSessions(w.id);
          const futureSessions = s
            .filter((sess) => sess.status !== 'cancelled' && new Date(sess.startTime) > new Date())
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
          setSessions(futureSessions);
        }
      } catch (err) {
        console.error('Error fetching workshop detail:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-[#E8E2D6] w-48 rounded" />
          <div className="h-96 bg-[#F4EFE6] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="pt-40 pb-28 text-center max-w-md mx-auto px-4">
        <h2 className="font-montserrat text-3xl font-semibold text-[#28231F]">Workshop Not Found</h2>
        <p className="text-[#5C544D] mt-2 font-normal">
          The requested workshop could not be found.
        </p>
        <Link to="/workshops" className="btn-clayton-green mt-6 inline-block">
          View All Workshops
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#F6F3EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E2D6] text-sm">
          <Link
            to="/workshops"
            className="inline-flex items-center gap-2 text-[#5C544D] hover:text-[#28231F] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Workshops</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C544D] hover:text-[#28231F] bg-white px-3.5 py-1.5 border border-[#E8E2D6] transition-colors rounded-lg shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16 items-start font-montserrat">
          {/* Main Visual: Signature Clayton Arched Alcove */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[440px] aspect-[4/5] bg-stone-100 rounded-t-[180px] lg:rounded-t-[240px] border-[3px] border-[#577057] overflow-hidden shadow-sm">
              <img
                src={workshop.coverImage}
                alt={workshop.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quick Info & Price Box */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DFA363] block">
                {workshop.category}
              </span>
              <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold text-[#577057] leading-tight tracking-tight">
                {workshop.title}
              </h1>
              <p className="text-base text-stone-600 leading-relaxed font-normal">
                {workshop.shortDescription}
              </p>
            </div>

            {/* Price & Details Box with Asymmetric Diagonal Corners */}
            <div className="clayton-card-diagonal p-6 sm:p-8 border border-stone-200 shadow-clayton-card space-y-5">
              <div className="flex items-baseline justify-between pb-4 border-b border-stone-100">
                <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Price per Seat</span>
                <span className="font-montserrat text-3xl font-extrabold text-[#577057]">
                  {formatEGP(workshop.priceEgp)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#DFA363]" />
                  <span>{formatDuration(workshop.durationMinutes)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#577057]" />
                  <span>Max {workshop.capacityPerSession} guests</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 text-xs text-stone-500">
                  <MapPin className="w-4 h-4 text-[#577057] shrink-0" />
                  <span>14 Rue Ahmed Zulfikar, Kafr Abdo, Alexandria</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#sessions-list"
                  className="btn-clayton-green w-full text-center block text-sm py-3"
                >
                  View Available Dates & Times
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections: Description, Inclusions, and Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Description & Inclusions */}
          <div className="lg:col-span-7 space-y-8">
            {/* Description */}
            <div className="bg-white p-8 border border-[#E8E2D6] rounded-xl shadow-sm space-y-4">
              <h2 className="font-montserrat text-2xl font-semibold text-[#28231F]">About This Workshop</h2>
              <div className="text-sm sm:text-base text-[#5C544D] leading-relaxed space-y-3 whitespace-pre-line font-normal">
                {workshop.description}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white p-8 border border-[#E8E2D6] rounded-xl shadow-sm space-y-4">
              <h3 className="font-montserrat text-2xl font-semibold text-[#28231F]">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {workshop.whatIsIncluded.map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-sm text-[#5C544D]">
                    <Check className="w-4 h-4 text-[#577057] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {workshop.requirements && (
              <div className="bg-[#F6F3EF] p-6 border border-[#E8E2D6] rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#28231F] uppercase tracking-wider">
                  <Info className="w-4 h-4 text-[#577057]" />
                  <span>Good to Know</span>
                </div>
                <p className="text-sm text-[#5C544D] leading-relaxed">
                  {workshop.requirements}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Sessions List */}
          <div className="lg:col-span-5" id="sessions-list">
            <div className="bg-white p-6 sm:p-8 border border-[#E8E2D6] rounded-xl shadow-sm space-y-6 sticky top-28">
              <div className="border-b border-[#E8E2D6] pb-4">
                <h3 className="font-montserrat text-2xl font-semibold text-[#28231F]">
                  Available Sessions
                </h3>
                <p className="text-xs sm:text-sm text-[#5C544D] mt-1 font-normal">
                  Select a session to book your spot.
                </p>
              </div>

              {sessions.length === 0 ? (
                <div className="py-8 text-center space-y-3 bg-[#F6F3EF] p-6 border border-[#E8E2D6] rounded-xl">
                  <Calendar className="w-8 h-8 text-[#8C8277] mx-auto opacity-50" />
                  <p className="font-montserrat text-base text-[#28231F] font-semibold">
                    No upcoming sessions scheduled right now.
                  </p>
                  <p className="text-xs text-[#5C544D]">
                    New dates are added weekly. Get in touch for custom dates.
                  </p>
                  <Link to="/contact" className="btn-clayton-outline text-xs !py-2 !px-4 inline-block mt-2">
                    Contact Studio
                  </Link>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
                  {sessions.map((sess) => {
                    const remainingSeats = sess.capacity - sess.bookedSeats;
                    const isFull = sess.status === 'full' || remainingSeats <= 0;

                    return (
                      <div
                        key={sess.id}
                        className={`p-4 border transition-colors rounded-xl ${
                          isFull
                            ? 'bg-[#F4EFE6]/60 border-[#E8E2D6] opacity-60'
                            : 'bg-white border-[#E8E2D6] hover:border-[#577057]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="font-montserrat text-base text-[#28231F] font-semibold">
                              {formatSessionDate(sess.startTime)}
                            </p>
                            <p className="text-xs text-[#5C544D] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#577057]" />
                              <span>{formatTimeRange(sess.startTime, sess.endTime)}</span>
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            {isFull ? (
                              <span className="text-xs px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded font-medium">
                                Full
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium">
                                {remainingSeats} left
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#E8E2D6] flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#28231F]">
                            {formatEGP(workshop.priceEgp)}
                          </span>

                          {isFull ? (
                            <span className="text-xs text-[#8C8277] font-medium">
                              Sold Out
                            </span>
                          ) : (
                            <Link
                              to={`/book?sessionId=${sess.id}`}
                              className="btn-clayton-green text-xs !py-1.5 !px-4"
                            >
                              Book Now
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
