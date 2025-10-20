import { createClient } from "@supabase/supabase-js";
const baseUrl = "https://xnxgixuefhmublzzuhzd.supabase.co";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueGdpeHVlZmhtdWJsenp1aHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjU3OTEsImV4cCI6MjA3NjUwMTc5MX0.K2ZCTQvYhPUoM62rzBygMm1Kt27jtRiBmDH4eFPCUwA";

export const supabase = createClient(baseUrl, anonKey);

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ?? null;
};
