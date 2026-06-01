import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Ticket = {
  id: string;
  reporter_id: string;
  department_id: string;
  category: string;
  severity: number;
  description: string;
  address: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Pending Verification' | 'Resolved';
  image_url: string;
  ai_review: string;
  lat: number;
  lng: number;
  location: any; // PostGIS Point
  escalation_level: string;
  upvotes: number;
  created_at: string;
};
