import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Workshop, Session } from '../../types';
import { workshopService } from '../../services/workshopService';
import { sessionService } from '../../services/sessionService';
import { WorkshopCard } from '../common/WorkshopCard';
import { PageContainer, Section, SectionHeader } from '../common/LayoutPrimitives';
import { ArrowRight } from 'lucide-react';

export const FeaturedWorkshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [wList, sList] = await Promise.all([
          workshopService.getWorkshops(true),
          sessionService.getSessions()
        ]);
        setWorkshops(wList.filter((w) => w.isFeatured).slice(0, 6));
        setSessions(sList);
      } catch (err) {
        console.error('Failed to load featured workshops:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Section bg="white" spacing="default">
      <PageContainer>
        <SectionHeader
          eyebrow="Our workshops"
          title="Featured Creative Sessions"
          description="Step into the studio. All raw materials, tools, mentor instruction, and take-home artwork are included."
          theme="green"
          action={
            <Link
              to="/workshops"
              className="btn-clayton-green !py-2.5 !px-6 text-xs font-semibold shrink-0 flex items-center gap-2"
            >
              <span>View All 17 Workshops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col items-center gap-4 animate-pulse w-full max-w-[360px] mx-auto">
                <div className="w-full aspect-[4/5] bg-stone-100 rounded-t-[150px] lg:rounded-t-[200px] border-2 border-stone-200" />
                <div className="h-5 bg-stone-200 w-3/4 rounded" />
                <div className="h-4 bg-stone-100 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-16 bg-[#f9f8f6] rounded-2xl border border-stone-200">
            <p className="font-montserrat text-stone-600">No workshops available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 justify-items-center">
            {workshops.map((workshop) => {
              const nextSession = sessions
                .filter(
                  (s) => s.workshopId === workshop.id && s.status !== 'cancelled' && new Date(s.startTime) > new Date()
                )
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

              const remainingSeats = nextSession ? nextSession.capacity - nextSession.bookedSeats : null;

              return (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  remainingSeats={remainingSeats}
                />
              );
            })}
          </div>
        )}
      </PageContainer>
    </Section>
  );
};
