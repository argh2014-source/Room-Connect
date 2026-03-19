export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">Room<span>Connect</span></div>
            <p className="footer-desc">
              La plateforme préférée pour vos réservations d'hôtels en Afrique. Trouvez le confort au meilleur prix.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Liens Rapides</h4>
            <ul className="footer-list">
              <li className="footer-item"><a href="/hotels" className="footer-link">Nos Hôtels</a></li>
              <li className="footer-item"><a href="/about" className="footer-link">À Propos</a></li>
              <li className="footer-item"><a href="/blog" className="footer-link">Blog</a></li>
              <li className="footer-item"><a href="/terms" className="footer-link">CGU</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Aide</h4>
            <ul className="footer-list">
              <li className="footer-item"><a href="/faq" className="footer-link">FAQ</a></li>
              <li className="footer-item"><a href="/support" className="footer-link">Support Client</a></li>
              <li className="footer-item"><a href="/privacy" className="footer-link">Confidentialité</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-list">
              <li className="footer-item"><span className="footer-link">Email: groupita25@gmail.com</span></li>
              <li className="footer-item"><span className="footer-link">Tél: +229 01 52 81 81 00</span></li>
              <li className="footer-item"><span className="footer-link">Parakou, Bénin</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} RoomConnect. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
