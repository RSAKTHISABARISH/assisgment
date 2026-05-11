const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.JWT_SECRET;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and Key are missing in .env');
}

// Use the service role key (stored in JWT_SECRET) to bypass RLS for development
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
