import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Group,
  ActionIcon,
  Text,
  Paper,
  Tooltip,
  Slider,
} from '@mantine/core';
import {
  IconMaximize,
  IconMinimize,
  IconZoomIn,
  IconZoomOut,
  IconRotateClockwise,
  IconRotate,
  IconChevronLeft,
  IconChevronRight,
  IconAspectRatio,
  IconDownload,
} from '@tabler/icons-react';
import { useMediaStore } from '../../stores/mediaStore';
import { MediaFile } from '../../types/media';

interface ImageViewerProps {
  mediaFile?: MediaFile;
  showControls?: boolean;
  className?: string;
  allowNavigation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onError?: (error: string) => void;
}

export function ImageViewer({
  mediaFile,
  showControls = true,
  className,
  allowNavigation = false,
  onNext,
  onPrevious,
  onError,
}: ImageViewerProps) {
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Media store integration could be added here if needed

  // Auto-ocultar controles
  useEffect(() => {
    if (!showControls) return;

    const resetTimeout = () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      setShowControlsOverlay(true);
      const timeout = setTimeout(() => {
        setShowControlsOverlay(false);
      }, 3000);
      setControlsTimeout(timeout);
    };

    resetTimeout();

    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showControls, controlsTimeout]);

  // Reset cuando cambie la imagen
  useEffect(() => {
    if (mediaFile) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setIsLoading(true);
      setHasError(false);
    }
  }, [mediaFile]);

  // Handlers de zoom
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Handlers de rotación
  const handleRotateClockwise = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const handleRotateCounterClockwise = useCallback(() => {
    setRotation(prev => (prev - 90 + 360) % 360);
  }, []);

  // Handlers de paneo
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
    if (showControls) {
      setShowControlsOverlay(true);
    }
  }, [isDragging, dragStart, zoom, showControls]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handler de wheel para zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(prev * delta, 5)));
  }, []);

  // Fullscreen
  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(prev => !prev);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleZoomReset();
          break;
        case 'r':
          handleRotateClockwise();
          break;
        case 'R':
          handleRotateCounterClockwise();
          break;
        case 'ArrowLeft':
          if (allowNavigation) onPrevious?.();
          break;
        case 'ArrowRight':
          if (allowNavigation) onNext?.();
          break;
        case 'f':
          handleFullscreenToggle();
          break;
        case 'Escape':
          if (isFullscreen) handleFullscreenToggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleRotateClockwise,
    handleRotateCounterClockwise,
    handleFullscreenToggle,
    allowNavigation,
    onNext,
    onPrevious,
    isFullscreen,
  ]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.('Error al cargar la imagen');
  };

  const handleDownload = () => {
    if (!mediaFile?.path && !mediaFile?.url) return;
    
    const link = document.createElement('a');
    link.href = mediaFile.path || mediaFile.url || '';
    link.download = mediaFile.filename;
    link.click();
  };

  if (!mediaFile) {
    return (
      <Box className={className || ''} style={{ 
        width: '100%', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Text c="dimmed">No hay imagen seleccionada</Text>
      </Box>
    );
  }

  return (
    <Box 
      className={className || ''}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        backgroundColor: '#000',
        overflow: 'hidden',
        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Image Display */}
      {isLoading && (
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <Text c="white">Cargando imagen...</Text>
        </Box>
      )}

      {hasError && (
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
            <Text c="white" fw={500}>Error al cargar imagen</Text>
            <Text c="white" size="sm">No se pudo mostrar la imagen</Text>
          </Paper>
        </Box>
      )}

      {!hasError && (
        <img
          src={mediaFile.path || mediaFile.url}
          alt={mediaFile.metadata.title || mediaFile.name}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom}) rotate(${rotation}deg)`,
            maxWidth: zoom === 1 ? '100%' : 'none',
            maxHeight: zoom === 1 ? '100%' : 'none',
            objectFit: 'contain',
            transition: isDragging ? 'none' : 'transform 0.2s ease',
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
      )}

      {/* Navigation Arrows */}
      {allowNavigation && showControlsOverlay && (
        <>
          <ActionIcon
            variant="filled"
            size="xl"
            onClick={onPrevious}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <IconChevronLeft />
          </ActionIcon>

          <ActionIcon
            variant="filled"
            size="xl"
            onClick={onNext}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <IconChevronRight />
          </ActionIcon>
        </>
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
          <Group justify="space-between">
            {/* Left Controls */}
            <Group>
              <Tooltip label="Zoom In (+)">
                <ActionIcon variant="light" size="md" onClick={handleZoomIn}>
                  <IconZoomIn />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Zoom Out (-)">
                <ActionIcon variant="light" size="md" onClick={handleZoomOut}>
                  <IconZoomOut />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Ajustar a pantalla (0)">
                <ActionIcon variant="light" size="md" onClick={handleZoomReset}>
                  <IconAspectRatio />
                </ActionIcon>
              </Tooltip>

              <Text c="white" size="sm">
                {Math.round(zoom * 100)}%
              </Text>

              <Slider
                value={zoom}
                onChange={setZoom}
                min={0.1}
                max={5}
                step={0.1}
                style={{ width: 100 }}
                size="sm"
              />
            </Group>

            {/* Center Controls */}
            <Group>
              <Tooltip label="Rotar horario (R)">
                <ActionIcon variant="light" size="md" onClick={handleRotateClockwise}>
                  <IconRotateClockwise />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Rotar antihorario (Shift+R)">
                <ActionIcon variant="light" size="md" onClick={handleRotateCounterClockwise}>
                  <IconRotate />
                </ActionIcon>
              </Tooltip>

              <Text c="white" size="sm">
                {rotation}°
              </Text>
            </Group>

            {/* Right Controls */}
            <Group>
              <Tooltip label="Descargar">
                <ActionIcon variant="light" size="md" onClick={handleDownload}>
                  <IconDownload />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={isFullscreen ? "Salir de pantalla completa (F)" : "Pantalla completa (F)"}>
                <ActionIcon variant="light" size="md" onClick={handleFullscreenToggle}>
                  {isFullscreen ? <IconMinimize /> : <IconMaximize />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
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
          <Text c="white" size="xs" opacity={0.6}>
            {mediaFile.metadata.resolution} • {mediaFile.metadata.format?.toUpperCase()}
          </Text>
        </Box>
      )}
    </Box>
  );
}