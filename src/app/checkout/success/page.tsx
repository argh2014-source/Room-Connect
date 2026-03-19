import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="section container mt-80 p-60 text-center">
      <div className="success-icon" style={{ fontSize: '5rem', marginBottom: '20px' }}>✅</div>
      <h1 className="section-title">Réservation soumise !</h1>
      <p className="lead-text mb-40">
        Votre demande de réservation pour l'AFCD 2026 a été envoyée avec succès.
        <br />
        Vous avez été redirigé vers WhatsApp pour finaliser la confirmation avec nos agents.
      </p>
      
      <div className="alert alert-info max-w-600 m-auto text-left">
        <strong>Prochaine étape :</strong> Un administrateur vérifiera votre paiement. 
        Dès que c'est fait, vous recevrez une confirmation finale. Gardez précieusement votre ID de transaction.
      </div>

      <div className="mt-40">
        <Link href="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    </main>
  );
}
