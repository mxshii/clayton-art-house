import React from 'react';
import { Link } from 'react-router-dom';
import { Workshop } from '../../types';
import { formatEGP, formatDuration } from '../../utils/formatters';
import { Clock } from 'lucide-react';

interface WorkshopCardProps {
  workshop: Workshop;
  remainingSeats?: number | null;
  className?: string;
  showButton?: boolean;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({
  workshop,
  remainingSeats,
  className = '',
  showButton = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center text-center w-full max-w-[360px] mx-auto group transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* Clayton Signature Arched Alcove Image */}
      <Link
        to={`/workshops/${workshop.slug}`}
        className="w-full aspect-[4/5] border-[2px] lg:border-[3px] border-[#577057] rounded-t-[150px] lg:rounded-t-[200px] overflow-hidden bg-stone-100 mb-5 block relative shadow-sm"
        aria-label={`View ${workshop.title} workshop details`}
      >
        <img
          src={workshop.coverImage}
          alt={workshop.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Live seat availability indicator badge */}
        {remainingSeats !== undefined && remainingSeats !== null && remainingSeats > 0 && (
          <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#577057] shadow-sm">
            {remainingSeats} seat{remainingSeats === 1 ? '' : 's'} left
          </span>
        )}
      </Link>

      {/* Card Metadata & Information */}
      <div className="space-y-1.5 w-full flex flex-col items-center">
        {/* Category label */}
        <span className="text-xs uppercase tracking-wider font-bold text-[#DFA363] block">
          {workshop.category}
        </span>

        {/* Workshop Title */}
        <Link to={`/workshops/${workshop.slug}`} className="block w-full">
          <h3 className="font-montserrat text-stone-900 text-xl lg:text-2xl font-bold hover:text-[#577057] transition-colors leading-snug line-clamp-1">
            {workshop.title}
          </h3>
        </Link>

        {/* Short scannable description */}
        <p className="font-montserrat text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed px-2 min-h-[2.5rem]">
          {workshop.shortDescription || 'Hands-on creative workshop at Clayton with all studio tools and materials included.'}
        </p>

        {/* Price & Duration */}
        <div className="flex items-center justify-center gap-3 pt-2 text-sm font-montserrat">
          <span className="font-bold text-[#577057] text-base">
            {formatEGP(workshop.priceEgp)}
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500 text-xs font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#DFA363]" />
            {formatDuration(workshop.durationMinutes)}
          </span>
        </div>

        {/* Booking CTA Button */}
        {showButton && (
          <div className="pt-3 w-full sm:w-auto">
            <Link
              to={`/workshops/${workshop.slug}`}
              className="btn-clayton-green !py-2.5 !px-6 text-xs font-semibold w-full sm:w-auto inline-block"
            >
              Book Workshop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
