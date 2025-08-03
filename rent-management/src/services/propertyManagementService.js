import { supabase } from '../supabaseClient.js';

//CRUD OPERATIONS

/**
 * CREATE A NEW PROPERTY
 * @param {Object} propertyData - property data object
 * @returns {Object} - { data, error }
 */
export const createProperty = async (propertyData) => {
  try {
    // validate required fields
    const requiredFields = ['name', 'address', 'city', 'county'];
    for (const field of requiredFields) {
      if (!propertyData[field] || !propertyData[field].trim()) {
        throw new Error(`${field} is required`);
      }
    }

    // prepare data for insertion
    const propertyToInsert = {
      name: propertyData.name.trim(),
      address: propertyData.address.trim(),
      city: propertyData.city.trim(),
      county: propertyData.county.trim(),
      postal_code: propertyData.postalCode?.trim() || null,
      phone_number: propertyData.phoneNumber?.trim() || null,
      property_type: propertyData.propertyType || 'residential',
      description: propertyData.description?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('properties')
      .insert([propertyToInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating property:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating property:', error);
    return { data: null, error: error.message };
  }
};

/**
 * GET ALL PROPERTIES WITH OPTIONAL FILTERING
 * @param {Object} filters - optional filters
 * @returns {Object} - { data, error }
 */
export const getProperties = async (filters = {}) => {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    // apply filters if provided
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.county) {
      query = query.eq('county', filters.county);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching properties:', error);
      throw new Error(error.message);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { data: [], error: error.message };
  }
};

/**
 * GET A SINGLE PROPERTY BY ID
 * @param {string} propertyId - property ID
 * @returns {Object} - { data, error }
 */
export const getPropertyById = async (propertyId) => {
  try {
    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) {
      console.error('Supabase error fetching property:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching property:', error);
    return { data: null, error: error.message };
  }
};

/**
 * UPDATE A PROPERTY
 * @param {string} propertyId - property ID
 * @param {Object} updateData - updated property data
 * @returns {Object} - { data, error }
 */
export const updateProperty = async (propertyId, updateData) => {
  try {
    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    // validate required fields
    const requiredFields = ['name', 'address', 'city', 'county'];
    for (const field of requiredFields) {
      if (updateData[field] && !updateData[field].trim()) {
        throw new Error(`${field} cannot be empty`);
      }
    }

    // prepare update data
    const propertyToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // clean up the data
    if (propertyToUpdate.name) propertyToUpdate.name = propertyToUpdate.name.trim();
    if (propertyToUpdate.address) propertyToUpdate.address = propertyToUpdate.address.trim();
    if (propertyToUpdate.city) propertyToUpdate.city = propertyToUpdate.city.trim();
    if (propertyToUpdate.county) propertyToUpdate.county = propertyToUpdate.county.trim();
    if (propertyToUpdate.postalCode) propertyToUpdate.postal_code = propertyToUpdate.postalCode.trim();
    if (propertyToUpdate.phoneNumber) propertyToUpdate.phone_number = propertyToUpdate.phoneNumber.trim();
    if (propertyToUpdate.description) propertyToUpdate.description = propertyToUpdate.description.trim();

    // remove postalCode and phoneNumber from the update object as they're mapped to postal_code and phone_number
    delete propertyToUpdate.postalCode;
    delete propertyToUpdate.phoneNumber;

    const { data, error } = await supabase
      .from('properties')
      .update(propertyToUpdate)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating property:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating property:', error);
    return { data: null, error: error.message };
  }
};

/**
 * DELETE A PROPERTY
 * @param {string} propertyId - property ID
 * @returns {Object} - { success, error }
 */
export const deleteProperty = async (propertyId) => {
  try {
    if (!propertyId) {
      throw new Error('Property ID is required');
    }

    // check if property has units before deleting
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id')
      .eq('property_id', propertyId);

    if (unitsError) {
      console.error('Error checking units:', unitsError);
      throw new Error('Failed to check if property has units');
    }

    if (units && units.length > 0) {
      throw new Error('Cannot delete property that has units. Please delete all units first.');
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Supabase error deleting property:', error);
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: error.message };
  }
};

// UNIT CRUD OPERATIONS

/**
 * CREATE A NEW UNIT
 * @param {Object} unitData - unit data object
 * @returns {Object} - { data, error }
 */
export const createUnit = async (unitData) => {
  try {
    // validate required fields
    const requiredFields = ['propertyId', 'unitNumber', 'rentAmount'];
    for (const field of requiredFields) {
      if (!unitData[field] || !unitData[field].toString().trim()) {
        throw new Error(`${field} is required`);
      }
    }

    // validate rent amount
    if (unitData.rentAmount <= 0) {
      throw new Error('Rent amount must be greater than 0');
    }

    // prepare data for insertion
    const unitToInsert = {
      property_id: unitData.propertyId,
      unit_number: unitData.unitNumber.trim(),
      unit_type: unitData.unitType || 'apartment',
      bedrooms: unitData.bedrooms || 0,
      bathrooms: unitData.bathrooms || 0,
      square_feet: unitData.squareFeet || null,
      rent_amount: unitData.rentAmount,
      rent_currency: unitData.rentCurrency || 'KES',
      deposit_amount: unitData.depositAmount || null,
      deposit_currency: unitData.depositCurrency || 'KES',
      is_available: unitData.isAvailable !== undefined ? unitData.isAvailable : true,
      description: unitData.description?.trim() || null,
      amenities: unitData.amenities || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('units')
      .insert([unitToInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating unit:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating unit:', error);
    return { data: null, error: error.message };
  }
};

/**
 * GET ALL UNITS WITH OPTIONAL FILTERING
 * @param {Object} filters - optional filters
 * @returns {Object} - { data, error }
 */
export const getUnits = async (filters = {}) => {
  try {
    let query = supabase
      .from('units')
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city,
          county
        )
      `)
      .order('created_at', { ascending: false });

    // apply filters if provided
    if (filters.propertyId) {
      query = query.eq('property_id', filters.propertyId);
    }

    if (filters.unitType) {
      query = query.eq('unit_type', filters.unitType);
    }

    if (filters.isAvailable !== undefined) {
      query = query.eq('is_available', filters.isAvailable);
    }

    if (filters.minRent) {
      query = query.gte('rent_amount', filters.minRent);
    }

    if (filters.maxRent) {
      query = query.lte('rent_amount', filters.maxRent);
    }

    if (filters.search) {
      query = query.or(`unit_number.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching units:', error);
      throw new Error(error.message);
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching units:', error);
    return { data: [], error: error.message };
  }
};

/**
 * GET A SINGLE UNIT BY ID
 * @param {string} unitId - unit ID
 * @returns {Object} - { data, error }
 */
export const getUnitById = async (unitId) => {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    const { data, error } = await supabase
      .from('units')
      .select(`
        *,
        properties (
          id,
          name,
          address,
          city,
          county
        )
      `)
      .eq('id', unitId)
      .single();

    if (error) {
      console.error('Supabase error fetching unit:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching unit:', error);
    return { data: null, error: error.message };
  }
};

/**
 * UPDATE A UNIT
 * @param {string} unitId - unit ID
 * @param {Object} updateData - updated unit data
 * @returns {Object} - { data, error }
 */
export const updateUnit = async (unitId, updateData) => {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    // validate rent amount if provided
    if (updateData.rentAmount !== undefined && updateData.rentAmount <= 0) {
      throw new Error('Rent amount must be greater than 0');
    }

    // Prepare update data
    const unitToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Clean up the data
    if (unitToUpdate.unitNumber) unitToUpdate.unit_number = unitToUpdate.unitNumber.trim();
    if (unitToUpdate.propertyId) unitToUpdate.property_id = unitToUpdate.propertyId;
    if (unitToUpdate.description) unitToUpdate.description = unitToUpdate.description.trim();

    // Remove mapped fields
    delete unitToUpdate.unitNumber;
    delete unitToUpdate.propertyId;

    const { data, error } = await supabase
      .from('units')
      .update(unitToUpdate)
      .eq('id', unitId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating unit:', error);
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating unit:', error);
    return { data: null, error: error.message };
  }
};

/**
 * DELETE A UNIT
 * @param {string} unitId - unit ID
 * @returns {Object} - { success, error }
 */
export const deleteUnit = async (unitId) => {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', unitId);

    if (error) {
      console.error('Supabase error deleting unit:', error);
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting unit:', error);
    return { success: false, error: error.message };
  }
};

// UTILITY FUNCTIONS

/**
 * GET UNIQUE COUNTIES FROM PROPERTIES
 * @returns {Object} - { data, error }
 */
export const getUniqueCounties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('county')
      .not('county', 'is', null);

    if (error) {
      console.error('Supabase error fetching counties:', error);
      throw new Error(error.message);
    }

    // extract unique counties
    const uniqueCounties = [...new Set(data.map(item => item.county))].sort();
    return { data: uniqueCounties, error: null };
  } catch (error) {
    console.error('Error fetching counties:', error);
    return { data: [], error: error.message };
  }
};

/**
 * GET UNIQUE CITIES FROM PROPERTIES
 * @returns {Object} - { data, error }
 */
export const getUniqueCities = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('city')
      .not('city', 'is', null);

    if (error) {
      console.error('Supabase error fetching cities:', error);
      throw new Error(error.message);
    }

    // Extract unique cities
    const uniqueCities = [...new Set(data.map(item => item.city))].sort();
    return { data: uniqueCities, error: null };
  } catch (error) {
    console.error('Error fetching cities:', error);
    return { data: [], error: error.message };
  }
};

