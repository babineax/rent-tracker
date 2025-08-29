import { supabase } from '../supabaseClient.js';

// Finance service: rent roll and KPIs (monthly-only per Sprint 2 scope)

/**
 * Compute start and end date strings (YYYY-MM-DD) for a given month and year.
 */
const getMonthRange = (month, year) => {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  const toDateStr = (d) => d.toISOString().slice(0, 10);
  return { startDate: toDateStr(start), endDate: toDateStr(end) };
};

/**
 * Fetch leases that are active within the given month (overlap),
 * filtered by property or unit if provided. Monthly frequency only.
 * Returns enriched rows with unit, property, and tenant info.
 */
export const getRentRoll = async ({ propertyId = '', unitId = '', month, year }) => {
  try {
    if (!month || !year) {
      throw new Error('Both month and year are required');
    }

    const { startDate, endDate } = getMonthRange(Number(month), Number(year));

    // Base query: leases with joins, monthly frequency only, overlapping month
    let query = supabase
      .from('leases')
      .select(`
        *,
        units (
          id,
          unit_number,
          property_id,
          properties (
            id,
            name,
            address
          )
        ),
        tenants (
          id,
          name,
          email
        )
      `)
      .eq('rent_frequency', 'monthly')
      .lte('start_date', endDate)
      .gte('end_date', startDate)
      .order('created_at', { ascending: false });

    if (unitId) {
      query = query.eq('unit_id', unitId);
    }

    // Filter by property via joined units table. Supabase supports filtering joined foreign tables.
    if (propertyId) {
      query = query.eq('units.property_id', propertyId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data || []).map((lease) => {
      const unit = lease.units || {};
      const property = unit.properties || {};
      const tenant = lease.tenants || {};
      return {
        lease_id: lease.id,
        property_id: property.id || unit.property_id || null,
        property_name: property.name || '',
        unit_id: unit.id || null,
        unit_number: unit.unit_number || '',
        tenant_id: tenant.id || null,
        tenant_name: tenant.name || '',
        rent_amount: lease.rent_amount || 0,
        rent_currency: lease.rent_currency || 'KES',
        due_date: lease.due_date || 1,
        start_date: lease.start_date,
        end_date: lease.end_date,
        status: lease.status || 'active'
      };
    });

    return { data: rows, error: null };
  } catch (err) {
    console.error('Error fetching rent roll:', err);
    return { data: [], error: err.message };
  }
};

/**
 * Compute simple KPIs from rent roll: totals per currency and overall.
 * Received/arrears are placeholders until a payments table exists.
 */
export const getFinanceKpis = async (filters) => {
  try {
    // Prefer accurate KPIs from rent_logs for the selected month
    const { month, year, propertyId = '', unitId = '' } = filters;

    if (month && year) {
      let query = supabase
        .from('rent_logs')
        .select('amount_due, amount_paid, balance, rent_currency')
        .eq('period_month', Number(month))
        .eq('period_year', Number(year));

      if (unitId) query = query.eq('unit_id', unitId);
      if (propertyId) query = query.eq('property_id', propertyId);

      const { data: logs, error: logsErr } = await query;
      if (logsErr) throw logsErr;

      const totalsByCurrency = (logs || []).reduce((acc, row) => {
        const currency = row.rent_currency || 'KES';
        acc[currency] = (acc[currency] || 0) + Number(row.amount_due || 0);
        return acc;
      }, {});

      const totalExpected = (logs || []).reduce((s, r) => s + Number(r.amount_due || 0), 0);
      const totalReceived = (logs || []).reduce((s, r) => s + Number(r.amount_paid || 0), 0);
      const totalArrears = Math.max(0, totalExpected - totalReceived);
      const collectionRate = totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0;

      return {
        data: {
          totalsByCurrency,
          totalExpected,
          totalReceived,
          totalArrears,
          collectionRate
        },
        error: null
      };
    }

    // Fallback: compute simple totals from rent roll if no month/year
    const { data: rentRoll, error } = await getRentRoll(filters);
    if (error) throw new Error(error);

    const totalsByCurrency = rentRoll.reduce((acc, row) => {
      const currency = row.rent_currency || 'KES';
      acc[currency] = (acc[currency] || 0) + (row.rent_amount || 0);
      return acc;
    }, {});

    const totalExpected = Object.values(totalsByCurrency).reduce((s, v) => s + v, 0);

    return {
      data: {
        totalsByCurrency,
        totalExpected,
        totalReceived: 0,
        totalArrears: totalExpected,
        collectionRate: totalExpected > 0 ? 0 : 0
      },
      error: null
    };
  } catch (err) {
    console.error('Error computing finance KPIs:', err);
    return { data: null, error: err.message };
  }
};

/**
 * Build a list of {year, month} pairs for the last N months ending at filters.year/filters.month.
 */
const buildTrailingMonths = (endMonth, endYear, monthsBack) => {
  const result = [];
  let y = endYear;
  let m = endMonth;
  for (let i = 0; i < monthsBack; i++) {
    result.unshift({ year: y, month: m });
    m -= 1;
    if (m === 0) {
      m = 12;
      y -= 1;
    }
  }
  return result;
};

/**
 * Fetch rent_logs over the trailing months and aggregate a monthly series:
 * [{ label: 'Jan 2025', expected, received, collectionRate }]
 */
export const getMonthlyCollectionsSeries = async (filters, monthsBack = 6) => {
  try {
    const endMonth = Number(filters.month);
    const endYear = Number(filters.year);
    if (!endMonth || !endYear) throw new Error('month and year are required');

    const months = buildTrailingMonths(endMonth, endYear, monthsBack);
    const min = months[0];

    // Fetch by year range to minimize round-trips; further filter in-memory
    let query = supabase
      .from('rent_logs')
      .select('period_month, period_year, amount_due, amount_paid');

    // Year window covering the months range
    query = query.gte('period_year', min.year).lte('period_year', endYear);

    if (filters.unitId) query = query.eq('unit_id', filters.unitId);
    if (filters.propertyId) query = query.eq('property_id', filters.propertyId);

    const { data, error } = await query;
    if (error) throw error;

    const monthKey = (y, m) => `${y}-${String(m).padStart(2, '0')}`;
    const allowed = new Set(months.map(({ year, month }) => monthKey(year, month)));

    const buckets = months.reduce((acc, { year, month }) => {
      acc[monthKey(year, month)] = { expected: 0, received: 0 };
      return acc;
    }, {});

    (data || []).forEach((row) => {
      const key = monthKey(row.period_year, row.period_month);
      if (!allowed.has(key)) return;
      buckets[key].expected += Number(row.amount_due || 0);
      buckets[key].received += Number(row.amount_paid || 0);
    });

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const series = months.map(({ year, month }) => {
      const key = monthKey(year, month);
      const expected = buckets[key].expected;
      const received = buckets[key].received;
      const rate = expected > 0 ? (received / expected) * 100 : 0;
      return {
        label: `${monthNames[month - 1]} ${year}`,
        expected,
        received,
        collectionRate: rate
      };
    });

    return { data: series, error: null };
  } catch (err) {
    console.error('Error building monthly collections series:', err);
    return { data: [], error: err.message };
  }
};

/**
 * Breakdown by property for the selected month: [{ propertyName, expected, received }]
 */
export const getBreakdownByProperty = async (filters) => {
  try {
    const { month, year, propertyId = '', unitId = '' } = filters;
    if (!month || !year) throw new Error('month and year are required');

    let query = supabase
      .from('rent_logs')
      .select('property_id, properties(name), amount_due, amount_paid')
      .eq('period_month', Number(month))
      .eq('period_year', Number(year));

    if (unitId) query = query.eq('unit_id', unitId);
    if (propertyId) query = query.eq('property_id', propertyId);

    const { data, error } = await query;
    if (error) throw error;

    const map = new Map();
    (data || []).forEach((row) => {
      const name = row.properties?.name || 'Unknown';
      const current = map.get(name) || { propertyName: name, expected: 0, received: 0 };
      current.expected += Number(row.amount_due || 0);
      current.received += Number(row.amount_paid || 0);
      map.set(name, current);
    });

    return { data: Array.from(map.values()), error: null };
  } catch (err) {
    console.error('Error computing breakdown by property:', err);
    return { data: [], error: err.message };
  }
};

/**
 * Breakdown by payment status for the selected month: [{ status, count, expected, received }]
 */
export const getBreakdownByStatus = async (filters) => {
  try {
    const { month, year, propertyId = '', unitId = '' } = filters;
    if (!month || !year) throw new Error('month and year are required');

    let query = supabase
      .from('rent_logs')
      .select('payment_status, amount_due, amount_paid')
      .eq('period_month', Number(month))
      .eq('period_year', Number(year));

    if (unitId) query = query.eq('unit_id', unitId);
    if (propertyId) query = query.eq('property_id', propertyId);

    const { data, error } = await query;
    if (error) throw error;

    const map = new Map();
    (data || []).forEach((row) => {
      const status = row.payment_status || 'pending';
      const current = map.get(status) || { status, count: 0, expected: 0, received: 0 };
      current.count += 1;
      current.expected += Number(row.amount_due || 0);
      current.received += Number(row.amount_paid || 0);
      map.set(status, current);
    });

    return { data: Array.from(map.values()), error: null };
  } catch (err) {
    console.error('Error computing breakdown by status:', err);
    return { data: [], error: err.message };
  }
};

/**
 * Currency breakdown for the selected month: [{ currency, total }]
 */
export const getCurrencyBreakdown = async (filters) => {
  try {
    const { month, year, propertyId = '', unitId = '' } = filters;
    if (!month || !year) throw new Error('month and year are required');

    let query = supabase
      .from('rent_logs')
      .select('rent_currency, amount_due')
      .eq('period_month', Number(month))
      .eq('period_year', Number(year));

    if (unitId) query = query.eq('unit_id', unitId);
    if (propertyId) query = query.eq('property_id', propertyId);

    const { data, error } = await query;
    if (error) throw error;

    const map = new Map();
    (data || []).forEach((row) => {
      const currency = row.rent_currency || 'KES';
      const current = map.get(currency) || { currency, total: 0 };
      current.total += Number(row.amount_due || 0);
      map.set(currency, current);
    });

    return { data: Array.from(map.values()), error: null };
  } catch (err) {
    console.error('Error computing currency breakdown:', err);
    return { data: [], error: err.message };
  }
};


