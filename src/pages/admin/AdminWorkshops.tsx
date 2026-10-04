import React, { useEffect, useState } from 'react';
import { Workshop, WorkshopCategory } from '../../types';
import { workshopService } from '../../services/workshopService';
import { formatEGP, formatDuration } from '../../utils/formatters';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

const CATEGORIES: WorkshopCategory[] = [
  'Ceramics & Pottery',
  'Painting & Drawing',
  'Botanical & Flora',
  'Glass & Mosaic',
  'Textile & Fiber',
  'Culinary & Sensory',
  'Private & Seasonal'
];

export const AdminWorkshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkshopCategory>('Ceramics & Pottery');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [priceEgp, setPriceEgp] = useState<number>(750);
  const [duration, setDuration] = useState<number>(120);
  const [capacity, setCapacity] = useState<number>(10);
  const [difficulty, setDifficulty] = useState('All Levels');
  const [included, setIncluded] = useState('');
  const [requirements, setRequirements] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await workshopService.getWorkshops(false);
      setWorkshops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateModal = () => {
    setEditingWorkshop(null);
    setTitle('');
    setCategory('Ceramics & Pottery');
    setShortDesc('');
    setDesc('');
    setPriceEgp(750);
    setDuration(120);
    setCapacity(10);
    setDifficulty('All Levels');
    setIncluded('All workshop materials & specialized tools, mentor guidance');
    setRequirements('Wear comfortable clothes');
    setCoverImage('/assets/clayton/workshops/f02e4d00-ac2b-4cb4-91d1-5ec0d0f832e8-01M0YMGJ7DZM4VEP9B4WN7CFJ5.webp');
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (w: Workshop) => {
    setEditingWorkshop(w);
    setTitle(w.title);
    setCategory(w.category);
    setShortDesc(w.shortDescription);
    setDesc(w.description);
    setPriceEgp(w.priceEgp);
    setDuration(w.durationMinutes);
    setCapacity(w.capacityPerSession);
    setDifficulty(w.difficulty);
    setIncluded(w.whatIsIncluded.join(', '));
    setRequirements(w.requirements || '');
    setCoverImage(w.coverImage);
    setIsPublished(w.isPublished);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const inclusionsArray = included
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      if (editingWorkshop) {
        await workshopService.updateWorkshop(editingWorkshop.id, {
          title,
          category,
          shortDescription: shortDesc,
          description: desc,
          priceEgp: Number(priceEgp),
          durationMinutes: Number(duration),
          capacityPerSession: Number(capacity),
          difficulty,
          whatIsIncluded: inclusionsArray,
          requirements,
          coverImage,
          isPublished
        });
      } else {
        await workshopService.createWorkshop({
          title,
          category,
          shortDescription: shortDesc,
          description: desc,
          priceEgp: Number(priceEgp),
          durationMinutes: Number(duration),
          capacityPerSession: Number(capacity),
          difficulty,
          whatIsIncluded: inclusionsArray,
          requirements,
          coverImage,
          isPublished,
          isFeatured: false,
          sortOrder: workshops.length + 1
        });
      }

      setModalOpen(false);
      load();
    } catch (err: any) {
      alert(`Error saving workshop: ${err.message}`);
    }
  };

  const handleTogglePublish = async (w: Workshop) => {
    await workshopService.updateWorkshop(w.id, { isPublished: !w.isPublished });
    load();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workshop?')) {
      await workshopService.deleteWorkshop(id);
      load();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-clayton-charcoal">
            Workshop Management
          </h1>
          <p className="text-xs text-clayton-charcoal-muted mt-1">
            Create, edit prices, descriptions, and publish workshop offerings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary text-xs !py-2.5 !px-4 gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Workshop</span>
        </button>
      </div>

      {/* Grid of Workshops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-3xl border border-clayton-border overflow-hidden shadow-warm-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-clayton-sand">
                <img src={w.coverImage} alt={w.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="badge-tag bg-white/95 text-clayton-charcoal shadow-sm">
                    {w.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleTogglePublish(w)}
                    className={`p-1.5 rounded-full shadow-sm ${
                      w.isPublished
                        ? 'bg-clayton-olive-light text-clayton-olive'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    title={w.isPublished ? 'Published (tap to unpublish)' : 'Draft (tap to publish)'}
                  >
                    {w.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-clayton-charcoal">
                    {formatEGP(w.priceEgp)}
                  </span>
                  <span className="text-xs text-clayton-charcoal-muted">
                    {formatDuration(w.durationMinutes)}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-clayton-charcoal line-clamp-1">
                  {w.title}
                </h3>
                <p className="text-xs text-clayton-charcoal-muted line-clamp-2 leading-relaxed">
                  {w.shortDescription}
                </p>
              </div>
            </div>

            <div className="p-4 bg-clayton-linen/60 border-t border-clayton-border flex items-center justify-between">
              <span className="text-[11px] text-clayton-charcoal-muted">
                Cap: {w.capacityPerSession} guests
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(w)}
                  className="p-1.5 rounded-lg text-clayton-charcoal-muted hover:text-clayton-charcoal hover:bg-white"
                  title="Edit Workshop"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                  title="Delete Workshop"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workshop Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-clayton-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-clayton-border shadow-warm-xl my-8 space-y-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-clayton-charcoal-muted hover:text-clayton-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-clayton-charcoal">
                {editingWorkshop ? 'Edit Workshop' : 'Create New Workshop'}
              </h2>
              <p className="text-xs text-clayton-charcoal-muted mt-1">
                Configure curriculum title, category, pricing in EGP, and inclusions.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Workshop Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Difficulty Level
                  </label>
                  <input
                    type="text"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="input-clayton text-xs"
                    placeholder="All Levels"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                    Price (EGP) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={priceEgp}
                    onChange={(e) => setPriceEgp(Number(e.target.value))}
                    className="input-clayton text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min={30}
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="input-clayton text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                    Default Capacity *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="input-clayton text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Short Summary (Cards & Previews) *
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Full Editorial Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  What's Included (comma separated)
                </label>
                <input
                  type="text"
                  value={included}
                  onChange={(e) => setIncluded(e.target.value)}
                  placeholder="Stoneware clay, kiln firing, apron, specialty coffee"
                  className="input-clayton text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Requirements & Safety Notes
                </label>
                <input
                  type="text"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="input-clayton text-xs"
                  placeholder="Closed-toe shoes required, comfortable clothing"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-clayton-charcoal mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="input-clayton text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-clayton-green focus:ring-clayton-green"
                />
                <label htmlFor="publishedCheckbox" className="font-medium text-clayton-charcoal">
                  Publish workshop to public website
                </label>
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
                  Save Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
