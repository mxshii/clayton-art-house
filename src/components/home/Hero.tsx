import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="w-full min-h-[85vh] lg:min-h-[620px] relative z-20 bg-[#172F17] flex justify-center items-center overflow-hidden">
      {/* Background Banners: Responsive Desktop and Mobile Real Assets */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img
          className="w-full h-full object-cover absolute left-0 top-0 hidden lg:block"
          src="/assets/clayton/general/b3107333-6cd6-4317-99ed-acf91838aa35-01M0TJV5Q5RH98TXKP2HJ5W8B7.webp"
          alt="Clayton Art House Studio Banner"
          loading="eager"
        />
        <img
          className="w-full h-full object-cover absolute left-0 top-0 block lg:hidden"
          src="/assets/clayton/general/f8b47015-bbf2-4664-af69-31dce200daec-01M0TJV6P7HCSP48G67DNYV4E1.webp"
          alt="Clayton Art House Studio Mobile"
          loading="eager"
        />

        {/* Clayton Signature Organic Atmospheric Gradient */}
        <div className="absolute inset-0 w-full h-full">
          <svg
            width="1440"
            height="620"
            viewBox="0 0 1440 620"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path d="M1440 0H0V620H1440V0Z" fill="url(#paint0_linear_hero)" fillOpacity="0.75" />
            <defs>
              <linearGradient
                id="paint0_linear_hero"
                x1="1414"
                y1="55"
                x2="169.927"
                y2="489.668"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#DFA363" stopOpacity="0.45" />
                <stop offset="0.485577" stopColor="#CE9781" stopOpacity="0.35" />
                <stop offset="1" stopColor="#172F17" stopOpacity="0.85" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Decorative Clayton Botanical SVG Corner Accent */}
        <div className="absolute top-0 left-0 w-28 lg:w-44 z-10 opacity-70 pointer-events-none">
          <svg width="120" height="100" viewBox="0 0 88 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M52.35 73.84C41.82 73.84 32.35 66.18 22.63 49.65C17.45 60.77 10.56 70.69 -0.05 70.69C-8.19 68.61 -14.87 59.89 -12.11 36.42C-42.32 38.68 -48.15 25.37 -45.8 9.97C-31.71 -8.9 -37.22 -20.19 -28.94 -37.75C-16.24 -39.39 0.2 -30.6 5.79 -55.03C17.37 -61 29.76 -55.76 36.8 -37.21C55.76 -51.81 72.6 -51.81 72.6 -51.81"
              stroke="#DFA363"
              strokeWidth="2"
              strokeOpacity="0.4"
            />
          </svg>
        </div>
      </div>

      {/* Hero Content — Editorial Typographic Hierarchy */}
      <div className="w-full max-w-[1440px] px-6 lg:px-[135px] relative z-30 flex flex-col justify-center items-center text-center lg:items-start lg:text-left pt-36 pb-24 sm:pt-40 sm:pb-28">
        <div className="flex flex-col items-center lg:items-start max-w-2xl">
          {/* Cursive flourish */}
          <span className="font-courgette text-3xl sm:text-4xl lg:text-5xl text-[#DFA363] drop-shadow-sm mb-1 block">
            Welcome to
          </span>

          {/* Master title */}
          <h1 className="font-montserrat text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-3">
            Clayton Art House
          </h1>

          {/* Architectural tagline */}
          <p className="font-montserrat text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F6F3EF] uppercase mb-4">
            YOUR FAVORITE PLACE OF ART
          </p>

          {/* Clean scannable description */}
          <p className="font-montserrat text-base sm:text-lg text-white/90 font-normal leading-relaxed mb-8 max-w-lg">
            A tranquil creative studio in historic Kafr Abdo, Alexandria. Reserve pottery wheel workshops, painting sessions, and craft experiences.
          </p>

          {/* Clayton Pill Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
            <Link
              to="/book"
              className="btn-clayton-green !py-3.5 !px-8 text-base shadow-clayton-btn flex items-center justify-center gap-2"
            >
              <span>Book a Workshop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/workshops"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white/15 backdrop-blur-md border border-white/30 text-white font-montserrat font-semibold text-sm rounded-full hover:bg-white/25 transition-all shadow-sm"
            >
              <span>Explore All Workshops</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
