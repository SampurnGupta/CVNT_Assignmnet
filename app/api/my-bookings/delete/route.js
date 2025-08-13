import { supabase } from '../../../../utils/supabaseClient';

export async function DELETE(request) {
  const { booking_id } = await request.json();
  const authHeader = request.headers.get('Authorization');
  const access_token = authHeader?.replace('Bearer ', '');

  if (!access_token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  // Get the booking to find activity_id
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('activity_id')
    .eq('id', booking_id)
    .single();

  if (bookingError || !booking) {
    return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404 });
  }

  // Delete booking (RLS ensures only user's own booking can be deleted)
  const { error: deleteError } = await supabase
    .from('bookings')
    .delete()
    .eq('id', booking_id);

  if (deleteError) {
    return new Response(JSON.stringify({ error: 'Delete failed: ' + deleteError.message }), { status: 500 });
  }

  // Increment available_slots for activity
  const { error: updateError } = await supabase
    .from('activities')
    .update({ available_slots: supabase.raw('available_slots + 1') })
    .eq('id', booking.activity_id);

  if (updateError) {
    return new Response(JSON.stringify({ error: 'Failed to update activity slots: ' + updateError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Booking cancelled.' }), { status: 200 });
}