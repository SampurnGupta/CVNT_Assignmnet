//AIM: fetch all available activities

import { supabase } from '../../../utils/supabaseClient';

export async function GET() {
  // Fetch all activities (available_slots > 0)
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .gt('available_slots', 0);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}