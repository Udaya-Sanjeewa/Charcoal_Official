import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!verifyResponse.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch user profiles' }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ users: [] });
    }

    const userIds = profiles.map(p => p.id);

    const { data: orderStats } = await supabase
      .from('orders')
      .select('user_id, total_amount')
      .in('user_id', userIds)
      .not('user_id', 'is', null);

    const userStats = orderStats?.reduce((acc: any, order: any) => {
      if (!acc[order.user_id]) {
        acc[order.user_id] = { count: 0, total: 0 };
      }
      acc[order.user_id].count += 1;
      acc[order.user_id].total += parseFloat(order.total_amount || 0);
      return acc;
    }, {}) || {};

    const enrichedUsers = profiles.map(profile => ({
      id: profile.id,
      email: profile.email || 'Email not available',
      created_at: profile.created_at,
      last_sign_in_at: null,
      confirmed_at: profile.created_at,
      profile: profile,
      order_count: userStats[profile.id]?.count || 0,
      total_spent: userStats[profile.id]?.total || 0,
    }));

    return NextResponse.json({ users: enrichedUsers });
  } catch (error: any) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!verifyResponse.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('Error deleting user profile:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in admin users delete API:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
