import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F3EF] selection:bg-[#577057] selection:text-white">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
