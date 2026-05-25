'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  school: string;
  province: string;
  option: string;
  exam_year: number;
  avatar_url: string | null;
  subscription: 'gratuit' | 'premium';
  created_at: string;
}

interface UserStats {
  id: string;
  user_id: string;
  exams_opened: number;
  quizzes_completed: number;
  average_score: number;
  study_time_minutes: number;
}

interface Activity {
  id: string;
  activity_type: 'quiz' | 'exam' | 'simulation';
  title: string;
  date: string;
}

interface Goal {
  id: string;
  goal_type: 'score' | 'daily';
  target: string;
  current: number;
}

interface SubjectProgress {
  id: string;
  user_id: string;
  subject: string;
  progress: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      if (!supabase) {
        setError('Supabase non configuré');
        setLoading(false);
        return;
      }

      // Debug: Check session state
      console.log('Fetching profile...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session:', session, 'Error:', sessionError);

      if (sessionError) {
        console.log('Session error:', sessionError);
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('User:', user, 'Error:', userError);

      if (userError || !user) {
        if (!session?.access_token) {
          console.log('No session - user not logged in');
          setError('Non connecté');
          setLoading(false);
          return;
        }
        console.log('Using session access token');
        var accessToken = session.access_token;
      } else {
        const { data: { session: session2 } } = await supabase.auth.getSession();
        var accessToken = session2?.access_token || user.id;
      }

      console.log('Access token available:', !!accessToken);

      const headers = {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      const baseUrl = window.location.origin;

      const [profileRes, statsRes, activitiesRes, goalsRes, progressRes] = await Promise.all([
        fetch(`${baseUrl}/api/profile`, { headers }),
        fetch(`${baseUrl}/api/profile/stats`, { headers }),
        fetch(`${baseUrl}/api/profile/activities?limit=5`, { headers }),
        fetch(`${baseUrl}/api/profile/goals`, { headers }),
        fetch(`${baseUrl}/api/profile/progress`, { headers }),
      ]);

      const profileData = profileRes.ok ? await profileRes.json() : null;

      // If profile not found (404), try to create it
      if (!profileData && profileRes.status === 404 && user) {
        const createRes = await fetch(`${baseUrl}/api/profile`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || 'Utilisateur',
            phone: user.user_metadata?.phone || '',
            email: user.email || '',
            school: user.user_metadata?.school || '',
            province: user.user_metadata?.province || '',
            option: user.user_metadata?.section || '',
            exam_year: parseInt(user.user_metadata?.exam_year || '2026'),
          }),
        });
        const newProfile = createRes.ok ? await createRes.json() : null;
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      const statsData = statsRes.ok ? await statsRes.json() : null;
      const activitiesData = activitiesRes.ok ? await activitiesRes.json() : [];
      const goalsData = goalsRes.ok ? await goalsRes.json() : [];
      const progressData = progressRes.ok ? await progressRes.json() : [];

      setStats(statsData);
      setActivities(activitiesData);
      setGoals(goalsData);
      setSubjectProgress(progressData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    // Listen for auth state changes if supabase is configured
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return { profile, stats, activities, goals, subjectProgress, loading, error, refetch: fetchProfile };
}
