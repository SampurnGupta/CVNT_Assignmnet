/*
Logic:

User must be authenticated (must provide a valid Supabase access token in the header).
Check if available_slots > 0 for the selected activity.
If yes, insert a new booking, and decrement available_slots by 1.
If not, return an error.

Yet to Implement: one User: one booking
*/

import { supabase } from '../../../utils/supabaseClient';

export async function POST(request) {
  const { activity_id } = await request.json();
  const authHeader = request.headers.get('Authorization');
  const access_token = authHeader?.replace('Bearer ', '');

  if (!access_token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Getting user info from token
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  // Checking activity slots
  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activity_id)
    .single();

  if (activityError || !activity) {
    return new Response(JSON.stringify({ error: 'Activity not found' }), { status: 404 });
  }
  if (activity.available_slots <= 0) {
    return new Response(JSON.stringify({ error: 'No slots available' }), { status: 400 });
  }

  // Create booking and decrement available_slots (transactional logic)
  // preventing race condition
  const { error: bookingError } = await supabase.rpc('book_activity', {
    activity_id_input: activity_id,
    user_id_input: user.id
  });

  if (bookingError) {
    return new Response(JSON.stringify({ error: 'Booking failed: ' + bookingError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Booking successful!' }), { status: 200 });
}