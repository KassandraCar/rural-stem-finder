import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null if env vars aren't set yet — callers must handle this
export function createClient() {
  if (!supabaseUrl || supabaseUrl === "https://yaipcflaeawanvcsfwos.supabase.co" ||
      !supabaseAnonKey || supabaseAnonKey === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaXBjZmxhZWF3YW52Y3Nmd29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTUzNjQsImV4cCI6MjA4OTMzMTM2NH0.h-GvSujDy-o4yFvkJYlbX5jprjrXSj5eNsLTwU-VQTg") {
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function isSupabaseConfigured() {
  return createClient() !== null;
}
