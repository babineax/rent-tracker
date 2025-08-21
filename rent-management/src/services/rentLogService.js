import { supabase } from '../supabaseClient.js';

export const rentLogService = {
  // Generate rent logs for a specific month/year
  async generateRentLogs(month, year, force = false) {
    try {
      const response = await fetch('/api/rent-logs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, year, force }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate rent logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating rent logs:', error);
      throw error;
    }
  },

  // Get rent logs with optional filters
  async getRentLogs(filters = {}) {
    try {
      let query = supabase
        .from('rent_logs')
        .select('*, leases(*, units(*, properties(*)), tenants(*))')
        .order('period_year', { ascending: false })
        .order('period_month', { ascending: false });

      // Apply filters
      if (filters.leaseId) query = query.eq('lease_id', filters.leaseId);
      if (filters.tenantId) query = query.eq('tenant_id', filters.tenantId);
      if (filters.propertyId) query = query.eq('property_id', filters.propertyId);
      if (filters.month) query = query.eq('period_month', filters.month);
      if (filters.year) query = query.eq('period_year', filters.year);
      if (filters.paymentStatus) query = query.eq('payment_status', filters.paymentStatus);

      const { data, error } = await query;
      
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching rent logs:', error);
      return { data: [], error: error.message };
    }
  },

  // Get rent log by ID
  async getRentLogById(logId) {
    try {
      if (!logId) throw new Error('Rent log ID is required');

      const { data, error } = await supabase
        .from('rent_logs')
        .select('*, leases(*, units(*, properties(*)), tenants(*))')
        .eq('id', logId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching rent log:', error);
      return { data: null, error: error.message };
    }
  },

  // Update rent log payment status
  async updatePaymentStatus(logId, paymentData) {
    try {
      if (!logId) throw new Error('Rent log ID is required');

      const updateData = {
        ...paymentData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('rent_logs')
        .update(updateData)
        .eq('id', logId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating rent log:', error);
      return { data: null, error: error.message };
    }
  },

  // Get rent log statistics
  async getRentLogStats(filters = {}) {
    try {
      let query = supabase
        .from('rent_logs')
        .select('payment_status, amount_due, amount_paid, balance');

      if (filters.month) query = query.eq('period_month', filters.month);
      if (filters.year) query = query.eq('period_year', filters.year);
      if (filters.propertyId) query = query.eq('property_id', filters.propertyId);

      const { data, error } = await query;
      
      if (error) throw error;

      const stats = {
        totalLogs: data.length,
        pending: data.filter(log => log.payment_status === 'pending').length,
        paid: data.filter(log => log.payment_status === 'paid').length,
        overdue: data.filter(log => log.payment_status === 'overdue').length,
        totalDue: data.reduce((sum, log) => sum + (log.amount_due || 0), 0),
        totalPaid: data.reduce((sum, log) => sum + (log.amount_paid || 0), 0),
        averageRent: data.length > 0 ? Math.round(data.reduce((sum, log) => sum + (log.amount_due || 0), 0) / data.length) : 0
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching rent log stats:', error);
      return { data: null, error: error.message };
    }
  }
};
