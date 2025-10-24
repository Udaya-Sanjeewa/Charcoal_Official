import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: 400 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 400 }
      );
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: data.user.id,
          full_name: fullName,
          phone: phone || null,
        },
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    return NextResponse.json({
      success: true,
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: fullName,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
