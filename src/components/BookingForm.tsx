'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Room } from '@/types';

interface BookingFormProps {
  hotelId: string;
  rooms: Room[];
}

export default function BookingForm({ hotelId, rooms }: BookingFormProps) {
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomId: ''
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedRoom = rooms.find(r => r.id === formData.roomId);
    if (!selectedRoom) return;

    // Calcul du nombre de nuits
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nuitees = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    
    const totalPrix = selectedRoom.prix * nuitees;

    const message = `Bonjour RoomConnect, je souhaite réserver à l'Hôtel AFCD 2026 :
- Nom : ${formData.name}
- Email : ${formData.email}
- Arrivée : ${formData.checkIn}
- Départ : ${formData.checkOut}
- Durée : ${nuitees} ${nuitees > 1 ? 'nuits' : 'nuit'}
- Chambre : ${selectedRoom.nom}
- Prix total : ${totalPrix.toLocaleString()} FCFA (${selectedRoom.prix.toLocaleString()} / nuit)`;

    const whatsappUrl = `https://wa.me/22952818100?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setBookingStatus('success');
  };

  return (
    <div id="booking" className="booking-sidebar">
      <div className="card booking-form-card">
        <h3>Réserver votre séjour</h3>
        {bookingStatus === 'success' && (
          <div className="alert alert-success">
            Votre demande a été envoyée via WhatsApp ! Nous vous contacterons bientôt.
          </div>
        )}
        {bookingStatus === 'error' && (
          <div className="alert alert-error">
            Une erreur est survenue. Veuillez réessayer.
          </div>
        )}
        <form onSubmit={handleBookingSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input 
              id="name"
              type="text" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Jean Dupont"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="jean@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input 
              id="phone"
              type="tel" 
              required 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+229 01 02 03 04"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkIn">Arrivée</label>
              <input 
                id="checkIn"
                type="date" 
                required 
                value={formData.checkIn}
                onChange={e => setFormData({...formData, checkIn: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="checkOut">Départ</label>
              <input 
                id="checkOut"
                type="date" 
                required 
                value={formData.checkOut}
                onChange={e => setFormData({...formData, checkOut: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="room">Chambre</label>
            <select 
              id="room"
              required 
              value={formData.roomId}
              onChange={e => setFormData({...formData, roomId: e.target.value})}
            >
              <option value="">Sélectionnez une chambre</option>
              {rooms.filter(r => r.disponibilite > 0).map(room => (
                <option key={room.id} value={room.id}>
                  {room.nom} - {room.prix.toLocaleString()} FCFA
                </option>
              ))}
            </select>
          </div>
          <button 
            type="submit" 
            className="btn btn-whatsapp"
          >
            <span>Réserver via WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
}
