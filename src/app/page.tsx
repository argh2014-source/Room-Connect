import Link from 'next/link';
import Countdown from '../components/Countdown';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-event">
        <div className="container hero-content-center">
          <span className="event-tag">Événement Rotary</span>
          <h1 className="hero-title animate-up">Réservation de chambres AFCD Lomé 2026</h1>
          <p className="hero-subtitle animate-up delay-1">
            Chers compagnons Rotariens, sécurisez votre hébergement dès aujourd'hui pour l'événement panafricain majeur de l'année 2026 à Lomé.
          </p>
          <div className="hero-btns animate-up delay-2">
            <Link href="/rooms" className="btn btn-secondary btn-lg">
              Voir les chambres disponibles
            </Link>
          </div>
          <Countdown />
        </div>
      </section>

      {/* Intro Message */}
      <section className="section bg-light">
        <div className="container text-center max-w-800">
          <h2 className="section-title">Bienvenue à Lomé</h2>
          <p className="lead-text">
            Pour l'AFCD 2026, nous avons sélectionné pour vous des chambres adaptées à tous les besoins, 
            du confort ventilé aux suites climatisées premium. Notre processus de réservation est simple, 
            fluide et sécurisé.
          </p>
          <div className="stats-box grid-3 mt-40">
            <div className="stat-item">
              <span className="stat-number">11</span>
              <span className="stat-label">Types de chambres</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Assistance Voyageur</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Paiement Sécurisé</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Steps */}
      <section className="section container">
        <h2 className="section-title text-center">Comment ça marche ?</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Choisissez vos chambres</h3>
            <p>Sélectionnez une ou plusieurs chambres selon vos préférences.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Paiement Mobile Money</h3>
            <p>Effectuez le règlement et récupérez votre ID de transaction.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Confirmation Admin</h3>
            <p>Votre réservation sera validée manuellement par l'organisation.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
