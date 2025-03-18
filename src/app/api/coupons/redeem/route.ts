import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('id, name')
      .eq('id', session.user.id)
      .single()
    
    if (brandError || !brandData) {
      return NextResponse.json(
        { error: 'Apenas marcas podem resgatar cupons.' },
        { status: 403 }
      )
    }
    
    // Get redemption data from request
    const { code, location, value } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Código do cupom é obrigatório.' },
        { status: 400 }
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
            brand_id
          )
        )
      `)
      .eq('code', code)
      .eq('status', 'active')
      .single()
    
    if (couponError || !coupon) {
      return NextResponse.json(
        { error: 'Cupom inválido ou expirado.' },
        { status: 404 }
      )
    }
    
    // Check if the coupon belongs to a campaign from this brand
    if (coupon.participations.campaigns.brand_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Este cupom não pertence a uma campanha da sua marca.' },
        { status: 403 }
      )
    }
    
    // Update coupon status to used
    const { error: updateError } = await supabase
      .from('coupons')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        used_by: brandData.name
      })
      .eq('id', coupon.id)
    
    if (updateError) {
      console.error('Erro ao atualizar status do cupom:', updateError)
      return NextResponse.json(
        { error: 'Erro ao resgatar cupom. Por favor, tente novamente.' },
        { status: 500 }
      )
    }
    
    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('coupon_redemptions')
      .insert([
        {
          coupon_id: coupon.id,
          location: location || brandData.name,
          value: value || coupon.value,
          metadata: {
            redeemed_by: session.user.id,
            redeemed_by_name: brandData.name
          }
        }
      ])
      .select()
      .single()
    
    if (redemptionError) {
      console.error('Erro ao criar registro de resgate:', redemptionError)
      return NextResponse.json(
        { error: 'Erro ao registrar resgate. Por favor, tente novamente.' },
        { status: 500 }
      )
    }
    
    // Update participation earnings if value is provided
    if (value) {
      await supabase
        .from('participations')
        .update({
          earnings: supabase.rpc('increment', { x: value }),
        })
        .eq('id', coupon.participation_id)
    }
    
    // Create notification for the creator
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: coupon.participations.creator_id,
          title: 'Cupom resgatado',
          content: `Seu cupom "${code}" foi resgatado por ${brandData.name}.`,
          type: 'coupon_redeemed',
          is_read: false,
          metadata: { 
            coupon_id: coupon.id,
            brand_id: session.user.id,
            brand_name: brandData.name,
            value: value || coupon.value
          }
        }
      ])
    
    // Return the redemption details
    return NextResponse.json({
      success: true,
      redemption: {
        id: redemption.id,
        coupon_code: code,
        redeemed_at: redemption.redeemed_at,
        value: redemption.value
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
