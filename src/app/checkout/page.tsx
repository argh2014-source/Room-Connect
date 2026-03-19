"use client";

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    transactionId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      // 1. Create Reservation
      const { data: res, error: resError } = await supabase
        .from('reservations')
        .insert({
          nom_client: formData.nom,
          telephone: formData.telephone,
          email: formData.email,
          transaction_id: formData.transactionId,
          montant_total: totalPrice,
          statut: 'EN ATTENTE'
        })
        .select()
        .single();

      if (resError) throw resError;

      const details = cart.map(item => ({
        reservation_id: res.id,
        chambre_id: item.id,
        quantite: item.quantite,
        prix: item.prix,
        nuitees: item.nuitees
      }));

      const { error: detError } = await supabase
        .from('reservation_details')
        .insert(details);

      if (detError) throw detError;

      // 3. Clear Cart & Redirect to WhatsApp
      const whatsappMsg = `Bonjour AFCD 2026,\n\nJe viens de soumettre une réservation :\n- Nom : ${formData.nom}\n- Transaction ID : ${formData.transactionId}\n- Montant Total : ${totalPrice.toLocaleString()} FCFA\n\nDétails des séjours (Début : 6 Avril 2026) :\n${cart.map(item => `- ${item.nom} : ${item.quantite} ch. pour ${item.nuitees} nuits (du 6 au ${6 + item.nuitees} Avril)`).join('\n')}\n\nMerci de valider ma réservation.`;
      const encodedMsg = encodeURIComponent(whatsappMsg);
      const whatsappUrl = `https://wa.me/22952818100?text=${encodedMsg}`; // Contact number

      clearCart();
      window.open(whatsappUrl, '_blank');
      router.push('/checkout/success');
    } catch (error) {
      console.error("Reservation error:", error);
      alert("Une erreur est survenue lors de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="section container mt-80 p-60 text-center">
        <h2>Votre panier est vide</h2>
        <button onClick={() => router.push('/rooms')} className="btn btn-primary mt-20">Retour aux chambres</button>
      </main>
    );
  }

  return (
    <main className="section container mt-80">
      <div className="checkout-centered-container card">
        <h1 className="section-title text-center mb-10">Finaliser ma réservation</h1>
        
        {/* Résumé de la commande en haut */}
        <div className="cart-summary-centered mb-40">
          <h3 className="mb-20 text-center">Votre panier</h3>
          <div className="cart-mini-list">
            {cart.map(item => (
              <div key={item.id} className="flex-between mb-15 pb-10" style={{ borderBottom: '1px solid #eee' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="font-bold">{item.nom}</div>
                  <small className="text-muted">
                    {item.quantite} ch. x {item.nuitees} nuits (du 6 au {6 + item.nuitees} Avril)
                  </small>
                </div>
                <div className="font-bold">{(item.prix * item.quantite * item.nuitees).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="total-pay-highlight mt-20">
            <span className="font-bold">TOTAL À RÉGLER</span>
            <span className="price-amount">{totalPrice.toLocaleString()} FCFA</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form-centered">
          <h2 className="mb-20 text-center">Informations Personnelles</h2>
          
          <div className="form-group-centered">
            <label className="form-label text-center">Nom complet *</label>
            <input 
              type="text" required className="form-input-centered" 
              value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})}
              placeholder="Ex: John Doe"
            />
          </div>
          
          <div className="form-group-centered mt-20">
            <label className="form-label text-center">Téléphone *</label>
            <input 
              type="tel" required className="form-input-centered"
              value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})}
              placeholder="Ex: +229 52818100"
            />
          </div>

          <div className="form-group-centered mt-20">
            <label className="form-label text-center">Email (Facultatif)</label>
            <input 
              type="email" className="form-input-centered"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
            />
          </div>

          <hr className="my-40 w-100" />

          <h2 className="mb-20 text-center">Paiement Mobile Money</h2>
          <p className="text-muted mb-30 text-center">Veuillez effectuer le paiement total avant de valider.</p>
          
          <div className="payment-instructions-centered mb-30">
            <div className="instruction-step-centered">
              <div className="step-circle mx-auto mb-10">1</div>
              <p>Envoyez <strong>{totalPrice.toLocaleString()} FCFA</strong> par MTN Mobile Money au <strong>+229 52 81 81 00</strong>.</p>
            </div>
            <div className="instruction-step-centered">
              <div className="step-circle mx-auto mb-10">2</div>
              <p>Une fois le transfert réussi, copiez l'<strong>ID de transaction</strong> reçu par SMS.</p>
            </div>
            <div className="instruction-step-centered">
              <div className="step-circle mx-auto mb-10">3</div>
              <p>Saisissez cet ID ci-dessous pour confirmer votre demande.</p>
            </div>
          </div>

          <div className="form-group-centered mt-20">
            <label className="form-label text-center">ID de Transaction *</label>
            <input 
              type="text" required className="form-input-centered"
              value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})}
              placeholder="ID: 11719645954"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-secondary btn-centered mt-40 py-15" style={{ fontSize: '1.1rem' }}>
            {loading ? 'Traitement...' : 'Confirmer ma réservation'}
          </button>
        </form>
      </div>
    </main>
  );
}
