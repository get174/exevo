# Settings Module Plan - Exevo

## Information Gathered

### Existing Files Analyzed:
1. **app/dashboard/profile/page.tsx** - Contains profile UI components using:
   - Framer Motion animations
   - shadcn/ui components (Card, Avatar, Badge, Button, Progress)
   - Sample data from types/profile.ts
   
2. **types/profile.ts** - Contains interfaces:
   - Profile, UserStats, SubjectProgress, Activity, PersonalGoal
   - Sample data: SAMPLE_PROFILE, SAMPLE_USER_STATS
   - Constants: PROVINCES, SCHOOL_OPTIONS, EXAM_YEARS
   
3. **database/schema.sql** - Contains tables:
   - profiles, user_stats, subject_progress
   - user_activities, personal_goals
   - No user_preferences table exists yet

4. **components/dashboard/sidebar.tsx** - Navigation items with settings link pointing to `/dashboard/profile` (incorrect)

5. **tailwind.config.ts** - Custom colors:
   - exevo-blue: #0F172A
   - exevo-orange: #F97316
   - exevo-light-orange: #FB923C
   - exevo-cream: #FFF7ED

### Tech Stack Dependencies:
- Next.js 15 App Router
- TypeScript
- TailwindCSS
- shadcn/ui (already: Button, Card, Input, Switch, Dialog, AlertDialog, Select, etc.)
- Framer Motion
- Lucide React
- Supabase (for data)
- React Hook Form + Zod (for validation)

---

## Plan

### Step 1: Update Database Schema
Add `user_preferences` table to database/schema.sql:
```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en', 'ln', 'sw')),
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  new_exams_notifications BOOLEAN DEFAULT true,
  new_quiz_notifications BOOLEAN DEFAULT true,
  results_notifications BOOLEAN DEFAULT true,
  premium_promo_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Step 2: Add Types
Add to types/profile.ts:
- UserPreferences interface
- SettingsFormData interface  
- NotificationSettings interface
- PasswordChangeFormData interface
- AccountDeleteFormData interface

### Step 3: Create Settings Page
Create app/dashboard/settings/page.tsx with:

**Section 1: Account Information Card**
- Display: full name, phone, email, school, province, option, exam_year
- Fields: all editable with validation (Zod)
- Phone validation: +243 format for DRC
- Email validation: proper email format

**Section 2: Password & Security Card**  
- Current password field (with show/hide toggle)
- New password field (with strength indicator)
- Password strength: weak/medium/strong/very strong
- Confirm password field
- Real-time validation

**Section 3: Active Sessions Card**
- Display device, browser, last activity
- "Disconnect this device" button
- "Disconnect all devices" button

**Section 4: Preferences Card**
- Theme selector: Clair / Sombre / Système (3 options)
- Language selector: Français, Anglais (Lingala/Swahili prepare only)

**Section 5: Notifications Card**
- Toggle switches for:
  - Nouveaux examens disponibles
  - Nouveaux quiz
  - Résultats et progression
  - Promotions premium
  - Notifications email

**Section 6: Data & Privacy Card**
- "Télécharger mes données" button (exports: profile, quiz history, downloads, stats)
- "Supprimer mon compte" button with:
  - Alert dialog confirmation
  - Password + confirmation input
  - Warning message about irreversibility

### Step 4: Update Navigation
Fix sidebar.tsx to link Settings to /dashboard/settings

### Step 5: UX Features
- Skeleton loading states while data loads
- Toast notifications for success/error feedback
- Confirmation dialogs before sensitive actions
- Auto-save for preferences
- Framer Motion page transitions

---

## Dependent Files to Edit

1. **database/schema.sql** - Add user_preferences table
2. **types/profile.ts** - Add settings types and interfaces
3. **components/dashboard/sidebar.tsx** - Fix settings link path
4. **app/dashboard/settings/page.tsx** - Create full settings page

---

## Followup Steps

After creating files:
1. Test form validation
2. Verify Supabase connection for preferences
3. Test responsive mobile layout
4. Test all animations and transitions
5. Verify toast notifications
6. Test delete account flow

---

## Implementation Order

1. Add types to types/profile.ts
2. Add table to database/schema.sql  
3. Fix sidebar navigation
4. Create full settings page with all sections
5. Test and verify
