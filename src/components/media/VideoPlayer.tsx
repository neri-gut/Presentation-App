import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Group,
  ActionIcon,
  Slider,
  Text,
  Paper,
  Stack,
  Tooltip,
  Progress,
  Button,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerStop,
  IconVolume,
  IconVolumeOff,
  IconMaximize,
  IconMinimize,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconRotateClockwise,
} from '@tabler/icons-react';
import { useMediaStore } from '../../stores/mediaStore';
import { MediaFile, PlaybackState } from '../../types/media';

interface VideoPlayerProps {
  mediaFile?: MediaFile;
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
}

export function VideoPlayer({
  mediaFile,
  autoplay = false,
  showControls = true,
  className,
  onTimeUpdate,
  onEnded,
  onError,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const {
    playbackState,
    playbackConfig,
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate,
    toggleFullscreen,
    updatePlaybackState,
  } = useMediaStore();

  // Formatear tiempo para mostrar
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Manejar eventos del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      updatePlaybackState({ currentTime });
      onTimeUpdate?.(currentTime);
    };

    const handleDurationChange = () => {
      updatePlaybackState({ duration: video.duration });
    };

    const handleLoadStart = () => {
      setIsBuffering(true);
      updatePlaybackState({ isLoading: true });
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
      updatePlaybackState({ isLoading: false });
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
      updatePlaybackState({ isPlaying: true, isPaused: false });
    };

    const handlePause = () => {
      updatePlaybackState({ isPlaying: false, isPaused: true });
    };

    const handleEnded = () => {
      updatePlaybackState({ isPlaying: false, isPaused: false, currentTime: 0 });
      onEnded?.();
    };

    const handleError = () => {
      const error = video.error;
      const errorMessage = error ? `Error ${error.code}: ${error.message}` : 'Error desconocido';
      updatePlaybackState({ 
        error: { 
          code: error?.code.toString() || 'UNKNOWN', 
          message: errorMessage,
          timestamp: new Date()
        }
      });
      onError?.(errorMessage);
    };

    // Agregar listeners
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [updatePlaybackState, onTimeUpdate, onEnded, onError]);

  // Sincronizar estado con el video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playbackState.isPlaying && video.paused) {
      video.play().catch(console.error);
    } else if (!playbackState.isPlaying && !video.paused) {
      video.pause();
    }

    video.volume = playbackState.volume;
    video.playbackRate = playbackState.playbackRate;
  }, [playbackState.isPlaying, playbackState.volume, playbackState.playbackRate]);

  // Cargar archivo de video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaFile) return;

    video.src = mediaFile.path || mediaFile.url || '';
    video.load();

    if (autoplay) {
      video.play().catch(console.error);
    }
  }, [mediaFile, autoplay]);

  // Auto-ocultar controles
  useEffect(() => {
    if (!showControls) return;

    const resetTimeout = () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      setShowControlsOverlay(true);
      const timeout = setTimeout(() => {
        if (playbackState.isPlaying) {
          setShowControlsOverlay(false);
        }
      }, 3000);
      setControlsTimeout(timeout);
    };

    resetTimeout();

    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [playbackState.isPlaying, showControls, controlsTimeout]);

  // Handlers
  const handlePlayPause = () => {
    if (playbackState.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleStop = () => {
    stop();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleSeek = (value: number) => {
    seek(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(0.8);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(playbackState.currentTime + seconds, playbackState.duration));
    handleSeek(newTime);
  };

  const handleFullscreenToggle = () => {
    toggleFullscreen();
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const handleMouseMove = () => {
    if (showControls) {
      setShowControlsOverlay(true);
    }
  };

  if (!mediaFile) {
    return (
      <Box className={className} style={{ 
        width: '100%', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#000'
      }}>
        <Text c="white">No hay video seleccionado</Text>
      </Box>
    );
  }

  return (
    <Box 
      className={className}
      style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}
      onMouseMove={handleMouseMove}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        poster={mediaFile.thumbnail}
        preload="metadata"
      />

      {/* Loading/Buffering Indicator */}
      {(playbackState.isLoading || isBuffering) && (
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <Progress size="lg" value={undefined} animate />
        </Box>
      )}

      {/* Error Display */}
      {playbackState.error && (
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <Paper p="md" style={{ backgroundColor: 'rgba(255, 0, 0, 0.8)' }}>
            <Text c="white" fw={500}>Error de reproducción</Text>
            <Text c="white" size="sm">{playbackState.error.message}</Text>
          </Paper>
        </Box>
      )}

      {/* Controls Overlay */}
      {showControls && showControlsOverlay && (
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
            padding: '20px',
            zIndex: 5,
          }}
        >
          <Stack gap="md">
            {/* Progress Bar */}
            <Slider
              value={playbackState.currentTime}
              max={playbackState.duration || 100}
              onChange={handleSeek}
              size="sm"
              color="blue"
              style={{ cursor: 'pointer' }}
            />

            {/* Control Buttons */}
            <Group justify="space-between">
              <Group>
                <Tooltip label="Reproducir/Pausar">
                  <ActionIcon
                    variant="filled"
                    size="lg"
                    onClick={handlePlayPause}
                    color={playbackState.isPlaying ? 'orange' : 'green'}
                  >
                    {playbackState.isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Detener">
                  <ActionIcon variant="light" size="md" onClick={handleStop}>
                    <IconPlayerStop />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Retroceder 10s">
                  <ActionIcon variant="light" size="md" onClick={() => handleSkip(-10)}>
                    <IconPlayerSkipBack />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Avanzar 10s">
                  <ActionIcon variant="light" size="md" onClick={() => handleSkip(10)}>
                    <IconPlayerSkipForward />
                  </ActionIcon>
                </Tooltip>

                {/* Volume Controls */}
                <Group gap="xs">
                  <Tooltip label={isMuted ? "Activar sonido" : "Silenciar"}>
                    <ActionIcon variant="light" size="md" onClick={handleMuteToggle}>
                      {isMuted ? <IconVolumeOff /> : <IconVolume />}
                    </ActionIcon>
                  </Tooltip>
                  
                  <Slider
                    value={playbackState.volume * 100}
                    onChange={(value) => handleVolumeChange(value / 100)}
                    min={0}
                    max={100}
                    step={5}
                    style={{ width: 80 }}
                    size="sm"
                  />
                </Group>
              </Group>

              {/* Right Side Controls */}
              <Group>
                <Text c="white" size="sm">
                  {formatTime(playbackState.currentTime)} / {formatTime(playbackState.duration)}
                </Text>

                <Tooltip label="Velocidad de reproducción">
                  <Button
                    variant="light"
                    size="xs"
                    onClick={() => {
                      const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
                      const currentIndex = rates.indexOf(playbackState.playbackRate);
                      const nextRate = rates[(currentIndex + 1) % rates.length];
                      setPlaybackRate(nextRate);
                    }}
                  >
                    {playbackState.playbackRate}x
                  </Button>
                </Tooltip>

                <Tooltip label={playbackState.isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                  <ActionIcon variant="light" size="md" onClick={handleFullscreenToggle}>
                    {playbackState.isFullscreen ? <IconMinimize /> : <IconMaximize />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Stack>
        </Box>
      )}

      {/* Title Overlay */}
      {mediaFile && showControlsOverlay && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(rgba(0, 0, 0, 0.8), transparent)',
            padding: '20px',
            zIndex: 5,
          }}
        >
          <Text c="white" fw={500} size="lg">
            {mediaFile.metadata.title || mediaFile.name}
          </Text>
          {mediaFile.metadata.description && (
            <Text c="white" size="sm" opacity={0.8}>
              {mediaFile.metadata.description}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}