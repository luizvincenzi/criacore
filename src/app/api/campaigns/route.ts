import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = "force-static"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      )
    }
    
    // Get user data to check if they are a brand
    const { data: userData, error: userError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Apenas marcas podem criar campanhas.' },
        { status: 403 }
      )
    }
    
    // Get campaign data from request
    const campaignData = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'start_date', 'end_date']
    for (const field of requiredFields) {
      if (!campaignData[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório ausente: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Add brand_id to campaign data
    campaignData.brand_id = session.user.id
    
    // Insert campaign into database
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single()
    
    if (campaignError) {
      console.error('Erro ao criar campanha:', campaignError)
      return NextResponse.json(
        { error: 'Erro ao criar campanha. Por favor, tente novamente.' },
        { status: 500 }
      )
    }
    
    // Create notification for the brand
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: session.user.id,
          title: 'Campanha criada com sucesso',
          content: `Sua campanha "${campaign.title}" foi criada com sucesso.`,
          type: 'campaign_created',
          is_read: false,
          metadata: { campaign_id: campaign.id }
        }
      ])
    
    // Return the created campaign
    return NextResponse.json({ campaign }, { status: 201 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit
    
    // Check if user is a brand or creator
    const { data: brandData } = await supabase
      .from('brands')
      .select('id')
      .eq('id', session.user.id)
      .single()
    
    let query = supabase.from('campaigns').select(`
      *,
      brands:brand_id (
        name,
        logo_url
      ),
      participations:participations (
        id,
        status,
        creator_id
      )
    `)
    
    // If user is a brand, show only their campaigns
    if (brandData) {
      query = query.eq('brand_id', session.user.id)
    } else {
      // If user is a creator, show only active campaigns or campaigns they're participating in
      query = query.eq('status', 'active')
    }
    
    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }
    
    // Add pagination
    query = query.range(offset, offset + limit - 1)
    
    // Order by created_at (newest first)
    query = query.order('created_at', { ascending: false })
    
    // Execute query
    const { data: campaigns, error, count } = await query
    
    if (error) {
      console.error('Erro ao buscar campanhas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar campanhas. Por favor, tente novamente.' },
        { status: 500 }
      )
    }
    
    // Return campaigns with pagination info
    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: count ? Math.ceil(count / limit) : 0
      }
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
