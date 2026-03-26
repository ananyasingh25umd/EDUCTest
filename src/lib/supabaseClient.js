import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mljpiqzkcgvmmrlwvmab.supabase.co";
const supabaseAnonKey = "sb_publishable_jyspSZkor6_DaD-CchkA6Q_tvHTDL5Z";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);