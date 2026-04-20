import { supabase } from './supabase';
import { Location, Area, Model, Enquiry } from '@/types';
import { Database } from '@/types/supabase';

type LocationRow = Database['public']['Tables']['locations']['Row'];
type AreaRow = Database['public']['Tables']['areas']['Row'];
type ModelRow = Database['public']['Tables']['models']['Row'];
type EnquiryRow = Database['public']['Tables']['enquiries']['Row'];

type LocationInsert = Database['public']['Tables']['locations']['Insert'];
type LocationUpdate = Database['public']['Tables']['locations']['Update'];
type AreaInsert = Database['public']['Tables']['areas']['Insert'];
type AreaUpdate = Database['public']['Tables']['areas']['Update'];
type ModelInsert = Database['public']['Tables']['models']['Insert'];
type ModelUpdate = Database['public']['Tables']['models']['Update'];
type EnquiryInsert = Database['public']['Tables']['enquiries']['Insert'];

// Helper to convert DB row to Location type
const toLocation = (row: LocationRow): Location => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  image: row.image,
  description: row.description,
});

// Helper to convert DB row to Area type
const toArea = (row: AreaRow): Area => ({
  id: row.id,
  locationId: row.location_id,
  name: row.name,
  slug: row.slug,
  image: row.image,
  description: row.description,
});

// Helper to convert DB row to Model type
const toModel = (row: ModelRow): Model => ({
  id: row.id,
  areaId: row.area_id,
  name: row.name,
  slug: row.slug,
  image: row.image,
  images: row.images || [],
  shortDescription: row.short_description,
  description: row.description,
  phoneNumber: row.phone_number,
  features: row.features || [],
  specifications: row.specifications as Record<string, string>,
});

// Helper to convert DB row to Enquiry type
const toEnquiry = (row: EnquiryRow): Enquiry => ({
  id: row.id,
  modelId: row.model_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  message: row.message,
  createdAt: row.created_at,
});

// ===========================
// LOCATIONS
// ===========================
export const fetchLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []).map(toLocation);
};

export const fetchLocationBySlug = async (slug: string): Promise<Location | undefined> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return undefined;
  return toLocation(data);
};

export const createLocation = async (location: Omit<Location, 'id'>): Promise<Location> => {
  const insertData: LocationInsert = {
    name: location.name,
    slug: location.slug,
    image: location.image,
    description: location.description,
  };

  const { data, error } = await supabase
    .from('locations')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from insert');
  return toLocation(data);
};

export const updateLocation = async (id: string, location: Partial<Location>): Promise<Location> => {
  const updateData: LocationUpdate = {
    name: location.name,
    slug: location.slug,
    image: location.image,
    description: location.description,
  };

  const { data, error } = await supabase
    .from('locations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from update');
  return toLocation(data);
};

export const deleteLocation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ===========================
// AREAS
// ===========================
export const fetchAreas = async (): Promise<Area[]> => {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []).map(toArea);
};

export const fetchAreasByLocation = async (locationId: string): Promise<Area[]> => {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('location_id', locationId)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []).map(toArea);
};

export const fetchAreaBySlug = async (locationId: string, slug: string): Promise<Area | undefined> => {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('location_id', locationId)
    .eq('slug', slug)
    .single();

  if (error) return undefined;
  return toArea(data);
};

export const createArea = async (area: Omit<Area, 'id'>): Promise<Area> => {
  const insertData: AreaInsert = {
    location_id: area.locationId,
    name: area.name,
    slug: area.slug,
    image: area.image,
    description: area.description,
  };

  const { data, error } = await supabase
    .from('areas')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from insert');
  return toArea(data);
};

export const updateArea = async (id: string, area: Partial<Area>): Promise<Area> => {
  const updateData: AreaUpdate = {
    location_id: area.locationId,
    name: area.name,
    slug: area.slug,
    image: area.image,
    description: area.description,
  };

  const { data, error } = await supabase
    .from('areas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from update');
  return toArea(data);
};

export const deleteArea = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('areas')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ===========================
// MODELS
// ===========================
export const fetchModels = async (): Promise<Model[]> => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []).map(toModel);
};

export const fetchModelsByArea = async (areaId: string): Promise<Model[]> => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('area_id', areaId)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []).map(toModel);
};

export const fetchModelBySlug = async (areaId: string, slug: string): Promise<Model | undefined> => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('area_id', areaId)
    .eq('slug', slug)
    .single();

  if (error) return undefined;
  return toModel(data);
};

export const createModel = async (model: Omit<Model, 'id'>): Promise<Model> => {
  const insertData: ModelInsert = {
    area_id: model.areaId,
    name: model.name,
    slug: model.slug,
    image: model.image,
    images: model.images,
    short_description: model.shortDescription,
    description: model.description,
    phone_number: model.phoneNumber,
    features: model.features,
    specifications: model.specifications,
  };

  const { data, error } = await supabase
    .from('models')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from insert');
  return toModel(data);
};

export const updateModel = async (id: string, model: Partial<Model>): Promise<Model> => {
  const updateData: ModelUpdate = {
    area_id: model.areaId,
    name: model.name,
    slug: model.slug,
    image: model.image,
    images: model.images,
    short_description: model.shortDescription,
    description: model.description,
    phone_number: model.phoneNumber,
    features: model.features,
    specifications: model.specifications,
  };

  const { data, error } = await supabase
    .from('models')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from update');
  return toModel(data);
};

export const deleteModel = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('models')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ===========================
// ENQUIRIES
// ===========================
export const fetchEnquiries = async (): Promise<Enquiry[]> => {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(toEnquiry);
};

export const createEnquiry = async (enquiry: Omit<Enquiry, 'id' | 'createdAt'>): Promise<Enquiry> => {
  const insertData: EnquiryInsert = {
    model_id: enquiry.modelId,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    message: enquiry.message,
  };

  const { data, error } = await supabase
    .from('enquiries')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from insert');
  return toEnquiry(data);
};
