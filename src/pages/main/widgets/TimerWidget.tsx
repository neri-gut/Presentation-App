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
  ActionIcon,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerStop,
  IconRefresh,
  IconSettings,
  IconClock,
} from '@tabler/icons-react';

import type { TimerWidgetProps } from '../../../types/dashboard';

export function TimerWidget({
  timer,
  onStart,
  onPause,
  onStop,
  onReset,
  onConfigure,
}: TimerWidgetProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (timer.totalTime === 0) return 0;
    return Math.min((timer.currentTime / timer.totalTime) * 100, 100);
  };

  const getRemainingTime = () => {
    return Math.max(timer.totalTime - timer.currentTime, 0);
  };

  const getTimerColor = () => {
    const progress = getProgress();
    if (progress >= 90) return 'red';
    if (progress >= 75) return 'orange';
    return 'blue';
  };

  const getTimerTypeLabel = (type: string) => {
    const labelMap: Record<string, string> = {
      meeting: 'Reunión',
      break: 'Descanso',
      presentation: 'Presentación',
      song: 'Cántico',
    };
    return labelMap[type] || type;
  };

  return (
    <Paper withBorder shadow="sm" p="md" h="100%">
      <Group justify="space-between" mb="md">
        <Title order={3} size="h4">
          Cronómetro
        </Title>

        <ActionIcon variant="subtle" size="sm" onClick={onConfigure}>
          <IconSettings size={16} />
        </ActionIcon>
      </Group>

      <Stack gap="md">
        <Card withBorder radius="sm" p="md" ta="center">
          <Group justify="center" gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color={getTimerColor()}>
              <IconClock size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              {timer.title}
            </Text>
          </Group>

          <Text size="xs" c="dimmed" mb="md">
            {getTimerTypeLabel(timer.type)}
          </Text>

          {/* Tiempo principal */}
          <Text
            size="xl"
            fw={700}
            ta="center"
            mb="md"
            style={{
              fontFamily: 'monospace',
              fontSize: '2rem',
              color: timer.isRunning ? getTimerColor() : undefined,
            }}
          >
            {formatTime(timer.currentTime)}
          </Text>

          {/* Barra de progreso */}
          <Progress
            size="lg"
            value={getProgress()}
            color={getTimerColor()}
            mb="sm"
            animated={timer.isRunning}
          />

          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Tiempo restante: {formatTime(getRemainingTime())}
            </Text>
            <Text size="xs" c="dimmed">
              Total: {formatTime(timer.totalTime)}
            </Text>
          </Group>
        </Card>

        {/* Controles */}
        <Group justify="center" gap="md">
          {!timer.isRunning ? (
            <Button
              leftSection={<IconPlayerPlay size={16} />}
              color="green"
              onClick={onStart}
            >
              Iniciar
            </Button>
          ) : (
            <Button
              leftSection={<IconPlayerPause size={16} />}
              color="orange"
              onClick={onPause}
            >
              Pausar
            </Button>
          )}

          <Button
            leftSection={<IconPlayerStop size={16} />}
            color="red"
            variant="light"
            onClick={onStop}
            disabled={!timer.isRunning && timer.currentTime === 0}
          >
            Detener
          </Button>

          <ActionIcon
            variant="light"
            color="gray"
            onClick={onReset}
            disabled={timer.isRunning}
          >
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>

        <Text size="xs" c="dimmed" ta="center">
          {timer.isRunning ? 'Cronómetro en ejecución' : 'Cronómetro detenido'}
        </Text>
      </Stack>
    </Paper>
  );
}
