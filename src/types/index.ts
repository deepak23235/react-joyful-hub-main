export interface Location {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface Area {
  id: string;
  locationId: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface Model {
  id: string;
  areaId: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  phoneNumber: string;
  features: string[];
  specifications: Record<string, string>;
}

export interface Enquiry {
  id: string;
  modelId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}
