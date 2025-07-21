import {
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Card,
  Button,
  ActionIcon,
  ThemeIcon,
  Badge,
  ScrollArea,
} from '@mantine/core';
import {
  IconBell,
  IconInfoCircle,
  IconAlertTriangle,
  IconX,
  IconCheck,
  IconTrash,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import type { NotificationsWidgetProps } from '../../../types/dashboard';

export function NotificationsWidget({
  notifications,
  onNotificationRead,
  onNotificationAction,
  onClearAll,
}: NotificationsWidgetProps) {
  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      info: <IconInfoCircle size={16} />,
      warning: <IconAlertTriangle size={16} />,
      error: <IconX size={16} />,
      success: <IconCheck size={16} />,
    };
    return iconMap[type] || <IconBell size={16} />;
  };

  const getNotificationColor = (type: string) => {
    const colorMap: Record<string, string> = {
      info: 'blue',
      warning: 'orange',
      error: 'red',
      success: 'green',
    };
    return colorMap[type] || 'gray';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Paper withBorder shadow="sm" p="md" h="100%">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Title order={3} size="h4">
            Notificaciones
          </Title>
          {unreadCount > 0 && (
            <Badge size="sm" color="red" variant="filled">
              {unreadCount}
            </Badge>
          )}
        </Group>

        {notifications.length > 0 && (
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconTrash size={14} />}
            onClick={onClearAll}
          >
            Limpiar todo
          </Button>
        )}
      </Group>

      <ScrollArea.Autosize mah={300}>
        <Stack gap="sm">
          {notifications.length === 0 ? (
            <Card withBorder radius="sm" p="md">
              <Group justify="center" gap="xs">
                <ThemeIcon size="lg" variant="light" color="gray">
                  <IconBell size={20} />
                </ThemeIcon>
                <Stack gap={0} align="center">
                  <Text size="sm" fw={500}>
                    No hay notificaciones
                  </Text>
                  <Text size="xs" c="dimmed">
                    Te notificaremos cuando algo importante suceda
                  </Text>
                </Stack>
              </Group>
            </Card>
          ) : (
            notifications.map(notification => (
              <Card
                key={notification.id}
                withBorder
                radius="sm"
                p="sm"
                style={{
                  opacity: notification.isRead ? 0.7 : 1,
                  borderLeft: `4px solid var(--mantine-color-${getNotificationColor(notification.type)}-5)`,
                }}
              >
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Group gap="xs" align="flex-start" style={{ flex: 1 }}>
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color={getNotificationColor(notification.type)}
                    >
                      {getNotificationIcon(notification.type)}
                    </ThemeIcon>

                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {notification.title}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={2}>
                        {notification.message}
                      </Text>
                    </Stack>
                  </Group>

                  {!notification.isRead && (
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={() => onNotificationRead(notification.id)}
                    >
                      <IconCheck size={14} />
                    </ActionIcon>
                  )}
                </Group>

                <Group justify="space-between" align="center">
                  <Text size="xs" c="dimmed">
                    {formatDistanceToNow(notification.timestamp, {
                      addSuffix: true,
                      locale: es,
                    })}
                  </Text>

                  {notification.actionLabel && notification.actionCallback && (
                    <Button
                      size="xs"
                      variant="subtle"
                      color={getNotificationColor(notification.type)}
                      onClick={() => onNotificationAction(notification)}
                    >
                      {notification.actionLabel}
                    </Button>
                  )}
                </Group>
              </Card>
            ))
          )}
        </Stack>
      </ScrollArea.Autosize>
    </Paper>
  );
}
