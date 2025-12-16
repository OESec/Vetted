import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION: UPDATE THESE WITH YOUR SUPABASE KEYS
// ------------------------------------------------------------------
// 1. Go to your Supabase Dashboard (https://supabase.com/dashboard)
// 2. Select your project
// 3. Go to Project Settings (gear icon) -> API
// 4. Copy "Project URL" and "anon" public key below.

const SUPABASE_URL = 'https://iiafzgamwpdajyqqlmni.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpYWZ6Z2Ftd3BkYWp5cXFsbW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODQ5MjQsImV4cCI6MjA4MTQ2MDkyNH0.6Z54bEojDoa5F99Fa57QFrq9o34htrh2v4SMTT81ucw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);