'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Smartphone, CreditCard, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  PAYMENT_METHODS,
  type PremiumPlan,
  type PaymentMethod,
  type PaymentFormData,
} from '@/types/profile';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PremiumPlan;
  onPaymentSuccess: () => Promise<void>;
  isLoading: boolean;
}

export function PaymentDialog({
  open,
  onOpenChange,
  plan,
  onPaymentSuccess,
  isLoading,
}: PaymentDialogProps) {
  const [step, setStep] = useState<'method' | 'confirmation' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('airtel_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setStep('confirmation');
  };

  const handleConfirm = async () => {
    setStep('processing');
    setIsProcessing(true);

    try {
      const paymentData: PaymentFormData = {
        paymentMethod,
        phoneNumber,
        amount: plan.price,
        planId: plan.id,
      };

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du traitement du paiement');
      }

      setStep('success');
      toast.success('Paiement réussi ! Bienvenue Premium !');
      await onPaymentSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Le paiement a échoué. Veuillez réessayer.');
      setStep('method');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setStep('method');
      setPhoneNumber('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'method' && 'Méthode de paiement'}
            {step === 'confirmation' && 'Confirmer le paiement'}
            {step === 'processing' && 'Traitement en cours...'}
            {step === 'success' && 'Paiement réussi !'}
          </DialogTitle>
          <DialogDescription>
            {step === 'method' && `Payer ${plan.price.toLocaleString()} CDF pour ${plan.name}`}
            {step === 'confirmation' && 'Veuillez confirmer vos informations'}
            {step === 'processing' && 'Veuillez patienter pendant le traitement de votre paiement...'}
            {step === 'success' && 'Votre abonnement Premium est maintenant actif'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Select Payment Method */}
          {step === 'method' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="grid grid-cols-2 gap-3"
              >
                {PAYMENT_METHODS.map((method) => (
                  <Label
                    key={method.value}
                    htmlFor={method.value}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-exevo-orange/50 ${
                      paymentMethod === method.value
                        ? 'border-exevo-orange bg-exevo-orange/5'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <RadioGroupItem value={method.value} id={method.value} className="sr-only" />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </Label>
                ))}
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Numéro de téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ex: 0812345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="text-lg"
                />
                <p className="text-xs text-slate-500">
                  Vous recevrez une notification pour confirmer le paiement
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!phoneNumber || phoneNumber.length < 9}
                className="w-full bg-exevo-orange hover:bg-exevo-orange/90 text-white"
              >
                Continuer
              </Button>
            </motion.div>
          )}

          {/* Step 2: Confirmation */}
          {step === 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="rounded-lg border bg-slate-50 dark:bg-slate-800 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-medium">{plan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Durée</span>
                  <span className="font-medium">{plan.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Méthode</span>
                  <span className="font-medium">
                    {PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Téléphone</span>
                  <span className="font-medium">{phoneNumber}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-exevo-blue text-lg">
                    {plan.price.toLocaleString()} CDF
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('method')}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="flex-1 bg-exevo-orange hover:bg-exevo-orange/90 text-white"
                >
                  Confirmer
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-8"
            >
              <Loader2 className="h-12 w-12 text-exevo-orange animate-spin mb-4" />
              <p className="text-slate-500 text-center">
                Traitement de votre paiement...
                <br />
                Veuillez patienter
              </p>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8"
            >
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                Bienvenue Premium !
              </h3>
              <p className="text-slate-500 text-center mb-4">
                Votre paiement a été traité avec succès.
                <br />
                Vous avez maintenant accès à toutes les fonctionnalités Premium.
              </p>
              <Button
                onClick={handleClose}
                className="w-full bg-exevo-orange hover:bg-exevo-orange/90 text-white"
              >
                Commencer à explorer
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}