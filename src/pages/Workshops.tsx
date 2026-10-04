import React, { useEffect, useState } from 'react';
import { Workshop, Session, WorkshopCategory } from '../types';
import { workshopService } from '../services/workshopService';
import { sessionService } from '../services/sessionService';
import { WorkshopCard } from '../components/common/WorkshopCard';
import { PageContainer } from '../components/common/LayoutPrimitives';
import { Search } from 'lucide-react';

const CATEGORIES: (WorkshopCategory | 'All')[] = [
  'All',
  'Pottery & Ceramics',
  'Painting & Drawing',
  'Candle Craft',
  'Fiber & Textiles',
  'Jewelry & Craft',
  'Floral & Botanical',
  'Cake Decorating',
  'Leather & Bookbinding',
  'Arts & Crafts',
];

export const Workshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<WorkshopCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [wList, sList] = await Promise.all([
          workshopService.getWorkshops(true),
          sessionService.getSessions()
        ]);
        setWorkshops(wList);
        setSessions(sList);
      } catch (err) {
        console.error('Error fetching workshops:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredWorkshops = workshops.filter((w) => {
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#F6F3EF] min-h-screen">
      <PageContainer>
        {/* Section Header */}
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="font-courgette text-2xl sm:text-3xl text-[#DFA363] block">
            Our workshops
          </span>
          <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold text-[#577057] tracking-tight">
            Creative Workshops at Clayton
          </h1>
          <p className="font-montserrat text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
            All 17 hands-on sessions hosted in our Kafr Abdo villa. Raw materials, specialized tools, and mentor guidance are completely covered.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-14 pb-6 border-b border-stone-200 space-y-4 font-montserrat">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by workshop name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-full text-sm text-stone-800 focus:outline-none focus:border-[#577057] shadow-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold transition-all rounded-full shrink-0 border ${
                    selectedCategory === cat
                      ? 'bg-[#577057] text-white border-[#577057] shadow-sm'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-[#577057] hover:text-[#577057]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workshop Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 justify-items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4 animate-pulse w-full max-w-[360px]">
                <div className="w-full aspect-[4/5] bg-stone-200 rounded-t-[150px] lg:rounded-t-[200px] border-2 border-stone-300" />
                <div className="h-5 bg-stone-200 w-3/4 rounded" />
                <div className="h-4 bg-stone-100 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : filteredWorkshops.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 max-w-md mx-auto space-y-3 shadow-sm">
            <h3 className="font-montserrat text-xl font-bold text-stone-900">No workshops match your search</h3>
            <p className="font-montserrat text-xs text-stone-500">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="btn-clayton-green text-xs !py-2 !px-5 mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 justify-items-center">
            {filteredWorkshops.map((workshop) => {
              const nextSession = sessions
                .filter(
                  (s) => s.workshopId === workshop.id && s.status !== 'cancelled' && new Date(s.startTime) > new Date()
                )
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

              const remainingSeats = nextSession ? (nextSession.capacity - nextSession.bookedSeats) : null;

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
    </div>
  );
};
