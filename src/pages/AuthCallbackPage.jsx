import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const finalizeLogin = async () => {
      try {
        await supabase.auth.getSession();
      } finally {
        if (isMounted) {
          navigate('/app', { replace: true });
        }
      }
    };

    finalizeLogin();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <section className="auth-callback">
      <div className="panel">
        <h1>Completing login…</h1>
        <p>You’ll be redirected to the dashboard once Discord confirms your session.</p>
      </div>
    </section>
  );
}
