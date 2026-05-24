# TODO: Settings Module - Exevo

## Task Summary
Develop the complete "Paramètres" (Settings) module for Exevo without modifying the existing dashboard.

## Database
- [ ] Create `user_preferences` table in database/schema.sql

## Types
- [ ] Add UserPreferences interface to types/profile.ts
- [ ] Add SettingsFormData interface
- [ ] Add NotificationSettings interface

## Components
- [ ] Create app/dashboard/settings/page.tsx with all 5 sections:
  - [ ] Section 1: Account Info (Informations du compte)
  - [ ] Section 2: Password & Security (Mot de passe et sécurité)
  - [ ] Section 3: Preferences (Préférences - theme, language)
  - [ ] Section 4: Notifications (Notifications)
  - [ ] Section 5: Data & Privacy (Données et confidentialité)

## Navigation
- [ ] Update sidebar to link to /dashboard/settings

## Features Required
- [ ] Form validation with Zod
- [ ] Password strength indicator
- [ ] Show/hide password toggle
- [ ] Active sessions display
- [ ] Theme switcher (Light/Dark/System)
- [ ] Language selector
- [ ] Notification toggles
- [ ] Data export functionality
- [ ] Account delete with confirmation
- [ ] Toast notifications
- [ ] Skeleton loading states
- [ ] Mobile responsive design
- [ ] Framer Motion animations

## UI Requirements
- [ ] African EdTech premium style
- [ ] Dark blue + Orange + White color scheme
- [ ] Modern cards
- [ ] Mobile-optimized touch targets
- [ ] Responsive design

## Dependencies Used
- Next.js 15 App Router
- TypeScript
- TailwindCSS
- shadcn/ui components
- Framer Motion
- Lucide React
- Supabase
- React Hook Form
- Zod
