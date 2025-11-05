import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase.from('orders').insert([body]).select();
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ message: 'Order created', data });
}

export async function GET() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data);
}