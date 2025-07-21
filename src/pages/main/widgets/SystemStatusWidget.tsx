import {
  Paper,
  Title,
  Text,
  Progress,
  Group,
  Stack,
  Badge,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Card,
} from '@mantine/core';
import {
  IconRefresh,
  IconEye,
  IconDeviceDesktop,
  IconDownload,
  IconCpu,
  IconDatabase,
  IconWifi,
} from '@tabler/icons-react';
import { format } from 'date-fns';

import type { SystemStatusWidgetProps } from '../../../types/dashboard';

export function SystemStatusWidget({
  status,
  onRefresh,
  onViewDetails,
}: SystemStatusWidgetProps) {
  const getStatusColor = (
    value: number,
    thresholds = { warning: 70, error: 90 }
  ) => {
    if (value >= thresholds.error) return 'red';
    if (value >= thresholds.warning) return 'yellow';
    return 'green';
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Nunca';
    return format(date, 'HH:mm');
  };

  return (
    <Paper withBorder shadow="sm" p="md" h="100%">
      <Group justify="space-between" mb="md">
        <Title order={3} size="h4">
          Estado del Sistema
        </Title>

        <Group gap="xs">
          <Tooltip label="Actualizar">
            <ActionIcon variant="subtle" size="sm" onClick={onRefresh}>
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Ver detalles">
            <ActionIcon variant="subtle" size="sm" onClick={onViewDetails}>
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Stack gap="md">
        {/* Pantallas */}
        <Card withBorder radius="sm" p="sm">
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="blue">
              <IconDeviceDesktop size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              Pantallas
            </Text>
          </Group>

          <Group justify="space-between" gap="xs">
            <Text size="xs" c="dimmed">
              Conectadas: {status.displays.connected}
            </Text>
            <Badge
              size="xs"
              color={status.displays.active > 0 ? 'green' : 'gray'}
              variant="light"
            >
              {status.displays.active} activas
            </Badge>
          </Group>

          {status.displays.errors > 0 && (
            <Badge size="xs" color="red" variant="light" mt="xs">
              {status.displays.errors} errores
            </Badge>
          )}
        </Card>

        {/* Contenido */}
        <Card withBorder radius="sm" p="sm">
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="green">
              <IconDownload size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              Contenido
            </Text>
          </Group>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Descargados
              </Text>
              <Text size="xs" fw={500}>
                {status.content.downloaded}
              </Text>
            </Group>

            {status.content.pending > 0 && (
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  Pendientes
                </Text>
                <Badge size="xs" color="orange" variant="light">
                  {status.content.pending}
                </Badge>
              </Group>
            )}

            <Text size="xs" c="dimmed">
              Última sincronización: {formatLastSync(status.content.lastSync)}
            </Text>
          </Stack>
        </Card>

        {/* Performance */}
        <Card withBorder radius="sm" p="sm">
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="orange">
              <IconCpu size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              Rendimiento
            </Text>
          </Group>

          <Stack gap="xs">
            <div>
              <Group justify="space-between" mb={2}>
                <Text size="xs" c="dimmed">
                  CPU
                </Text>
                <Text size="xs" fw={500}>
                  {status.performance.cpu}%
                </Text>
              </Group>
              <Progress
                size="xs"
                value={status.performance.cpu}
                color={getStatusColor(status.performance.cpu)}
              />
            </div>

            <div>
              <Group justify="space-between" mb={2}>
                <Text size="xs" c="dimmed">
                  Memoria
                </Text>
                <Text size="xs" fw={500}>
                  {status.performance.memory}%
                </Text>
              </Group>
              <Progress
                size="xs"
                value={status.performance.memory}
                color={getStatusColor(status.performance.memory)}
              />
            </div>

            <div>
              <Group justify="space-between" mb={2}>
                <Text size="xs" c="dimmed">
                  Almacenamiento
                </Text>
                <Text size="xs" fw={500}>
                  {status.performance.storage}%
                </Text>
              </Group>
              <Progress
                size="xs"
                value={status.performance.storage}
                color={getStatusColor(status.performance.storage, {
                  warning: 80,
                  error: 95,
                })}
              />
            </div>
          </Stack>
        </Card>
      </Stack>
    </Paper>
  );
}
