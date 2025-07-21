// Types para Dashboard - Hub central de la aplicación

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  isVisible: boolean;
  config?: Record<string, unknown>;
}

export type WidgetType =
  | 'quick-actions'
  | 'recent-presentations'
  | 'system-status'
  | 'upcoming-meetings'
  | 'content-library'
  | 'display-preview'
  | 'timer-widget'
  | 'notifications';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  shortcut?: string;
  isEnabled: boolean;
}

export interface RecentPresentation {
  id: string;
  title: string;
  date: Date;
  duration: number;
  thumbnail?: string;
  tags: string[];
}

export interface SystemStatus {
  displays: {
    connected: number;
    active: number;
    errors: number;
  };
  content: {
    downloaded: number;
    pending: number;
    lastSync: Date | null;
  };
  performance: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  date: Date;
  type: 'midweek' | 'weekend' | 'assembly' | 'convention' | 'special';
  duration: number;
  isReady: boolean;
  materials: string[];
}

export interface ContentLibraryStats {
  music: {
    total: number;
    downloaded: number;
  };
  publications: {
    total: number;
    downloaded: number;
  };
  bible: {
    translations: number;
    verses: number;
  };
}

export interface DisplayPreview {
  id: string;
  name: string;
  type: 'audience' | 'speaker' | 'operator';
  isActive: boolean;
  currentContent: string | null;
  thumbnail?: string;
}

export interface TimerState {
  isRunning: boolean;
  currentTime: number;
  totalTime: number;
  type: 'meeting' | 'break' | 'presentation' | 'song';
  title: string;
}

export interface DashboardNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionLabel?: string;
  actionCallback?: () => void;
}

// Props para componentes del Dashboard
export interface DashboardProps {
  widgets: DashboardWidget[];
  onWidgetUpdate: (widget: DashboardWidget) => void;
  onWidgetRemove: (widgetId: string) => void;
  onWidgetAdd: (widget: Omit<DashboardWidget, 'id'>) => void;
}

export interface QuickActionsWidgetProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
}

export interface RecentPresentationsWidgetProps {
  presentations: RecentPresentation[];
  onPresentationSelect: (presentation: RecentPresentation) => void;
  onViewAll: () => void;
}

export interface SystemStatusWidgetProps {
  status: SystemStatus;
  onRefresh: () => void;
  onViewDetails: () => void;
}

export interface UpcomingMeetingsWidgetProps {
  meetings: UpcomingMeeting[];
  onMeetingSelect: (meeting: UpcomingMeeting) => void;
  onPrepare: (meetingId: string) => void;
}

export interface ContentLibraryWidgetProps {
  stats: ContentLibraryStats;
  onSyncContent: () => void;
  onViewLibrary: () => void;
}

export interface DisplayPreviewWidgetProps {
  displays: DisplayPreview[];
  onDisplaySelect: (display: DisplayPreview) => void;
  onConfigureDisplays: () => void;
}

export interface TimerWidgetProps {
  timer: TimerState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onConfigure: () => void;
}

export interface NotificationsWidgetProps {
  notifications: DashboardNotification[];
  onNotificationRead: (notificationId: string) => void;
  onNotificationAction: (notification: DashboardNotification) => void;
  onClearAll: () => void;
}

// Dashboard layout configuration
export interface DashboardLayout {
  id: string;
  name: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  gridCols: number;
  gridRows: number;
}

// Dashboard preferences
export interface DashboardPreferences {
  defaultLayout: string;
  autoRefresh: boolean;
  refreshInterval: number; // en segundos
  showGridLines: boolean;
  enableDragDrop: boolean;
  theme: 'light' | 'dark' | 'auto';
}
