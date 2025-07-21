import {
  Paper,
  Title,
  Text,
  Group,
  Card,
  Badge,
  Button,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import {
  IconDeviceDesktop,
  IconMicrophone,
  IconSettings,
  IconEye,
  IconCircleFilled,
} from '@tabler/icons-react';

import type { DisplayPreviewWidgetProps } from '../../../types/dashboard';

export function DisplayPreviewWidget({
  displays,
  onDisplaySelect,
  onConfigureDisplays,
}: DisplayPreviewWidgetProps) {
  const getDisplayTypeLabel = (type: string) => {
    const labelMap: Record<string, string> = {
      audience: 'Audiencia',
      speaker: 'Orador',
      operator: 'Operador',
    };
    return labelMap[type] || type;
  };

  const getDisplayTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      audience: 'blue',
      speaker: 'green',
      operator: 'orange',
    };
    return colorMap[type] || 'gray';
  };

  const getDisplayIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      audience: <IconDeviceDesktop size={16} />,
      speaker: <IconMicrophone size={16} />,
      operator: <IconSettings size={16} />,
    };
    return iconMap[type] || <IconDeviceDesktop size={16} />;
  };

  return (
    <Paper withBorder shadow="sm" p="md" h="100%">
      <Group justify="space-between" mb="md">
        <Title order={3} size="h4">
          Vista Previa de Pantallas
        </Title>

        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconSettings size={14} />}
          onClick={onConfigureDisplays}
        >
          Configurar
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {displays.map(display => (
          <Card
            key={display.id}
            withBorder
            radius="sm"
            p="sm"
            style={{ cursor: 'pointer' }}
            onClick={() => onDisplaySelect(display)}
          >
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon
                  size="sm"
                  variant="light"
                  color={getDisplayTypeColor(display.type)}
                >
                  {getDisplayIcon(display.type)}
                </ThemeIcon>

                <Text size="sm" fw={500} lineClamp={1}>
                  {display.name}
                </Text>
              </Group>

              <Group gap={4}>
                <IconCircleFilled
                  size={8}
                  color={display.isActive ? 'green' : 'gray'}
                />
              </Group>
            </Group>

            <Badge
              size="xs"
              color={getDisplayTypeColor(display.type)}
              variant="light"
              mb="xs"
            >
              {getDisplayTypeLabel(display.type)}
            </Badge>

            {/* Preview area */}
            <Card
              withBorder
              radius="xs"
              p="xs"
              mb="xs"
              style={{
                height: 60,
                backgroundColor: display.isActive ? '#f8f9fa' : '#e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {display.currentContent ? (
                <Text size="xs" ta="center" lineClamp={2}>
                  {display.currentContent}
                </Text>
              ) : (
                <Text size="xs" c="dimmed" ta="center">
                  Sin contenido
                </Text>
              )}
            </Card>

            <Group justify="space-between" align="center">
              <Badge
                size="xs"
                color={display.isActive ? 'green' : 'gray'}
                variant="dot"
              >
                {display.isActive ? 'Activa' : 'Inactiva'}
              </Badge>

              <Group gap={4}>
                <ThemeIcon variant="subtle" size="xs">
                  <IconEye size={12} />
                </ThemeIcon>
              </Group>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {displays.length === 0 && (
        <Text c="dimmed" ta="center" py="xl">
          No hay pantallas configuradas
        </Text>
      )}
    </Paper>
  );
}
