import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="section container" style={{ marginTop: '80px' }}>
      <div className="card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="section-title">À Propos de RoomConnect</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-muted)' }}>
          <p>
            <strong>RoomConnect</strong> est la plateforme de référence pour la réservation d'hôtels en Afrique, 
            particulièrement au Bénin et en Côte d'Ivoire. Notre mission est de simplifier l'accès à l'hébergement 
            de qualité tout en garantissant les meilleurs prix du marché.
          </p>
          
          <p>
            Fondée par une équipe passionnée d'innovation technologique (**ITA - Innovative Technology Agency**), 
            RoomConnect se distingue par sa transparence, sa rapidité et son support client exceptionnel.
          </p>
          
          <h2 style={{ color: 'var(--text-main)', marginTop: '1rem', fontSize: '1.5rem' }}>Nos Valeurs</h2>
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <li style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary-dark)' }}>
              <strong>Excellence</strong><br/>Un service premium pour tous.
            </li>
            <li style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary-dark)' }}>
              <strong>Proximité</strong><br/>Présent partout en Afrique.
            </li>
            <li style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary-dark)' }}>
              <strong>Sécurité</strong><br/>Vos paiements et données protégés.
            </li>
          </ul>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/" className="btn btn-primary">Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
