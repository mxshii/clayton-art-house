import { SiteSettings } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          venueName: data.venue_name,
          tagline: data.tagline,
          addressLine1: data.address_line_1,
          city: data.city,
          country: data.country,
          phone: data.phone,
          email: data.email,
          instagram: data.instagram,
          facebook: data.facebook,
          openingHours: data.opening_hours,
          bookingLeadHours: data.booking_lead_hours,
          cancellationPolicy: data.cancellation_policy,
          updatedAt: data.updated_at
        };
      }
    }
    return localStore.getSettings();
  },

  async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    if (isSupabaseConfigured() && supabase) {
      const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (updates.venueName) dbUpdates.venue_name = updates.venueName;
      if (updates.tagline) dbUpdates.tagline = updates.tagline;
      if (updates.addressLine1) dbUpdates.address_line_1 = updates.addressLine1;
      if (updates.city) dbUpdates.city = updates.city;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.instagram) dbUpdates.instagram = updates.instagram;
      if (updates.facebook !== undefined) dbUpdates.facebook = updates.facebook;
      if (updates.openingHours) dbUpdates.opening_hours = updates.openingHours;
      if (updates.cancellationPolicy) dbUpdates.cancellation_policy = updates.cancellationPolicy;

      const current = await this.getSettings();
      await supabase.from('site_settings').update(dbUpdates).eq('id', current.id);
    }
    return localStore.updateSettings(updates);
  }
};
