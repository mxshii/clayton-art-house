import React from 'react';
import { Hero } from '../components/home/Hero';
import { HomeEventsPreview } from '../components/home/HomeEventsPreview';
import { HomeStudioIntro } from '../components/home/HomeStudioIntro';
import { FeaturedWorkshops } from '../components/home/FeaturedWorkshops';
import { HomeReviews } from '../components/home/HomeReviews';
import { LocationSection } from '../components/home/LocationSection';
import { ClaytonDivider } from '../components/common/ClaytonDivider';

export const Home: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[#F6F3EF]">
      {/* 1. Official Clayton Hero Banner with Editorial Typography */}
      <Hero />

      {/* 2. Special Events & Festival Pop-ups (Raabta Festival & Painting) */}
      <HomeEventsPreview />

      {/* Scalloped Divider into Clayton Sand */}
      <ClaytonDivider variant="white-to-sand" />

      {/* 3. The Clayton Studio Experience (Kafr Abdo Villa) */}
      <HomeStudioIntro />

      {/* Scalloped Divider back to White */}
      <ClaytonDivider variant="sand-to-white" />

      {/* 4. Featured Workshops in Signature Clayton Arched Masonry Frames */}
      <FeaturedWorkshops />

      {/* Scalloped Divider into Clayton Sand */}
      <ClaytonDivider variant="white-to-sand" />

      {/* 5. Words from Our Community (Asymmetrical Diagonal Cards) */}
      <HomeReviews />

      {/* Scalloped Divider into Canvas */}
      <ClaytonDivider variant="sand-to-canvas" />

      {/* 6. Kafr Abdo Studio Location & Contact */}
      <LocationSection />
    </div>
  );
};
