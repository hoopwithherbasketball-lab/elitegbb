// Players API Endpoints
// GET /api/players - List all players
// POST /api/players - Create new player
// GET /api/players/:id - Get player by ID
// PATCH /api/players/:id - Update player

import { verifyJWT } from '../../utils/jwt.js';

// Supabase REST API helper
async function supabaseQuery(env, table, method, params = {}) {
  const url = `${env.SUPABASE_URL}/rest/v1/${table}`;
  const headers = {
    'apikey': env.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'return=representation' : method === 'PATCH' ? 'return=representation' : ''
  };

  const queryParams = new URLSearchParams();
  if (params.select) queryParams.append('select', params.select);
  if (params.eq) {
    Object.entries(params.eq).forEach(([key, value]) => {
      queryParams.append(key, `eq.${value}`);
    });
  }
  if (params.neq) {
    Object.entries(params.neq).forEach(([key, value]) => {
      queryParams.append(key, `neq.${value}`);
    });
  }
  if (params.order) queryParams.append('order', params.order);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.offset) queryParams.append('offset', params.offset);

  const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: params.body ? JSON.stringify(params.body) : undefined
  });

  if (!response.ok) {
    const error = await response.text();
    return { data: null, error: { message: error, status: response.status } };
  }

  const data = await response.json();
  return { data: Array.isArray(data) ? data : [data], error: null };
}

// Generate SHA-256 password hash
async function hashPassword(password) {
  // Generate random salt
  const saltArray = new Uint8Array(16);
  crypto.getRandomValues(saltArray);
  const salt = btoa(String.fromCharCode(...saltArray));
  
  // Create hash: salt + SHA256(password + salt)
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = btoa(String.fromCharCode(...hashArray));
  
  return salt + hash;
}

// Verify any authenticated token (admin or coach)
async function verifyAnyToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing token' };
  }

  const token = authHeader.substring(7);
  try {
    const payload = await verifyJWT(token, env.JWT_SECRET || 'fallback-secret-key-change-in-production');
    return { valid: true, user: payload };
  } catch (err) {
    return { valid: false, error: 'Invalid token' };
  }
}

