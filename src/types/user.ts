// Sistema de usuarios y roles

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  role: UserRole;
  permissions: UserPermission[];
  preferences: UserPreferences;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  createdBy?: string; // ID del usuario que lo creó
}

export type UserRole = 
  | 'admin'           // Administrador total del sistema
  | 'operator'        // Operador principal (dashboard)
  | 'audio'          // Técnico de audio
  | 'video'          // Técnico de video
  | 'elder'          // Anciano con permisos especiales
  | 'attendant'      // Siervo ministerial
  | 'viewer';        // Solo visualización

export interface UserPermission {
  action: PermissionAction;
  granted: boolean;
  grantedBy?: string; // ID del usuario que otorgó el permiso
  grantedAt?: Date;
}

export type PermissionAction =
  // Sistema y administración
  | 'user_management'        // Crear, editar, eliminar usuarios
  | 'system_settings'        // Configuraciones del sistema
  | 'backup_restore'         // Respaldos y restauración
  
  // Cronómetro y reuniones
  | 'timer_control'          // Controlar cronómetro
  | 'meeting_config'         // Configurar reuniones
  | 'template_edit'          // Editar plantillas
  | 'timer_override'         // Pausar/detener en emergencia
  
  // Pantallas y multimedia
  | 'display_control'        // Controlar pantallas
  | 'media_management'       // Gestionar multimedia
  | 'presentation_control'   // Controlar presentaciones
  
  // Reportes y datos
  | 'reports_view'           // Ver reportes
  | 'reports_export'         // Exportar reportes
  | 'data_edit'              // Editar datos de reuniones
  
  // Configuraciones personales
  | 'profile_edit'           // Editar propio perfil
  | 'preferences_edit';      // Editar preferencias

export interface UserPreferences {
  // Configuraciones de reunión
  defaultMeetingStartTime: string; // formato HH:MM
  autoStartTimer: boolean;
  
  // Configuraciones de pantalla
  timerDisplayConfig: TimerDisplayConfig;
  preferredDisplayLayout: 'compact' | 'standard' | 'large';
  
  // Configuraciones de interfaz
  language: 'es' | 'en';
  theme: 'light' | 'dark' | 'auto';
  sidebarWidth: number;
  
  // Notificaciones
  notifications: {
    soundEnabled: boolean;
    visualEnabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    warningTime: number; // segundos antes del final para alertar
  };
  
  // Configuraciones avanzadas
  advanced: {
    showDebugInfo: boolean;
    autoSaveInterval: number; // minutos
    backupReminders: boolean;
  };
}

export interface TimerDisplayConfig {
  displayId: 'audience' | 'speaker' | 'operator';
  showCurrentTime: boolean;
  showMeetingEndTime: boolean;
  showTimeVariance: boolean;
  showSectionList: boolean;
  alertThresholds: {
    warning: number; // segundos antes del final
    critical: number; // segundos antes del final
  };
  colors: {
    normal: string;
    warning: string;
    critical: string;
    overtime: string;
  };
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
}

// Store de usuarios
export interface UserSession {
  currentUser: User | null;
  isAuthenticated: boolean;
  sessionId?: string;
  loginTime?: Date;
  lastActivity?: Date;
}

// Props para componentes
export interface UserManagementProps {
  users: User[];
  currentUser: User;
  onUserCreate: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUserUpdate: (user: User) => void;
  onUserDelete: (userId: string) => void;
  onPermissionUpdate: (userId: string, permissions: UserPermission[]) => void;
}

export interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  onForgotPassword: (email: string) => void;
  isLoading: boolean;
  error?: string;
}

export interface UserProfileProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  canEdit: boolean;
}

// Configuraciones por defecto según rol
export const DEFAULT_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  admin: [
    'user_management', 'system_settings', 'backup_restore',
    'timer_control', 'meeting_config', 'template_edit', 'timer_override',
    'display_control', 'media_management', 'presentation_control',
    'reports_view', 'reports_export', 'data_edit',
    'profile_edit', 'preferences_edit'
  ],
  operator: [
    'timer_control', 'meeting_config', 'template_edit',
    'display_control', 'media_management', 'presentation_control',
    'reports_view', 'data_edit',
    'profile_edit', 'preferences_edit'
  ],
  audio: [
    'timer_control', 'display_control',
    'reports_view', 'profile_edit', 'preferences_edit'
  ],
  video: [
    'display_control', 'media_management', 'presentation_control',
    'reports_view', 'profile_edit', 'preferences_edit'
  ],
  elder: [
    'timer_control', 'meeting_config', 'timer_override',
    'display_control', 'reports_view', 'reports_export', 'data_edit',
    'profile_edit', 'preferences_edit'
  ],
  attendant: [
    'timer_control', 'display_control',
    'reports_view', 'profile_edit', 'preferences_edit'
  ],
  viewer: [
    'reports_view', 'profile_edit', 'preferences_edit'
  ]
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultMeetingStartTime: '19:00',
  autoStartTimer: false,
  timerDisplayConfig: {
    displayId: 'operator',
    showCurrentTime: true,
    showMeetingEndTime: true,
    showTimeVariance: true,
    showSectionList: true,
    alertThresholds: {
      warning: 60,
      critical: 30
    },
    colors: {
      normal: '#228be6',
      warning: '#fd7e14',
      critical: '#fa5252',
      overtime: '#e03131'
    },
    fontSize: 'medium'
  },
  preferredDisplayLayout: 'standard',
  language: 'es',
  theme: 'auto',
  sidebarWidth: 350,
  notifications: {
    soundEnabled: true,
    visualEnabled: true,
    emailEnabled: false,
    pushEnabled: false,
    warningTime: 60
  },
  advanced: {
    showDebugInfo: false,
    autoSaveInterval: 5,
    backupReminders: true
  }
};