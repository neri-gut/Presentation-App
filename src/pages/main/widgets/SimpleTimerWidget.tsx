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
import { useState, useEffect } from 'react';

// Plantillas simplificadas para testing
const templates = [
  {
    id: 'weekday-default',
    name: 'Reunión Entre Semana (Estándar)',
    type: 'weekday' as const,
    totalDuration: 105,
    sections: [
      { id: 'opening-song', name: 'Cántico Inicial', duration: 3, order: 1 },
      { id: 'opening-prayer', name: 'Oración Inicial', duration: 2, order: 2 },
      { id: 'treasures', name: 'Tesoros de la Palabra de Dios', duration: 10, order: 3 },
      { id: 'ministry-1', name: 'Seamos Mejores Maestros - Parte 1', duration: 4, order: 4 },
      { id: 'ministry-2', name: 'Seamos Mejores Maestros - Parte 2', duration: 4, order: 5 },
      { id: 'ministry-3', name: 'Seamos Mejores Maestros - Parte 3', duration: 4, order: 6 },
      { id: 'middle-song', name: 'Cántico Intermedio', duration: 3, order: 7 },
      { id: 'living-1', name: 'Vivamos Como Cristianos - Parte 1', duration: 15, order: 8 },
      { id: 'living-2', name: 'Vivamos Como Cristianos - Parte 2', duration: 30, order: 9 },
      { id: 'announcements', name: 'Anuncios', duration: 5, order: 10 },
      { id: 'closing-song', name: 'Cántico Final', duration: 3, order: 11 },
      { id: 'closing-prayer', name: 'Oración Final', duration: 2, order: 12 }
    ]
  },
  {
    id: 'weekend-default',
    name: 'Reunión Fin de Semana (Estándar)',
    type: 'weekend' as const,
    totalDuration: 105,
    sections: [
      { id: 'opening-song-we', name: 'Cántico Inicial', duration: 3, order: 1 },
      { id: 'opening-prayer-we', name: 'Oración Inicial', duration: 2, order: 2 },
      { id: 'public-talk', name: 'Discurso Público', duration: 30, order: 3 },
      { id: 'middle-song-we', name: 'Cántico Intermedio', duration: 3, order: 4 },
      { id: 'watchtower-study', name: 'Estudio de La Atalaya', duration: 60, order: 5 },
      { id: 'announcements-we', name: 'Anuncios', duration: 4, order: 6 },
      { id: 'closing-song-we', name: 'Cántico Final', duration: 3, order: 7 }
    ]
  }
];

