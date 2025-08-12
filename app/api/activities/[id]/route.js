import { supabase } from '../../../../utils/supabaseClient';

export async function GET(request, { params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}