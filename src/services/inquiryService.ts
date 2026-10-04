import { PrivateEventInquiry } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';
import { emailService } from './emailService';

export const inquiryService = {
  async submitInquiry(data: Omit<PrivateEventInquiry, 'id' | 'status' | 'createdAt'>): Promise<PrivateEventInquiry> {
    let result: PrivateEventInquiry;

    if (isSupabaseConfigured() && supabase) {
      const { data: inserted, error } = await supabase
        .from('private_event_inquiries')
        .insert([{
          event_type: data.eventType,
          preferred_date: data.preferredDate,
          guest_count: data.guestCount,
          budget_range: data.budgetRange,
          name: data.name,
          phone: data.phone,
          email: data.email,
          notes: data.notes
        }])
        .select()
        .single();

      if (!error && inserted) {
        result = {
          id: inserted.id,
          eventType: inserted.event_type,
          preferredDate: inserted.preferred_date,
          guestCount: inserted.guest_count,
          budgetRange: inserted.budget_range,
          name: inserted.name,
          phone: inserted.phone,
          email: inserted.email,
          notes: inserted.notes,
          status: inserted.status,
          createdAt: inserted.created_at
        };
      } else {
        result = localStore.createInquiry(data);
      }
    } else {
      result = localStore.createInquiry(data);
    }

    // Trigger admin alert
    emailService.sendAdminInquiryAlert({
      inquiryId: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      eventType: result.eventType,
      preferredDate: result.preferredDate,
      guestCount: result.guestCount,
      budgetRange: result.budgetRange,
      notes: result.notes
    });

    return result;
  },

  async getInquiries(): Promise<PrivateEventInquiry[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('private_event_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(row => ({
          id: row.id,
          eventType: row.event_type,
          preferredDate: row.preferred_date,
          guestCount: row.guest_count,
          budgetRange: row.budget_range,
          name: row.name,
          phone: row.phone,
          email: row.email,
          notes: row.notes,
          status: row.status,
          adminNotes: row.admin_notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
      }
    }

    return localStore.getInquiries();
  },

  async updateInquiryStatus(id: string, status: PrivateEventInquiry['status'], adminNotes?: string): Promise<PrivateEventInquiry> {
    if (isSupabaseConfigured() && supabase) {
      const updates: Record<string, any> = { status, updated_at: new Date().toISOString() };
      if (adminNotes !== undefined) updates.admin_notes = adminNotes;
      await supabase.from('private_event_inquiries').update(updates).eq('id', id);
    }
    return localStore.updateInquiryStatus(id, status, adminNotes);
  }
};
