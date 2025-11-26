import { createClient } from '@supabase/supabase-js';

// Access environment variables. 
// In a production build, these would be populated by your build system.
// In this simulated environment, we check if they are defined.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // This should be the ANON key for client-side

console.log("Supabase Configuration Status:", supabaseUrl ? "Present" : "Missing");

// Initialize Supabase client if credentials exist. 
// Otherwise return null to signal fallback to Mock Data.
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
