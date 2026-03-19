"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CartPage() {
    const { cart, updateQuantity, updateNights, removeFromCart, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <main className="section container mt-80 p-60 text-center">
        <h1 className="section-title">Votre panier est vide</h1>
        <p className="mb-40">Vous n'avez pas encore sélectionné de chambres pour l'AFCD 2026.</p>
        <Link href="/rooms" className="btn btn-primary">
          Voir les chambres disponibles
        </Link>
      </main>
    );
  }

  return (
    <main className="section container mt-80">
      <h1 className="section-title">Récapitulatif de votre sélection</h1>
      
      <div className="detail-grid">
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 0.2fr', alignItems: 'center' }}>
              <div className="cart-item-info">
                <h3 className="mb-0">{item.nom}</h3>
                <small className="text-muted">{item.categorie}</small>
              </div>
              <div className="text-center font-bold">
                {item.prix.toLocaleString()} FCFA <br/><small className="text-muted">/ nuit</small>
              </div>
              <div className="qty-control justify-center">
                <div className="flex flex-col items-center">
                  <small className="text-xs uppercase mb-5">Chambres</small>
                  <div className="flex items-center">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantite - 1)}>-</button>
                    <span className="mx-10">{item.quantite}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.id, item.quantite + 1)}
                      disabled={item.quantite >= item.disponibilite}
                    >
                      +
                    </button>

                  </div>
                </div>
              </div>
              <div className="qty-control justify-center">
                <div className="flex flex-col items-center">
                  <small className="text-xs uppercase mb-5">Nuits</small>
                  <div className="flex items-center">
                    <button className="qty-btn" onClick={() => updateNights(item.id, item.nuitees - 1)}>-</button>
                    <span className="mx-10">{item.nuitees}</span>
                    <button className="qty-btn" onClick={() => updateNights(item.id, item.nuitees + 1)}>+</button>
                  </div>
                </div>
              </div>
              <div className="text-primary font-bold text-right" style={{ fontSize: '1.1rem' }}>
                {(item.prix * item.quantite * item.nuitees).toLocaleString()} FCFA
              </div>
              <button className="btn-icon text-error ml-20" onClick={() => removeFromCart(item.id)}>🗑️</button>
            </div>
          ))}
        </div>

        <aside>
          <div className="cart-summary-box">
            <h3 className="mb-20">Résumé de la commande</h3>
            <div className="flex-between mb-10">
              <span>Nombre de chambres</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex-between mb-20">
              <span>Total partiel</span>
              <span className="font-bold">{totalPrice.toLocaleString()} FCFA</span>
            </div>
            
            <hr className="mb-20" />
            
            <div className="flex-between mb-30">
              <span className="font-bold">Total à payer</span>
              <span className="price-amount">{totalPrice.toLocaleString()} FCFA</span>
            </div>

            <Link href="/checkout" className="btn btn-secondary w-100">
              Procéder au paiement
            </Link>
            
            <p className="text-muted text-center mt-20 text-xs">
              Une fois le paiement effectué via Mobile Money, vous devrez saisir l'ID de transaction pour validation.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
