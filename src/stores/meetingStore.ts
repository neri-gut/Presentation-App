import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  MeetingTemplate, 
  MeetingSchedule, 
  AdvancedTimerState, 
  TimerSession, 
  SectionTimeReport,
  UserProfile,
  TimerDisplayConfig 
} from '../types/meeting';

interface MeetingStore {
  // Templates y configuración
  templates: MeetingTemplate[];
  currentTemplate?: MeetingTemplate;
  currentSchedule?: MeetingSchedule;
  
  // Estado del timer avanzado
  timerState: AdvancedTimerState;
  
  // Sesiones y reportes
  sessions: TimerSession[];
  currentSession?: TimerSession;
  
  // Configuración de usuario actual
  currentUser?: UserProfile;
  displayConfig: TimerDisplayConfig;
  
  // Actions para templates
  setTemplates: (templates: MeetingTemplate[]) => void;
  addTemplate: (template: MeetingTemplate) => void;
  updateTemplate: (template: MeetingTemplate) => void;
  deleteTemplate: (templateId: string) => void;
  setCurrentTemplate: (template: MeetingTemplate) => void;
  
  // Actions para timer
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  nextSection: () => void;
  previousSection: () => void;
  updateTimerState: (update: Partial<AdvancedTimerState>) => void;
  
  // Actions para sesiones
  startNewSession: (scheduleId: string) => void;
  endCurrentSession: () => void;
  addSectionReport: (report: SectionTimeReport) => void;
  
  // Actions para usuario y configuración
  setCurrentUser: (user: UserProfile) => void;
  updateDisplayConfig: (config: Partial<TimerDisplayConfig>) => void;
}

// Plantillas predefinidas
const defaultTemplates: MeetingTemplate[] = [
  {
    id: 'weekday-default',
    name: 'Reunión Entre Semana (Estándar)',
    type: 'weekday',
    isDefault: true,
    lastModified: new Date(),
    totalDuration: 105,
    sections: [
      { id: 'opening-song', name: 'Cántico Inicial', duration: 3, order: 1, type: 'song', isRequired: true },
      { id: 'opening-prayer', name: 'Oración Inicial', duration: 2, order: 2, type: 'prayer', isRequired: true },
      { id: 'treasures', name: 'Tesoros de la Palabra de Dios', duration: 10, order: 3, type: 'talk', isRequired: true },
      { id: 'ministry-1', name: 'Seamos Mejores Maestros - Parte 1', duration: 4, order: 4, type: 'demo', isRequired: true },
      { id: 'ministry-2', name: 'Seamos Mejores Maestros - Parte 2', duration: 4, order: 5, type: 'demo', isRequired: true },
      { id: 'ministry-3', name: 'Seamos Mejores Maestros - Parte 3', duration: 4, order: 6, type: 'demo', isRequired: true },
      { id: 'middle-song', name: 'Cántico Intermedio', duration: 3, order: 7, type: 'song', isRequired: true },
      { id: 'living-1', name: 'Vivamos Como Cristianos - Parte 1', duration: 15, order: 8, type: 'study', isRequired: true },
      { id: 'living-2', name: 'Vivamos Como Cristianos - Parte 2', duration: 30, order: 9, type: 'study', isRequired: true },
      { id: 'announcements', name: 'Anuncios', duration: 5, order: 10, type: 'talk', isRequired: true },
      { id: 'closing-song', name: 'Cántico Final', duration: 3, order: 11, type: 'song', isRequired: true },
      { id: 'closing-prayer', name: 'Oración Final', duration: 2, order: 12, type: 'prayer', isRequired: true }
    ]
  },
  {
    id: 'weekend-default',
    name: 'Reunión Fin de Semana (Estándar)',
    type: 'weekend',
    isDefault: true,
    lastModified: new Date(),
    totalDuration: 105,
    sections: [
      { id: 'opening-song-we', name: 'Cántico Inicial', duration: 3, order: 1, type: 'song', isRequired: true },
      { id: 'opening-prayer-we', name: 'Oración Inicial', duration: 2, order: 2, type: 'prayer', isRequired: true },
      { id: 'public-talk', name: 'Discurso Público', duration: 30, order: 3, type: 'talk', isRequired: true },
      { id: 'middle-song-we', name: 'Cántico Intermedio', duration: 3, order: 4, type: 'song', isRequired: true },
      { id: 'watchtower-study', name: 'Estudio de La Atalaya', duration: 60, order: 5, type: 'study', isRequired: true },
      { id: 'announcements-we', name: 'Anuncios', duration: 4, order: 6, type: 'talk', isRequired: true },
      { id: 'closing-song-we', name: 'Cántico Final', duration: 3, order: 7, type: 'song', isRequired: true }
    ]
  }
];

