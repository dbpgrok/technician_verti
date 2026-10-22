// Contrat d'interface partagé depuis technician_verti vers technician_hori
export interface SystemMetrics {
  id: string;
  verticalStatus: 'active' | 'idle';
  timestamp: Date;
  lastUpdated?: string;
}

export interface MediaAsset {
  id: string;
  type: 'audio' | 'image' | 'video';
  title: string;
  path: string;
  format: 'mp3' | 'webp' | 'mp4';
  mimeType: 'audio/mpeg' | 'image/webp' | 'video/mp4';
  durationSeconds?: number;
  altText?: string;
  width?: number;
  height?: number;
}

export interface PodcastMetadata {
  title: string;
  description: string;
  language: string;
  coverAssetId?: string;
}
