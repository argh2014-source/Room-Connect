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
  const [nuitees, setNuitees] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomId: ''
  });

  const checkInDateStr = "2026-04-06";
  const checkOutDate = new Date("2026-04-06");
  checkOutDate.setDate(checkOutDate.getDate() + nuitees);
  const checkOutDateStr = checkOutDate.toISOString().split('T')[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedRoom = rooms.find(r => r.id === formData.roomId);
    if (!selectedRoom) return;

    const totalPrix = selectedRoom.prix * nuitees;

    const message = `Bonjour RoomConnect, je souhaite réserver à l'Hôtel AFCD 2026 :
- Nom : ${formData.name}
- Email : ${formData.email}
- Séjour : du 6 Avril au ${6 + nuitees} Avril 2026 (${nuitees} ${nuitees > 1 ? 'nuits' : 'nuit'})
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
          <div className="form-row border-y py-15 mb-20 bg-light-blue" style={{ borderRadius: '8px', padding: '15px' }}>
            <div className="form-group mb-0">
              <label className="text-xs uppercase font-bold text-blue">Arrivée</label>
              <div className="font-bold">6 Avril 2026</div>
            </div>
            <div className="form-group mb-0">
              <label htmlFor="nuitees" className="text-xs uppercase font-bold text-blue">Nombre de nuits</label>
              <input 
                id="nuitees"
                type="number" 
                min="1"
                max="30"
                required 
                value={nuitees}
                onChange={e => setNuitees(parseInt(e.target.value) || 1)}
                className="w-100"
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-xs uppercase font-bold text-blue">Départ</label>
              <div className="font-bold">{6 + nuitees} Avril 2026</div>
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
