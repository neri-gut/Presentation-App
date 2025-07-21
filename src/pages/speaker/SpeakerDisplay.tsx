import { useEffect } from 'react';
import {
  Box,
  Text,
  Group,
  Progress,
  ThemeIcon,
  Badge,
  Stack,
  Center,
  Paper,
} from '@mantine/core';
import {
  IconClock,
  IconAlertTriangle,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useMeetingStore, useTimerTick } from '../../stores/meetingStore';
import type { SpeakerDisplayProps } from '../../types/meeting';

export default function SpeakerDisplay({ isFullscreen = true }: Partial<SpeakerDisplayProps>) {
  const {
    timerState,
    currentTemplate,
    displayConfig,
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
    if (variance > 0) return { text: `+${formatTime(variance)}`, color: 'red' };
    return { text: `-${formatTime(Math.abs(variance))}`, color: 'blue' };
  };

  const getAlertIcon = () => {
    switch (timerState.alertLevel) {
      case 'critical':
        return <IconAlertTriangle size={32} color={getTimerColor()} />;
      case 'overtime':
        return <IconAlertCircle size={32} color={getTimerColor()} />;
      default:
        return <IconClock size={32} color={getTimerColor()} />;
    }
  };

  // Configurar página para pantalla completa si es necesario
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.backgroundColor = '#000';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.backgroundColor = '';
        document.body.style.margin = '';
        document.body.style.padding = '';
        document.body.style.overflow = '';
      };
    }
  }, [isFullscreen]);

  const variance = getVarianceDisplay();

  if (!timerState.currentSection) {
    return (
      <Center h="100vh" style={{ backgroundColor: '#000' }}>
        <Stack align="center" gap="xl">
          <Text c="white" size="xl" ta="center">
            No hay reunión activa
          </Text>
          <Text c="dimmed" size="lg" ta="center">
            Esperando inicio del cronómetro...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box
      h={isFullscreen ? "100vh" : "100%"}
      style={{
        backgroundColor: '#000',
        color: 'white',
        padding: isFullscreen ? '2rem' : '1rem',
        position: 'relative',
      }}
    >
      {/* Indicador de varianza en esquina superior izquierda */}
      {displayConfig.showTimeVariance && (
        <Box
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            zIndex: 10,
          }}
        >
          <Badge 
            size="xl" 
            color={variance.color}
            variant={timerState.timeVariance === 0 ? "light" : "filled"}
            style={{ 
              fontSize: isFullscreen ? '1.2rem' : '1rem',
              padding: isFullscreen ? '1rem 1.5rem' : '0.5rem 1rem'
            }}
          >
            {variance.text}
          </Badge>
        </Box>
      )}

      <Center h="100%">
        <Stack align="center" gap={isFullscreen ? "3rem" : "2rem"} style={{ width: '100%', maxWidth: '800px' }}>
          
          {/* Nombre de la sección */}
          <Group justify="center" gap="lg">
            {getAlertIcon()}
            <Text 
              size={isFullscreen ? "3xl" : "xl"} 
              fw={700} 
              ta="center"
              style={{
                color: getTimerColor(),
                textShadow: timerState.alertLevel === 'overtime' ? '0 0 20px currentColor' : undefined
              }}
            >
              {timerState.currentSection.name}
            </Text>
          </Group>

          {/* Tiempo principal */}
          <Text
            ta="center"
            fw={900}
            style={{
              fontSize: isFullscreen ? '8rem' : '4rem',
              fontFamily: 'monospace',
              color: getTimerColor(),
              textShadow: timerState.alertLevel === 'overtime' ? '0 0 30px currentColor' : '0 0 10px rgba(255,255,255,0.3)',
              lineHeight: 1,
            }}
          >
            {formatTime(timerState.currentSectionTime)}
          </Text>

          {/* Barra de progreso de la sección */}
          <Box style={{ width: '100%', maxWidth: '600px' }}>
            <Progress
              size={isFullscreen ? "2rem" : "1.5rem"}
              value={getSectionProgress()}
              color={timerState.alertLevel === 'normal' ? 'blue' : getTimerColor()}
              animated={timerState.isRunning}
              style={{
                filter: timerState.alertLevel === 'overtime' ? 'brightness(1.5) drop-shadow(0 0 10px currentColor)' : undefined
              }}
            />
            
            <Group justify="space-between" mt="md">
              <Text c="dimmed" size={isFullscreen ? "lg" : "md"}>
                Tiempo restante: {formatTime(getSectionTimeLeft())}
              </Text>
              <Text c="dimmed" size={isFullscreen ? "lg" : "md"}>
                Duración: {timerState.currentSection.duration} min
              </Text>
            </Group>
          </Box>

          {/* Información adicional en la parte inferior */}
          <Group 
            justify="space-around" 
            style={{ 
              width: '100%', 
              position: isFullscreen ? 'absolute' : 'static',
              bottom: isFullscreen ? '3rem' : 'auto',
              left: isFullscreen ? '0' : 'auto',
              right: isFullscreen ? '0' : 'auto',
              padding: isFullscreen ? '0 3rem' : '2rem 0 0 0'
            }}
          >
            {/* Hora actual */}
            {displayConfig.showCurrentTime && (
              <Paper p="lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Stack align="center" gap="xs">
                  <Text c="dimmed" size="sm">Hora actual</Text>
                  <Text 
                    fw={700} 
                    size={isFullscreen ? "xl" : "lg"}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {timerState.currentTime}
                  </Text>
                </Stack>
              </Paper>
            )}

            {/* Tiempo restante de reunión */}
            {displayConfig.showMeetingEndTime && (
              <Paper p="lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Stack align="center" gap="xs">
                  <Text c="dimmed" size="sm">Reunión termina en</Text>
                  <Text 
                    fw={700} 
                    size={isFullscreen ? "xl" : "lg"}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {formatTime(getMeetingTimeLeft())}
                  </Text>
                </Stack>
              </Paper>
            )}

            {/* Fin estimado */}
            {displayConfig.showMeetingEndTime && timerState.estimatedEndTime && (
              <Paper p="lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Stack align="center" gap="xs">
                  <Text c="dimmed" size="sm">Fin estimado</Text>
                  <Text 
                    fw={700} 
                    size={isFullscreen ? "xl" : "lg"}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {timerState.estimatedEndTime}
                  </Text>
                </Stack>
              </Paper>
            )}
          </Group>

          {/* Indicador de estado */}
          <Text 
            c="dimmed" 
            size={isFullscreen ? "lg" : "md"} 
            ta="center"
            style={{
              position: isFullscreen ? 'absolute' : 'static',
              bottom: isFullscreen ? '1rem' : 'auto',
              left: isFullscreen ? '50%' : 'auto',
              transform: isFullscreen ? 'translateX(-50%)' : 'none'
            }}
          >
            {timerState.isRunning 
              ? `Sección ${timerState.currentSectionIndex + 1} de ${currentTemplate?.sections.length || 0} • ${timerState.isPaused ? 'PAUSADO' : 'EN PROGRESO'}` 
              : 'Cronómetro detenido'
            }
          </Text>
        </Stack>
      </Center>
    </Box>
  );
}