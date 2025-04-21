import { createClient } from "@supabase/supabase-js";

const supabseUrl: string = "https://ayyxgmkinxpjwiebmpkl.supabase.co";
const supabaseKey: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5eXhnbWtpbnhwandpZWJtcGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDU3NjI1NiwiZXhwIjoyMDU2MTUyMjU2fQ.r6om1_JM4sAdsG0YPyQG5Sm0bcTlTOrVBLoJBnDQauk";

export const supabase =
    createClient( supabseUrl, supabaseKey);