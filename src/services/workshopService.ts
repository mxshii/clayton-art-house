import { Workshop } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';

export const workshopService = {
  async getWorkshops(onlyPublished: boolean = true): Promise<Workshop[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('workshops')
        .select('*')
        .order('sort_order', { ascending: true });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Supabase workshops fetch error, falling back to local store:', error.message);
        return localStore.getWorkshops().filter(w => !onlyPublished || w.isPublished);
      }
      return (data || []).map(row => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        shortDescription: row.short_description,
        description: row.description,
        priceEgp: Number(row.price_egp),
        durationMinutes: row.duration_minutes,
        capacityPerSession: row.capacity_per_session,
        difficulty: row.difficulty,
        whatIsIncluded: row.what_is_included || [],
        requirements: row.requirements,
        coverImage: row.cover_image,
        isPublished: row.is_published,
        isFeatured: row.is_featured,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    }

    const workshops = localStore.getWorkshops();
    return onlyPublished ? workshops.filter(w => w.isPublished) : workshops;
  },

  async getWorkshopBySlugOrId(identifier: string): Promise<Workshop | null> {
    if (isSupabaseConfigured() && supabase) {
      const isUuid = /^[0-9a-fA-F-]{36}$/.test(identifier);
      const query = supabase
        .from('workshops')
        .select('*')
        .eq(isUuid ? 'id' : 'slug', identifier)
        .maybeSingle();

      const { data, error } = await query;
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          slug: data.slug,
          category: data.category,
          shortDescription: data.short_description,
          description: data.description,
          priceEgp: Number(data.price_egp),
          durationMinutes: data.duration_minutes,
          capacityPerSession: data.capacity_per_session,
          difficulty: data.difficulty,
          whatIsIncluded: data.what_is_included || [],
          requirements: data.requirements,
          coverImage: data.cover_image,
          isPublished: data.is_published,
          isFeatured: data.is_featured,
          sortOrder: data.sort_order,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
    }

    return localStore.getWorkshopById(identifier) || null;
  },

  async createWorkshop(data: Omit<Workshop, 'id' | 'createdAt' | 'slug'>): Promise<Workshop> {
    if (isSupabaseConfigured() && supabase) {
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
      const { data: inserted, error } = await supabase
        .from('workshops')
        .insert([{
          title: data.title,
          slug,
          category: data.category,
          short_description: data.shortDescription,
          description: data.description,
          price_egp: data.priceEgp,
          duration_minutes: data.durationMinutes,
          capacity_per_session: data.capacityPerSession,
          difficulty: data.difficulty,
          what_is_included: data.whatIsIncluded,
          requirements: data.requirements,
          cover_image: data.coverImage,
          is_published: data.isPublished,
          is_featured: data.isFeatured,
          sort_order: data.sortOrder
        }])
        .select()
        .single();

      if (!error && inserted) {
        return {
          id: inserted.id,
          title: inserted.title,
          slug: inserted.slug,
          category: inserted.category,
          shortDescription: inserted.short_description,
          description: inserted.description,
          priceEgp: Number(inserted.price_egp),
          durationMinutes: inserted.duration_minutes,
          capacityPerSession: inserted.capacity_per_session,
          difficulty: inserted.difficulty,
          whatIsIncluded: inserted.what_is_included || [],
          requirements: inserted.requirements,
          coverImage: inserted.cover_image,
          isPublished: inserted.is_published,
          isFeatured: inserted.is_featured,
          sortOrder: inserted.sort_order,
          createdAt: inserted.created_at
        };
      }
    }

    return localStore.createWorkshop(data);
  },

  async updateWorkshop(id: string, updates: Partial<Workshop>): Promise<Workshop> {
    if (isSupabaseConfigured() && supabase) {
      const dbUpdates: Record<string, any> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.priceEgp !== undefined) dbUpdates.price_egp = updates.priceEgp;
      if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;
      if (updates.capacityPerSession !== undefined) dbUpdates.capacity_per_session = updates.capacityPerSession;
      if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
      if (updates.whatIsIncluded !== undefined) dbUpdates.what_is_included = updates.whatIsIncluded;
      if (updates.requirements !== undefined) dbUpdates.requirements = updates.requirements;
      if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
      if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;
      if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
      if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

      const { data: updated, error } = await supabase
        .from('workshops')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (!error && updated) {
        return {
          id: updated.id,
          title: updated.title,
          slug: updated.slug,
          category: updated.category,
          shortDescription: updated.short_description,
          description: updated.description,
          priceEgp: Number(updated.price_egp),
          durationMinutes: updated.duration_minutes,
          capacityPerSession: updated.capacity_per_session,
          difficulty: updated.difficulty,
          whatIsIncluded: updated.what_is_included || [],
          requirements: updated.requirements,
          coverImage: updated.cover_image,
          isPublished: updated.is_published,
          isFeatured: updated.is_featured,
          sortOrder: updated.sort_order,
          createdAt: updated.created_at,
          updatedAt: updated.updated_at
        };
      }
    }

    return localStore.updateWorkshop(id, updates);
  },

  async deleteWorkshop(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('workshops').delete().eq('id', id);
    }
    localStore.deleteWorkshop(id);
  }
};
