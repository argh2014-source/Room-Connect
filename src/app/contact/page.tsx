"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const whatsappNumber = "2290152818100"; // Format simplified for URL
    const text = `Bonjour, je suis *${name}*.
Email: ${email}
Message: ${message}`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="section container mt-80">
      <div className="contact-grid">
        <div>
          <h1 className="section-title text-left">Contactez-nous</h1>
          <p className="mb-30 section-subtitle">
            Une question ? Un besoin spécifique ? Notre équipe est disponible 24h/24 et 7j/7 pour vous accompagner.
          </p>
          
          <div className="card contact-info-card">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h3 className="contact-item-title">Adresse</h3>
                <p className="section-subtitle">Parakou, Bénin</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <h3 className="contact-item-title">Email</h3>
                <p className="section-subtitle">groupita25@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h3 className="contact-item-title">Téléphone</h3>
                <p className="section-subtitle">+229 01 52 81 81 00</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card contact-form-card">
          <h2 className="mb-1rem">Envoyez un message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom Complet</label>
              <input 
                type="text" 
                name="name"
                placeholder="Ex: Jean Dupont" 
                className="form-input" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="votre@email.com" 
                className="form-input" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                name="message"
                placeholder="Comment pouvons-nous vous aider ?" 
                rows={5} 
                className="form-input form-textarea"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Envoyer le message</button>
          </form>
        </div>

      </div>
    </main>
  );
}
