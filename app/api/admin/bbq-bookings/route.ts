import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-client';

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const storedToken = process.env.ADMIN_TOKEN;

  if (token !== storedToken) {
    return null;
  }

  return token;
}

export async function GET(request: NextRequest) {
  try {
    const token = verifyAdminToken(request);
    if (!token) {
      console.error('BBQ Bookings API: Unauthorized - no valid token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    const { data: bookings, error } = await supabase
      .from('bbq_rental_bookings')
      .select(`
        *,
        bbq_rental_packages (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('BBQ Bookings API: Supabase error:', error);
      throw error;
    }

    console.log('BBQ Bookings API: Successfully fetched', bookings?.length || 0, 'bookings');

    return NextResponse.json({ bookings: bookings || [] });
  } catch (error: any) {
    console.error('BBQ Bookings API: Error fetching bookings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = verifyAdminToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      handover_date,
      returned_date,
      deposit_amount,
      balance_amount,
      payment_status,
      booking_status,
      notes
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    const updateData: any = {
      deposit_amount: parseFloat(deposit_amount),
      balance_amount: parseFloat(balance_amount),
      payment_status,
      booking_status,
      notes
    };

    if (handover_date) {
      updateData.handover_date = handover_date;
    }

    if (returned_date) {
      updateData.returned_date = returned_date;
    }

    const { data, error } = await supabase
      .from('bbq_rental_bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ booking: data });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = verifyAdminToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('bbq_rental_bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
