"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Reservation, ReservationDetail, Room } from '@/types';
import ConfirmedReservationsTab from '@/components/admin/ConfirmedReservationsTab';

export default function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<(Reservation & { details: any[] })[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'confirmed' | 'reports'>('list');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!authLoading) {
      if (!profile || profile.role !== 'admin') {
        router.push('/login');
      } else {
        fetchData();
      }
    }
  }, [authLoading, profile, router]);

  const fetchData = async () => {
    setLoading(true);
    const [resResponse, roomsResponse] = await Promise.all([
      supabase
        .from('reservations')
        .select('*, details:reservation_details(*, room:rooms(*))')
        .order('created_at', { ascending: false }),
      supabase
        .from('rooms')
        .select('*')
        .order('nom')
    ]);

    if (resResponse.error) console.error("Error fetching admin data:", resResponse.error);
    else setReservations(resResponse.data || []);

    if (roomsResponse.error) console.error("Error fetching rooms:", roomsResponse.error);
    else setRooms(roomsResponse.data || []);
    
    setLoading(false);
  };

  const handleStatusUpdate = async (reservation: any, newStatus: 'CONFIRMÉ' | 'REFUSÉ' | 'EN ATTENTE') => {
    try {
      const oldStatus = reservation.statut;
      if (oldStatus === newStatus) return;

      const { error: resError } = await supabase
        .from('reservations')
        .update({ statut: newStatus })
        .eq('id', reservation.id);

      if (resError) throw resError;

      // Logique de stock intelligente
      // 1. Si on passe à CONFIRMÉ : on déduit du stock
      if (newStatus === 'CONFIRMÉ') {
        console.log("Confirming: Deducting stock...");
        for (const detail of reservation.details) {
          if (detail.chambre_id) {
            const { data: room, error: fetchError } = await supabase.from('rooms').select('disponibilite').eq('id', detail.chambre_id).single();
            if (fetchError) console.error("Error fetching room for stock update:", fetchError);
            if (room) {
              const { error: updateError } = await supabase.from('rooms').update({ disponibilite: Math.max(0, room.disponibilite - detail.quantite) }).eq('id', detail.chambre_id);
              if (updateError) console.error("Error updating room availability:", updateError);
            }
          }
        }
      } 
      // 2. Si on était CONFIRMÉ et qu'on change vers autre chose : on rend au stock
      else if (oldStatus === 'CONFIRMÉ') {
        console.log("Restoring stock: Reservation was confirmed but is now " + newStatus);
        for (const detail of reservation.details) {
          if (detail.chambre_id) {
            const { data: room, error: fetchError } = await supabase.from('rooms').select('disponibilite').eq('id', detail.chambre_id).single();
            if (fetchError) console.error("Error fetching room for stock restoration:", fetchError);
            if (room) {
              const { error: updateError } = await supabase.from('rooms').update({ disponibilite: room.disponibilite + detail.quantite }).eq('id', detail.chambre_id);
              if (updateError) console.error("Error restoring room availability:", updateError);
            }
          }
        }
      }

      alert(`Statut mis à jour : ${newStatus}`);
      fetchData();

    } catch (e) {
      console.error(e);
      alert("Erreur lors de la mise à jour.");
    }
  };


  const roomStats = rooms.map(room => {
    let reservedCount = 0;
    reservations.filter(r => r.statut === 'CONFIRMÉ').forEach(r => {
      r.details.forEach(d => {
        if (d.chambre_id === room.id) {
          reservedCount += d.quantite;
        }
      });
    });

    const remaining = room.disponibilite;
    const totalInitial = remaining + reservedCount;
    const percentReserved = totalInitial > 0 ? (reservedCount / totalInitial) * 100 : 0;
    const percentRemaining = totalInitial > 0 ? (remaining / totalInitial) * 100 : 0;

    return {
      ...room,
      reservedCount,
      remaining,
      totalInitial,
      percentReserved,
      percentRemaining
    };
  });

  // Stats calculation
  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.statut === 'CONFIRMÉ').length,
    refused: reservations.filter(r => r.statut === 'REFUSÉ').length,
    pending: reservations.filter(r => r.statut === 'EN ATTENTE').length,
    revenue: reservations.filter(r => r.statut === 'CONFIRMÉ').reduce((acc, r) => acc + Number(r.montant_total), 0)
  };

  // Detailed dashboard calculations
  const validationRate = stats.total > 0 ? ((stats.confirmed / stats.total) * 100).toFixed(1) : '0';
  const rejectionRate = stats.total > 0 ? ((stats.refused / stats.total) * 100).toFixed(1) : '0';

  const pendingRevenue = reservations
    .filter(r => r.statut === 'EN ATTENTE')
    .reduce((sum, r) => sum + Number(r.montant_total || 0), 0);
    
  const estimatedExpenses = stats.revenue * 0.15;
  const estimatedProfit = stats.revenue - estimatedExpenses;

  const pConfirmed = stats.total > 0 ? (stats.confirmed / stats.total) * 100 : 0;
  const pPending = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;
  const pieGradient = `conic-gradient(#10b981 0% ${pConfirmed}%, #f59e0b ${pConfirmed}% ${pConfirmed + pPending}%, #ef4444 ${pConfirmed + pPending}% 100%)`;

  const lowStockRooms = roomStats.filter(r => r.percentRemaining < 20 && r.nom);

  return (
    <main className="section container mt-80">
      <div className="flex-between flex-wrap gap-20 mb-40">
        <div>
          <h1 className="section-title mb-0">Tableau de Bord Admin</h1>
        </div>
        <div className="flex gap-10">
          <Link href="/" className="btn btn-outline flex-center gap-5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Retour au site
          </Link>
          <button onClick={fetchData} className="btn btn-primary flex-center gap-5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Actualiser
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="kpi-grid mb-40">
        <div className="kpi-card border-blue">
          <div className="kpi-icon bg-blue-light text-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Réservations</span>
            <span className="kpi-value text-blue">{stats.total}</span>
          </div>
        </div>
        
        <div className="kpi-card border-green">
          <div className="kpi-icon bg-green-light text-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Confirmées</span>
            <span className="kpi-value text-green">{stats.confirmed}</span>
          </div>
        </div>

        <div className="kpi-card border-red">
          <div className="kpi-icon bg-red-light text-red">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Refusées</span>
            <span className="kpi-value text-red">{stats.refused}</span>
          </div>
        </div>

        <div className="kpi-card border-yellow">
          <div className="kpi-icon bg-yellow-light text-yellow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">En Attente</span>
            <span className="kpi-value text-yellow">{stats.pending}</span>
          </div>
        </div>

        <div className="kpi-card border-purple">
          <div className="kpi-icon bg-purple-light text-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Revenus</span>
            <span className="kpi-value text-purple">{stats.revenue.toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Liste des Réservations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Réservations Confirmées
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Rapports & Suivi
        </button>
      </div>

      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <>
          {activeTab === 'list' ? (
            <div className="admin-table-container card overflow-hidden">
              <table className="w-100 admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Transaction ID</th>
                    <th>Chambres</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => (
                    <tr key={res.id}>
                      <td>{new Date(res.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className="font-bold">{res.nom_client}</div>
                        <div className="text-xs">{res.telephone}</div>
                      </td>
                      <td className="font-mono">{res.transaction_id}</td>
                      <td>
                        {res.details.map((d, i) => (
                          <div key={i} className="text-xs">
                            {d.quantite}x {d.room?.nom || 'Chambre supprimée'} 
                            {d.nuitees > 0 && <span className="text-muted ml-5">({d.nuitees} {d.nuitees > 1 ? 'nuits' : 'nuit'})</span>}
                          </div>
                        ))}
                      </td>
                      <td className="font-bold">{Number(res.montant_total).toLocaleString()} FCFA</td>
                      <td>
                        <span className={`status-pill pill-${res.statut.toLowerCase().replace(' ', '-')}`}>
                          {res.statut}
                        </span>
                      </td>
                      <td>
                        {res.statut === 'EN ATTENTE' && (
                          <div className="flex gap-10">
                            <button 
                              onClick={() => handleStatusUpdate(res, 'CONFIRMÉ')}
                              className="btn btn-success btn-sm"
                            >
                              Confirmer
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(res, 'REFUSÉ')}
                              className="btn btn-error btn-sm"
                            >
                              Refuser
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-40">Aucune réservation trouvée.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'confirmed' ? (
            <ConfirmedReservationsTab reservations={reservations} />
          ) : (
            <div className="detailed-dashboard-grid w-100">
              {/* Block 1: Performance */}
              <div className="dash-card col-span-4">
                <div className="dash-card-header">
                  <div className="dash-card-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                  Performance
                </div>
                <div className="perf-list">
                  <div className="perf-item">
                    <span className="perf-label">
                      <div className="w-10 h-10 rounded-full bg-success"></div> Validation
                    </span>
                    <span className="perf-val text-green">{validationRate}%</span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">
                      <div className="w-10 h-10 rounded-full bg-error"></div> Rejet
                    </span>
                    <span className="perf-val text-red">{rejectionRate}%</span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">
                      <div className="w-10 h-10 rounded-full bg-blue"></div> Conversion
                    </span>
                    <span className="perf-val text-blue">{validationRate}%</span>
                  </div>
                </div>
              </div>

              {/* Block 2: Distribution */}
              <div className="dash-card col-span-4">
                <div className="dash-card-header">
                  <div className="dash-card-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg></div>
                  Distribution
                </div>
                <div className="pie-chart" style={{ background: pieGradient }}></div>
                <div className="flex flex-wrap gap-20 mt-10">
                  <div className="flex align-center gap-5 text-sm">
                    <span className="w-10 h-10 rounded-full bg-success"></span>
                    <span>Confirmées: <span className="font-bold">{stats.confirmed}</span></span>
                  </div>
                  <div className="flex align-center gap-5 text-sm">
                    <span className="w-10 h-10 rounded-full bg-warning"></span>
                    <span>En Attente: <span className="font-bold">{stats.pending}</span></span>
                  </div>
                  <div className="flex align-center gap-5 text-sm">
                    <span className="w-10 h-10 rounded-full bg-error"></span>
                    <span>Refusées: <span className="font-bold">{stats.refused}</span></span>
                  </div>
                </div>

              </div>

              {/* Block 3: Finances */}
              <div className="dash-card col-span-4">
                <div className="dash-card-header">
                  <div className="dash-card-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                  Finances
                </div>
                <div className="fin-grid">
                  <div className="fin-card">
                    <div className="fin-card-label">Collecté</div>
                    <div className="fin-card-val text-green">{stats.revenue.toLocaleString()}</div>
                  </div>
                  <div className="fin-card">
                    <div className="fin-card-label">En Attente</div>
                    <div className="fin-card-val text-yellow">{pendingRevenue.toLocaleString()}</div>
                  </div>
                  <div className="fin-card">
                    <div className="fin-card-label">Dépenses (est.)</div>
                    <div className="fin-card-val text-red">{estimatedExpenses.toLocaleString()}</div>
                  </div>
                  <div className="fin-card">
                    <div className="fin-card-label">Bénéfice</div>
                    <div className="fin-card-val text-blue">{estimatedProfit.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Block 4: Suivi Chambres */}
              <div className="dash-card col-span-8">
                <div className="dash-card-header">
                  <div className="dash-card-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                  Suivi des Chambres
                </div>
                <div className="overflow-x-auto w-100">
                  <table className="w-100 admin-table text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">Chambre</th>
                        <th className="text-center">Initial</th>
                        <th className="text-center">Réservé</th>
                        <th className="text-center">Restant</th>
                        <th className="text-left">Disponibilité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomStats.map(stat => {
                        let statusColor = "bg-success";
                        let textColor = "#2E7D32";
                        if (stat.percentRemaining < 20) { statusColor = "bg-error"; textColor = "#C62828"; }
                        else if (stat.percentRemaining < 50) { statusColor = "bg-warning"; textColor = "#F57F17"; }
                        return (
                          <tr key={stat.id}>
                            <td className="font-bold">{stat.nom}</td>
                            <td className="text-center">{stat.totalInitial}</td>
                            <td className="text-center text-blue font-bold">{stat.reservedCount}</td>
                            <td className="text-center font-bold" style={{ color: textColor }}>{stat.remaining}</td>
                            <td style={{ minWidth: '150px' }}>
                              <div className="flex flex-col gap-5">
                                <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ flex: 1, background: '#f1f5f9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div className={statusColor} style={{ height: '100%', width: `${stat.percentReserved}%` }}></div>
                                  </div>
                                  <span className="text-xs font-bold" style={{minWidth: '35px'}}>{stat.percentReserved.toFixed(0)}%</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Block 5: Alertes et Actions */}
              <div className="dash-card col-span-4">
                <div className="dash-card-header">
                  <div className="dash-card-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                  Alertes & Actions
                </div>
                <div className="alert-list">
                  {stats.pending > 0 ? (
                    <div className="alert-item warning">
                      <div>
                        <div className="alert-title text-yellow">Action Requise</div>
                        <div className="alert-desc">{stats.pending} réservation(s) en attente de validation.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="alert-item" style={{ background: '#ecfdf5', borderLeftColor: '#10b981' }}>
                      <div>
                        <div className="alert-title text-green">À jour</div>
                        <div className="alert-desc">Aucune réservation en attente.</div>
                      </div>
                    </div>
                  )}

                  {lowStockRooms.length > 0 && (
                    <div className="alert-item danger">
                      <div>
                        <div className="alert-title text-red">Stock Critique</div>
                        <div className="alert-desc">
                          {lowStockRooms.map(r => r.nom).join(', ')} presque complète(s) !
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
