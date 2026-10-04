import { GalleryImage } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';

export const galleryService = {
  async getGalleryImages(): Promise<GalleryImage[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data) {
        return data.map(row => ({
          id: row.id,
          title: row.title,
          category: row.category,
          imageUrl: row.image_url,
          aspectRatio: row.aspect_ratio,
          isFeatured: row.is_featured,
          sortOrder: row.sort_order,
          createdAt: row.created_at
        }));
      }
    }
    return localStore.getGallery();
  },

  async addGalleryImage(data: Omit<GalleryImage, 'id' | 'createdAt'>): Promise<GalleryImage> {
    if (isSupabaseConfigured() && supabase) {
      const { data: inserted, error } = await supabase
        .from('gallery_images')
        .insert([{
          title: data.title,
          category: data.category,
          image_url: data.imageUrl,
          aspect_ratio: data.aspectRatio || 'square',
          is_featured: data.isFeatured,
          sort_order: data.sortOrder
        }])
        .select()
        .single();

      if (!error && inserted) {
        return {
          id: inserted.id,
          title: inserted.title,
          category: inserted.category,
          imageUrl: inserted.image_url,
          aspectRatio: inserted.aspect_ratio,
          isFeatured: inserted.is_featured,
          sortOrder: inserted.sort_order,
          createdAt: inserted.created_at
        };
      }
    }
    return localStore.createGalleryImage(data);
  },

  async deleteGalleryImage(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('gallery_images').delete().eq('id', id);
    }
    localStore.deleteGalleryImage(id);
  }
};