/**
 * GET PROPERTY STATISTICS
 * @returns {Object} - { data, error }
 */
export const getPropertyStats = async () => {
  try {
    // get total properties
    const { count: totalProperties, error: propertiesError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (propertiesError) throw propertiesError;

    // Get total units
    const { count: totalUnits, error: unitsError } = await supabase
      .from('units')
      .select('*', { count: 'exact', head: true });

    if (unitsError) throw unitsError;

    // Get available units
    const { count: availableUnits, error: availableError } = await supabase
      .from('units')
      .select('*', { count: 'exact', head: true })
      .eq('is_available', true);

    if (availableError) throw availableError;

    // Get average rent
    const { data: rentData, error: rentError } = await supabase
      .from('units')
      .select('rent_amount')
      .not('rent_amount', 'is', null);

    if (rentError) throw rentError;

    const averageRent = rentData.length > 0 
      ? rentData.reduce((sum, unit) => sum + unit.rent_amount, 0) / rentData.length 
      : 0;

    return {
      data: {
        totalProperties,
        totalUnits,
        availableUnits,
        averageRent: Math.round(averageRent)
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching property stats:', error);
    return { data: null, error: error.message };
  }
};

/**
 * GET DASHBOARD STATISTICS WITH MORE DETAILS
 * @returns {Object} - { data, error }
 */
export const getDashboardStats = async () => {
  try {
    // Try to get basic stats first
    let basicStats = null;
    try {
      const statsResult = await getPropertyStats();
      if (statsResult.data && !statsResult.error) {
        basicStats = statsResult.data;
      }
    } catch (statsError) {
      console.log('Basic stats failed, using fallback:', statsError);
    }

    // If basic stats failed or is null, use fallback approach
    if (!basicStats) {
      console.log('Using fallback stats calculation');
      
      try {
        // Get all data in parallel for better performance
        const [propertiesResult, unitsResult, recentPropertiesResult] = await Promise.all([
          supabase.from('properties').select('county'),
          supabase.from('units').select('unit_type, is_available, rent_amount'),
          supabase.from('properties').select('id, name, city, county, created_at').order('created_at', { ascending: false }).limit(5)
        ]);

        // Extract data safely
        const properties = propertiesResult.data || [];
        const units = unitsResult.data || [];
        const recentProperties = recentPropertiesResult.data || [];

        // Calculate statistics
        const totalProperties = properties.length;
        const totalUnits = units.length;
        const availableUnits = units.filter(unit => unit.is_available).length;
        const totalMonthlyRent = units.reduce((sum, unit) => sum + (unit.rent_amount || 0), 0);
        const averageRent = totalUnits > 0 ? totalMonthlyRent / totalUnits : 0;
        const occupiedRent = totalMonthlyRent - (availableUnits * averageRent);

        // Calculate properties by county
        const propertiesByCounty = properties.reduce((acc, property) => {
          if (property.county) {
            acc[property.county] = (acc[property.county] || 0) + 1;
          }
          return acc;
        }, {});

        // Calculate units by type
        const unitsByType = units.reduce((acc, unit) => {
          if (!acc[unit.unit_type]) {
            acc[unit.unit_type] = { total: 0, available: 0 };
          }
          acc[unit.unit_type].total += 1;
          if (unit.is_available) {
            acc[unit.unit_type].available += 1;
          }
          return acc;
        }, {});

        return {
          data: {
            totalProperties,
            totalUnits,
            availableUnits,
            averageRent: Math.round(averageRent),
            propertiesByCounty,
            unitsByType,
            recentProperties,
            totalMonthlyRent: Math.round(totalMonthlyRent),
            occupiedRent: Math.round(occupiedRent),
            occupancyRate: totalUnits > 0 ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100) : 0
          },
          error: null
        };
      } catch (fallbackError) {
        console.error('Fallback stats also failed:', fallbackError);
        // Return safe default values
        return {
          data: {
            totalProperties: 0,
            totalUnits: 0,
            availableUnits: 0,
            averageRent: 0,
            propertiesByCounty: {},
            unitsByType: {},
            recentProperties: [],
            totalMonthlyRent: 0,
            occupiedRent: 0,
            occupancyRate: 0
          },
          error: null
        };
      }
    }

    // If we have basic stats, proceed with full calculation
    try {
      // Get additional data in parallel
      const [countyResult, unitTypeResult, recentResult, rentResult] = await Promise.all([
        supabase.from('properties').select('county').not('county', 'is', null),
        supabase.from('units').select('unit_type, is_available'),
        supabase.from('properties').select('id, name, city, county, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('units').select('rent_amount, is_available')
      ]);

      // Process county data
      const propertiesByCounty = (countyResult.data || []).reduce((acc, property) => {
        acc[property.county] = (acc[property.county] || 0) + 1;
        return acc;
      }, {});

      // Process unit type data
      const unitsByType = (unitTypeResult.data || []).reduce((acc, unit) => {
        if (!acc[unit.unit_type]) {
          acc[unit.unit_type] = { total: 0, available: 0 };
        }
        acc[unit.unit_type].total += 1;
        if (unit.is_available) {
          acc[unit.unit_type].available += 1;
        }
        return acc;
      }, {});

      // Process rent data
      const rentData = rentResult.data || [];
      const totalMonthlyRent = rentData.reduce((sum, unit) => sum + (unit.rent_amount || 0), 0);
      const occupiedRent = rentData
        .filter(unit => !unit.is_available)
        .reduce((sum, unit) => sum + (unit.rent_amount || 0), 0);

      return {
        data: {
          ...basicStats,
          propertiesByCounty,
          unitsByType,
          recentProperties: recentResult.data || [],
          totalMonthlyRent: Math.round(totalMonthlyRent),
          occupiedRent: Math.round(occupiedRent),
          occupancyRate: basicStats.totalUnits > 0 
            ? Math.round(((basicStats.totalUnits - basicStats.availableUnits) / basicStats.totalUnits) * 100)
            : 0
        },
        error: null
      };
    } catch (additionalDataError) {
      console.error('Error getting additional data:', additionalDataError);
      // Return basic stats with minimal additional data
      return {
        data: {
          ...basicStats,
          propertiesByCounty: {},
          unitsByType: {},
          recentProperties: [],
          totalMonthlyRent: Math.round(basicStats.averageRent * basicStats.totalUnits),
          occupiedRent: Math.round(basicStats.averageRent * (basicStats.totalUnits - basicStats.availableUnits)),
          occupancyRate: basicStats.totalUnits > 0 
            ? Math.round(((basicStats.totalUnits - basicStats.availableUnits) / basicStats.totalUnits) * 100)
            : 0
        },
        error: null
      };
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return safe default values
    return {
      data: {
        totalProperties: 0,
        totalUnits: 0,
        availableUnits: 0,
        averageRent: 0,
        propertiesByCounty: {},
        unitsByType: {},
        recentProperties: [],
        totalMonthlyRent: 0,
        occupiedRent: 0,
        occupancyRate: 0
      },
      error: null
    };
  }
};

/**
 * GET PROPERTIES WITH UNIT COUNT
 * @param {Object} filters - optional filters
 * @returns {Object} - { data, error }
 */
export const getPropertiesWithUnitCount = async (filters = {}) => {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        units (
          id,
          is_available,
          rent_amount
        )
      `)
      .order('created_at', { ascending: false });

    // apply filters if provided
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.county) {
      query = query.eq('county', filters.county);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching properties with unit count:', error);
      throw new Error(error.message);
    }

    // Process the data to add unit counts and total rent
    const processedData = (data || []).map(property => {
      const units = property.units || [];
      const totalUnits = units.length;
      const availableUnits = units.filter(unit => unit.is_available).length;
      const totalRent = units.reduce((sum, unit) => sum + (unit.rent_amount || 0), 0);
      const averageRent = totalUnits > 0 ? totalRent / totalUnits : 0;

      return {
        ...property,
        totalUnits,
        availableUnits,
        occupiedUnits: totalUnits - availableUnits,
        totalRent: Math.round(totalRent),
        averageRent: Math.round(averageRent),
        occupancyRate: totalUnits > 0 ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100) : 0
      };
    });

    return { data: processedData, error: null };
  } catch (error) {
    console.error('Error fetching properties with unit count:', error);
    return { data: [], error: error.message };
  }
}; 