// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the code from the request
    const { code } = await req.json()

    if (!code) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Código de cupom não fornecido' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Check if the coupon exists and is active
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select(`
        *,
        participations:participation_id (
          creator_id,
          campaign_id,
          campaigns:campaign_id (
            title,
            brand_id,
            brands:brand_id (
              name
            )
          ),
          creators:creator_id (
            name
          )
        )
      `)
      .eq('code', code)
      .eq('status', 'active')
      .single()

    if (couponError || !coupon) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Cupom inválido ou expirado' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    // Return the coupon details
    return new Response(
      JSON.stringify({
        success: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          value: coupon.value,
          campaign: {
            id: coupon.participations.campaign_id,
            title: coupon.participations.campaigns.title,
          },
          brand: {
            id: coupon.participations.campaigns.brand_id,
            name: coupon.participations.campaigns.brands.name,
          },
          creator: {
            id: coupon.participations.creator_id,
            name: coupon.participations.creators.name,
          },
        },
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erro interno do servidor',
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
