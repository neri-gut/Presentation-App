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
  Badge,
  Modal,
  Grid,
  Divider,
  Box,
  Tooltip,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerStop,
  IconRefresh,
  IconSettings,
  IconClock,
  IconChevronLeft,
  IconChevronRight,
  IconAlertTriangle,
  IconAlertCircle,
  IconPlayerSkipForward,
  IconAdjustments,
  IconExternalLink,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useMeetingStore, useTimerTick } from '../../../stores/meetingStore';
import type { AdvancedTimerWidgetProps } from '../../../types/meeting';

export function AdvancedTimerWidget() {
  const [configOpened, { open: openConfig, close: closeConfig }] = useDisclosure(false);
  
  const {
    timerState,
    currentTemplate,
    displayConfig,
    currentUser,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    nextSection,
    previousSection,
    updateTimerState,
    setCurrentTemplate,
    templates
  } = useMeetingStore();

  // Hook para actualizar el timer cada segundo
  useTimerTick();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSectionProgress = () => {
    if (!timerState.currentSection) return 0;
    const sectionDurationSeconds = timerState.currentSection.duration * 60;
    return Math.min((timerState.currentSectionTime / sectionDurationSeconds) * 100, 100);
  };

  const getSectionTimeLeft = () => {
    if (!timerState.currentSection) return 0;
    const sectionDurationSeconds = timerState.currentSection.duration * 60;
    return Math.max(sectionDurationSeconds - timerState.currentSectionTime, 0);
  };

  const getMeetingProgress = () => {
    return Math.min((timerState.totalMeetingTime / timerState.plannedTotalDuration) * 100, 100);
  };

  const getMeetingTimeLeft = () => {
    return Math.max(timerState.plannedTotalDuration - timerState.totalMeetingTime, 0);
  };

  const getTimerColor = () => {
    switch (timerState.alertLevel) {
      case 'critical': return displayConfig.colors.critical;
      case 'warning': return displayConfig.colors.warning;
      case 'overtime': return displayConfig.colors.overtime;
      default: return displayConfig.colors.normal;
    }
  };

  const getVarianceDisplay = () => {
    const variance = timerState.timeVariance;
    if (variance === 0) return { text: 'A tiempo', color: 'green' };
    if (variance > 0) return { text: `+${formatTime(variance)} atraso`, color: 'red' };
    return { text: `-${formatTime(Math.abs(variance))} adelanto`, color: 'blue' };
  };

  const canControlTimer = () => {
    return currentUser?.permissions.some(p => p.action === 'timer_control' && p.granted) ?? true;
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
    }
  };

  const variance = getVarianceDisplay();

  return (
    <>
      <Paper withBorder shadow="sm" p="md" h="100%">
        <Group justify="space-between" mb="md">
          <Group>
            <Title order={3} size="h4">
              Cronómetro Avanzado
            </Title>
            {currentTemplate && (
              <Badge size="sm" variant="light">
                {currentTemplate.name}
              </Badge>
            )}
          </Group>

          <Group gap="xs">
            {/* Indicador de varianza en esquina superior */}
            <Tooltip label="Atraso/Adelanto general">
              <Badge 
                size="sm" 
                color={variance.color}
                variant={timerState.timeVariance === 0 ? "light" : "filled"}
              >
                {variance.text}
              </Badge>
            </Tooltip>

            <ActionIcon variant="subtle" size="sm" onClick={openConfig}>
              <IconSettings size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <Stack gap="md">
          {/* Sección Actual - Display Principal */}
          <Card 
            withBorder 
            radius="sm" 
            p="md" 
            ta="center"
            style={{ 
              borderColor: timerState.alertLevel !== 'normal' ? getTimerColor() : undefined,
              backgroundColor: timerState.alertLevel === 'overtime' ? `${getTimerColor()}10` : undefined
            }}
          >
            {timerState.currentSection && (
              <>
                <Group justify="center" gap="xs" mb="xs">
                  <ThemeIcon size="sm" variant="light" color={getTimerColor()}>
                    <IconClock size={14} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>
                    {timerState.currentSection.name}
                  </Text>
                  {timerState.alertLevel === 'critical' && (
                    <IconAlertTriangle size={16} color={getTimerColor()} />
                  )}
                  {timerState.alertLevel === 'overtime' && (
                    <IconAlertCircle size={16} color={getTimerColor()} />
                  )}
                </Group>

                <Text size="xs" c="dimmed" mb="sm">
                  Sección {timerState.currentSectionIndex + 1} de {currentTemplate?.sections.length || 0}
                </Text>

                {/* Tiempo principal de la sección */}
                <Text
                  size="xl"
                  fw={700}
                  ta="center"
                  mb="md"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '2.5rem',
                    color: getTimerColor(),
                    textShadow: timerState.alertLevel === 'overtime' ? '0 0 10px currentColor' : undefined
                  }}
                >
                  {formatTime(timerState.currentSectionTime)}
                </Text>

                {/* Barra de progreso de la sección */}
                <Progress
                  size="xl"
                  value={getSectionProgress()}
                  color={timerState.alertLevel === 'normal' ? 'blue' : getTimerColor()}
                  mb="sm"
                  animated={timerState.isRunning}
                  style={{
                    filter: timerState.alertLevel === 'overtime' ? 'brightness(1.2)' : undefined
                  }}
                />

                <Group justify="space-between" mb="md">
                  <Text size="xs" c="dimmed">
                    Tiempo restante: {formatTime(getSectionTimeLeft())}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Duración: {timerState.currentSection.duration} min
                  </Text>
                </Group>
              </>
            )}

            {!timerState.currentSection && (
              <Text c="dimmed" ta="center" py="xl">
                No hay plantilla de reunión seleccionada
              </Text>
            )}
          </Card>

          {/* Información secundaria */}
          <Grid>
            <Grid.Col span={6}>
              <Card withBorder p="sm" ta="center">
                <Text size="xs" c="dimmed" mb={4}>Hora actual</Text>
                <Text fw={600} style={{ fontFamily: 'monospace' }}>
                  {timerState.currentTime}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={6}>
              <Card withBorder p="sm" ta="center">
                <Text size="xs" c="dimmed" mb={4}>Fin estimado</Text>
                <Text fw={600} style={{ fontFamily: 'monospace' }}>
                  {timerState.estimatedEndTime || '--:--'}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Progreso general de la reunión */}
          <Box>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">Progreso de la reunión</Text>
              <Text size="xs" c="dimmed">
                {formatTime(getMeetingTimeLeft())} restantes
              </Text>
            </Group>
            <Progress
              size="sm"
              value={getMeetingProgress()}
              color="gray"
              mb="xs"
            />
            <Text size="xs" c="dimmed" ta="center">
              {formatTime(timerState.totalMeetingTime)} / {formatTime(timerState.plannedTotalDuration)}
            </Text>
          </Box>

          <Divider />

          {/* Controles principales */}
          <Group justify="center" gap="md">
            {!timerState.isRunning ? (
              <Button
                leftSection={<IconPlayerPlay size={16} />}
                color="green"
                onClick={startTimer}
                disabled={!canControlTimer() || !currentTemplate}
                size="sm"
              >
                Iniciar
              </Button>
            ) : (
              <Button
                leftSection={<IconPlayerPause size={16} />}
                color="orange"
                onClick={pauseTimer}
                disabled={!canControlTimer()}
                size="sm"
              >
                Pausar
              </Button>
            )}

            <Button
              leftSection={<IconPlayerStop size={16} />}
              color="red"
              variant="light"
              onClick={stopTimer}
              disabled={!canControlTimer() || (!timerState.isRunning && timerState.currentSectionTime === 0)}
              size="sm"
            >
              Detener
            </Button>

            <ActionIcon
              variant="light"
              color="gray"
              onClick={resetTimer}
              disabled={timerState.isRunning || !canControlTimer()}
              size="lg"
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>

          {/* Navegación de secciones */}
          {currentTemplate && (
            <Group justify="center" gap="xs">
              <ActionIcon
                variant="subtle"
                onClick={previousSection}
                disabled={timerState.currentSectionIndex === 0 || timerState.isRunning}
                size="sm"
              >
                <IconChevronLeft size={14} />
              </ActionIcon>

              <ActionIcon
                variant="subtle"
                onClick={nextSection}
                disabled={
                  timerState.currentSectionIndex >= (currentTemplate.sections.length - 1) || 
                  timerState.isRunning
                }
                size="sm"
              >
                <IconChevronRight size={14} />
              </ActionIcon>

              <Tooltip label="Saltar sección">
                <ActionIcon
                  variant="subtle"
                  color="orange"
                  onClick={nextSection}
                  disabled={!timerState.isRunning || !canControlTimer()}
                  size="sm"
                >
                  <IconPlayerSkipForward size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          )}

          <Text size="xs" c="dimmed" ta="center">
            {timerState.isRunning 
              ? `Cronómetro en ejecución${timerState.isPaused ? ' (pausado)' : ''}` 
              : 'Cronómetro detenido'
            }
          </Text>
        </Stack>
      </Paper>

      {/* Modal de configuración */}
      <Modal
        opened={configOpened}
        onClose={closeConfig}
        title="Configuración de Reunión"
        size="lg"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Selecciona una plantilla de reunión para usar con el cronómetro
          </Text>

          {templates.map((template) => (
            <Card 
              key={template.id} 
              withBorder 
              p="md"
              style={{ 
                cursor: 'pointer',
                borderColor: currentTemplate?.id === template.id ? 'var(--mantine-color-blue-6)' : undefined
              }}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <Group justify="space-between">
                <div>
                  <Text fw={500}>{template.name}</Text>
                  <Text size="sm" c="dimmed">
                    {template.sections.length} secciones • {template.totalDuration} minutos
                  </Text>
                </div>
                <Badge variant={template.isDefault ? "filled" : "light"}>
                  {template.type === 'weekday' ? 'Entre semana' : 'Fin de semana'}
                </Badge>
              </Group>
            </Card>
          ))}

          <Group justify="space-between" mt="md">
            <Button 
              variant="light" 
              leftSection={<IconExternalLink size={16} />}
              component="a"
              href="/speaker-display"
              target="_blank"
            >
              Abrir Pantalla Orador
            </Button>
            
            <Group>
              <Button variant="light" leftSection={<IconAdjustments size={16} />}>
                Editar Plantillas
              </Button>
              <Button onClick={closeConfig}>Cerrar</Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}