// Generate unique player key
function generatePlayerKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'P-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// GET - List all players (with optional filters)
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  try {
    // Allow public access - return all players
    let params = {
      select: '*',
      order: 'created_at.desc'
    };

    const { data: players, error } = await supabaseQuery(env, 'players', 'GET', params);

    if (error) {
      return new Response(
        JSON.stringify({ detail: 'Failed to fetch players', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(players || []),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ detail: 'Error: ' + err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST - Create new player (from intake form)
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Log environment status (without exposing secrets)
    console.log('Player creation started');
    console.log('SUPABASE_URL available:', !!env.SUPABASE_URL);
    console.log('SUPABASE_ANON_KEY available:', !!env.SUPABASE_ANON_KEY);

    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({
          detail: 'Server configuration error: Database connection not configured',
          error: 'MISSING_ENV_VARS',
          help: 'Please ensure SUPABASE_ANON_KEY is set via wrangler secret put SUPABASE_ANON_KEY'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    let body;
    try {
      body = await request.json();
      console.log('Request body received:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ detail: 'Invalid JSON in request body', error: parseError.message }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    // Required fields (matching frontend form validation)
    const required = ['player_name', 'grad_class', 'gender', 'primary_position'];
    const missingFields = [];
    for (const field of required) {
      if (!body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({
          detail: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields: missingFields,
          receivedData: Object.keys(body)
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    // Also require parent info
    if (!body.parent_name || !body.parent_email) {
      console.log('Missing parent info');
      return new Response(
        JSON.stringify({
          detail: 'Parent name and email are required',
          missingParentInfo: {
            parent_name: !body.parent_name ? 'missing' : 'provided',
            parent_email: !body.parent_email ? 'missing' : 'provided'
          }
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    const playerKey = generatePlayerKey();
    
    // Generate a temporary password for the player
    const tempPassword = await hashPassword('TempPass123!');

    // Build player data using ONLY columns that exist in Supabase
    // Based on testing: id, created_at, updated_at, user_id, player_id, email, name,
    // first_name, last_name, full_name exist - other columns may not
    const isFreeTier = body.package_selected === 'free';
    
    // Prepare the data payload - start minimal and add fields that might work
    const playerData = {
      // Core fields that should exist
      name: body.player_name,
      email: body.player_email || body.parent_email,
      first_name: body.player_name.split(' ')[0] || body.player_name,
      last_name: body.player_name.split(' ').slice(1).join(' ') || '',
      full_name: body.player_name,
      
      // Store everything else in player_id field as a JSON string
      // This is a workaround for schema mismatch issues
      player_id: playerKey,
      
      // Store password and extended data in user_id as JSON
      user_id: JSON.stringify({
        player_key: playerKey,
        password_hash: tempPassword,
        graduation_year: body.grad_class ? parseInt(body.grad_class) : null,
        school: body.school || null,
        state: body.state || null,
        height: body.height || null,
        weight: body.weight ? parseInt(body.weight) : null,
        positions: body.secondary_position
          ? [body.primary_position, body.secondary_position]
          : [body.primary_position],
        gender: body.gender,
        primary_position: body.primary_position,
        secondary_position: body.secondary_position || null,
        stats: {
          ppg: body.ppg,
          rpg: body.rpg,
          apg: body.apg,
          spg: body.spg,
          bpg: body.bpg,
          fg_pct: body.fg_pct,
          three_pct: body.three_pct,
          ft_pct: body.ft_pct
        },
        instagram: body.instagram_handle || null,
        parent_name: body.parent_name,
        parent_email: body.parent_email,
        parent_phone: body.parent_phone || null,
        is_verified: false,
        payment_status: isFreeTier ? 'free' : 'pending',
        package_selected: body.package_selected || null,
        is_free_tier: isFreeTier,
        // All extended intake data
        intake_data: {
          preferred_name: body.preferred_name,
          dob: body.dob,
          jersey_number: body.jersey_number,
          city: body.city,
          level: body.level,
          team_names: body.team_names,
          league_region: body.league_region,
          self_evaluation: {
            self_words: body.self_words,
            strength: body.strength,
            improvement: body.improvement,
            separation: body.separation,
            adversity_response: body.adversity_response,
            iq_self_rating: body.iq_self_rating,
            pride_tags: body.pride_tags,
            player_model: body.player_model
          },
          film_links: body.film_links,
          highlight_links: body.highlight_links,
          other_socials: body.other_socials,
          goal: body.goal,
          colleges_interest: body.colleges_interest,
          consent_eval: body.consent_eval,
          consent_media: body.consent_media,
          guardian_signature: body.guardian_signature,
          signature_date: body.signature_date
        },
        created_at: new Date().toISOString()
      })
    };

    console.log('Inserting player data into Supabase...');
    console.log('Player data keys:', Object.keys(playerData));

    const { data, error } = await supabaseQuery(env, 'players', 'POST', {
      body: playerData
    });

    if (error) {
      console.error('Player creation error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Provide helpful error information
      let errorDetail = 'Failed to create player';
      let errorCode = 'DB_ERROR';
      let helpMessage = 'Check your Supabase configuration';
      let requiresAction = false;

      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes('23505') || errorMsg.includes('unique constraint')) {
        errorDetail = 'A player with this email already exists';
        errorCode = 'DUPLICATE_EMAIL';
        helpMessage = 'Use a different email address or contact support';
      } else if (errorMsg.includes('23502') || errorMsg.includes('not-null')) {
        errorDetail = 'Required database field is missing';
        errorCode = 'NOT_NULL_VIOLATION';
        helpMessage = 'The database requires additional columns. See supabase_schema_fix.sql in the project root.';
        requiresAction = true;
      } else if (errorMsg.includes('42p01')) {
        errorDetail = 'Database table not found';
        errorCode = 'TABLE_NOT_FOUND';
        helpMessage = 'Create the players table in Supabase';
        requiresAction = true;
      } else if (errorMsg.includes('permission') || errorMsg.includes('policy')) {
        errorDetail = 'Database permission denied - RLS policy issue';
        errorCode = 'PERMISSION_DENIED';
        helpMessage = 'Enable INSERT permissions for anonymous users in Supabase RLS policies. Run the SQL in supabase_schema_fix.sql';
        requiresAction = true;
      } else if (errorMsg.includes('column') && errorMsg.includes('does not exist')) {
        errorDetail = 'Database schema mismatch';
        errorCode = 'SCHEMA_MISMATCH';
        helpMessage = 'Your Supabase table structure differs from the API expectations. The API now uses minimal fields. If this persists, run supabase_schema_fix.sql';
        requiresAction = true;
      } else if (errorMsg.includes('schema cache') || errorMsg.includes('pgrst204')) {
        errorDetail = 'Database schema cache error - columns not found for INSERT';
        errorCode = 'SCHEMA_CACHE_ERROR';
        helpMessage = 'This is usually a Row Level Security (RLS) issue, not a missing column. Anonymous users need INSERT permissions. Run supabase_schema_fix.sql in your Supabase SQL Editor.';
        requiresAction = true;
      }

      const responsePayload = {
        detail: errorDetail,
        error: error.message,
        code: errorCode,
        help: helpMessage,
        requiresSupabaseFix: requiresAction,
        fixInstructions: requiresAction ? [
          '1. Go to https://supabase.com/dashboard',
          '2. Select your project (srrasrbsqajtssqlxoju)',
          '3. Go to SQL Editor',
          '4. Run the contents of supabase_schema_fix.sql',
          '5. This will add missing columns and fix RLS policies'
        ] : undefined
      };

      return new Response(
        JSON.stringify(responsePayload),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    console.log('Player created successfully:', data[0]?.id || 'unknown id');

    // Get package price for Stripe integration
    const packagePrices = {
      'free': 0,
      'starter': 99,
      'development': 199,
      'elite_track': 399
    };
    const packagePrice = packagePrices[body.package_selected] || 0;

    // Return player data with payment info
    return new Response(
      JSON.stringify({ 
        success: true, 
        player: data[0], 
        player_key: playerKey,
        message: isFreeTier ? 'Free profile created successfully! Upgrade anytime.' : 'Player created successfully',
        payment_required: !isFreeTier && packagePrice > 0,
        package_price: packagePrice,
        is_free_tier: isFreeTier,
        temp_password: 'TempPass123!'
      }),
      { status: 201, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    console.error('Server error:', err);
    console.error('Error stack:', err.stack);
    return new Response(
      JSON.stringify({
        detail: 'Internal server error: ' + err.message,
        error: err.message,
        help: 'Please check server logs for more details'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}

// OPTIONS - CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
