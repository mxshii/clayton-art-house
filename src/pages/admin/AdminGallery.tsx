import React, { useEffect, useState } from 'react';
import { GalleryImage, GalleryCategory } from '../../types';
import { galleryService } from '../../services/galleryService';
import { Plus, Trash2, Image, Sparkles, X } from 'lucide-react';

const CATEGORIES: GalleryCategory[] = [
  'Pottery',
  'Painting',
  'Garden & Villa',
  'Sensory & Tea',
  'Private Events'
];

export const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('Pottery');
  const [imageUrl, setImageUrl] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getGalleryImages();
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    try {
      await galleryService.addGalleryImage({
        title,
        category,
        imageUrl,
        aspectRatio: 'square',
        isFeatured: false,
        sortOrder: images.length + 1
      });
      setModalOpen(false);
      setTitle('');
      setImageUrl('');
      load();
    } catch (err: any) {
      alert(`Error adding photo: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this image from the gallery?')) {
      await galleryService.deleteGalleryImage(id);
      load();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
            Gallery Management
          </h1>
          <p className="text-xs text-clayton-charcoal-muted mt-1">
            Curate photo portfolio displayed on the public website and homepage.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs !py-2.5 !px-4 gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl aspect-square border border-clayton-border" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-clayton-border max-w-md mx-auto">
          <Image className="w-8 h-8 text-clayton-charcoal-light mx-auto mb-2" />
          <p className="text-sm text-clayton-charcoal-muted">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="group bg-white rounded-2xl border border-clayton-border overflow-hidden shadow-warm-sm flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-clayton-sand overflow-hidden">
                <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="badge-tag bg-white/95 text-clayton-charcoal shadow-sm">
                    {img.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white shadow-sm transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-clayton-charcoal truncate">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-clayton-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-clayton-border shadow-warm-xl space-y-5 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-clayton-charcoal-muted hover:text-clayton-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-clayton-charcoal">
                Add Photo
              </h2>
              <p className="text-xs text-clayton-charcoal-muted mt-0.5">
                Upload image URL and specify category.
              </p>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Photo Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Afternoon Glaze Studio"
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="input-clayton text-xs"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/assets/clayton/studio/..."
                  className="input-clayton text-xs"
                />
              </div>

              <div className="pt-4 border-t border-clayton-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs !py-2 !px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs !py-2 !px-5">
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