const defaultDisplayConfig: TimerDisplayConfig = {
  displayId: 'operator',
  showCurrentTime: true,
  showMeetingEndTime: true,
  showTimeVariance: true,
  alertThresholds: {
    warning: 60, // 1 minuto antes
    critical: 30 // 30 segundos antes
  },
  colors: {
    normal: '#228be6',
    warning: '#fd7e14',
    critical: '#fa5252',
    overtime: '#e03131'
  }
};

const initialTimerState: AdvancedTimerState = {
  isRunning: false,
  isPaused: false,
  currentSectionTime: 0,
  currentSectionIndex: 0,
  totalMeetingTime: 0,
  plannedTotalDuration: 6300, // 105 minutos en segundos
  timeVariance: 0,
  currentTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  estimatedEndTime: '',
  alertLevel: 'normal',
  showAlert: false
};

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      templates: defaultTemplates,
      timerState: initialTimerState,
      sessions: [],
      displayConfig: defaultDisplayConfig,
      
      // Template actions
      setTemplates: (templates) => set({ templates }),
      
      addTemplate: (template) => set(state => ({
        templates: [...state.templates, template]
      })),
      
      updateTemplate: (template) => set(state => ({
        templates: state.templates.map(t => t.id === template.id ? template : t)
      })),
      
      deleteTemplate: (templateId) => set(state => ({
        templates: state.templates.filter(t => t.id !== templateId)
      })),
      
      setCurrentTemplate: (template) => {
        set({ currentTemplate: template });
        // Reiniciar timer state cuando se cambia de template
        set(state => ({
          timerState: {
            ...initialTimerState,
            plannedTotalDuration: template.totalDuration * 60 // convertir a segundos
          }
        }));
      },
      
      // Timer actions
      startTimer: () => {
        const state = get();
        if (!state.currentTemplate) return;
        
        const now = new Date();
        let newSession: TimerSession | undefined;
        
        // Si no hay sesión actual, crear una nueva
        if (!state.currentSession) {
          newSession = {
            id: `session_${Date.now()}`,
            meetingScheduleId: `schedule_${Date.now()}`,
            startTime: now,
            currentSectionIndex: 0,
            sectionReports: [],
            isPaused: false,
            totalDelay: 0
          };
        }
        
        set(state => ({
          timerState: {
            ...state.timerState,
            isRunning: true,
            isPaused: false,
            meetingStartTime: state.timerState.meetingStartTime || now,
            currentSection: state.currentTemplate?.sections[state.timerState.currentSectionIndex],
            currentTime: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          },
          currentSession: newSession || state.currentSession
        }));
      },
      
      pauseTimer: () => set(state => ({
        timerState: {
          ...state.timerState,
          isRunning: false,
          isPaused: true
        }
      })),
      
      stopTimer: () => {
        const state = get();
        if (state.currentSession && state.timerState.currentSection) {
          // Guardar reporte de la sección actual
          const report: SectionTimeReport = {
            sectionId: state.timerState.currentSection.id,
            sectionName: state.timerState.currentSection.name,
            plannedDuration: state.timerState.currentSection.duration,
            actualStartTime: new Date(Date.now() - (state.timerState.currentSectionTime * 1000)),
            actualEndTime: new Date(),
            actualDuration: Math.floor(state.timerState.currentSectionTime / 60),
            variance: Math.floor(state.timerState.currentSectionTime / 60) - state.timerState.currentSection.duration
          };
          
          get().addSectionReport(report);
        }
        
        set(state => ({
          timerState: {
            ...state.timerState,
            isRunning: false,
            isPaused: false
          }
        }));
      },
      
      resetTimer: () => set(state => ({
        timerState: {
          ...initialTimerState,
          plannedTotalDuration: state.currentTemplate?.totalDuration ? state.currentTemplate.totalDuration * 60 : 6300
        },
        currentSession: undefined
      })),
      
      nextSection: () => {
        const state = get();
        if (!state.currentTemplate) return;
        
        const nextIndex = Math.min(
          state.timerState.currentSectionIndex + 1,
          state.currentTemplate.sections.length - 1
        );
        
        // Guardar reporte de la sección actual si está corriendo
        if (state.timerState.isRunning && state.timerState.currentSection) {
          const report: SectionTimeReport = {
            sectionId: state.timerState.currentSection.id,
            sectionName: state.timerState.currentSection.name,
            plannedDuration: state.timerState.currentSection.duration,
            actualStartTime: new Date(Date.now() - (state.timerState.currentSectionTime * 1000)),
            actualEndTime: new Date(),
            actualDuration: Math.floor(state.timerState.currentSectionTime / 60),
            variance: Math.floor(state.timerState.currentSectionTime / 60) - state.timerState.currentSection.duration
          };
          
          get().addSectionReport(report);
        }
        
        set(state => ({
          timerState: {
            ...state.timerState,
            currentSectionIndex: nextIndex,
            currentSection: state.currentTemplate?.sections[nextIndex],
            currentSectionTime: 0
          }
        }));
      },
      
      previousSection: () => {
        const state = get();
        if (!state.currentTemplate) return;
        
        const prevIndex = Math.max(state.timerState.currentSectionIndex - 1, 0);
        
        set(state => ({
          timerState: {
            ...state.timerState,
            currentSectionIndex: prevIndex,
            currentSection: state.currentTemplate?.sections[prevIndex],
            currentSectionTime: 0
          }
        }));
      },
      
      updateTimerState: (update) => set(state => ({
        timerState: { ...state.timerState, ...update }
      })),
      
      // Session actions
      startNewSession: (scheduleId) => {
        const newSession: TimerSession = {
          id: `session_${Date.now()}`,
          meetingScheduleId: scheduleId,
          startTime: new Date(),
          currentSectionIndex: 0,
          sectionReports: [],
          isPaused: false,
          totalDelay: 0
        };
        
        set({ currentSession: newSession });
      },
      
      endCurrentSession: () => {
        const state = get();
        if (state.currentSession) {
          const completedSession: TimerSession = {
            ...state.currentSession,
            endTime: new Date()
          };
          
          set(state => ({
            sessions: [...state.sessions, completedSession],
            currentSession: undefined
          }));
        }
      },
      
      addSectionReport: (report) => set(state => {
        if (!state.currentSession) return state;
        
        const updatedSession: TimerSession = {
          ...state.currentSession,
          sectionReports: [...state.currentSession.sectionReports, report]
        };
        
        return { currentSession: updatedSession };
      }),
      
      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      updateDisplayConfig: (config) => set(state => ({
        displayConfig: { ...state.displayConfig, ...config }
      }))
    }),
    {
      name: 'meeting-store',
      partialize: (state) => ({
        templates: state.templates,
        sessions: state.sessions,
        displayConfig: state.displayConfig,
        currentUser: state.currentUser
      })
    }
  )
);

