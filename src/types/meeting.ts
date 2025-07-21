// Tipos para el sistema de reuniones y cronómetro avanzado

export interface MeetingSection {
  id: string;
  name: string;
  duration: number; // en minutos
  order: number;
  type: 'song' | 'prayer' | 'talk' | 'study' | 'demo' | 'video' | 'break';
  isRequired: boolean;
  description?: string;
}

export interface MeetingTemplate {
  id: string;
  name: string;
  type: 'weekday' | 'weekend';
  sections: MeetingSection[];
  totalDuration: number; // calculado automáticamente
  isDefault: boolean;
  lastModified: Date;
  createdBy?: string;
}

export interface MeetingSchedule {
  id: string;
  templateId: string;
  date: Date;
  startTime: string; // formato HH:MM
  sections: MeetingSection[];
  customizations?: {
    sectionId: string;
    customDuration?: number;
    customName?: string;
    notes?: string;
  }[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface TimerSession {
  id: string;
  meetingScheduleId: string;
  startTime: Date;
  endTime?: Date;
  currentSectionIndex: number;
  sectionReports: SectionTimeReport[];
  isPaused: boolean;
  totalDelay: number; // en segundos (positivo = atraso, negativo = adelanto)
}

export interface SectionTimeReport {
  sectionId: string;
  sectionName: string;
  plannedDuration: number; // en minutos
  actualStartTime: Date;
  actualEndTime?: Date;
  actualDuration?: number; // en minutos
  variance: number; // diferencia en minutos respecto al plan
  notes?: string;
}

export interface AdvancedTimerState {
  // Estado principal del cronómetro
  isRunning: boolean;
  isPaused: boolean;
  currentSession?: TimerSession;
  
  // Sección actual
  currentSection?: MeetingSection;
  currentSectionTime: number; // tiempo transcurrido en la sección actual (segundos)
  currentSectionIndex: number;
  
  // Tiempo de reunión general
  meetingStartTime?: Date;
  totalMeetingTime: number; // tiempo total transcurrido (segundos)
  plannedTotalDuration: number; // duración total planificada (segundos)
  
  // Indicadores de tiempo
  timeVariance: number; // atraso/adelanto en segundos
  currentTime: string; // hora actual del día
  estimatedEndTime: string; // hora estimada de finalización
  
  // Alertas visuales
  alertLevel: 'normal' | 'warning' | 'critical' | 'overtime';
  showAlert: boolean;
}

export interface TimerDisplayConfig {
  // Configuración para la pantalla del orador (Display #3)
  displayId: 'audience' | 'speaker' | 'operator';
  showCurrentTime: boolean;
  showMeetingEndTime: boolean;
  showTimeVariance: boolean;
  alertThresholds: {
    warning: number; // segundos antes del final para mostrar warning
    critical: number; // segundos antes del final para mostrar critical
  };
  colors: {
    normal: string;
    warning: string;
    critical: string;
    overtime: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  role: 'operator' | 'audio' | 'video' | 'elder' | 'attendant';
  permissions: UserPermission[];
  preferences: UserPreferences;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserPermission {
  action: 'timer_control' | 'meeting_config' | 'template_edit' | 'reports_view' | 'system_config';
  granted: boolean;
}

export interface UserPreferences {
  defaultMeetingStartTime: string; // formato HH:MM
  timerDisplayConfig: TimerDisplayConfig;
  language: 'es' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    soundEnabled: boolean;
    visualEnabled: boolean;
    emailReports: boolean;
  };
}

// Props para componentes

export interface MeetingConfigWidgetProps {
  currentTemplate?: MeetingTemplate;
  availableTemplates: MeetingTemplate[];
  onTemplateSelect: (template: MeetingTemplate) => void;
  onTemplateEdit: (template: MeetingTemplate) => void;
  onTemplateCreate: () => void;
  onSectionEdit: (section: MeetingSection) => void;
}

export interface AdvancedTimerWidgetProps {
  timerState: AdvancedTimerState;
  displayConfig: TimerDisplayConfig;
  currentUser: UserProfile;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onNextSection: () => void;
  onPreviousSection: () => void;
  onSectionSkip: (sectionIndex: number) => void;
  onEmergencyStop: () => void;
}

export interface SpeakerDisplayProps {
  timerState: AdvancedTimerState;
  displayConfig: TimerDisplayConfig;
  isFullscreen?: boolean;
}

export interface TimeReportWidgetProps {
  sessions: TimerSession[];
  onViewReport: (session: TimerSession) => void;
  onExportReport: (session: TimerSession) => void;
  onGenerateWeeklyReport: () => void;
}

// Tipos para GitHub Actions y documentos JW

export interface JWDocumentData {
  weekDate: string; // formato YYYY-MM-DD
  documentUrl: string;
  sections: {
    name: string;
    duration: number;
    type: string;
    order: number;
  }[];
  totalDuration: number;
  lastUpdated: Date;
}

export interface DocumentUpdateConfig {
  autoUpdate: boolean;
  updateDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  updateTime: string; // formato HH:MM
  fallbackToDefault: boolean;
  notifyOnUpdate: boolean;
}