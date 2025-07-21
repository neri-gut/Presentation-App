import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type {
  DashboardWidget,
  QuickAction,
  RecentPresentation,
  SystemStatus,
  UpcomingMeeting,
  ContentLibraryStats,
  DisplayPreview,
  TimerState,
  DashboardNotification,
  DashboardLayout,
  DashboardPreferences,
} from '@/types/dashboard';

// Estado del store
interface DashboardState {
  // Widgets y layout
  widgets: DashboardWidget[];
  layouts: DashboardLayout[];
  currentLayoutId: string;
  preferences: DashboardPreferences;

  // Datos de widgets
  quickActions: QuickAction[];
  recentPresentations: RecentPresentation[];
  systemStatus: SystemStatus;
  upcomingMeetings: UpcomingMeeting[];
  contentStats: ContentLibraryStats;
  displays: DisplayPreview[];
  timer: TimerState;
  notifications: DashboardNotification[];

  // Estado de UI
  isLoading: boolean;
  lastRefresh: Date | null;
  autoRefreshEnabled: boolean;
}

// Acciones del store
interface DashboardActions {
  // Widget management
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  removeWidget: (widgetId: string) => void;
  reorderWidgets: (widgetIds: string[]) => void;

  // Layout management
  saveLayout: (layout: Omit<DashboardLayout, 'id'>) => void;
  switchLayout: (layoutId: string) => void;
  deleteLayout: (layoutId: string) => void;

  // Preferences
  updatePreferences: (preferences: Partial<DashboardPreferences>) => void;

  // Data updates
  updateQuickActions: (actions: QuickAction[]) => void;
  updateRecentPresentations: (presentations: RecentPresentation[]) => void;
  updateSystemStatus: (status: SystemStatus) => void;
  updateUpcomingMeetings: (meetings: UpcomingMeeting[]) => void;
  updateContentStats: (stats: ContentLibraryStats) => void;
  updateDisplays: (displays: DisplayPreview[]) => void;
  updateTimer: (timer: Partial<TimerState>) => void;

  // Notifications
  addNotification: (notification: Omit<DashboardNotification, 'id'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;

  // Actions
  refreshData: () => Promise<void>;
  setLoading: (loading: boolean) => void;

  // Quick actions
  executeQuickAction: (actionId: string) => Promise<void>;
}

type DashboardStore = DashboardState & DashboardActions;

// Datos iniciales
const initialPreferences: DashboardPreferences = {
  defaultLayout: 'default',
  autoRefresh: true,
  refreshInterval: 30,
  showGridLines: false,
  enableDragDrop: true,
  theme: 'auto',
};

const initialWidgets: DashboardWidget[] = [
  {
    id: 'quick-actions',
    title: 'Acciones Rápidas',
    type: 'quick-actions',
    size: 'large',
    position: { x: 0, y: 0 },
    isVisible: true,
  },
  {
    id: 'system-status',
    title: 'Estado del Sistema',
    type: 'system-status',
    size: 'medium',
    position: { x: 8, y: 0 },
    isVisible: true,
  },
  {
    id: 'recent-presentations',
    title: 'Presentaciones Recientes',
    type: 'recent-presentations',
    size: 'medium',
    position: { x: 0, y: 3 },
    isVisible: true,
  },
  {
    id: 'upcoming-meetings',
    title: 'Próximas Reuniones',
    type: 'upcoming-meetings',
    size: 'medium',
    position: { x: 6, y: 3 },
    isVisible: true,
  },
];

const initialTimer: TimerState = {
  isRunning: false,
  currentTime: 0,
  totalTime: 7200,
  type: 'meeting',
  title: 'Reunión',
};

const initialSystemStatus: SystemStatus = {
  displays: { connected: 0, active: 0, errors: 0 },
  content: { downloaded: 0, pending: 0, lastSync: null },
  performance: { cpu: 0, memory: 0, storage: 0 },
};

const initialContentStats: ContentLibraryStats = {
  music: { total: 0, downloaded: 0 },
  publications: { total: 0, downloaded: 0 },
  bible: { translations: 0, verses: 0 },
};

// Store principal
export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        widgets: initialWidgets,
        layouts: [
          {
            id: 'default',
            name: 'Layout por defecto',
            isDefault: true,
            widgets: initialWidgets,
            gridCols: 12,
            gridRows: 8,
          },
        ],
        currentLayoutId: 'default',
        preferences: initialPreferences,

        quickActions: [],
        recentPresentations: [],
        systemStatus: initialSystemStatus,
        upcomingMeetings: [],
        contentStats: initialContentStats,
        displays: [],
        timer: initialTimer,
        notifications: [],

        isLoading: false,
        lastRefresh: null,
        autoRefreshEnabled: true,

        // Widget management
        addWidget: widget => {
          const newWidget: DashboardWidget = {
            ...widget,
            id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };

          set(
            state => ({
              widgets: [...state.widgets, newWidget],
            }),
            false,
            'addWidget'
          );
        },

        updateWidget: (widgetId, updates) => {
          set(
            state => ({
              widgets: state.widgets.map(widget =>
                widget.id === widgetId ? { ...widget, ...updates } : widget
              ),
            }),
            false,
            'updateWidget'
          );
        },

