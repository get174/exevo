import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { PREMIUM_PLANS } from '@/types/profile';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentMethod, phoneNumber, amount, planId } = body;

    // Validate the plan
    const plan = PREMIUM_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    // Validate amount matches plan price
    if (amount !== plan.price) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });
    }

    // In a real application, you would integrate with a payment provider here
    // For example, Airtel Money API, M-Pesa API, or a payment gateway
    // For demo purposes, we'll simulate a successful payment

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create payment session record (for audit purposes)
    const { data: paymentSession, error: sessionError } = await supabase
      .from('payment_sessions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount: amount,
        payment_method: paymentMethod,
        phone_number: phoneNumber,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating payment session:', sessionError);
    }

    // Update user profile subscription status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription: 'premium',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error updating subscription:', profileError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut Premium' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Paiement traité avec succès',
      subscription: 'premium',
      plan: plan.name,
      paymentSession,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    // Get user's payment history
    const { data: paymentSessions, error: sessionsError } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching payment sessions:', sessionsError);
      return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
    }

    return NextResponse.json(paymentSessions || []);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}