import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchLocations, 
  fetchAreas, 
  fetchModels, 
  fetchEnquiries,
  fetchLocationBySlug,
  fetchAreaBySlug,
  fetchModelBySlug,
  createLocation,
  updateLocation,
  deleteLocation,
  createArea,
  updateArea,
  deleteArea,
  createModel,
  updateModel,
  deleteModel,
  createEnquiry
} from "@/lib/store";
import { Location, Area, Model, Enquiry } from "@/types";

// ===========================
// LOCATIONS
// ===========================
export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
};

export const useLocationBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["locations", slug],
    queryFn: () => (slug ? fetchLocationBySlug(slug) : Promise.resolve(undefined)),
    enabled: !!slug,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Location> }) => updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

// ===========================
// AREAS
// ===========================
export const useAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: fetchAreas,
  });
};

export const useAreaBySlug = (locationId: string | undefined, slug: string | undefined) => {
  return useQuery({
    queryKey: ["areas", locationId, slug],
    queryFn: () => (locationId && slug ? fetchAreaBySlug(locationId, slug) : Promise.resolve(undefined)),
    enabled: !!locationId && !!slug,
  });
};

export const useCreateArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
};

export const useUpdateArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Area> }) => updateArea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
};

export const useDeleteArea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
};

// ===========================
// MODELS
// ===========================
export const useModels = () => {
  return useQuery({
    queryKey: ["models"],
    queryFn: fetchModels,
  });
};

export const useModelBySlug = (areaId: string | undefined, slug: string | undefined) => {
  return useQuery({
    queryKey: ["models", areaId, slug],
    queryFn: () => (areaId && slug ? fetchModelBySlug(areaId, slug) : Promise.resolve(undefined)),
    enabled: !!areaId && !!slug,
  });
};

export const useCreateModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

export const useUpdateModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Model> }) => updateModel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

export const useDeleteModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

// ===========================
// ENQUIRIES
// ===========================
export const useEnquiries = () => {
  return useQuery({
    queryKey: ["enquiries"],
    queryFn: fetchEnquiries,
  });
};

export const useCreateEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });
};