// Hook para el timer que se actualiza cada segundo
export const useTimerTick = () => {
  const { timerState, updateTimerState, currentTemplate } = useMeetingStore();
  
  React.useEffect(() => {
    if (!timerState.isRunning) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      
      updateTimerState({
        currentSectionTime: timerState.currentSectionTime + 1,
        totalMeetingTime: timerState.totalMeetingTime + 1,
        currentTime
      });
      
      // Calcular alertas
      if (timerState.currentSection) {
        const sectionTimeLeft = (timerState.currentSection.duration * 60) - timerState.currentSectionTime;
        let alertLevel: AdvancedTimerState['alertLevel'] = 'normal';
        
        if (sectionTimeLeft <= 0) {
          alertLevel = 'overtime';
        } else if (sectionTimeLeft <= 30) {
          alertLevel = 'critical';
        } else if (sectionTimeLeft <= 60) {
          alertLevel = 'warning';
        }
        
        updateTimerState({ alertLevel });
      }
      
      // Calcular tiempo estimado de finalización
      if (timerState.meetingStartTime && currentTemplate) {
        const plannedEndTime = new Date(timerState.meetingStartTime.getTime() + (currentTemplate.totalDuration * 60 * 1000));
        const estimatedEndTime = plannedEndTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        updateTimerState({ estimatedEndTime });
      }
      
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.currentSectionTime, timerState.totalMeetingTime]);
};