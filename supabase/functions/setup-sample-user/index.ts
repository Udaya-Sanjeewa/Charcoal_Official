import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'user@example.com',
      password: 'user123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Demo User',
      },
    });

    if (error) {
      if (error.message.includes('already') || error.message.includes('exists')) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Sample user already exists',
            credentials: {
              email: 'user@example.com',
              password: 'user123',
            },
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      throw error;
    }

    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert([{
        id: data.user!.id,
        full_name: 'Demo User',
        phone: '+1 (555) 123-4567',
      }]);

    if (profileError) {
      console.error('Profile error:', profileError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sample user created successfully!',
        credentials: {
          email: 'user@example.com',
          password: 'user123',
        },
        userId: data.user?.id,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error creating sample user:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create sample user',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
