import { useEffect } from 'react';
import { Box, Alert, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { VideoPlayer } from './VideoPlayer';
import { ImageViewer } from './ImageViewer';
import { useMediaStore } from '../../stores/mediaStore';
import { MediaFile, MediaType } from '../../types/media';

interface MediaPlayerProps {
  mediaFile?: MediaFile;
  autoplay?: boolean;
  showControls?: boolean;
  allowNavigation?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onError?: (error: string) => void;
}

export function MediaPlayer({
  mediaFile,
  autoplay = false,
  showControls = true,
  allowNavigation = false,
  className,
  style,
  onTimeUpdate,
  onEnded,
  onNext,
  onPrevious,
  onError,
}: MediaPlayerProps) {
  const { loadMedia, recordPlayback } = useMediaStore();

  // Cargar archivo cuando cambie
  useEffect(() => {
    if (mediaFile) {
      loadMedia(mediaFile);
    }
  }, [mediaFile, loadMedia]);

  // Registrar reproducción cuando termine
  const handleEnded = () => {
    if (mediaFile) {
      // Para videos, usar la duración real; para imágenes, tiempo fijo
      const duration = mediaFile.type === 'video' 
        ? mediaFile.duration || 0 
        : 5; // 5 segundos por defecto para imágenes
      recordPlayback(mediaFile.id, duration);
    }
    onEnded?.();
  };

  // Manejar errores
  const handleError = (error: string) => {
    console.error('Error en reproductor multimedia:', error);
    onError?.(error);
  };

  // Si no hay archivo, mostrar placeholder
  if (!mediaFile) {
    return (
      <Box 
        className={className || ''}
        style={{ 
          width: '100%', 
          height: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          ...style
        }}
      >
        <Text c="dimmed" ta="center">
          Selecciona un archivo multimedia para reproducir
        </Text>
      </Box>
    );
  }

  // Verificar si el tipo de archivo es soportado
  const isVideoType = (type: MediaType) => type === 'video';
  const isImageType = (type: MediaType) => type === 'image';
  const isAudioType = (type: MediaType) => type === 'audio';

  // Verificar formatos soportados
  const getSupportedFormats = (type: MediaType) => {
    switch (type) {
      case 'video':
        return ['mp4', 'webm', 'ogg', 'mov', 'avi'];
      case 'image':
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
      case 'audio':
        return ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
      default:
        return [];
    }
  };

  const supportedFormats = getSupportedFormats(mediaFile.type);
  const isFormatSupported = supportedFormats.includes(
    mediaFile.metadata.format.toLowerCase()
  );

  // Mostrar error si el formato no es soportado
  if (!isFormatSupported) {
    return (
      <Box className={className || ''} style={style}>
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Formato no soportado" 
          color="orange"
        >
          <Text size="sm">
            El formato <strong>{mediaFile.metadata.format}</strong> no es compatible.
          </Text>
          <Text size="sm" mt="xs">
            Formatos soportados para {mediaFile.type}: {supportedFormats.join(', ')}
          </Text>
        </Alert>
      </Box>
    );
  }

  // Renderizar el reproductor apropiado según el tipo
  if (isVideoType(mediaFile.type)) {
    return (
      <VideoPlayer
        mediaFile={mediaFile}
        autoplay={autoplay}
        showControls={showControls}
        className={className}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
      />
    );
  }

  if (isImageType(mediaFile.type)) {
    return (
      <ImageViewer
        mediaFile={mediaFile}
        showControls={showControls}
        allowNavigation={allowNavigation}
        className={className}
        onNext={onNext}
        onPrevious={onPrevious}
        onError={handleError}
      />
    );
  }

  if (isAudioType(mediaFile.type)) {
    // Para audio, usar el reproductor de video sin elemento visual
    return (
      <Box className={className || ''} style={style}>
        <VideoPlayer
          mediaFile={mediaFile}
          autoplay={autoplay}
          showControls={showControls}
          onTimeUpdate={onTimeUpdate}
          onEnded={handleEnded}
          onError={handleError}
        />
        {/* Overlay para audio con información visual */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Box ta="center" c="white">
            <Text size="xl" fw={500} mb="md">
              🎵
            </Text>
            <Text size="lg" fw={500}>
              {mediaFile.metadata.title || mediaFile.name}
            </Text>
            {mediaFile.metadata.description && (
              <Text size="sm" opacity={0.8} mt="xs">
                {mediaFile.metadata.description}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Tipo no reconocido
  return (
    <Box className={className} style={style}>
      <Alert 
        icon={<IconAlertCircle size={16} />} 
        title="Tipo de archivo no reconocido" 
        color="red"
      >
        <Text size="sm">
          No se puede reproducir archivos de tipo: <strong>{mediaFile.type}</strong>
        </Text>
      </Alert>
    </Box>
  );
}