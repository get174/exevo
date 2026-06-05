'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PREMIUM_PLANS,
  PREMIUM_BENEFITS,
  type Profile,
  type PremiumPlan,
} from '@/types/profile';
import { PaymentDialog } from './PaymentDialog';

interface PremiumSettingsProps {
  profile: Profile;
  isLoading: boolean;
  onUpgrade: (planId: string) => Promise<void>;
}

export function PremiumSettings({ profile, isLoading, onUpgrade }: PremiumSettingsProps) {
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const isPremium = profile.subscription === 'premium';

  const handleSelectPlan = (plan: PremiumPlan) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async () => {
    if (selectedPlan) {
      setIsUpgrading(true);
      try {
        await onUpgrade(selectedPlan.id);
      } finally {
        setIsUpgrading(false);
        setShowPaymentDialog(false);
        setSelectedPlan(null);
      }
    }
  };

  if (isPremium) {
    return (
      <Card className="border-2 border-exevo-orange/30 bg-gradient-to-br from-exevo-orange/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-exevo-orange/10">
              <Crown className="h-5 w-5 text-exevo-orange" />
            </div>
            <CardTitle className="text-lg">Statut Premium</CardTitle>
            <Badge className="bg-exevo-orange text-white">Actif</Badge>
          </div>
          <CardDescription>
            Vous avez accès à toutes les fonctionnalités Premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PREMIUM_BENEFITS.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-exevo-orange/5"
              >
                <span className="text-lg">{benefit.icon}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {benefit.title}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <Card className="border-2 border-exevo-orange/30 bg-gradient-to-br from-exevo-blue to-exevo-blue/90 text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-exevo-orange" />
              <CardTitle className="text-xl text-white">Passer Premium</CardTitle>
            </div>
            <CardDescription className="text-slate-200">
              Débloquez toutes les fonctionnalités et accélérez votre préparation à l&apos;Exetat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PREMIUM_BENEFITS.slice(0, 3).map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xl">{benefit.icon}</span>
                  <span className="text-sm font-medium">{benefit.title}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid gap-4 md:grid-cols-3">
          {PREMIUM_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-2 border-exevo-orange ring-2 ring-exevo-orange/20'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-exevo-orange text-white px-3 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-2">
                    <span className="text-2xl font-bold text-exevo-blue">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">CDF</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isLoading || isUpgrading}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-exevo-orange hover:bg-exevo-orange/90 text-white'
                        : ''
                    }`}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Choisir ce plan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Dialog */}
      {selectedPlan && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          plan={selectedPlan}
          onPaymentSuccess={handlePaymentSuccess}
          isLoading={isUpgrading}
        />
      )}
    </>
  );
}