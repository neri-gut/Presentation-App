// Tipos para el sistema multimedia de presentaciones

export type MediaType = 'video' | 'image' | 'audio';
export type MediaSource = 'local' | 'jw' | 'url';
export type MediaQuality = 'low' | 'medium' | 'high' | 'auto';

// Metadatos básicos de archivo multimedia
export interface MediaFile {
  id: string;
  name: string;
  filename: string;
  type: MediaType;
  source: MediaSource;
  path?: string; // Ruta local del archivo
  url?: string; // URL externa (JW.org, etc.)
  size: number; // Tamaño en bytes
  duration?: number; // Duración en segundos (para video/audio)
  thumbnail?: string; // Ruta de miniatura
  metadata: MediaMetadata;
  tags: string[];
  createdAt: Date;
  lastModified: Date;
}

// Metadatos específicos por tipo de archivo
export interface MediaMetadata {
  width?: number;
  height?: number;
  resolution?: string; // "1920x1080"
  fps?: number; // Para videos
  format: string; // "mp4", "jpg", "mp3", etc.
  codec?: string; // "h264", "jpeg", etc.
  bitrate?: number; // Para video/audio
  title?: string; // Título descriptivo
  description?: string;
  language?: string;
  subtitles?: SubtitleTrack[];
}

// Pistas de subtítulos
export interface SubtitleTrack {
  id: string;
  language: string;
  label: string; // "Español", "English", etc.
  path: string; // Ruta al archivo .srt/.vtt
  isDefault: boolean;
}

// Configuración de reproducción
export interface PlaybackConfig {
  autoplay: boolean;
  loop: boolean;
  volume: number; // 0-1
  quality: MediaQuality;
  subtitlesEnabled: boolean;
  selectedSubtitleTrack?: string;
  playbackRate: number; // 0.5, 1, 1.5, 2, etc.
  startTime: number; // Tiempo de inicio en segundos
  endTime?: number; // Tiempo de fin en segundos (para clips)
}

// Estado actual de reproducción
export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isFullscreen: boolean;
  error?: MediaError;
}

// Errores de reproducción
export interface MediaError {
  code: string;
  message: string;
  details?: string;
  timestamp: Date;
}

// Biblioteca de medios organizada
export interface MediaLibrary {
  id: string;
  name: string;
  description?: string;
  collections: MediaCollection[];
  totalFiles: number;
  totalSize: number; // Tamaño total en bytes
  lastUpdated: Date;
}

// Colección de archivos multimedia
export interface MediaCollection {
  id: string;
  name: string;
  description?: string;
  color?: string; // Color de etiqueta
  files: MediaFile[];
  parentId?: string; // Para subcarpetas
  createdAt: Date;
  isPublic: boolean; // Visible para todos los usuarios
  permissions: CollectionPermissions;
}

// Permisos de colección
export interface CollectionPermissions {
  canView: string[]; // IDs de usuarios/roles
  canEdit: string[]; // IDs de usuarios/roles
  canDelete: string[]; // IDs de usuarios/roles
  canShare: string[]; // IDs de usuarios/roles
}

// Lista de reproducción para presentaciones
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  items: PlaylistItem[];
  totalDuration: number;
  createdBy: string; // ID del usuario
  createdAt: Date;
  lastModified: Date;
  isActive: boolean; // Lista actualmente en uso
}

// Elemento de lista de reproducción
export interface PlaylistItem {
  id: string;
  mediaFileId: string;
  order: number;
  config: PlaybackConfig;
  notes?: string; // Notas para el operador
  cuePoints?: CuePoint[]; // Puntos de referencia
}

// Puntos de referencia en medios
export interface CuePoint {
  id: string;
  time: number; // Tiempo en segundos
  label: string;
  description?: string;
  action?: CueAction; // Acción automática
}

// Acciones automáticas en puntos de referencia
export interface CueAction {
  type: 'pause' | 'volume' | 'subtitle' | 'notification';
  value?: any; // Valor específico según el tipo
  message?: string; // Mensaje a mostrar
}

// Configuración de presentación
export interface PresentationConfig {
  displayMode: 'fullscreen' | 'windowed' | 'picture-in-picture';
  screens: ScreenConfig[];
  transitions: TransitionConfig;
  controls: ControlsConfig;
}

// Configuración de pantalla
export interface ScreenConfig {
  id: string;
  name: string; // "Audiencia", "Orador", "Operador"
  type: 'audience' | 'speaker' | 'operator';
  display: number; // Número de display/monitor
  resolution: string;
  isActive: boolean;
  showControls: boolean;
  showSubtitles: boolean;
}

// Configuración de transiciones
export interface TransitionConfig {
  type: 'fade' | 'slide' | 'cut' | 'dissolve';
  duration: number; // Milisegundos
  easing: 'ease' | 'ease-in' | 'ease-out' | 'linear';
}

// Configuración de controles
export interface ControlsConfig {
  showPlayButton: boolean;
  showVolumeSlider: boolean;
  showProgressBar: boolean;
  showFullscreenButton: boolean;
  showSubtitleButton: boolean;
  autoHideDelay: number; // Milisegundos
  keyboardShortcuts: boolean;
}

// Estadísticas de uso de medios
export interface MediaStats {
  fileId: string;
  timesPlayed: number;
  totalPlayTime: number; // Tiempo total reproducido en segundos
  lastPlayed?: Date;
  averageWatchTime: number; // Porcentaje promedio visto
  popularSegments: TimeRange[]; // Segmentos más reproducidos
}

// Rango de tiempo
export interface TimeRange {
  start: number;
  end: number;
  playCount: number;
}

// Filtros para búsqueda de medios
export interface MediaFilter {
  type?: MediaType[];
  source?: MediaSource[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  durationRange?: {
    min: number;
    max: number;
  };
  resolution?: string[];
  format?: string[];
  searchQuery?: string;
}

// Resultado de búsqueda
export interface SearchResult {
  files: MediaFile[];
  totalCount: number;
  hasMore: boolean;
  filters: MediaFilter;
  sortBy: 'name' | 'date' | 'size' | 'duration' | 'relevance';
  sortOrder: 'asc' | 'desc';
}