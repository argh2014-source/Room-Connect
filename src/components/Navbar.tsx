"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();
  const { profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar glass dark ${isScrolled ? "scrolled" : ""}`}>
      <div className="container nav-content">
        <div className="nav-left">
          <div className="logo">
            <Link href="/" className="logo-top">
              <span className="blue">Room</span><span className="orange">Connect</span>
            </Link>
            <div className="logo-bottom">
              <Link href="/">AFCD<span className="orange-text">LOMÉ</span></Link>
              <Link href="/login" className="admin-trigger">2026</Link>
            </div>
          </div>



        </div>
        <div className="nav-right">
          <div className="utility-links">
            <Link href="/" className="nav-link">ACCUEIL</Link>
            <Link href="/rooms" className="nav-link">CHAMBRES</Link>
            <Link href="/contact" className="nav-link">CONTACTS</Link>
            
            {profile?.role === 'admin' ? (
              <button onClick={signOut} className="nav-link btn-logout">DECONNEXION</button>
            ) : null}

          </div>
          <Link href="/cart" className="cart-icon-container">
            <span className="cart-icon">🛒</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
