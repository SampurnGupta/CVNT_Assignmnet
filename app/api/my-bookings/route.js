//AIM: GET /api/my-bookings — Get all bookings for the logged-in user

import { supabase } from '../../../utils/supabaseClient';

export async function GET(request) {
  const authHeader = request.headers.get('Authorization');
  const access_token = authHeader?.replace('Bearer ', '');

  if (!access_token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Get user
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  // Query bookings
  const { data, error } = await supabase
    .from('bookings')
    .select('id, activity_id, timestamp, activities (title, location)')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}