'use client';

import React, { useState } from 'react';
import { Room } from '@/types';
import { useCart } from '@/context/CartContext';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nuitees, setNuitees] = useState(1);
  const { addToCart, cart } = useCart();
  
  const images = room.images && room.images.length > 0 
    ? room.images 
    : ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800'];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const cartItem = cart.find(item => item.id === room.id);
  const isInCart = !!cartItem;

  return (
    <div className="room-card-premium">
      <div className="room-badge">{room.categorie}</div>
      
      {/* Image Slider */}
      <div className="room-slider">
        <img 
          src={images[currentImageIndex]} 
          alt={room.nom} 
          className="room-slider-image"
        />
        {images.length > 1 && (
          <>
            <button className="slider-arrow arrow-left" onClick={prevImage}>❮</button>
            <button className="slider-arrow arrow-right" onClick={nextImage}>❯</button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="room-details">
        <div className="flex-between">
          <h3 className="room-title">{room.nom}</h3>
          <span className="room-availability">
            {room.disponibilite > 0 ? `${room.disponibilite} dispos` : 'Complet'}
          </span>
        </div>
        
        <p className="room-desc-short">{room.description}</p>

        <div className="flex-between align-center mt-10">
          <div className="room-price-tag">
            <span className="price-amount">{room.prix.toLocaleString()} FCFA</span>
            <span className="price-unit">/ nuit</span>
          </div>
          
          <div className="nights-selector flex-center gap-10">
            <label className="text-xs font-bold uppercase">Nuits:</label>
            <input 
              type="number" min="1" max="30" 
              value={nuitees} 
              onChange={(e) => setNuitees(parseInt(e.target.value) || 1)}
              style={{ width: '50px', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <button 
          onClick={() => addToCart(room, nuitees)}
          disabled={room.disponibilite === 0 || (isInCart && cartItem.quantite >= room.disponibilite)}
          className={`btn ${isInCart ? 'btn-secondary' : 'btn-primary'} w-100 mt-20`}
        >
          {room.disponibilite === 0 
            ? 'Complet' 
            : isInCart && cartItem.quantite >= room.disponibilite
              ? 'Maximum atteint'
              : isInCart 
                ? `Ajouter une chambre (${cartItem.quantite} déjà au panier)` 
                : 'Ajouter au panier'}
        </button>

      </div>
    </div>
  );
}
