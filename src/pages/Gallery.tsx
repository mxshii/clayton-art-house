import React, { useEffect, useState } from 'react';
import { GalleryImage, GalleryCategory } from '../types';
import { galleryService } from '../services/galleryService';
import { X } from 'lucide-react';

const CATEGORIES: (GalleryCategory | 'All')[] = [
  'All',
  'Pottery',
  'Painting',
  'Garden & Villa',
  'Sensory & Tea',
  'Private Events'
];

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'All'>('All');
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await galleryService.getGalleryImages();
        setImages(data);
      } catch (err) {
        console.error('Gallery fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = images.filter(
    (img) => selectedCategory === 'All' || img.category === selectedCategory
  );

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-[#F6F3EF] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        {/* Simple, clear header */}
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="font-courgette text-2xl sm:text-3xl text-[#DFA363] block">
            Studio gallery
          </span>
          <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold text-[#577057] tracking-tight">
            Inside the Clayton Studio
          </h1>
          <p className="font-montserrat text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
            A visual journal of finished attendee creations, ceramic firings, and daily atelier moments in Kafr Abdo.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-stone-200 scrollbar-none font-montserrat">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold transition-all border rounded-full shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#577057] text-white border-[#577057] shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-[#577057] hover:text-[#577057]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-[#F4EFE6] aspect-[4/5] animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#E8E2D6] rounded-xl max-w-md mx-auto p-8 shadow-sm">
            <p className="font-montserrat text-lg font-semibold text-[#28231F]">No photos found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <article
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="group flex flex-col bg-white border border-[#E8E2D6] rounded-xl overflow-hidden shadow-sm hover:border-[#577057]/40 transition-colors duration-200 cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[4/5] bg-[#F4EFE6]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-montserrat text-lg font-medium text-[#28231F]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C544D] mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-[#28231F]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-xl border border-[#E8E2D6] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-[#28231F] flex items-center justify-center shadow-md hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-[#F4EFE6] overflow-hidden">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#577057]">
                {activeImage.category}
              </span>
              <h3 className="font-montserrat text-2xl font-semibold text-[#28231F] mt-1">
                {activeImage.title}
              </h3>
              {activeImage.caption && (
                <p className="text-sm text-[#5C544D] mt-2">
                  {activeImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
