import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('menu').select('*');
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data);
}