import { supabase } from '@/lib/supabase';
import { Hotel } from '@/types';
import Link from 'next/link';

export const revalidate = 0;

export default async function HotelsPage() {
  const { data: hotels, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('name', 'Hôtel Mboloani')
    .returns<Hotel[]>();

  return (
    <main className="section container mt-80">
      <div className="mb-3rem text-center">
        <h1 className="section-title">Notre Hôtel Partenaire</h1>
        <p className="section-subtitle">
          Découvrez le confort exceptionnel de l'Hôtel Mboloani à Lomé.
        </p>
      </div>

      <div className="hotels-grid">
        {hotels && hotels.length > 0 ? (
          hotels.map((hotel: Hotel) => (
            <div key={hotel.id} className="card hotel-card">
              <div className="hotel-image-container">
                <img 
                  src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
                  alt={hotel.name}
                  className="hotel-image"
                />
              </div>
              <div className="hotel-content">
                <h3 className="hotel-name">{hotel.name}</h3>
                <p className="hotel-location">
                  {hotel.city}
                </p>
                <div className="hotel-footer">
                  <span className="hotel-price">
                    À partir de ... <small className="price-unit">/ nuit</small>
                  </span>
                  <div className="mb-1rem">
                    <a 
                      href="https://maps.google.com/?q=Hotel+Mboloani+Lomé" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="nav-link gps-link"
                    >
                      📍 Localisation GPS
                    </a>
                  </div>
                  <Link href={`/hotels/${hotel.id}`} className="btn btn-primary hotel-btn">
                    Voir Détails
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-hotels">
            {error ? 'Une erreur est survenue lors du chargement.' : 'Aucun hôtel trouvé.'}
          </p>
        )}
      </div>
    </main>
  );
}
