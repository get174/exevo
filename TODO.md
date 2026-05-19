# Exevo - Plateforme Éducative Congolaise

## 🎯 Objectif
Créer une landing page professionnelle pour Exevo, une plateforme éducative de préparation à l'Exetat en République Démocratique du Congo.

## 📋 Plan de Développement

## 🔄 Mise à jour demandée (RDC Flag Theme)
- [ ] A. Adapter toute la charte visuelle aux couleurs du drapeau RDC
- [ ] B. Mettre à jour `globals.css` et `tailwind.config.ts`
- [ ] C. Harmoniser toutes les sections/pages avec la nouvelle palette
- [ ] D. Rebuild de validation

### Phase 1: Configuration Globale
- [ ] 1.1. Mettre à jour `app/globals.css` avec les couleurs personnalisées (Bleu foncé #0F172A, Orange #F97316)
- [ ] 1.2. Configurer `tailwind.config.ts` avec les couleurs et animations personnalisées
- [ ] 1.3. Mettre à jour `app/layout.tsx` avec le ThemeProvider et metadata SEO
- [ ] 1.4. Créer le fichier de configuration du thème dans `components/theme-provider.tsx`

### Phase 2: Composants UI de Base
- [ ] 2.1. Créer `components/Navbar.tsx` (navigation sticky avec blur)
- [ ] 2.2. Créer `components/Hero.tsx` (section principale avec titre et statistiques)
- [ ] 2.3. Créer `components/Features.tsx` (6 cartes de fonctionnalités)
- [ ] 2.4. Créer `components/HowItWorks.tsx` (3 étapes horizontales)
- [ ] 2.5. Créer `components/Sections.tsx` (cartes des sections disponibles)
- [ ] 2.6. Créer `components/CTA.tsx` (section d'appel à l'action)
- [ ] 2.7. Créer `components/Footer.tsx` (pied de page complet)

### Phase 3: Pages d'Authentification
- [ ] 3.1. Créer `app/login/page.tsx` (page de connexion)
- [ ] 3.2. Créer `app/register/page.tsx` (page d'inscription)

### Phase 4: Page Principale
- [ ] 4.1. Implémenter `app/page.tsx` avec tous les composants assemblés
- [ ] 4.2. Vérifier le responsive design mobile/desktop
- [ ] 4.3. Tester les animations Framer Motion

### Phase 5: Optimisation
- [ ] 5.1. Vérifier l'accessibilité SEO
- [ ] 5.2. Tester le dark/light mode
- [ ] 5.3. Optimiser les performances

## 🎨 Design System

### Couleurs
- **Primary**: Bleue foncé `#0F172A`
- **Secondary**: Orange `#F97316`
- **Background**: Blanc `#FFFFFF`
- **Text**: Gris foncé `#334155`
- **Accent**: Orange clair `#FB923C`

### Typographie
- Font principale: Inter (Google Fonts)
- Titres: bold, grande taille
- Corps: regular, lisible

### Animations
- Transitions douces (300ms ease)
- Hover effects sur les cartes
- Scroll animations avec Framer Motion

## ✅ Critères de Succès
- Design moderne et professionnel
- Responsive mobile Android
- Animations fluides
- Navigation intuitive
- Code propre et structuré
- SEO optimisé
- Dark/Light mode fonctionnel

## 🚀 Technologies
- Next.js 13.5.1
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Lucide React
- next-themes

---
*Dernière mise à jour: $(date)*