export function SimpleTimerWidget() {
  const [configOpened, { open: openConfig, close: closeConfig }] = useDisclosure(false);
  
  // Estado local simplificado
  const [currentTemplate, setCurrentTemplate] = useState(templates[0]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSectionTime, setCurrentSectionTime] = useState(0);
  const [totalMeetingTime, setTotalMeetingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeVariance, setTimeVariance] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));

  const currentSection = currentTemplate.sections[currentSectionIndex];

  // Timer tick effect
  useEffect(() => {
    if (!isRunning || isPaused) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      setCurrentSectionTime(prev => prev + 1);
      setTotalMeetingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

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
    if (!currentSection) return 0;
    const sectionDurationSeconds = currentSection.duration * 60;
    return Math.min((currentSectionTime / sectionDurationSeconds) * 100, 100);
  };

  const getSectionTimeLeft = () => {
    if (!currentSection) return 0;
    const sectionDurationSeconds = currentSection.duration * 60;
    return Math.max(sectionDurationSeconds - currentSectionTime, 0);
  };

  const getMeetingProgress = () => {
    const plannedTotalSeconds = currentTemplate.totalDuration * 60;
    return Math.min((totalMeetingTime / plannedTotalSeconds) * 100, 100);
  };

  const getMeetingTimeLeft = () => {
    const plannedTotalSeconds = currentTemplate.totalDuration * 60;
    return Math.max(plannedTotalSeconds - totalMeetingTime, 0);
  };

  const getAlertLevel = () => {
    if (!currentSection) return 'normal';
    const sectionTimeLeft = getSectionTimeLeft();
    
    if (sectionTimeLeft <= 0) return 'overtime';
    if (sectionTimeLeft <= 30) return 'critical';
    if (sectionTimeLeft <= 60) return 'warning';
    return 'normal';
  };

  const getTimerColor = () => {
    const alertLevel = getAlertLevel();
    switch (alertLevel) {
      case 'critical': return '#fa5252';
      case 'warning': return '#fd7e14';
      case 'overtime': return '#e03131';
      default: return '#228be6';
    }
  };

  const getVarianceDisplay = () => {
    if (timeVariance === 0) return { text: 'A tiempo', color: 'green' };
    if (timeVariance > 0) return { text: `+${formatTime(timeVariance)} atraso`, color: 'red' };
    return { text: `-${formatTime(Math.abs(timeVariance))} adelanto`, color: 'blue' };
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentSectionTime(0);
    setTotalMeetingTime(0);
    setCurrentSectionIndex(0);
    setTimeVariance(0);
  };

  const handleNextSection = () => {
    if (currentSectionIndex < currentTemplate.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentSectionTime(0);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      setCurrentSectionTime(0);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
      handleReset();
    }
  };

  const variance = getVarianceDisplay();
  const alertLevel = getAlertLevel();

  return (
    <>
      <Paper withBorder shadow="sm" p="md" h="100%">
        <Group justify="space-between" mb="md">
          <Group>
            <Title order={3} size="h4">
              Cronómetro Avanzado
            </Title>
            <Badge size="sm" variant="light">
              {currentTemplate.name}
            </Badge>
          </Group>

          <Group gap="xs">
            <Tooltip label="Atraso/Adelanto general">
              <Badge 
                size="sm" 
                color={variance.color}
                variant={timeVariance === 0 ? "light" : "filled"}
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
              borderColor: alertLevel !== 'normal' ? getTimerColor() : undefined,
              backgroundColor: alertLevel === 'overtime' ? `${getTimerColor()}10` : undefined
            }}
          >
            {currentSection && (
              <>
                <Group justify="center" gap="xs" mb="xs">
                  <ThemeIcon size="sm" variant="light" color={getTimerColor()}>
                    <IconClock size={14} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>
                    {currentSection.name}
                  </Text>
                  {alertLevel === 'critical' && (
                    <IconAlertTriangle size={16} color={getTimerColor()} />
                  )}
                  {alertLevel === 'overtime' && (
                    <IconAlertCircle size={16} color={getTimerColor()} />
                  )}
                </Group>

                <Text size="xs" c="dimmed" mb="sm">
                  Sección {currentSectionIndex + 1} de {currentTemplate.sections.length}
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
                    textShadow: alertLevel === 'overtime' ? '0 0 10px currentColor' : undefined
                  }}
                >
                  {formatTime(currentSectionTime)}
                </Text>

                {/* Barra de progreso de la sección */}
                <Progress
                  size="xl"
                  value={getSectionProgress()}
                  color={alertLevel === 'normal' ? 'blue' : getTimerColor()}
                  mb="sm"
                  animated={isRunning && !isPaused}
                  style={{
                    filter: alertLevel === 'overtime' ? 'brightness(1.2)' : undefined
                  }}
                />

                <Group justify="space-between" mb="md">
                  <Text size="xs" c="dimmed">
                    Tiempo restante: {formatTime(getSectionTimeLeft())}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Duración: {currentSection.duration} min
                  </Text>
                </Group>
              </>
            )}
          </Card>

          {/* Información secundaria */}
          <Grid>
            <Grid.Col span={6}>
              <Card withBorder p="sm" ta="center">
                <Text size="xs" c="dimmed" mb={4}>Hora actual</Text>
                <Text fw={600} style={{ fontFamily: 'monospace' }}>
                  {currentTime}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={6}>
              <Card withBorder p="sm" ta="center">
                <Text size="xs" c="dimmed" mb={4}>Reunión termina en</Text>
                <Text fw={600} style={{ fontFamily: 'monospace' }}>
                  {formatTime(getMeetingTimeLeft())}
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
              {formatTime(totalMeetingTime)} / {formatTime(currentTemplate.totalDuration * 60)}
            </Text>
          </Box>

          <Divider />

          {/* Controles principales */}
          <Group justify="center" gap="md">
            {!isRunning ? (
              <Button
                leftSection={<IconPlayerPlay size={16} />}
                color="green"
                onClick={handleStart}
                size="sm"
              >
                Iniciar
              </Button>
            ) : (
              <Button
                leftSection={<IconPlayerPause size={16} />}
                color="orange"
                onClick={handlePause}
                size="sm"
              >
                {isPaused ? 'Reanudar' : 'Pausar'}
              </Button>
            )}

            <Button
              leftSection={<IconPlayerStop size={16} />}
              color="red"
              variant="light"
              onClick={handleStop}
              disabled={!isRunning && currentSectionTime === 0}
              size="sm"
            >
              Detener
            </Button>

            <ActionIcon
              variant="light"
              color="gray"
              onClick={handleReset}
              disabled={isRunning}
              size="lg"
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>

          {/* Navegación de secciones */}
          <Group justify="center" gap="xs">
            <ActionIcon
              variant="subtle"
              onClick={handlePreviousSection}
              disabled={currentSectionIndex === 0 || isRunning}
              size="sm"
            >
              <IconChevronLeft size={14} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              onClick={handleNextSection}
              disabled={currentSectionIndex >= (currentTemplate.sections.length - 1) || isRunning}
              size="sm"
            >
              <IconChevronRight size={14} />
            </ActionIcon>

            <Tooltip label="Saltar sección">
              <ActionIcon
                variant="subtle"
                color="orange"
                onClick={handleNextSection}
                disabled={!isRunning}
                size="sm"
              >
                <IconPlayerSkipForward size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Text size="xs" c="dimmed" ta="center">
            {isRunning 
              ? `Cronómetro en ejecución${isPaused ? ' (pausado)' : ''}` 
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
                borderColor: currentTemplate.id === template.id ? 'var(--mantine-color-blue-6)' : undefined
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
                <Badge variant="light">
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