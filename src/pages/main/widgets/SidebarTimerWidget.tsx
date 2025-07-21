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
  Divider,
  Box,
  Tooltip,
  ScrollArea,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerStop,
  IconRefresh,
  IconSettings,
  IconClock,
  IconChevronUp,
  IconChevronDown,
  IconAlertTriangle,
  IconAlertCircle,
  IconPlayerSkipForward,
  IconExternalLink,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';

// Plantillas simplificadas
const templates = [
  {
    id: 'weekday-default',
    name: 'Entre Semana',
    type: 'weekday' as const,
    totalDuration: 105,
    sections: [
      { id: 'opening-song', name: 'Cántico Inicial', duration: 3, order: 1 },
      { id: 'opening-prayer', name: 'Oración Inicial', duration: 2, order: 2 },
      { id: 'treasures', name: 'Tesoros de la Palabra', duration: 10, order: 3 },
      { id: 'ministry-1', name: 'Mejores Maestros - P1', duration: 4, order: 4 },
      { id: 'ministry-2', name: 'Mejores Maestros - P2', duration: 4, order: 5 },
      { id: 'ministry-3', name: 'Mejores Maestros - P3', duration: 4, order: 6 },
      { id: 'middle-song', name: 'Cántico Intermedio', duration: 3, order: 7 },
      { id: 'living-1', name: 'Cristianos - P1', duration: 15, order: 8 },
      { id: 'living-2', name: 'Cristianos - P2', duration: 30, order: 9 },
      { id: 'announcements', name: 'Anuncios', duration: 5, order: 10 },
      { id: 'closing-song', name: 'Cántico Final', duration: 3, order: 11 },
      { id: 'closing-prayer', name: 'Oración Final', duration: 2, order: 12 }
    ]
  },
  {
    id: 'weekend-default',
    name: 'Fin de Semana',
    type: 'weekend' as const,
    totalDuration: 105,
    sections: [
      { id: 'opening-song-we', name: 'Cántico Inicial', duration: 3, order: 1 },
      { id: 'opening-prayer-we', name: 'Oración Inicial', duration: 2, order: 2 },
      { id: 'public-talk', name: 'Discurso Público', duration: 30, order: 3 },
      { id: 'middle-song-we', name: 'Cántico Intermedio', duration: 3, order: 4 },
      { id: 'watchtower-study', name: 'Estudio Atalaya', duration: 60, order: 5 },
      { id: 'announcements-we', name: 'Anuncios', duration: 4, order: 6 },
      { id: 'closing-song-we', name: 'Cántico Final', duration: 3, order: 7 }
    ]
  }
];

