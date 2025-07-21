import {
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Card,
  Badge,
  Button,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCalendar,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconSettings,
} from '@tabler/icons-react';
import { format } from 'date-fns';

import type { UpcomingMeetingsWidgetProps } from '../../../types/dashboard';

export function UpcomingMeetingsWidget({
  meetings,
  onMeetingSelect,
  onPrepare,
}: UpcomingMeetingsWidgetProps) {
  const getMeetingTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      midweek: 'blue',
      weekend: 'green',
      assembly: 'orange',
      convention: 'red',
      special: 'grape',
    };
    return colorMap[type] || 'gray';
  };

  const getMeetingTypeLabel = (type: string) => {
    const labelMap: Record<string, string> = {
      midweek: 'Entre semana',
      weekend: 'Fin de semana',
      assembly: 'Asamblea',
      convention: 'Congreso',
      special: 'Especial',
    };
    return labelMap[type] || type;
  };

  return (
    <Paper withBorder shadow="sm" p="md" h="100%">
      <Title order={3} size="h4" mb="md">
        Próximas Reuniones
      </Title>

      <Stack gap="md">
        {meetings.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay reuniones programadas
          </Text>
        ) : (
          meetings.map(meeting => (
            <Card
              key={meeting.id}
              withBorder
              radius="sm"
              p="sm"
              style={{ cursor: 'pointer' }}
              onClick={() => onMeetingSelect(meeting)}
            >
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <ThemeIcon
                    size="sm"
                    variant="light"
                    color={getMeetingTypeColor(meeting.type)}
                  >
                    <IconCalendar size={14} />
                  </ThemeIcon>

                  <Text size="sm" fw={500} lineClamp={1}>
                    {meeting.title}
                  </Text>
                </Group>

                {meeting.isReady ? (
                  <ThemeIcon size="sm" variant="light" color="green">
                    <IconCheck size={14} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon size="sm" variant="light" color="orange">
                    <IconAlertTriangle size={14} />
                  </ThemeIcon>
                )}
              </Group>

              <Group gap="xs" mb="xs">
                <Badge
                  size="xs"
                  color={getMeetingTypeColor(meeting.type)}
                  variant="light"
                >
                  {getMeetingTypeLabel(meeting.type)}
                </Badge>

                <Text size="xs" c="dimmed">
                  {format(meeting.date, 'dd/MM HH:mm')}
                </Text>

                <Text size="xs" c="dimmed">
                  •
                </Text>

                <Group gap={2}>
                  <IconClock size={12} />
                  <Text size="xs" c="dimmed">
                    {Math.floor(meeting.duration / 60)}h {meeting.duration % 60}
                    min
                  </Text>
                </Group>
              </Group>

              <Group justify="space-between" align="flex-end">
                <Group gap="xs">
                  <Text size="xs" c="dimmed">
                    Materiales: {meeting.materials.join(', ')}
                  </Text>
                </Group>

                {!meeting.isReady && (
                  <Button
                    size="xs"
                    variant="light"
                    onClick={e => {
                      e.stopPropagation();
                      onPrepare(meeting.id);
                    }}
                  >
                    Preparar
                  </Button>
                )}
              </Group>
            </Card>
          ))
        )}
      </Stack>
    </Paper>
  );
}
