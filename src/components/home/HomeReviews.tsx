import React from 'react';
import { PageContainer, Section } from '../common/LayoutPrimitives';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    quote: 'Bgd kan experience to7fa w the place is very nice! It brings out the creativity in you with so many options and something I never expected to find in Alex.',
    author: 'Mariam S.',
    workshop: 'Pottery Session',
    rating: 5,
  },
  {
    quote: 'Aside from the usual cafes, restaurants, and food places I was trying to find something different and new to do, and I found Clayton. Calm atmosphere and great mentors.',
    author: 'Youssef T.',
    workshop: 'Hand Building Ceramics',
    rating: 5,
  },
  {
    quote: 'I visited Clayton Art House for a pottery session with my friends and it was such a wonderful experience. The instructors were very friendly, patient, and welcoming.',
    author: 'Dina K.',
    workshop: 'Candle & Painting Workshop',
    rating: 5,
  },
];

export const HomeReviews: React.FC = () => {
  return (
    <Section bg="sand" spacing="default">
      <PageContainer>
        <div className="flex flex-col items-center gap-12">
          {/* Section Header */}
          <div className="text-center max-w-xl">
            <span className="font-courgette text-2xl sm:text-3xl text-[#577057] block mb-1">
              Testimonials
            </span>
            <h2 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
              Words from Our Community
            </h2>
            <p className="font-montserrat text-stone-700 text-sm sm:text-base mt-2 font-normal">
              Real impressions from people who spent their weekends shaping clay and painting in Kafr Abdo.
            </p>
          </div>

          {/* Clayton Diagonal Asymmetrical Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="clayton-card-diagonal p-8 flex flex-col justify-between gap-6 border border-white/80"
              >
                <div className="space-y-4">
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-[#DFA363]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#DFA363]" />
                    ))}
                  </div>

                  <p className="font-montserrat text-stone-700 text-sm sm:text-base leading-relaxed italic">
                    "{rev.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-montserrat font-bold text-sm text-stone-900">{rev.author}</h4>
                    <span className="text-xs text-[#577057] font-semibold">{rev.workshop}</span>
                  </div>
                  <Quote className="w-6 h-6 text-[#577057]/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
};
