import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, Section } from '../common/LayoutPrimitives';
import { HeartHandshake, Palette, Coffee, ArrowRight } from 'lucide-react';

export const HomeStudioIntro: React.FC = () => {
  return (
    <Section bg="sand" spacing="default">
      <PageContainer>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Authentic Studio Framing with diagonal rounded corners */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-clayton-card border-2 border-white/80">
              <img
                src="/assets/clayton/studio/e089d58a-a4ea-4c92-a1b4-7d52683e9b17-01M0YMVC6BCEH94W99K841T5T0.webp"
                alt="Clayton Art House Studio Interior in Kafr Abdo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-[#577057] shadow-sm">
                📍 Kafr Abdo, Alexandria
              </div>
            </div>
          </div>

          {/* Right: Direct Editorial Identity */}
          <div className="w-full lg:w-1/2 flex flex-col items-start gap-6 font-montserrat">
            <div>
              <span className="font-courgette text-2xl sm:text-3xl text-[#577057] block mb-1">
                About our space
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
                A Quiet Sanctuary for Hands-on Art
              </h2>
            </div>

            <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
              Nestled inside a historic villa in Kafr Abdo, Clayton Art House was born to give Alexandria a warm space to slow down, explore ceramics, and create something tangible with their hands.
            </p>

            {/* 3 Core Experience Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2">
              <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl border border-white/70 shadow-sm">
                <HeartHandshake className="w-5 h-5 text-[#577057] mb-2" />
                <h4 className="font-bold text-sm text-stone-900">Patient Guidance</h4>
                <p className="text-xs text-stone-600 mt-1">Beginner-friendly mentors with you at every step.</p>
              </div>

              <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl border border-white/70 shadow-sm">
                <Palette className="w-5 h-5 text-[#577057] mb-2" />
                <h4 className="font-bold text-sm text-stone-900">All Included</h4>
                <p className="text-xs text-stone-600 mt-1">Natural clays, glazes, paints, and tools covered.</p>
              </div>

              <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl border border-white/70 shadow-sm">
                <Coffee className="w-5 h-5 text-[#577057] mb-2" />
                <h4 className="font-bold text-sm text-stone-900">Garden Calm</h4>
                <p className="text-xs text-stone-600 mt-1">Relaxed atmosphere with tea & coffee provided.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link to="/about" className="btn-clayton-green !py-3 !px-7 text-xs font-semibold">
                Read Our Full Story
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#577057] hover:text-[#425141] transition-colors"
              >
                <span>View Studio Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
};
