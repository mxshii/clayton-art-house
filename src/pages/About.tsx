import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Coffee, ArrowRight, Flame } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#F6F3EF] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Simple Header */}
        <div className="max-w-3xl mb-16 space-y-2">
          <span className="font-courgette text-2xl sm:text-3xl text-[#DFA363] block">
            About Clayton
          </span>
          <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold text-[#577057] tracking-tight leading-tight">
            A Creative Sanctuary in Kafr Abdo, Alexandria
          </h1>
          <p className="font-montserrat text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
            Clayton Art House was established to offer Alexandria an authentic space to slow down, disconnect from screens, and craft lasting art with their own hands.
          </p>
        </div>

        {/* Narrative & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20 font-montserrat">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Inside Our Historic Villa & Studio
            </h2>
            <p className="text-base text-stone-600 leading-relaxed">
              Located on a peaceful street in Kafr Abdo, our venue houses dedicated ateliers for pottery wheel throwing, ceramic hand building, canvas painting, and botanical crafts. 
            </p>
            <p className="text-base text-stone-600 leading-relaxed">
              Sessions are deliberately kept intimate so you receive hands-on instruction from resident mentors, dedicated tools, and a tranquil atmosphere.
            </p>
            <div className="pt-2">
              <Link to="/workshops" className="btn-clayton-green gap-2">
                <span>View All 17 Workshops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="border border-[#E8E2D6] aspect-[4/3] bg-[#F4EFE6] rounded-2xl overflow-hidden shadow-sm">
              <img
                src="/assets/clayton/journey/eb0aecc9-e0d5-4d79-aaa6-0d18fb098662-01M0TF0X9NCGN7QEC2VHR0D1J7.webp"
                alt="Clayton Art House founders and community in Alexandria"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Studio Spaces */}
        <div className="space-y-8 mb-20">
          <div>
            <h2 className="font-montserrat text-2xl sm:text-3xl font-semibold text-[#28231F]">
              The Studios
            </h2>
            <p className="text-sm sm:text-base text-[#5C544D] mt-1 font-normal">
              Dedicated spaces designed for focus, creativity, and comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 bg-white border border-[#E8E2D6] rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F6F3EF] border border-[#E8E2D6] flex items-center justify-center text-[#577057]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-[#28231F]">Pottery & Wheel</h3>
              <p className="text-sm text-[#5C544D] leading-relaxed">
                Electric wheels and hand-building tables where you shape clay, trim vessels, and glaze pieces with resident guidance.
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-white border border-[#E8E2D6] rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F6F3EF] border border-[#E8E2D6] flex items-center justify-center text-[#577057]">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-[#28231F]">Painting & Canvas</h3>
              <p className="text-sm text-[#5C544D] leading-relaxed">
                Stretched canvases, acrylics, and palette knives for freestyle painting and guided masterclasses in natural daylight.
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-white border border-[#E8E2D6] rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F6F3EF] border border-[#E8E2D6] flex items-center justify-center text-[#577057]">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-[#28231F]">Garden & Crafts</h3>
              <p className="text-sm text-[#5C544D] leading-relaxed">
                A calm courtyard setting for candle pouring, macramé, suncatchers, and flower arranging with fresh refreshments.
              </p>
            </div>
          </div>
        </div>

        {/* Real Collaboration Highlight: Raabta Wellness Festival */}
        <div className="bg-white border border-[#E8E2D6] rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#577057] block">
                FESTIVALS & COMMUNITY
              </span>
              <h3 className="font-montserrat text-2xl sm:text-3xl font-semibold text-[#28231F]">
                Clayton at Raabta Wellness Festival (El Gouna)
              </h3>
              <p className="text-sm sm:text-base text-[#5C544D] leading-relaxed">
                Raabta Wellness Festival is an annual three-day gathering held in El Gouna as a collective reset for mind and soul. Clayton became a core partner across both 2023 and 2024, hosting hands-on outdoor pottery, hand-building, and expressive painting sessions that invited hundreds of festival attendees to slow down and create.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E8E2D6]">
                <img
                  src="/assets/clayton/events/a22c4c9c-34a6-482e-8bd6-8657b1abdef0-01M0TJRW4A98C8K3HN75KC7SN8.webp"
                  alt="Clayton hosting workshops at Raabta Wellness Festival"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