export function SidebarTimerWidget() {
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
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
    if (timeVariance > 0) return { text: `+${formatTime(timeVariance)}`, color: 'red' };
    return { text: `-${formatTime(Math.abs(timeVariance))}`, color: 'blue' };
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
      <ScrollArea h="100%" offsetScrollbars>
        <Stack gap="md" p="xs">
          {/* Header compacto */}
          <Group justify="space-between" gap="xs">
            <Title order={4} size="h5">
              Cronómetro
            </Title>
            <ActionIcon variant="subtle" size="sm" onClick={openConfig}>
              <IconSettings size={14} />
            </ActionIcon>
          </Group>

          {/* Plantilla actual */}
          <Badge size="xs" variant="light" fullWidth>
            {currentTemplate.name}
          </Badge>

          {/* Indicador de varianza */}
          <Badge 
            size="xs" 
            color={variance.color}
            variant={timeVariance === 0 ? "light" : "filled"}
            fullWidth
          >
            {variance.text}
          </Badge>

          {/* Sección Actual */}
          {currentSection && (
            <Card 
              withBorder 
              radius="sm" 
              p="sm"
              style={{ 
                borderColor: alertLevel !== 'normal' ? getTimerColor() : undefined,
                backgroundColor: alertLevel === 'overtime' ? `${getTimerColor()}15` : undefined
              }}
            >
              <Stack gap="xs">
                <Group justify="center" gap="xs">
                  <ThemeIcon size="xs" variant="light" color={getTimerColor()}>
                    <IconClock size={10} />
                  </ThemeIcon>
                  {alertLevel === 'critical' && (
                    <IconAlertTriangle size={12} color={getTimerColor()} />
                  )}
                  {alertLevel === 'overtime' && (
                    <IconAlertCircle size={12} color={getTimerColor()} />
                  )}
                </Group>

                <Text size="xs" ta="center" fw={500} lineClamp={2}>
                  {currentSection.name}
                </Text>

                <Text size="xs" c="dimmed" ta="center">
                  {currentSectionIndex + 1}/{currentTemplate.sections.length}
                </Text>

                {/* Tiempo principal */}
                <Text
                  size="xl"
                  fw={700}
                  ta="center"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1.8rem',
                    color: getTimerColor(),
                    lineHeight: 1,
                    textShadow: alertLevel === 'overtime' ? '0 0 8px currentColor' : undefined
                  }}
                >
                  {formatTime(currentSectionTime)}
                </Text>

                {/* Progreso */}
                <Progress
                  size="md"
                  value={getSectionProgress()}
                  color={alertLevel === 'normal' ? 'blue' : getTimerColor()}
                  animated={isRunning && !isPaused}
                />

                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    -{formatTime(getSectionTimeLeft())}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {currentSection.duration}m
                  </Text>
                </Group>
              </Stack>
            </Card>
          )}

          {/* Información secundaria compacta */}
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" c="dimmed">Hora:</Text>
              <Text size="xs" fw={600} style={{ fontFamily: 'monospace' }}>
                {currentTime}
              </Text>
            </Group>
            
            <Group justify="space-between">
              <Text size="xs" c="dimmed">Restante:</Text>
              <Text size="xs" fw={600} style={{ fontFamily: 'monospace' }}>
                {formatTime(getMeetingTimeLeft())}
              </Text>
            </Group>
          </Stack>

          {/* Progreso general */}
          <Box>
            <Text size="xs" c="dimmed" mb={4}>Progreso reunión</Text>
            <Progress
              size="xs"
              value={(totalMeetingTime / (currentTemplate.totalDuration * 60)) * 100}
              color="gray"
            />
          </Box>

          <Divider />

          {/* Controles compactos */}
          <Group justify="center" gap="xs">
            {!isRunning ? (
              <Button
                leftSection={<IconPlayerPlay size={12} />}
                color="green"
                onClick={handleStart}
                size="xs"
                compact
              >
                Iniciar
              </Button>
            ) : (
              <Button
                leftSection={<IconPlayerPause size={12} />}
                color="orange"
                onClick={handlePause}
                size="xs"
                compact
              >
                {isPaused ? 'Reanudar' : 'Pausar'}
              </Button>
            )}

            <ActionIcon
              variant="light"
              color="red"
              onClick={handleStop}
              disabled={!isRunning && currentSectionTime === 0}
              size="sm"
            >
              <IconPlayerStop size={12} />
            </ActionIcon>

            <ActionIcon
              variant="light"
              color="gray"
              onClick={handleReset}
              disabled={isRunning}
              size="sm"
            >
              <IconRefresh size={12} />
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
              <IconChevronUp size={12} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              onClick={handleNextSection}
              disabled={currentSectionIndex >= (currentTemplate.sections.length - 1) || isRunning}
              size="sm"
            >
              <IconChevronDown size={12} />
            </ActionIcon>

            <Tooltip label="Saltar sección">
              <ActionIcon
                variant="subtle"
                color="orange"
                onClick={handleNextSection}
                disabled={!isRunning}
                size="sm"
              >
                <IconPlayerSkipForward size={12} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Text size="xs" c="dimmed" ta="center">
            {isRunning 
              ? `${isPaused ? 'Pausado' : 'Ejecutando'}` 
              : 'Detenido'
            }
          </Text>
        </Stack>
      </ScrollArea>

      {/* Modal de configuración */}
      <Modal
        opened={configOpened}
        onClose={closeConfig}
        title="Configuración"
        size="md"
      >
        <Stack>
          {templates.map((template) => (
            <Card 
              key={template.id} 
              withBorder 
              p="sm"
              style={{ 
                cursor: 'pointer',
                borderColor: currentTemplate.id === template.id ? 'var(--mantine-color-blue-6)' : undefined
              }}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <Group justify="space-between">
                <div>
                  <Text fw={500} size="sm">{template.name}</Text>
                  <Text size="xs" c="dimmed">
                    {template.sections.length} secciones • {template.totalDuration}min
                  </Text>
                </div>
                <Badge size="xs" variant="light">
                  {template.type === 'weekday' ? 'Entre semana' : 'Fin de semana'}
                </Badge>
              </Group>
            </Card>
          ))}

          <Group justify="space-between" mt="md">
            <Button 
              variant="light" 
              leftSection={<IconExternalLink size={14} />}
              component="a"
              href="/speaker-display"
              target="_blank"
              size="sm"
            >
              Pantalla Orador
            </Button>
            
            <Button onClick={closeConfig} size="sm">Cerrar</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}