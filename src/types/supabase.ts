export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      areas: {
        Row: {
          id: string;
          location_id: string;
          name: string;
          slug: string;
          image: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          name: string;
          slug: string;
          image?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          name?: string;
          slug?: string;
          image?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      models: {
        Row: {
          id: string;
          area_id: string;
          name: string;
          slug: string;
          image: string;
          images: string[];
          short_description: string;
          description: string;
          phone_number: string;
          features: string[];
          specifications: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          area_id: string;
          name: string;
          slug: string;
          image?: string;
          images?: string[];
          short_description?: string;
          description?: string;
          phone_number?: string;
          features?: string[];
          specifications?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          area_id?: string;
          name?: string;
          slug?: string;
          image?: string;
          images?: string[];
          short_description?: string;
          description?: string;
          phone_number?: string;
          features?: string[];
          specifications?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          model_id: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          model_id: string;
          name: string;
          email: string;
          phone: string;
          message?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          model_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
