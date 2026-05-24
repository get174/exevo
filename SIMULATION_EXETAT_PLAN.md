# Simulation Exetat Réaliste - Plan de Développement

## 1. Information Gathered

### Contexte du Projet
- **Tech Stack**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Lucide React, Supabase
- **URL cible**: `/dashboard/simulations`
- **Objectif**: Reproduire une expérience proche d'un vrai Exetat papier avec identification candidat, grille d'items, cases à remplir, chronomètre réel, navigation entre questions, correction automatique

### Structure existante analysée
- Dashboard layout: `app/dashboard/layout.tsx` - utilise `DashboardSidebar` et `DashboardHeader`
- Sidebar: `components/dashboard/sidebar.tsx` - déjà configurée avec menuItems
- UI Components disponibles: Button, Checkbox, Input, Select, RadioGroup, Card, Dialog, etc.
- Couleurs Exevo: `exevo-blue: #0F172A`, `exevo-orange: #F97316`, `exevo-light-orange: #FB923C`
- Animations existantes: fade-in-up, scale-in, slide-in-right, float

### Composants UI nécessaires à créer
- **CodeCandidatGrid**: Grille visuelle pour sélectionner les chiffres (0-9) avec bulles
- **BubbleButton**: Bouton circulaire style feuille papier (○ ●)
- **QuestionNavigator**: Liste des questions avec couleurs (bleu=actuelle, orange=répondue, gris=non répondue)
- **ExamTimer**: Chronomètre with color changes (orange dernière minute, rouge dernière minute)
- **ItemSheet**: Panneau latéral affichant toutes les réponses
- **CorrectionView**: Vue détaillée des résultats avec bonnes/mauvaises réponses

### Tables Supabase à créer
- `simulations`: id, candidate_id, candidate_name, candidate_code, option, school, province, status, started_at, ended_at, created_at
- `simulation_questions`: id, simulation_id, question_number, question_text, options (json), correct_answer, explanation
- `simulation_answers`: id, simulation_id, question_id, selected_answer, answered_at
- `simulation_results`: id, simulation_id, score, correct_count, wrong_count, time_used, created_at

---

## 2. Plan de Développement

### Phase 1: Structure des données et types (Fichiers à créer)
1. **Database Schema** - `database/schema.sql`
   - CREATE TABLE simulations
   - CREATE TABLE simulation_questions
   - CREATE TABLE simulation_answers
   - CREATE TABLE simulation_results

2. **Types** - `types/simulation.ts`
   - CandidateInfo
   - SimulationQuestion
   - SimulationAnswer
   - SimulationResult
   - ExamState

### Phase 2: Composants UI (Fichiers à créer)
3. **CodeCandidatGrid** - `components/simulation/code-candidat-grid.tsx`
   - Grille 0-9 avec selection de chiffres
   - Animation de noircissement (Framer Motion)
   - Affichage du code sélectionné

4. **BubbleButton** - `components/simulation/bubble-button.tsx`
   - States: empty (○), filled (●)
   - Animation de remplissage

5. **QuestionNavigator** - `components/simulation/question-navigator.tsx`
   - Liste questions avec couleurs dynamiques
   - Click handlers pour navigation

6. **ExamTimer** - `components/simulation/exam-timer.tsx`
   - Format HH:MM:SS
   - Changements de couleur: normal → orange (derniières 2 min) → rouge + blink (Dernière minute)

7. **ItemSheet** - `components/simulation/item-sheet.tsx`
   - Vue condensée de toutes les réponses
   - Auto-update quand réponse sélectionnée

8. **CorrectionView** - `components/simulation/correction-view.tsx`
   - Score final
   - Liste des réponses correctes/utilisateur
   - Explications

### Phase 3: Pages principales (Fichiers à créer)
9. **Page d'identification** - `app/dashboard/simulations/page.tsx` (Step 1)
   - Formulaire candidat (nom, prénom, sexe, option, province, école)
   - Code candidat grid
   - Passage vers instructions

10. **Page Instructions** - Step 2
    - Liste des consignes
    - Checkbox de validation
    - Bouton Start

11. **Page Examen** - Step 3
    - QuestionNavigator (colonne gauche)
    - Zone principale (question + réponses bubbles)
    - ItemSheet (panneau droit)
    - ExamTimer (header)
    - autosave vers Supabase

12. **Page Résultats** - Fin examen
    - Calcul automatique du score
    - CorrectionView détaillée

### Phase 4: Hooks et utilitaires (Fichiers à créer)
13. **Hook useExamTimer** - `hooks/use-exam-timer.ts`
    - Gestion du temps
    - Auto-submit quand temps écoulé

14. **Hook useAutosave** - `hooks/use-autosave.ts`
    - Sauvegarde automatique des réponses
    - Reprise après fermeture

15. **Lib simulation** - `lib/simulation.ts`
    - Fonctions utilitaires (calcul score, etc.)

### Phase 5: Intégration sidebar et navigation
16. **Mise à jour sidebar** - `components/dashboard/sidebar.tsx`
    - Update menu item Simulations vers `/dashboard/simulations`

---

## 3. Dependent Files

| Fichier | Action |
|---------|--------|
| `components/dashboard/sidebar.tsx` | Modifier menu item Simulations |
| `tailwind.config.ts` | Ajouter couleurs timer si nécessaire |
| `lib/supabase.ts` | Ajouter fonctions si nécessaire |

---

## 4. Followup Steps

1. **Créer database schema SQL** et exécuter sur Supabase
2. **Créer types TypeScript**
3. **Créer composants UI** un par un
4. **Créer pages** step par step
5. **Créer hooks**
6. **Mettre à jour sidebar**
7. **Tester localement** avec `npm run dev`

---

## 5. Priorité d'implémentation

1. Types et schema DB (fondations)
2. CodeCandidatGrid & BubbleButton (elements visuels clés)
3. QuestionNavigator & ExamTimer (navigation et temps)
4. Page principale examen (composants combinés)
5. CorrectionView (résultats)
6. Autosave et reprise (UX avancées)

---

## 6. Considerations UX Importantes

- **Reprise après fermeture**: Stocker état dans localStorage + Supabase
- **Autosave**: Sauvegarder toutes les 30 secondes
- **Skeleton loading**: Pour le chargement des questions
- **Mode plein écran**: API Fullscreen
- **Optimisation Android**: Responsive design adapté mobile
- **Sensation feuille papier**: Typos, couleurs, animations réalistes

---
