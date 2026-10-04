import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, Section, SectionHeader } from '../common/LayoutPrimitives';
import { ArrowRight } from 'lucide-react';

export const HomeEventsPreview: React.FC = () => {
  return (
    <Section bg="canvas" spacing="default">
      <PageContainer>
        {/* Section Header */}
        <SectionHeader
          eyebrow="Our events"
          title="Gatherings & Festival Pop-ups"
          description="Clayton hosts hands-on creative pop-ups across Egypt — from our residency at the Raabta Wellness Festival in El Gouna to atelier events in Kafr Abdo."
          theme="green"
          action={
            <Link
              to="/events"
              className="btn-clayton-green !py-2.5 !px-6 text-xs font-semibold shrink-0 flex items-center gap-2"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {/* Clayton Signature Arched Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 justify-items-center">
          {/* Card 1: Raabta Wellness Festival */}
          <Link
            to="/events"
            className="flex flex-col items-center text-center w-full max-w-[400px] hover:scale-[1.02] transition-transform duration-300 group"
          >
            <div className="w-full aspect-[4/5] border-[2px] lg:border-[3px] border-[#577057] rounded-t-[160px] lg:rounded-t-[200px] overflow-hidden bg-transparent mb-5 shadow-sm">
              <img
                src="/assets/clayton/events/d0e97474-5e5b-4df7-8b28-3e4415e191ab-01KZYYZ3Z22V0BF8KFP94C95ST.webp"
                alt="Raabta Wellness Festival El Gouna with Clayton"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#DFA363] mb-1">
              Annual Festival · El Gouna (2023 & 2024)
            </span>
            <h3 className="font-montserrat text-[#577057] text-2xl lg:text-3xl font-bold mb-2 group-hover:text-[#425141] transition-colors">
              Raabta Wellness Festival
            </h3>
            <p className="font-montserrat text-stone-600 text-sm lg:text-base font-normal leading-relaxed max-w-sm">
              A 3-day open-air collective reset where Clayton hosted continuous pottery throwing and ceramic shaping stations on the Red Sea.
            </p>
          </Link>

          {/* Card 2: Community Painting Sessions */}
          <Link
            to="/workshops/painting"
            className="flex flex-col items-center text-center w-full max-w-[400px] hover:scale-[1.02] transition-transform duration-300 group"
          >
            <div className="w-full aspect-[4/5] border-[2px] lg:border-[3px] border-[#577057] rounded-t-[160px] lg:rounded-t-[200px] overflow-hidden bg-transparent mb-5 shadow-sm">
              <img
                src="/assets/clayton/events/a22c4c9c-34a6-482e-8bd6-8657b1abdef0-01M0TJRW4A98C8K3HN75KC7SN8.webp"
                alt="Clayton Painting Workshop and Pop-up"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#DFA363] mb-1">
              Studio & Pop-up Sessions
            </span>
            <h3 className="font-montserrat text-[#577057] text-2xl lg:text-3xl font-bold mb-2 group-hover:text-[#425141] transition-colors">
              Painting & Mixed Media
            </h3>
            <p className="font-montserrat text-stone-600 text-sm lg:text-base font-normal leading-relaxed max-w-sm">
              Guided canvas sessions with acrylic textures, color theory, and full creative freedom in our quiet Kafr Abdo garden spaces.
            </p>
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
};
