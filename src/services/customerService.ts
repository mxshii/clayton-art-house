import { Customer } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/localStore';

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          fullName: row.full_name,
          email: row.email,
          phone: row.phone,
          notes: row.notes,
          totalBookings: row.total_bookings,
          totalSpentEgp: Number(row.total_spent_egp),
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
      }
    }
    return localStore.getCustomers();
  },

  async updateCustomerNotes(id: string, notes: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('customers')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', id);
    }
    const customers = localStore.getCustomers();
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      customer.notes = notes;
      customer.updatedAt = new Date().toISOString();
      localStore.saveCustomers(customers);
    }
  }
};
