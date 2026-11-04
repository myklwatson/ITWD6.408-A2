import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://biikpvpqlonhbdsoffaw.supabase.co";
const supabaseAnonKey = "sb_publishable_WEafKRL-ppByLI9KWg1wrw_nqaBA1XV";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
