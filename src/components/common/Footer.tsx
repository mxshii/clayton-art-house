import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { InstagramIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#F6F3EF] overflow-hidden pt-20 pb-8 px-6 lg:px-24 border-t border-[#E8E0DC]">
      {/* Background Clayton Organic SVG Shapes */}
      <div className="absolute right-0 top-0 w-72 lg:w-96 opacity-40 pointer-events-none z-0">
        <svg width="406" height="244" viewBox="0 0 406 244" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M116.44 16.53C130.95 15.92 149.52 20.97 168.28 24.48C185.88 27.85 203.68 30.76 221.67 26.32C241.2 17.91 258.42 8.27 268.47 5.06C299.84 -1.32 349.91 7.2 392.07 46.51C405.998 66.25 408.71 87.97 403.48 110C395.55 144.11 374.47 173.33 347.2 199.95C306.39 233 249.52 246.92 197.87 232.08C161.12 211.73 123.21 198.27 70.6 180.06C37.91 162.62 12.38 140.6 2.52 109.23C-1.68 95.49 5.59 67.79 37.33 34.73C59.38 22.19 84.14 16.84 116.44 16.53Z"
            fill="#eae9e5"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/">
              <img
                src="/assets/clayton/logo/Clayton Art House Logo.png"
                alt="Clayton Art House"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="font-montserrat text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xs mt-2">
              A serene creative venue in Kafr Abdo, Alexandria for hands-on ceramics, canvas painting, and private gatherings.
            </p>
            <span className="text-xs font-semibold text-[#577057]">
              Legal Entity: كلايتون
            </span>
          </div>

          {/* About Column */}
          <div className="flex flex-col gap-3 font-montserrat">
            <h3 className="text-base font-bold text-[#425141] mb-1">About Clayton</h3>
            <Link to="/about" className="text-stone-600 text-sm font-medium hover:text-[#DFA363] transition">
              Our Journey & Story
            </Link>
            <Link to="/contact" className="text-stone-600 text-sm font-medium hover:text-[#DFA363] transition">
              Location & Hours
            </Link>
            <Link to="/private-events" className="text-stone-600 text-sm font-medium hover:text-[#DFA363] transition">
              Private Events & Gatherings
            </Link>
          </div>

          {/* Gallery & Offerings Column */}
          <div className="flex flex-col gap-3 font-montserrat">
            <h3 className="text-base font-bold text-[#425141] mb-1">Creative Offerings</h3>
            <Link to="/workshops" className="text-stone-600 text-sm font-medium hover:text-[#DFA363] transition">
              All 17 Workshops
            </Link>
            <Link to="/gallery" className="text-stone-600 text-sm font-medium hover:text-[#DFA363] transition">
              Studio & Artwork Gallery
            </Link>
            <Link to="/events" className="text-stone-600 text-sm font-medium hover:text-[#DFA363] transition">
              Raabta Festival & Events
            </Link>
          </div>

          {/* Contact Us Column */}
          <div className="flex flex-col gap-3.5 font-montserrat">
            <h3 className="text-base font-bold text-[#425141] mb-1">Contact Us</h3>

            <div className="flex items-center gap-3 text-stone-700 text-sm font-medium">
              <Phone className="w-4 h-4 text-[#577057] shrink-0" />
              <div className="flex flex-col">
                <a href="tel:042780500" className="hover:text-[#577057]">042780500 (Landline)</a>
                <a href="tel:+201023456789" className="text-xs text-stone-500 hover:text-[#577057]">+20 102 345 6789 (Mobile)</a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-stone-700 text-sm font-medium">
              <Mail className="w-4 h-4 text-[#577057] shrink-0" />
              <a href="mailto:hello@claytonarthouse.com" className="hover:text-[#577057]">
                hello@claytonarthouse.com
              </a>
            </div>

            <div className="flex items-center gap-3 text-stone-700 text-sm font-medium">
              <MapPin className="w-4 h-4 text-[#577057] shrink-0" />
              <span>14 Rue Ahmed Zulfikar, Kafr Abdo, Alexandria</span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#425141] rounded-lg flex items-center justify-center text-white hover:bg-[#DFA363] transition"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#425141] rounded-lg flex items-center justify-center text-white font-bold text-xs hover:bg-[#DFA363] transition"
                aria-label="Facebook"
              >
                FB
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-300 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-montserrat text-stone-600">
          <p className="text-center md:text-left">
            Copyright © 2026 Clayton Art House | Legal Entity: كلايتون
          </p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-[#577057] transition">Privacy & Studio Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#577057] transition">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
