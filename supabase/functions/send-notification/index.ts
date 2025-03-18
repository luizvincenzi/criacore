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

    // Get the notification data from the request
    const { userId, title, content, type, metadata } = await req.json()

    if (!userId || !title || !content || !type) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Dados incompletos para envio de notificação' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Create the notification in the database
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title,
          content,
          type,
          metadata: metadata || {},
          is_read: false,
        }
      ])
      .select()
      .single()

    if (notificationError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Erro ao criar notificação',
          error: notificationError.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // If this is an email notification, we would integrate with an email service here
    // For example, using SendGrid, Mailgun, etc.
    if (type === 'email') {
      // This is a placeholder for email integration
      console.log(`Email would be sent to user ${userId} with title: ${title}`)
      
      // In a real implementation, you would call the email service API here
      // const emailSent = await sendEmail(userId, title, content)
    }

    // If this is a push notification, we would integrate with a push service here
    if (type === 'push') {
      // This is a placeholder for push notification integration
      console.log(`Push notification would be sent to user ${userId} with title: ${title}`)
      
      // In a real implementation, you would call the push service API here
      // const pushSent = await sendPushNotification(userId, title, content)
    }

    // Return the notification details
    return new Response(
      JSON.stringify({
        success: true,
        notification: {
          id: notification.id,
          userId: notification.user_id,
          title: notification.title,
          content: notification.content,
          type: notification.type,
          createdAt: notification.created_at,
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
