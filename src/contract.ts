// Contrat d'interface partagé depuis technician_verti vers technician_hori
export interface SystemMetrics {
  id: string;
  verticalStatus: 'active' | 'idle';
  timestamp: number;
}
