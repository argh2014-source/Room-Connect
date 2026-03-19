"use client";

import { useState, useMemo } from 'react';
import { Reservation } from '@/types';

// Extend the type to include details representing the joins in dashboard/page.tsx
type ExtendedReservation = Reservation & { details: any[] };

export default function ConfirmedReservationsTab({ reservations }: { reservations: ExtendedReservation[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // 1. Data Parsing & Filtering to CONFIRMÉ only
  const data = useMemo(() => {
    return reservations
      .filter((r) => r.statut === 'CONFIRMÉ')
      .map((r) => {
        // Calculate dynamic dates depending on nuits
        const maxNuitees = Math.max(...r.details.map((d: any) => Number(d.nuitees) || 0), 0);
        const dateArrivee = new Date(2026, 3, 6); // 6 April 2026
        const dateDepart = new Date(dateArrivee);
        dateDepart.setDate(dateDepart.getDate() + maxNuitees);
        
        // Formating DD/MM/YYYY
        const formatStr = (d: Date) => 
          `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
          
        return {
          id: r.id,
          created_at: r.created_at,
          client: r.nom_client || '',
          tel: r.telephone || '',
          rooms: r.details.map((d: any) => `${d.quantite}x ${d.room?.nom || 'Chambre'}`).join(', '),
          arrivalDate: formatStr(dateArrivee),
          departureDate: formatStr(dateDepart),
          duration: maxNuitees,
          montant: Number(r.montant_total) || 0,
          statut: r.statut
        };
      });
  }, [reservations]);

  // 2. Search, Filter, Sort
  const sortedAndFilteredData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tel.includes(searchTerm);
      
      const matchDate = dateFilter ? item.created_at.startsWith(dateFilter) : true;
      return matchSearch && matchDate;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let valA = (a as any)[sortConfig.key];
        let valB = (b as any)[sortConfig.key];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, dateFilter]);

  // 3. Handlers
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortIndicator = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  const handleExportExcel = () => {
    if (sortedAndFilteredData.length === 0) return;
    
    // Create CSV Config (Use semicolons for Excel French locale, strings wrapped in quotes)
    const headers = ["Chambre", "Client", "Téléphone", "Date d'arrivée", "Date de départ", "Durée du séjour", "Montant payé", "Date de Réservation"];
    
    const csvRows = [headers.join(';')];
    
    sortedAndFilteredData.forEach(item => {
      const row = [
        `"${item.rooms.replace(/"/g, '""')}"`,
        `"${item.client.replace(/"/g, '""')}"`,
        `"${item.tel}"`,
        `"${item.arrivalDate}"`,
        `"${item.departureDate}"`,
        item.duration,
        item.montant,
        `"${new Date(item.created_at).toLocaleDateString('fr-FR')}"`
      ];
      csvRows.push(row.join(';'));
    });
    
    // Add BOM for Excel UTF-8
    const csvContent = "\uFEFF" + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reservations_Confirmees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card overflow-hidden p-20 w-100 mt-20">
      <div className="flex-between flex-wrap gap-20 mb-20">
        <h3 className="mb-0 text-success flex align-center gap-10 font-bold" style={{ fontSize: '1.4rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Réservations Confirmées ({sortedAndFilteredData.length})
        </h3>
        <button onClick={handleExportExcel} className="btn btn-success flex align-center gap-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exporter en Excel
        </button>
      </div>

      <div className="flex flex-wrap gap-15 mb-20 bg-light p-15 card">
        <div className="form-group mb-0 flex-1">
          <label className="text-xs font-bold text-muted mb-5">Rechercher un client ou tél.</label>
          <input 
            type="text" 
            placeholder="Nom ou Téléphone..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-100 form-input"
            title="Rechercher"
          />
        </div>
        <div className="form-group mb-0 flex-1">
          <label className="text-xs font-bold text-muted mb-5">Date de réservation</label>
          <input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)} 
            className="w-100 form-input"
            title="Filtrer par date"
            placeholder="Sélectionner une date"
          />
        </div>
        <div className="flex align-end">
          <button onClick={() => { setSearchTerm(''); setDateFilter(''); setSortConfig(null); }} className="btn btn-outline py-10">
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="w-100 admin-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('rooms')} className="cursor-pointer">Chambre{sortIndicator('rooms')}</th>
              <th onClick={() => handleSort('client')} className="cursor-pointer">Client{sortIndicator('client')}</th>
              <th onClick={() => handleSort('tel')} className="cursor-pointer">Téléphone{sortIndicator('tel')}</th>
              <th onClick={() => handleSort('arrivalDate')} className="cursor-pointer">Arrivée{sortIndicator('arrivalDate')}</th>
              <th onClick={() => handleSort('departureDate')} className="cursor-pointer">Départ{sortIndicator('departureDate')}</th>
              <th onClick={() => handleSort('duration')} className="cursor-pointer text-center">Durée{sortIndicator('duration')}</th>
              <th onClick={() => handleSort('montant')} className="cursor-pointer">Montant{sortIndicator('montant')}</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-light'}>
                <td className="font-bold text-sm">{item.rooms}</td>
                <td className="font-bold">{item.client}</td>
                <td className="font-mono text-sm">{item.tel}</td>
                <td className="text-sm">{item.arrivalDate}</td>
                <td className="text-sm">{item.departureDate}</td>
                <td className="text-center font-bold">{item.duration} {item.duration > 1 ? 'nuits' : 'nuit'}</td>
                <td className="font-bold text-primary">{item.montant.toLocaleString()} FCFA</td>
                <td>
                  <span className="status-pill pill-confirmé">
                    {item.statut}
                  </span>
                </td>
              </tr>
            ))}
            {sortedAndFilteredData.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-40 text-muted">Aucune réservation confirmée trouvée selon vos filtres.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
