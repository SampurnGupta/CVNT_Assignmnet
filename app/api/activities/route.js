//AIM: fetch all available activities

import { supabase } from '../../../utils/supabaseClient';

export async function GET(request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 10;
  const title = url.searchParams.get('title');
  const location = url.searchParams.get('location');
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('activities')
    .select('*', { count: 'exact' })
    .gt('available_slots', 0)
    .range(from, to);

  // Filtering by title (case-insensitive, partial match)
  if (title) {
    query = query.ilike('title', `%${title}%`);
  }
  // Filtering by location (case-insensitive, partial match)
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({
    activities: data,
    total: count,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit)
  }), { status: 200 });
}