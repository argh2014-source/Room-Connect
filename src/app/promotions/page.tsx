export default function PromotionsPage() {
  return (
    <main className="section container" style={{ marginTop: '80px', textAlign: 'center' }}>
      <h1 className="section-title">Promotions Spéciales</h1>
      <div className="card" style={{ padding: '4rem', maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎁</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          De nouvelles offres exceptionnelles arrivent bientôt !
        </p>
        <p style={{ marginTop: '1rem' }}>
          Inscrivez-vous à notre newsletter pour ne rien manquer.
        </p>
      </div>
    </main>
  );
}
