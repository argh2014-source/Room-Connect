export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string | null;
  stars: number;
  amenities: string[];
  images: string[];
  created_at: string;
}

export interface Room {
  id: string;
  nom: string;
  description: string | null;
  prix: number;
  disponibilite: number;
  categorie: 'Ventilée' | 'Climatisée';
  images: string[];
  created_at: string;
}

export interface Reservation {
  id: string;
  nom_client: string;
  telephone: string;
  email: string | null;
  transaction_id: string;
  montant_total: number;
  statut: 'EN ATTENTE' | 'CONFIRMÉ' | 'REFUSÉ';
  created_at: string;
}

export interface ReservationDetail {
  id: string;
  reservation_id: string;
  chambre_id: string;
  quantite: number;
  prix: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: 'admin' | 'client';
  created_at: string;
}
