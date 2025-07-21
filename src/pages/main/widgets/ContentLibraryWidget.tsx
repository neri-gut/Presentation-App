import {
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Progress,
  Button,
  ThemeIcon,
  Card,
  SimpleGrid,
} from '@mantine/core';
import {
  IconMusic,
  IconBook,
  IconBible,
  IconRefresh,
  IconEye,
} from '@tabler/icons-react';

import type { ContentLibraryWidgetProps } from '../../../types/dashboard';

export function ContentLibraryWidget({
  stats,
  onSyncContent,
  onViewLibrary,
}: ContentLibraryWidgetProps) {
  const calculateProgress = (downloaded: number, total: number) => {
    return total > 0 ? Math.round((downloaded / total) * 100) : 0;
  };

  return (
    <Paper withBorder shadow="sm" p="md" h="100%">
      <Group justify="space-between" mb="md">
        <Title order={3} size="h4">
          Biblioteca de Contenido
        </Title>

        <Group gap="xs">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconRefresh size={14} />}
            onClick={onSyncContent}
          >
            Sincronizar
          </Button>
        </Group>
      </Group>

      <Stack gap="md">
        {/* Música */}
        <Card withBorder radius="sm" p="sm">
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="green">
              <IconMusic size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              Música y Cánticos
            </Text>
          </Group>

          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed">
              {stats.music.downloaded} de {stats.music.total}
            </Text>
            <Text size="xs" fw={500}>
              {calculateProgress(stats.music.downloaded, stats.music.total)}%
            </Text>
          </Group>

          <Progress
            size="xs"
            value={calculateProgress(stats.music.downloaded, stats.music.total)}
            color="green"
          />
        </Card>

        {/* Publicaciones */}
        <Card withBorder radius="sm" p="sm">
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="blue">
              <IconBook size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              Publicaciones
            </Text>
          </Group>

          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed">
              {stats.publications.downloaded} de {stats.publications.total}
            </Text>
            <Text size="xs" fw={500}>
              {calculateProgress(
                stats.publications.downloaded,
                stats.publications.total
              )}
              %
            </Text>
          </Group>

          <Progress
            size="xs"
            value={calculateProgress(
              stats.publications.downloaded,
              stats.publications.total
            )}
            color="blue"
          />
        </Card>

        {/* Biblia */}
        <Card withBorder radius="sm" p="sm">
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="grape">
              <IconBible size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              Contenido Bíblico
            </Text>
          </Group>

          <SimpleGrid cols={2} spacing="xs">
            <div>
              <Text size="xs" c="dimmed">
                Traducciones
              </Text>
              <Text size="sm" fw={500}>
                {stats.bible.translations}
              </Text>
            </div>

            <div>
              <Text size="xs" c="dimmed">
                Versículos
              </Text>
              <Text size="sm" fw={500}>
                {stats.bible.verses.toLocaleString()}
              </Text>
            </div>
          </SimpleGrid>
        </Card>

        <Button
          variant="light"
          fullWidth
          leftSection={<IconEye size={16} />}
          onClick={onViewLibrary}
        >
          Ver Biblioteca Completa
        </Button>
      </Stack>
    </Paper>
  );
}
