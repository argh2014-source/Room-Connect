"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      router.push("/login");
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
          <h1>Inscription</h1>
          <p className="subtitle">Rejoignez l'aventure AFCD 2026 !</p>
        </div>

        
        {error && <div className="alert alert-error mb-20">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>👤 Nom complet</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Jean Dupont" 
              className="auth-input"
              required
            />
          </div>
          
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
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
          
          <div className="text-center mt-30 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Déjà un compte ? <Link href="/login" className="text-secondary font-bold hover:underline">Se connecter</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

