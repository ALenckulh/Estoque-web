import { createClient } from "@supabase/supabase-js";

export const supabase = createClient( "https://ayyxgmkinxpjwiebmpkl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5eXhnbWtpbnhwandpZWJtcGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NzYyNTYsImV4cCI6MjA1NjE1MjI1Nn0.H6Qoq4z7bcXRVaLLGG8WAL4nynXmB5ZXdliL3j20PzQ"
);


//process.env.NEXT_PUBLIC_SUPABASE_URL!