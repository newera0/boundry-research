/* Public project configuration. The anon key is safe to put in a browser ONLY when RLS is enabled.
   Never put a Supabase service_role key here. */
window.BOUNDARY_CONFIG = {
  supabaseUrl: '', // e.g. 'https://abcdefghijk.supabase.co'
  supabaseAnonKey: '', // Supabase Publishable / anon key, NOT service_role
  projectUrl: '', // Optional canonical URL once deployed
  contactEmail: '' // Optional public project contact email
};