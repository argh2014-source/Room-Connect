import { supabase } from '@/lib/supabase';
import RoomCard from '@/components/RoomCard';
import { Room } from '@/types';
export const revalidate = 0;

export default async function RoomsPage() {
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('*')
    .order('prix', { ascending: true });

  if (error) {
    return <div className="container mt-80 p-60 text-center">Erreur lors du chargement des chambres.</div>;
  }

  const ventilatedRooms = rooms?.filter(r => r.categorie === 'Ventilée') || [];
  const acRooms = rooms?.filter(r => r.categorie === 'Climatisée') || [];

  return (
    <main className="section container mt-80">
      <header className="mb-40">
        <h1 className="section-title">Catalogue des Chambres</h1>
        <p className="section-subtitle">AFCD Lomé 2026 - Choisissez votre confort pour l'événement.</p>
      </header>

      {/* Section 1: Ventilées */}
      {ventilatedRooms.length > 0 && (
        <section className="mb-60">
          <h2 className="category-title text-left">Section 1 : CHAMBRES VENTILÉES</h2>
          <div className="grid-2">
            {ventilatedRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Climatisées */}
      {acRooms.length > 0 && (
        <section className="mb-60">
          <h2 className="category-title text-left">Section 2 : CHAMBRES CLIMATISÉES</h2>
          <div className="grid-2">
            {acRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      )}

      {rooms.length === 0 && (
        <p className="text-center">Aucune chambre n'est disponible pour le moment.</p>
      )}
    </main>
  );
}
