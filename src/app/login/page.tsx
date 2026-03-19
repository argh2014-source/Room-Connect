"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      // Check if user is admin to redirect accordingly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <main className="auth-container" style={{ backgroundImage: 'url("/images/login-bg.png")' }}>
      <div className="auth-card glass">
        <div className="text-center mb-40">
          <Link href="/" className="logo mb-20 inline-flex flex-col items-center">
            <div className="logo-brand">Room Connect</div>
            <div className="logo-top">
              <span className="blue">AFCD</span> <span className="orange">LOMÉ</span>
            </div>
            <div className="logo-bottom">2026</div>
          </Link>
          <h1>Connexion</h1>
          <p className="subtitle">Heureux de vous revoir parmi nous !</p>
        </div>


        
        {error && <div className="alert alert-error mb-20">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>📧 Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com" 
              className="auth-input"
              required
            />
          </div>
          
          <div className="input-group">
            <label>🔒 Mot de passe</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="auth-input"
                style={{ paddingRight: '45px' }}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>


          
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Chargement..." : "Se connecter"}
          </button>
          

        </form>
      </div>
    </main>
  );
}