        removeWidget: widgetId => {
          set(
            state => ({
              widgets: state.widgets.filter(widget => widget.id !== widgetId),
            }),
            false,
            'removeWidget'
          );
        },

        reorderWidgets: widgetIds => {
          const { widgets } = get();
          const orderedWidgets = widgetIds
            .map(id => widgets.find(w => w.id === id))
            .filter(Boolean) as DashboardWidget[];

          set({ widgets: orderedWidgets }, false, 'reorderWidgets');
        },

        // Layout management
        saveLayout: layout => {
          const newLayout: DashboardLayout = {
            ...layout,
            id: `layout-${Date.now()}`,
          };

          set(
            state => ({
              layouts: [...state.layouts, newLayout],
            }),
            false,
            'saveLayout'
          );
        },

        switchLayout: layoutId => {
          const { layouts } = get();
          const layout = layouts.find(l => l.id === layoutId);

          if (layout) {
            set(
              {
                currentLayoutId: layoutId,
                widgets: layout.widgets,
              },
              false,
              'switchLayout'
            );
          }
        },

        deleteLayout: layoutId => {
          set(
            state => ({
              layouts: state.layouts.filter(layout => layout.id !== layoutId),
            }),
            false,
            'deleteLayout'
          );
        },

        // Preferences
        updatePreferences: newPreferences => {
          set(
            state => ({
              preferences: { ...state.preferences, ...newPreferences },
            }),
            false,
            'updatePreferences'
          );
        },

        // Data updates
        updateQuickActions: actions => {
          set({ quickActions: actions }, false, 'updateQuickActions');
        },

        updateRecentPresentations: presentations => {
          set(
            { recentPresentations: presentations },
            false,
            'updateRecentPresentations'
          );
        },

        updateSystemStatus: status => {
          set({ systemStatus: status }, false, 'updateSystemStatus');
        },

        updateUpcomingMeetings: meetings => {
          set({ upcomingMeetings: meetings }, false, 'updateUpcomingMeetings');
        },

        updateContentStats: stats => {
          set({ contentStats: stats }, false, 'updateContentStats');
        },

        updateDisplays: displays => {
          set({ displays: displays }, false, 'updateDisplays');
        },

        updateTimer: timerUpdates => {
          set(
            state => ({
              timer: { ...state.timer, ...timerUpdates },
            }),
            false,
            'updateTimer'
          );
        },

        // Notifications
        addNotification: notification => {
          const newNotification: DashboardNotification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };

          set(
            state => ({
              notifications: [newNotification, ...state.notifications],
            }),
            false,
            'addNotification'
          );
        },

        markNotificationAsRead: notificationId => {
          set(
            state => ({
              notifications: state.notifications.map(notification =>
                notification.id === notificationId
                  ? { ...notification, isRead: true }
                  : notification
              ),
            }),
            false,
            'markNotificationAsRead'
          );
        },

        removeNotification: notificationId => {
          set(
            state => ({
              notifications: state.notifications.filter(
                notification => notification.id !== notificationId
              ),
            }),
            false,
            'removeNotification'
          );
        },

        clearAllNotifications: () => {
          set({ notifications: [] }, false, 'clearAllNotifications');
        },

        // Actions
        refreshData: async () => {
          set({ isLoading: true }, false, 'refreshData-start');

          try {
            // Simular carga de datos (implementar llamadas reales)
            await new Promise(resolve => setTimeout(resolve, 1000));

            set(
              {
                isLoading: false,
                lastRefresh: new Date(),
              },
              false,
              'refreshData-complete'
            );
          } catch (error) {
            set({ isLoading: false }, false, 'refreshData-error');
            throw error;
          }
        },

        setLoading: loading => {
          set({ isLoading: loading }, false, 'setLoading');
        },

        executeQuickAction: async actionId => {
          const { quickActions } = get();
          const action = quickActions.find(a => a.id === actionId);

          if (action && action.isEnabled) {
            // Implementar lógica de acción
            console.log('Executing action:', action);

            // Ejemplo: agregar notificación
            get().addNotification({
              type: 'info',
              title: 'Acción ejecutada',
              message: `Se ejecutó la acción: ${action.label}`,
              timestamp: new Date(),
              isRead: false,
            });
          }
        },
      }),
      {
        name: 'dashboard-store',
        partialize: state => ({
          // Persistir configuraciones y layouts
          layouts: state.layouts,
          currentLayoutId: state.currentLayoutId,
          preferences: state.preferences,
          widgets: state.widgets,
        }),
      }
    ),
    {
      name: 'dashboard-store',
    }
  )
);

// Selectores útiles
export const useQuickActions = () =>
  useDashboardStore(state => state.quickActions);
export const useRecentPresentations = () =>
  useDashboardStore(state => state.recentPresentations);
export const useSystemStatus = () =>
  useDashboardStore(state => state.systemStatus);
export const useUpcomingMeetings = () =>
  useDashboardStore(state => state.upcomingMeetings);
export const useContentStats = () =>
  useDashboardStore(state => state.contentStats);
export const useDisplays = () => useDashboardStore(state => state.displays);
export const useTimer = () => useDashboardStore(state => state.timer);
export const useNotifications = () =>
  useDashboardStore(state => state.notifications);
export const useDashboardPreferences = () =>
  useDashboardStore(state => state.preferences);
