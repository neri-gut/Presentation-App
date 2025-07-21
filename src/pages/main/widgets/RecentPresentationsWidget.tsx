import {
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Card,
  Button,
  Badge,
  ActionIcon,
} from '@mantine/core';
import { IconEye, IconArrowRight } from '@tabler/icons-react';
import { format } from 'date-fns';

import type { RecentPresentationsWidgetProps } from '../../../types/dashboard';

export function RecentPresentationsWidget({
  presentations,
  onPresentationSelect,
  onViewAll,
}: RecentPresentationsWidgetProps) {
  return (
    <Paper withBorder shadow="sm" p="md" h="100%">
      <Group justify="space-between" mb="md">
        <Title order={3} size="h4">
          Presentaciones Recientes
        </Title>

        <Button variant="subtle" size="xs" onClick={onViewAll}>
          Ver todas
          <IconArrowRight size={14} />
        </Button>
      </Group>

      <Stack gap="md">
        {presentations.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay presentaciones recientes
          </Text>
        ) : (
          presentations.map(presentation => (
            <Card
              key={presentation.id}
              withBorder
              radius="sm"
              p="sm"
              style={{ cursor: 'pointer' }}
              onClick={() => onPresentationSelect(presentation)}
            >
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} lineClamp={1}>
                  {presentation.title}
                </Text>

                <ActionIcon variant="subtle" size="sm">
                  <IconEye size={14} />
                </ActionIcon>
              </Group>

              <Group gap="xs" mb="xs">
                <Text size="xs" c="dimmed">
                  {format(presentation.date, 'dd/MM/yyyy')}
                </Text>
                <Text size="xs" c="dimmed">
                  •
                </Text>
                <Text size="xs" c="dimmed">
                  {Math.floor(presentation.duration / 60)}h{' '}
                  {presentation.duration % 60}min
                </Text>
              </Group>

              <Group gap="xs">
                {presentation.tags.map(tag => (
                  <Badge key={tag} size="xs" variant="light">
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Card>
          ))
        )}
      </Stack>
    </Paper>
  );
}
