import { Session } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';

export const sessionService = {
  async getSessions(workshopId?: string): Promise<Session[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase
        .from('sessions')
        .select('*, workshops(*)')
        .order('start_time', { ascending: true });

      if (workshopId) {
        query = query.eq('workshop_id', workshopId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Supabase sessions error, fallback to local store:', error.message);
        return workshopId
          ? localStore.getSessionsByWorkshopId(workshopId)
          : localStore.getSessions();
      }

      return (data || []).map(row => ({
        id: row.id,
        workshopId: row.workshop_id,
        startTime: row.start_time,
        endTime: row.end_time,
        capacity: row.capacity,
        bookedSeats: row.booked_seats,
        status: row.status,
        instructorName: row.instructor_name,
        roomOrSpace: row.room_or_space,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        workshop: row.workshops ? {
          id: row.workshops.id,
          title: row.workshops.title,
          slug: row.workshops.slug,
          category: row.workshops.category,
          shortDescription: row.workshops.short_description,
          description: row.workshops.description,
          priceEgp: Number(row.workshops.price_egp),
          durationMinutes: row.workshops.duration_minutes,
          capacityPerSession: row.workshops.capacity_per_session,
          difficulty: row.workshops.difficulty,
          whatIsIncluded: row.workshops.what_is_included || [],
          coverImage: row.workshops.cover_image,
          isPublished: row.workshops.is_published,
          isFeatured: row.workshops.is_featured,
          sortOrder: row.workshops.sort_order,
          createdAt: row.workshops.created_at
        } : undefined
      }));
    }

    const sessions = workshopId
      ? localStore.getSessionsByWorkshopId(workshopId)
      : localStore.getSessions();

    const workshops = localStore.getWorkshops();
    return sessions.map(s => ({
      ...s,
      workshop: workshops.find(w => w.id === s.workshopId)
    }));
  },

  async getSessionById(id: string): Promise<Session | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('sessions')
        .select('*, workshops(*)')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          workshopId: data.workshop_id,
          startTime: data.start_time,
          endTime: data.end_time,
          capacity: data.capacity,
          bookedSeats: data.booked_seats,
          status: data.status,
          instructorName: data.instructor_name,
          roomOrSpace: data.room_or_space,
          notes: data.notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          workshop: data.workshops ? {
            id: data.workshops.id,
            title: data.workshops.title,
            slug: data.workshops.slug,
            category: data.workshops.category,
            shortDescription: data.workshops.short_description,
            description: data.workshops.description,
            priceEgp: Number(data.workshops.price_egp),
            durationMinutes: data.workshops.duration_minutes,
            capacityPerSession: data.workshops.capacity_per_session,
            difficulty: data.workshops.difficulty,
            whatIsIncluded: data.workshops.what_is_included || [],
            coverImage: data.workshops.cover_image,
            isPublished: data.workshops.is_published,
            isFeatured: data.workshops.is_featured,
            sortOrder: data.workshops.sort_order,
            createdAt: data.workshops.created_at
          } : undefined
        };
      }
    }

    const session = localStore.getSessionById(id);
    if (!session) return null;
    const workshop = localStore.getWorkshopById(session.workshopId);
    return { ...session, workshop };
  },

  async createSession(data: Omit<Session, 'id' | 'bookedSeats' | 'status' | 'createdAt'>): Promise<Session> {
    if (isSupabaseConfigured() && supabase) {
      const { data: inserted, error } = await supabase
        .from('sessions')
        .insert([{
          workshop_id: data.workshopId,
          start_time: data.startTime,
          end_time: data.endTime,
          capacity: data.capacity,
          booked_seats: 0,
          status: 'scheduled',
          instructor_name: data.instructorName,
          room_or_space: data.roomOrSpace || 'Main Studio',
          notes: data.notes
        }])
        .select('*, workshops(*)')
        .single();

      if (!error && inserted) {
        return {
          id: inserted.id,
          workshopId: inserted.workshop_id,
          startTime: inserted.start_time,
          endTime: inserted.end_time,
          capacity: inserted.capacity,
          bookedSeats: inserted.booked_seats,
          status: inserted.status,
          instructorName: inserted.instructor_name,
          roomOrSpace: inserted.room_or_space,
          notes: inserted.notes,
          createdAt: inserted.created_at
        };
      }
    }

    return localStore.createSession(data);
  },

  async updateSession(id: string, updates: Partial<Session>): Promise<Session> {
    if (isSupabaseConfigured() && supabase) {
      const dbUpdates: Record<string, any> = {};
      if (updates.startTime) dbUpdates.start_time = updates.startTime;
      if (updates.endTime) dbUpdates.end_time = updates.endTime;
      if (updates.capacity !== undefined) dbUpdates.capacity = updates.capacity;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.instructorName !== undefined) dbUpdates.instructor_name = updates.instructorName;
      if (updates.roomOrSpace !== undefined) dbUpdates.room_or_space = updates.roomOrSpace;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { data: updated, error } = await supabase
        .from('sessions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (!error && updated) {
        return {
          id: updated.id,
          workshopId: updated.workshop_id,
          startTime: updated.start_time,
          endTime: updated.end_time,
          capacity: updated.capacity,
          bookedSeats: updated.booked_seats,
          status: updated.status,
          instructorName: updated.instructor_name,
          roomOrSpace: updated.room_or_space,
          notes: updated.notes,
          createdAt: updated.created_at,
          updatedAt: updated.updated_at
        };
      }
    }

    return localStore.updateSession(id, updates);
  },

  async deleteSession(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('sessions').delete().eq('id', id);
    }
    localStore.deleteSession(id);
  }
};
