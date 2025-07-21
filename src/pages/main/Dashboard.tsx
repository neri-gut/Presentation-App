import { useEffect, useState } from 'react';
import {
  Grid,
  Container,
  Title,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  LoadingOverlay,
} from '@mantine/core';
import { IconSettings, IconRefresh, IconMaximize } from '@tabler/icons-react';

import { useAppStore } from '../../stores/appStore';
import type {
  QuickAction,
  RecentPresentation,
  SystemStatus,
  UpcomingMeeting,
  ContentLibraryStats,
  DisplayPreview,
  TimerState,
  DashboardNotification,
} from '../../types/dashboard';

// Import de widgets (los crearemos después)
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { RecentPresentationsWidget } from './widgets/RecentPresentationsWidget';
import { SystemStatusWidget } from './widgets/SystemStatusWidget';
import { UpcomingMeetingsWidget } from './widgets/UpcomingMeetingsWidget';
import { ContentLibraryWidget } from './widgets/ContentLibraryWidget';
import { DisplayPreviewWidget } from './widgets/DisplayPreviewWidget';
import { NotificationsWidget } from './widgets/NotificationsWidget';

export default function Dashboard() {
  const { isLoading, setCurrentView, currentUser } = useAppStore();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Estados locales para datos del dashboard
  const [quickActions] = useState<QuickAction[]>([
    {
      id: '1',
      label: 'Iniciar Presentación',
      icon: 'presentation',
      action: 'start-presentation',
      shortcut: 'Ctrl+P',
      isEnabled: true,
    },
    {
      id: '2',
      label: 'Biblioteca de Música',
      icon: 'music',
      action: 'open-music-library',
      shortcut: 'Ctrl+M',
      isEnabled: true,
    },
    {
      id: '3',
      label: 'Configurar Pantallas',
      icon: 'display',
      action: 'configure-displays',
      shortcut: 'Ctrl+D',
      isEnabled: true,
    },
    {
      id: '4',
      label: 'Buscar en Biblia',
      icon: 'book',
      action: 'search-bible',
      shortcut: 'Ctrl+B',
      isEnabled: true,
    },
  ]);

  const [recentPresentations] = useState<RecentPresentation[]>([
    {
      id: '1',
      title: 'Reunión Vida y Ministerio - Semana 1',
      date: new Date('2025-01-15'),
      duration: 120,
      tags: ['midweek', 'clam'],
    },
    {
      id: '2',
      title: 'Reunión Fin de Semana - Enero',
      date: new Date('2025-01-12'),
      duration: 180,
      tags: ['weekend', 'watchtower'],
    },
  ]);

  const [systemStatus] = useState<SystemStatus>({
    displays: {
      connected: 3,
      active: 2,
      errors: 0,
    },
    content: {
      downloaded: 145,
      pending: 5,
      lastSync: new Date(),
    },
    performance: {
      cpu: 25,
      memory: 60,
      storage: 78,
    },
  });

  const [upcomingMeetings] = useState<UpcomingMeeting[]>([
    {
      id: '1',
      title: 'Reunión Vida y Ministerio',
      date: new Date('2025-01-22T19:00:00'),
      type: 'midweek',
      duration: 120,
      isReady: true,
      materials: ['Programa', 'Videos', 'Música'],
    },
    {
      id: '2',
      title: 'Reunión Fin de Semana',
      date: new Date('2025-01-25T10:00:00'),
      type: 'weekend',
      duration: 180,
      isReady: false,
      materials: ['Atalaya', 'Cánticos'],
    },
  ]);

  const [contentStats] = useState<ContentLibraryStats>({
    music: {
      total: 151,
      downloaded: 151,
    },
    publications: {
      total: 50,
      downloaded: 45,
    },
    bible: {
      translations: 5,
      verses: 31102,
    },
  });

  const [displays] = useState<DisplayPreview[]>([
    {
      id: '1',
      name: 'Pantalla Principal',
      type: 'audience',
      isActive: true,
      currentContent: 'Cántico 1 - Jehová es mi Pastor',
    },
    {
      id: '2',
      name: 'Monitor Orador',
      type: 'speaker',
      isActive: true,
      currentContent: 'Notas de la presentación',
    },
    {
      id: '3',
      name: 'Panel Operador',
      type: 'operator',
      isActive: false,
      currentContent: null,
    },
  ]);

  const [timerState] = useState<TimerState>({
    isRunning: false,
    currentTime: 0,
    totalTime: 7200, // 2 horas
    type: 'meeting',
    title: 'Reunión Vida y Ministerio',
  });

  const [notifications] = useState<DashboardNotification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Contenido actualizado',
      message: 'Se han descargado 5 nuevas publicaciones',
      timestamp: new Date(),
      isRead: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Pantalla desconectada',
      message: 'La pantalla secundaria se ha desconectado',
      timestamp: new Date(Date.now() - 300000), // 5 min ago
      isRead: false,
    },
  ]);

  // Efectos
  useEffect(() => {
    setCurrentView('dashboard');

    // Simular carga de datos
    const timer = setTimeout(() => {
      setDashboardLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [setCurrentView]);

  // Handlers
  const handleActionClick = (action: QuickAction) => {
    console.log('Action clicked:', action);
    // Implementar navegación según action.action
  };

  const handlePresentationSelect = (presentation: RecentPresentation) => {
    console.log('Presentation selected:', presentation);
    // Navegar a la presentación
  };

  const handleRefreshData = () => {
    setDashboardLoading(true);
    // Simular refresh
    setTimeout(() => setDashboardLoading(false), 1000);
  };

  const handleConfigureDashboard = () => {
    console.log('Configure dashboard');
    // Abrir configuración del dashboard
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <Container size="xl" py="md">
      <LoadingOverlay visible={isLoading || dashboardLoading} />

      {/* Header del Dashboard */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1} size="h2" mb="xs">
            Dashboard
          </Title>
          <Text c="dimmed" size="sm">
            Bienvenido, {currentUser?.name || 'Usuario'}. Hub central de tu
            aplicación de presentaciones.
          </Text>
        </div>

        <Group gap="xs">
          <Tooltip label="Actualizar datos">
            <ActionIcon
              variant="default"
              size="lg"
              onClick={handleRefreshData}
              loading={dashboardLoading}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Pantalla completa">
            <ActionIcon variant="default" size="lg" onClick={handleFullscreen}>
              <IconMaximize size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Configurar dashboard">
            <ActionIcon
              variant="default"
              size="lg"
              onClick={handleConfigureDashboard}
            >
              <IconSettings size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Grid de Widgets */}
      <Grid>
        {/* Fila 1: Acciones rápidas y Estado del sistema */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <QuickActionsWidget
            actions={quickActions}
            onActionClick={handleActionClick}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <SystemStatusWidget
            status={systemStatus}
            onRefresh={handleRefreshData}
            onViewDetails={() => console.log('View system details')}
          />
        </Grid.Col>

        {/* Fila 2: Presentaciones recientes y Próximas reuniones */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <RecentPresentationsWidget
            presentations={recentPresentations}
            onPresentationSelect={handlePresentationSelect}
            onViewAll={() => console.log('View all presentations')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <UpcomingMeetingsWidget
            meetings={upcomingMeetings}
            onMeetingSelect={meeting =>
              console.log('Meeting selected:', meeting)
            }
            onPrepare={meetingId => console.log('Prepare meeting:', meetingId)}
          />
        </Grid.Col>

        {/* Fila 3: Biblioteca de contenido y Vista previa displays */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <ContentLibraryWidget
            stats={contentStats}
            onSyncContent={() => console.log('Sync content')}
            onViewLibrary={() => console.log('View library')}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <DisplayPreviewWidget
            displays={displays}
            onDisplaySelect={display =>
              console.log('Display selected:', display)
            }
            onConfigureDisplays={() => console.log('Configure displays')}
          />
        </Grid.Col>

        {/* Fila 4: Notificaciones (el cronómetro está ahora en el sidebar) */}
        <Grid.Col span={{ base: 12, md: 12 }}>
          <NotificationsWidget
            notifications={notifications}
            onNotificationRead={id => console.log('Mark as read:', id)}
            onNotificationAction={notification =>
              console.log('Notification action:', notification)
            }
            onClearAll={() => console.log('Clear all notifications')}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
