'use client';

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import AuthForm from '@/components/auth/AuthForm';
import Dashboard from '@/components/dashboard/Dashboard';
import { Session } from '@supabase/supabase-js';

const HomePage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {session ? <Dashboard user={session.user} /> : <AuthForm />}
    </main>
  );
};

export default HomePage;