import { Paper, Title, SimpleGrid, Button, Text, Group } from '@mantine/core';
import {
  IconPresentation,
  IconMusic,
  IconDeviceDesktop,
  IconBook,
  IconPlayerPlay,
  IconSettings,
  IconSearch,
  IconDownload,
} from '@tabler/icons-react';

import type { QuickActionsWidgetProps, QuickAction } from '../../../types/dashboard';

// Mapeo de iconos
const iconMap = {
  presentation: IconPresentation,
  music: IconMusic,
  display: IconDeviceDesktop,
  book: IconBook,
  play: IconPlayerPlay,
  settings: IconSettings,
  search: IconSearch,
  download: IconDownload,
} as const;

function getActionIcon(iconName: string) {
  const Icon = iconMap[iconName as keyof typeof iconMap] || IconSettings;
  return <Icon size={20} />;
}

function getActionColor(action: string): string {
  const colorMap: Record<string, string> = {
    'start-presentation': 'blue',
    'open-music-library': 'green',
    'configure-displays': 'orange',
    'search-bible': 'grape',
  };
  return colorMap[action] || 'gray';
}

export function QuickActionsWidget({
  actions,
  onActionClick,
}: QuickActionsWidgetProps) {
  const handleActionClick = (action: QuickAction) => {
    if (action.isEnabled) {
      onActionClick(action);
    }
  };

  return (
    <Paper withBorder shadow="sm" p="md" h="100%">
      <Title order={3} size="h4" mb="md">
        Acciones Rápidas
      </Title>

      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        {actions.map(action => (
          <Button
            key={action.id}
            variant="light"
            color={getActionColor(action.action)}
            size="lg"
            h={80}
            disabled={!action.isEnabled}
            onClick={() => handleActionClick(action)}
            styles={{
              root: {
                flexDirection: 'column',
                gap: 8,
                padding: '12px 8px',
              },
            }}
          >
            <Group gap={4} justify="center">
              {getActionIcon(action.icon)}
            </Group>

            <Text size="xs" ta="center" lh={1.2}>
              {action.label}
            </Text>

            {action.shortcut && (
              <Text size="xs" c="dimmed" ta="center">
                {action.shortcut}
              </Text>
            )}
          </Button>
        ))}
      </SimpleGrid>

      <Text size="xs" c="dimmed" mt="md" ta="center">
        Usa las teclas de acceso rápido para mayor eficiencia
      </Text>
    </Paper>
  );
}
