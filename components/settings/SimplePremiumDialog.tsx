'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PREMIUM_PLANS,
  type PremiumPlan,
} from '@/types/profile';
import { PaymentDialog } from './PaymentDialog';

interface SimplePremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => Promise<void>;
  isLoading: boolean;
}

export function SimplePremiumDialog({
  open,
  onOpenChange,
  onPaymentSuccess,
  isLoading,
}: SimplePremiumDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleSelectPlan = (plan: PremiumPlan) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async () => {
    await onPaymentSuccess();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-exevo-orange" />
              Passer Premium
            </DialogTitle>
            <DialogDescription>
              Choisissez le plan qui vous convient le mieux et débloquez toutes les fonctionnalités
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {PREMIUM_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    plan.popular
                      ? 'border-exevo-orange bg-exevo-orange/5'
                      : 'border-slate-200 dark:border-slate-700 hover:border-exevo-orange/50'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-200">
                        {plan.name}
                      </h4>
                      <p className="text-sm text-slate-500">{plan.description}</p>
                    </div>
                    {plan.popular && (
                      <Badge className="bg-exevo-orange text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Populaire
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-exevo-blue">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">CDF</span>
                    </div>

                    <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
                      {plan.features.slice(0, 2).map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-600 dark:text-slate-400"
                        >
                          {feature}
                        </span>
                      ))}
                      {plan.features.length > 2 && (
                        <span className="text-xs text-slate-400 px-2 py-1">
                          +{plan.features.length - 2} autres
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {selectedPlan && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          plan={selectedPlan}
          onPaymentSuccess={handlePaymentSuccess}
          isLoading={isLoading}
        />
      )}
    </>
  );
}