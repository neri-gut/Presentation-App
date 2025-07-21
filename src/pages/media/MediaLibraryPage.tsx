import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  Grid,
  Card,
  Button,
  ActionIcon,
  Badge,
  Stack,
  Tabs,
  Box,
  Progress,
  Tooltip,
  Modal,
  TextInput,
  Select,
  FileInput,
  Alert,
} from '@mantine/core';
import {
  IconPhoto,
  IconVideo,
  IconMusic,
  IconUpload,
  IconPlus,
  IconSearch,
  IconFilter,
  IconPlayerPlay,
  IconEye,
  IconDownload,
  IconTrash,
  IconEdit,
  IconFolder,
  IconFolderPlus,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useMediaStore } from '../../stores/mediaStore';
import { MediaPlayer } from '../../components/media';
import { MediaFile, MediaType, MediaCollection } from '../../types/media';

export default function MediaLibraryPage() {
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOpened, { open: openUpload, close: closeUpload }] = useDisclosure(false);
  const [collectionOpened, { open: openCollection, close: closeCollection }] = useDisclosure(false);

  const {
    library,
    currentCollection,
    setCurrentCollection,
    createCollection,
    addMediaFile,
    loadMedia,
    searchMedia,
    currentFilter,
  } = useMediaStore();

  // Form para nueva colección
  const collectionForm = useForm({
    initialValues: {
      name: '',
      description: '',
      color: '#2196F3',
    },
    validate: {
      name: (value) => (!value ? 'El nombre es requerido' : null),
    },
  });

  // Form para subir archivos
  const uploadForm = useForm({
    initialValues: {
      files: [],
      collection: '',
      tags: '',
    },
  });

  // Filtrar archivos por tipo
  const getFilesByType = (type: MediaType | 'all') => {
    const allFiles = library.collections.flatMap(collection => collection.files);
    if (type === 'all') return allFiles;
    return allFiles.filter(file => file.type === type);
  };

  // Filtrar archivos por búsqueda
  const getFilteredFiles = () => {
    let files = getFilesByType(activeTab as MediaType | 'all');
    
    if (searchQuery) {
      files = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.metadata.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (currentCollection) {
      files = files.filter(file => 
        currentCollection.files.some(cf => cf.id === file.id)
      );
    }

    return files;
  };

  // Contar archivos por tipo
  const getFileCountByType = (type: MediaType) => {
    return library.collections.reduce((total, collection) => {
      return total + collection.files.filter(file => file.type === type).length;
    }, 0);
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Formatear duración
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers
  const handleCreateCollection = (values: typeof collectionForm.values) => {
    createCollection(values.name, values.description);
    collectionForm.reset();
    closeCollection();
  };

  const handleFileUpload = (values: typeof uploadForm.values) => {
    // TODO: Implementar lógica de subida real
    console.log('Subir archivos:', values);
    closeUpload();
  };

  const handlePlayMedia = (media: MediaFile) => {
    setSelectedMedia(media);
    loadMedia(media);
  };

  const handleSearch = () => {
    searchMedia({ searchQuery });
  };

  const filteredFiles = getFilteredFiles();

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1}>Biblioteca Multimedia</Title>
          <Text c="dimmed" size="lg">
            Gestiona videos, imágenes y audio para presentaciones
          </Text>
        </div>
        
        <Group>
          <Button leftSection={<IconFolderPlus size={16} />} onClick={openCollection}>
            Nueva Colección
          </Button>
          <Button leftSection={<IconUpload size={16} />} onClick={openUpload}>
            Subir Archivos
          </Button>
        </Group>
      </Group>

      {/* Estadísticas */}
      <Grid mb="xl">
        <Grid.Col span={3}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Total Archivos</Text>
                <Text size="xl" fw={700}>{library.totalFiles}</Text>
              </div>
              <IconFolder size={32} color="gray" />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={3}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Videos</Text>
                <Text size="xl" fw={700}>{getFileCountByType('video')}</Text>
              </div>
              <IconVideo size={32} color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={3}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Imágenes</Text>
                <Text size="xl" fw={700}>{getFileCountByType('image')}</Text>
              </div>
              <IconPhoto size={32} color="green" />
            </Group>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={3}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Tamaño Total</Text>
                <Text size="xl" fw={700}>{formatFileSize(library.totalSize)}</Text>
              </div>
              <IconMusic size={32} color="orange" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        {/* Sidebar: Colecciones */}
        <Grid.Col span={3}>
          <Card withBorder p="md">
            <Title order={4} mb="md">Colecciones</Title>
            <Stack gap="xs">
              <Button
                variant={!currentCollection ? 'light' : 'subtle'}
                fullWidth
                justify="flex-start"
                onClick={() => setCurrentCollection(null)}
              >
                Todas las colecciones
              </Button>
              
              {library.collections.map((collection) => (
                <Button
                  key={collection.id}
                  variant={currentCollection?.id === collection.id ? 'light' : 'subtle'}
                  fullWidth
                  justify="flex-start"
                  leftSection={
                    <div 
                      style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: collection.color 
                      }} 
                    />
                  }
                  onClick={() => setCurrentCollection(collection)}
                >
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <Text size="sm">{collection.name}</Text>
                    <Text size="xs" c="dimmed">{collection.files.length} archivos</Text>
                  </div>
                </Button>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Main Content */}
        <Grid.Col span={9}>
          <Card withBorder p="md">
            {/* Búsqueda y Filtros */}
            <Group mb="md">
              <TextInput
                placeholder="Buscar archivos..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{ flex: 1 }}
              />
              <Button onClick={handleSearch}>Buscar</Button>
              <ActionIcon variant="light">
                <IconFilter size={16} />
              </ActionIcon>
            </Group>

            {/* Tabs por tipo de archivo */}
            <Tabs value={activeTab} onChange={setActiveTab} mb="md">
              <Tabs.List>
                <Tabs.Tab value="all">
                  Todos ({getFilesByType('all').length})
                </Tabs.Tab>
                <Tabs.Tab value="video" leftSection={<IconVideo size={16} />}>
                  Videos ({getFileCountByType('video')})
                </Tabs.Tab>
                <Tabs.Tab value="image" leftSection={<IconPhoto size={16} />}>
                  Imágenes ({getFileCountByType('image')})
                </Tabs.Tab>
                <Tabs.Tab value="audio" leftSection={<IconMusic size={16} />}>
                  Audio ({getFileCountByType('audio')})
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

            {/* Lista de Archivos */}
            {filteredFiles.length === 0 ? (
              <Box ta="center" py="xl">
                <Text c="dimmed">No hay archivos en esta categoría</Text>
                <Button mt="md" leftSection={<IconUpload size={16} />} onClick={openUpload}>
                  Subir Primeros Archivos
                </Button>
              </Box>
            ) : (
              <Grid>
                {filteredFiles.map((file) => (
                  <Grid.Col key={file.id} span={4}>
                    <Card withBorder shadow="sm" style={{ height: '100%' }}>
                      {/* Thumbnail */}
                      <Card.Section style={{ height: 160, backgroundColor: '#f8f9fa' }}>
                        {file.thumbnail ? (
                          <img 
                            src={file.thumbnail} 
                            alt={file.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                          />
                        ) : (
                          <Box 
                            style={{ 
                              height: '100%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          >
                            {file.type === 'video' && <IconVideo size={48} color="gray" />}
                            {file.type === 'image' && <IconPhoto size={48} color="gray" />}
                            {file.type === 'audio' && <IconMusic size={48} color="gray" />}
                          </Box>
                        )}
                        
                        {/* Overlay con duración para videos */}
                        {file.type === 'video' && file.duration && (
                          <Badge
                            style={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                            }}
                          >
                            {formatDuration(file.duration)}
                          </Badge>
                        )}
                      </Card.Section>

                      {/* Información del archivo */}
                      <Stack gap="xs" p="md">
                        <Text fw={500} size="sm" lineClamp={2}>
                          {file.metadata.title || file.name}
                        </Text>
                        
                        <Group justify="space-between">
                          <Badge size="xs" variant="light">
                            {file.metadata.format?.toUpperCase()}
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {formatFileSize(file.size)}
                          </Text>
                        </Group>

                        {file.metadata.resolution && (
                          <Text size="xs" c="dimmed">
                            {file.metadata.resolution}
                          </Text>
                        )}

                        {/* Tags */}
                        {file.tags.length > 0 && (
                          <Group gap={4}>
                            {file.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} size="xs" variant="outline">
                                {tag}
                              </Badge>
                            ))}
                            {file.tags.length > 2 && (
                              <Text size="xs" c="dimmed">+{file.tags.length - 2}</Text>
                            )}
                          </Group>
                        )}

                        {/* Acciones */}
                        <Group justify="space-between" mt="auto">
                          <Group gap="xs">
                            <Tooltip label="Reproducir">
                              <ActionIcon 
                                variant="filled" 
                                size="sm"
                                onClick={() => handlePlayMedia(file)}
                              >
                                <IconPlayerPlay size={14} />
                              </ActionIcon>
                            </Tooltip>
                            
                            <Tooltip label="Vista previa">
                              <ActionIcon variant="light" size="sm">
                                <IconEye size={14} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                          
                          <Group gap="xs">
                            <Tooltip label="Editar">
                              <ActionIcon variant="light" size="sm">
                                <IconEdit size={14} />
                              </ActionIcon>
                            </Tooltip>
                            
                            <Tooltip label="Eliminar">
                              <ActionIcon variant="light" size="sm" color="red">
                                <IconTrash size={14} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      {/* Modal: Nueva Colección */}
      <Modal opened={collectionOpened} onClose={closeCollection} title="Nueva Colección">
        <form onSubmit={collectionForm.onSubmit(handleCreateCollection)}>
          <Stack>
            <TextInput
              label="Nombre"
              placeholder="Nombre de la colección"
              {...collectionForm.getInputProps('name')}
            />
            
            <TextInput
              label="Descripción"
              placeholder="Descripción opcional"
              {...collectionForm.getInputProps('description')}
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeCollection}>
                Cancelar
              </Button>
              <Button type="submit">
                Crear Colección
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal: Subir Archivos */}
      <Modal opened={uploadOpened} onClose={closeUpload} title="Subir Archivos" size="md">
        <form onSubmit={uploadForm.onSubmit(handleFileUpload)}>
          <Stack>
            <Alert color="blue">
              <Text size="sm">
                Formatos soportados: MP4, WebM (video) | JPG, PNG, GIF (imagen) | MP3, WAV (audio)
              </Text>
            </Alert>
            
            <FileInput
              label="Archivos"
              placeholder="Seleccionar archivos..."
              multiple
              accept="video/*,image/*,audio/*"
              {...uploadForm.getInputProps('files')}
            />
            
            <Select
              label="Colección destino"
              placeholder="Seleccionar colección"
              data={library.collections.map(c => ({ value: c.id, label: c.name }))}
              {...uploadForm.getInputProps('collection')}
            />
            
            <TextInput
              label="Etiquetas"
              placeholder="Separar con comas"
              {...uploadForm.getInputProps('tags')}
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeUpload}>
                Cancelar
              </Button>
              <Button type="submit">
                Subir Archivos
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Reproductor Modal/Drawer para vista previa */}
      {selectedMedia && (
        <Modal
          opened={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          title={selectedMedia.metadata.title || selectedMedia.name}
          size="xl"
          centered
        >
          <MediaPlayer
            mediaFile={selectedMedia}
            showControls={true}
            style={{ height: '60vh' }}
          />
        </Modal>
      )}
    </Container>
  );
}