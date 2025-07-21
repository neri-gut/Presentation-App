import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Tipos de estado
export interface User {
  id: string;
  name: string;
  role: 'operator' | 'speaker' | 'admin';
  permissions: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoStart: boolean;
  debugMode: boolean;
}

export interface DisplayConfig {
  id: string;
  name: string;
  type: 'audience' | 'speaker' | 'operator';
  resolution: string;
  isPrimary: boolean;
  isActive: boolean;
}

// Estado del store
interface AppState {
  // Usuario y autenticación
  currentUser: User | null;
  isAuthenticated: boolean;

  // Configuración global
  settings: AppSettings;
  displays: DisplayConfig[];

  // Estado de la aplicación
  isLoading: boolean;
  currentView: string;
  emergencyMode: boolean;

  // Estado de conectividad
  isOnline: boolean;
  lastSyncTime: Date | null;
}

// Acciones del store
interface AppActions {
  // Autenticación
  setUser: (user: User | null) => void;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;

  // Configuración
  updateSettings: (settings: Partial<AppSettings>) => void;
  addDisplay: (display: DisplayConfig) => void;
  removeDisplay: (displayId: string) => void;
  updateDisplay: (displayId: string, updates: Partial<DisplayConfig>) => void;

  // Estado de aplicación
  setLoading: (loading: boolean) => void;
  setCurrentView: (view: string) => void;
  toggleEmergencyMode: () => void;

  // Conectividad
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastSync: () => void;

  // Acciones combinadas
  initializeApp: () => Promise<void>;
  resetApp: () => void;
}

type AppStore = AppState & AppActions;

// Configuración inicial
const initialSettings: AppSettings = {
  theme: 'auto',
  language: 'es',
  autoStart: false,
  debugMode: false,
};

// Store principal
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        currentUser: null,
        isAuthenticated: false,
        settings: initialSettings,
        displays: [],
        isLoading: false,
        currentView: 'dashboard',
        emergencyMode: false,
        isOnline: true,
        lastSyncTime: null,

        // Implementación de acciones
        setUser: user =>
          set({ currentUser: user, isAuthenticated: !!user }, false, 'setUser'),

        login: async credentials => {
          set({ isLoading: true }, false, 'login-start');

          try {
            // Simular autenticación (implementar lógica real)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
              id: '1',
              name: credentials.username,
              role: 'operator',
              permissions: ['presentation', 'content', 'settings'],
            };

            set(
              {
                currentUser: mockUser,
                isAuthenticated: true,
                isLoading: false,
              },
              false,
              'login-success'
            );

            return true;
          } catch (error) {
            set({ isLoading: false }, false, 'login-error');
            return false;
          }
        },

        logout: () =>
          set(
            {
              currentUser: null,
              isAuthenticated: false,
              currentView: 'dashboard',
            },
            false,
            'logout'
          ),

        updateSettings: newSettings =>
          set(
            state => ({
              settings: { ...state.settings, ...newSettings },
            }),
            false,
            'updateSettings'
          ),

        addDisplay: display =>
          set(
            state => ({
              displays: [...state.displays, display],
            }),
            false,
            'addDisplay'
          ),

        removeDisplay: displayId =>
          set(
            state => ({
              displays: state.displays.filter(d => d.id !== displayId),
            }),
            false,
            'removeDisplay'
          ),

        updateDisplay: (displayId, updates) =>
          set(
            state => ({
              displays: state.displays.map(d =>
                d.id === displayId ? { ...d, ...updates } : d
              ),
            }),
            false,
            'updateDisplay'
          ),

        setLoading: loading => set({ isLoading: loading }, false, 'setLoading'),

        setCurrentView: view =>
          set({ currentView: view }, false, 'setCurrentView'),

        toggleEmergencyMode: () =>
          set(
            state => ({
              emergencyMode: !state.emergencyMode,
            }),
            false,
            'toggleEmergencyMode'
          ),

        setOnlineStatus: isOnline =>
          set({ isOnline }, false, 'setOnlineStatus'),

        updateLastSync: () =>
          set({ lastSyncTime: new Date() }, false, 'updateLastSync'),

        initializeApp: async () => {
          set({ isLoading: true }, false, 'initializeApp-start');

          try {
            // Inicializar configuraciones de display
            // Detectar pantallas conectadas
            // Cargar configuraciones guardadas
            // Verificar conectividad

            await new Promise(resolve => setTimeout(resolve, 2000));

            set(
              {
                isLoading: false,
                isOnline: navigator.onLine,
              },
              false,
              'initializeApp-complete'
            );
          } catch (error) {
            set({ isLoading: false }, false, 'initializeApp-error');
            throw error;
          }
        },

        resetApp: () =>
          set(
            {
              currentUser: null,
              isAuthenticated: false,
              settings: initialSettings,
              displays: [],
              isLoading: false,
              currentView: 'dashboard',
              emergencyMode: false,
              lastSyncTime: null,
            },
            false,
            'resetApp'
          ),
      }),
      {
        name: 'multimedia-presentation-app-store',
        partialize: state => ({
          // Solo persistir configuraciones, no estado temporal
          settings: state.settings,
          displays: state.displays,
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);

// Selectores útiles
export const useUser = () => useAppStore(state => state.currentUser);
export const useSettings = () => useAppStore(state => state.settings);
export const useDisplays = () => useAppStore(state => state.displays);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useCurrentView = () => useAppStore(state => state.currentView);
export const useEmergencyMode = () => useAppStore(state => state.emergencyMode);
