import { supabase } from '@/lib/supabase';
import BookingForm from '@/components/BookingForm';
import RoomCard from '@/components/RoomCard';

export const revalidate = 0;

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // ... (keeping fetch logic as is)
  const { data: hotel, error: hotelError } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single();

  if (hotelError || !hotel) {
    // ... (keeping error handling as is)
    return (
      <main className="section container mt-50 text-center min-h-60vh">
        <h2>Hôtel introuvable</h2>
        <p>Désolé, nous ne parvenons pas à trouver cet établissement.</p>
        <div className="mt-20">
          <a href="/hotels" className="btn btn-primary">Retour aux hôtels</a>
        </div>
      </main>
    );
  }

  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('*')
    .eq('hotel_id', id);

  // Split rooms into categories
  const ventilatedRooms = rooms?.filter(r => r.name.toLowerCase().includes('ventilée')) || [];
  const acRooms = rooms?.filter(r => r.name.toLowerCase().includes('climatisée')) || [];

  return (
    <div className="hotel-detail-page-wrapper">
      {/* Hero Section */}
      <section className="hotel-hero">
        <div 
          className="hotel-hero-image hotel-hero-image-premium" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${hotel.images?.[0] || '/images/hero-aerial.png'})`
          }}
        >
          <div className="container">
            <div className="hotel-hero-content hotel-hero-content-premium">
              <h1 className="hotel-hero-title hotel-hero-title-premium">
                {hotel.name}
              </h1>
              <p className="hotel-hero-location hotel-hero-location-premium">
                📍 {hotel.city}, Togo
              </p>
              <a href="#reservation" className="btn btn-primary btn-lg">Réserver maintenant</a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section container">
        <div className="detail-grid">
          <div>
            <h2 className="detail-title">Bienvenue à l'Hôtel Mboloani</h2>
            <p className="detail-description">
              Bienvenue à l’Hôtel Mboloani, un établissement confortable proposant des chambres à prix abordables avec plusieurs options adaptées aux besoins des clients. Notre priorité est votre sécurité et votre satisfaction.
            </p>

            <div className="services-box">
              <h3 className="services-title">Services principaux</h3>
              <ul className="services-list">
                <li>✅ Chambres ventilées et climatisées</li>
                <li>✅ Connexion internet</li>
                <li>✅ Restaurant ouvert 24h/24</li>
                <li>✅ Salle de réception pour événements</li>
                <li>✅ Garage sécurisé pour véhicules</li>
              </ul>
            </div>
          </div>

          <div id="reservation">
            <BookingForm hotelId={hotel.id} rooms={rooms || []} />
          </div>
        </div>
      </section>

      {/* Room Categories */}
      <section className="section bg-light py-60">
        <div className="container">
          <h2 className="category-title">Nos Chambres Ventilées</h2>
          <div className="hotels-grid">
            {ventilatedRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      <section className="section py-60">
        <div className="container">
          <h2 className="category-title">Nos Chambres Climatisées</h2>
          <div className="hotels-grid">
            {acRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
