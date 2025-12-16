import { createClient } from "@supabase/supabase-js";
import { captureException } from "../renderer/logging";

// Create a mock Supabase client if credentials are not configured
const createSupabaseClient = () => {
  const supaProjectId = window.envVars.SUPA_PROJECT_ID;
  const supaKey = window.envVars.SUPA_KEY;

  // If credentials are missing, return a mock client to prevent errors
  if (!supaProjectId || !supaKey) {
    console.warn("Supabase credentials not configured. Authentication features will be disabled.");
    // Use a dummy URL and key that won't cause the client creation to fail
    return createClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU0MjI0MDAsImV4cCI6MTk2MDk5ODQwMH0.placeholder",
    );
  }

  return createClient(`https://${supaProjectId}.supabase.co`, supaKey);
};

const supabase = createSupabaseClient();

export async function fetchById<Type>(table: string, id: number, columns: string = "*"): Promise<Type> {
  const { data, error } = await supabase.from(table).select(columns).eq("id", id).maybeSingle();
  if (error) {
    captureException(new Error(error.message));
    throw error;
  }
  return data as Type;
}

export default supabase;
