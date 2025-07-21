import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MediaFile,
  MediaLibrary,
  MediaCollection,
  Playlist,
  PlaylistItem,
  PlaybackState,
  PlaybackConfig,
  PresentationConfig,
  MediaFilter,
  SearchResult,
  MediaStats,
  MediaType,
  MediaSource
} from '../types/media';

interface MediaStore {
  // Estado de la biblioteca
  library: MediaLibrary;
  currentCollection: MediaCollection | null;
  
  // Estado de reproducción
  currentMedia: MediaFile | null;
  playbackState: PlaybackState;
  playbackConfig: PlaybackConfig;
  
  // Listas de reproducción
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  
  // Configuración de presentación
  presentationConfig: PresentationConfig;
  
  // Búsqueda y filtros
  searchResults: SearchResult | null;
  currentFilter: MediaFilter;
  
  // Estadísticas
  mediaStats: Record<string, MediaStats>;
  
  // Actions para biblioteca
  loadLibrary: () => void;
  createCollection: (name: string, description?: string) => void;
  updateCollection: (id: string, updates: Partial<MediaCollection>) => void;
  deleteCollection: (id: string) => void;
  setCurrentCollection: (collection: MediaCollection | null) => void;
  
  // Actions para archivos
  addMediaFile: (file: Omit<MediaFile, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateMediaFile: (id: string, updates: Partial<MediaFile>) => void;
  deleteMediaFile: (id: string) => void;
  moveMediaFile: (fileId: string, targetCollectionId: string) => void;
  
  // Actions para reproducción
  loadMedia: (mediaFile: MediaFile) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleFullscreen: () => void;
  updatePlaybackState: (updates: Partial<PlaybackState>) => void;
  updatePlaybackConfig: (updates: Partial<PlaybackConfig>) => void;
  
  // Actions para listas de reproducción
  createPlaylist: (name: string, description?: string) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, mediaFileId: string, config?: Partial<PlaybackConfig>) => void;
  removeFromPlaylist: (playlistId: string, itemId: string) => void;
  reorderPlaylist: (playlistId: string, oldIndex: number, newIndex: number) => void;
  setActivePlaylist: (playlist: Playlist | null) => void;
  playNext: () => void;
  playPrevious: () => void;
  
  // Actions para presentación
  updatePresentationConfig: (updates: Partial<PresentationConfig>) => void;
  startPresentation: (mediaFile: MediaFile) => void;
  stopPresentation: () => void;
  
  // Actions para búsqueda
  searchMedia: (filter: MediaFilter) => void;
  clearSearch: () => void;
  setFilter: (filter: Partial<MediaFilter>) => void;
  
  // Actions para estadísticas
  recordPlayback: (fileId: string, duration: number) => void;
  getMediaStats: (fileId: string) => MediaStats | undefined;
}

// Configuración inicial de reproducción
const defaultPlaybackConfig: PlaybackConfig = {
  autoplay: false,
  loop: false,
  volume: 0.8,
  quality: 'auto',
  subtitlesEnabled: false,
  playbackRate: 1,
  startTime: 0,
};

// Estado inicial de reproducción
const defaultPlaybackState: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  playbackRate: 1,
  isFullscreen: false,
};

// Configuración inicial de presentación
const defaultPresentationConfig: PresentationConfig = {
  displayMode: 'fullscreen',
  screens: [
    {
      id: 'audience',
      name: 'Audiencia',
      type: 'audience',
      display: 1,
      resolution: '1920x1080',
      isActive: true,
      showControls: false,
      showSubtitles: true,
    },
    {
      id: 'speaker',
      name: 'Orador',
      type: 'speaker',
      display: 2,
      resolution: '1920x1080',
      isActive: false,
      showControls: false,
      showSubtitles: false,
    },
    {
      id: 'operator',
      name: 'Operador',
      type: 'operator',
      display: 0,
      resolution: '1920x1080',
      isActive: true,
      showControls: true,
      showSubtitles: true,
    },
  ],
  transitions: {
    type: 'fade',
    duration: 500,
    easing: 'ease',
  },
  controls: {
    showPlayButton: true,
    showVolumeSlider: true,
    showProgressBar: true,
    showFullscreenButton: true,
    showSubtitleButton: true,
    autoHideDelay: 3000,
    keyboardShortcuts: true,
  },
};

// Biblioteca inicial por defecto
const defaultLibrary: MediaLibrary = {
  id: 'default-library',
  name: 'Biblioteca Principal',
  description: 'Biblioteca multimedia para presentaciones de reunión',
  collections: [
    {
      id: 'videos-reuniones',
      name: 'Videos de Reuniones',
      description: 'Videos para reuniones Vida y Ministerio',
      color: '#2196F3',
      files: [],
      createdAt: new Date(),
      isPublic: true,
      permissions: {
        canView: ['admin', 'operator', 'elder'],
        canEdit: ['admin', 'operator'],
        canDelete: ['admin'],
        canShare: ['admin', 'operator', 'elder'],
      },
    },
    {
      id: 'imagenes-presentaciones',
      name: 'Imágenes para Presentaciones',
      description: 'Imágenes e ilustraciones para presentaciones',
      color: '#4CAF50',
      files: [],
      createdAt: new Date(),
      isPublic: true,
      permissions: {
        canView: ['admin', 'operator', 'elder'],
        canEdit: ['admin', 'operator'],
        canDelete: ['admin'],
        canShare: ['admin', 'operator', 'elder'],
      },
    },
  ],
  totalFiles: 0,
  totalSize: 0,
  lastUpdated: new Date(),
};

export const useMediaStore = create<MediaStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      library: defaultLibrary,
      currentCollection: null,
      currentMedia: null,
      playbackState: defaultPlaybackState,
      playbackConfig: defaultPlaybackConfig,
      playlists: [],
      activePlaylist: null,
      presentationConfig: defaultPresentationConfig,
      searchResults: null,
      currentFilter: {},
      mediaStats: {},

      // Biblioteca
      loadLibrary: () => {
        // TODO: Cargar biblioteca desde persistencia o API
        console.log('Cargando biblioteca multimedia...');
      },

      createCollection: (name: string, description?: string) => {
        const newCollection: MediaCollection = {
          id: `collection_${Date.now()}`,
          name,
          description,
          color: '#FF9800',
          files: [],
          createdAt: new Date(),
          isPublic: false,
          permissions: {
            canView: ['admin', 'operator'],
            canEdit: ['admin', 'operator'],
            canDelete: ['admin'],
            canShare: ['admin', 'operator'],
          },
        };

        set(state => ({
          library: {
            ...state.library,
            collections: [...state.library.collections, newCollection],
            lastUpdated: new Date(),
          },
        }));
      },

      updateCollection: (id: string, updates: Partial<MediaCollection>) => {
        set(state => ({
          library: {
            ...state.library,
            collections: state.library.collections.map(collection =>
              collection.id === id ? { ...collection, ...updates } : collection
            ),
            lastUpdated: new Date(),
          },
        }));
      },

      deleteCollection: (id: string) => {
        set(state => ({
          library: {
            ...state.library,
            collections: state.library.collections.filter(collection => collection.id !== id),
            lastUpdated: new Date(),
          },
          currentCollection: state.currentCollection?.id === id ? null : state.currentCollection,
        }));
      },

      setCurrentCollection: (collection: MediaCollection | null) => {
        set({ currentCollection: collection });
      },

      // Archivos multimedia
      addMediaFile: (fileData) => {
        const newFile: MediaFile = {
          ...fileData,
          id: `media_${Date.now()}`,
          createdAt: new Date(),
          lastModified: new Date(),
        };

        const { currentCollection } = get();
        if (!currentCollection) return;

        set(state => ({
          library: {
            ...state.library,
            collections: state.library.collections.map(collection =>
              collection.id === currentCollection.id
                ? { ...collection, files: [...collection.files, newFile] }
                : collection
            ),
            totalFiles: state.library.totalFiles + 1,
            totalSize: state.library.totalSize + newFile.size,
            lastUpdated: new Date(),
          },
        }));
      },

      updateMediaFile: (id: string, updates: Partial<MediaFile>) => {
        set(state => ({
          library: {
            ...state.library,
            collections: state.library.collections.map(collection => ({
              ...collection,
              files: collection.files.map(file =>
                file.id === id ? { ...file, ...updates, lastModified: new Date() } : file
              ),
            })),
            lastUpdated: new Date(),
          },
        }));
      },

      deleteMediaFile: (id: string) => {
        set(state => {
          let deletedSize = 0;
          const updatedCollections = state.library.collections.map(collection => ({
            ...collection,
            files: collection.files.filter(file => {
              if (file.id === id) {
                deletedSize = file.size;
                return false;
              }
              return true;
            }),
          }));

          return {
            library: {
              ...state.library,
              collections: updatedCollections,
              totalFiles: state.library.totalFiles - 1,
              totalSize: state.library.totalSize - deletedSize,
              lastUpdated: new Date(),
            },
            currentMedia: state.currentMedia?.id === id ? null : state.currentMedia,
          };
        });
      },

      moveMediaFile: (fileId: string, targetCollectionId: string) => {
        set(state => {
          let fileToMove: MediaFile | null = null;
          
          // Encontrar y remover el archivo de su colección actual
          const collectionsWithoutFile = state.library.collections.map(collection => ({
            ...collection,
            files: collection.files.filter(file => {
              if (file.id === fileId) {
                fileToMove = file;
                return false;
              }
              return true;
            }),
          }));

          // Agregar el archivo a la colección destino
          if (fileToMove) {
            const collectionsWithMovedFile = collectionsWithoutFile.map(collection =>
              collection.id === targetCollectionId
                ? { ...collection, files: [...collection.files, fileToMove!] }
                : collection
            );

            return {
              library: {
                ...state.library,
                collections: collectionsWithMovedFile,
                lastUpdated: new Date(),
              },
            };
          }

          return state;
        });
      },

      // Reproducción
      loadMedia: (mediaFile: MediaFile) => {
        set({
          currentMedia: mediaFile,
          playbackState: {
            ...defaultPlaybackState,
            isLoading: true,
          },
        });
      },

      play: () => {
        set(state => ({
          playbackState: {
            ...state.playbackState,
            isPlaying: true,
            isPaused: false,
          },
        }));
      },

      pause: () => {
        set(state => ({
          playbackState: {
            ...state.playbackState,
            isPlaying: false,
            isPaused: true,
          },
        }));
      },

      stop: () => {
        set(state => ({
          playbackState: {
            ...state.playbackState,
            isPlaying: false,
            isPaused: false,
            currentTime: 0,
          },
        }));
      },

      seek: (time: number) => {
        set(state => ({
          playbackState: {
            ...state.playbackState,
            currentTime: time,
          },
        }));
      },

      setVolume: (volume: number) => {
        set(state => ({
          playbackState: {
            ...state.playbackState,
            volume,
          },
          playbackConfig: {
            ...state.playbackConfig,
            volume,
          },
        }));
      },

      setPlaybackRate: (rate: number) => {
        set(state => ({
          playbackState: {
            ...state.playbackState,
            playbackRate: rate,
          },
          playbackConfig: {
            ...state.playbackConfig,
            playbackRate: rate,
          },
        }));
      },

      toggleFullscreen: () => {
        set(state => ({
          playbackState: {
            ...state.playbackState,
            isFullscreen: !state.playbackState.isFullscreen,
          },
        }));
      },

      updatePlaybackState: (updates: Partial<PlaybackState>) => {
        set(state => ({
          playbackState: {
            ...state.playbackState,
            ...updates,
          },
        }));
      },

      updatePlaybackConfig: (updates: Partial<PlaybackConfig>) => {
        set(state => ({
          playbackConfig: {
            ...state.playbackConfig,
            ...updates,
          },
        }));
      },

      // Listas de reproducción
      createPlaylist: (name: string, description?: string) => {
        const newPlaylist: Playlist = {
          id: `playlist_${Date.now()}`,
          name,
          description,
          items: [],
          totalDuration: 0,
          createdBy: 'current-user', // TODO: Obtener del store de usuario
          createdAt: new Date(),
          lastModified: new Date(),
          isActive: false,
        };

        set(state => ({
          playlists: [...state.playlists, newPlaylist],
        }));
      },

      updatePlaylist: (id: string, updates: Partial<Playlist>) => {
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === id 
              ? { ...playlist, ...updates, lastModified: new Date() }
              : playlist
          ),
        }));
      },

      deletePlaylist: (id: string) => {
        set(state => ({
          playlists: state.playlists.filter(playlist => playlist.id !== id),
          activePlaylist: state.activePlaylist?.id === id ? null : state.activePlaylist,
        }));
      },

      addToPlaylist: (playlistId: string, mediaFileId: string, config?: Partial<PlaybackConfig>) => {
        set(state => {
          const playlist = state.playlists.find(p => p.id === playlistId);
          if (!playlist) return state;

          const newItem: PlaylistItem = {
            id: `item_${Date.now()}`,
            mediaFileId,
            order: playlist.items.length,
            config: { ...defaultPlaybackConfig, ...config },
          };

          return {
            playlists: state.playlists.map(p =>
              p.id === playlistId
                ? {
                    ...p,
                    items: [...p.items, newItem],
                    lastModified: new Date(),
                  }
                : p
            ),
          };
        });
      },

      removeFromPlaylist: (playlistId: string, itemId: string) => {
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  items: playlist.items.filter(item => item.id !== itemId),
                  lastModified: new Date(),
                }
              : playlist
          ),
        }));
      },

      reorderPlaylist: (playlistId: string, oldIndex: number, newIndex: number) => {
        set(state => ({
          playlists: state.playlists.map(playlist => {
            if (playlist.id !== playlistId) return playlist;

            const items = [...playlist.items];
            const [removed] = items.splice(oldIndex, 1);
            items.splice(newIndex, 0, removed);

            // Actualizar órdenes
            items.forEach((item, index) => {
              item.order = index;
            });

            return {
              ...playlist,
              items,
              lastModified: new Date(),
            };
          }),
        }));
      },

      setActivePlaylist: (playlist: Playlist | null) => {
        set(state => ({
          playlists: state.playlists.map(p => ({
            ...p,
            isActive: p.id === playlist?.id,
          })),
          activePlaylist: playlist,
        }));
      },

      playNext: () => {
        const { activePlaylist, currentMedia } = get();
        if (!activePlaylist || !currentMedia) return;

        const currentIndex = activePlaylist.items.findIndex(
          item => item.mediaFileId === currentMedia.id
        );
        const nextIndex = currentIndex + 1;

        if (nextIndex < activePlaylist.items.length) {
          const nextItem = activePlaylist.items[nextIndex];
          // TODO: Buscar el archivo de medios y cargarlo
          console.log('Reproducir siguiente:', nextItem.mediaFileId);
        }
      },

      playPrevious: () => {
        const { activePlaylist, currentMedia } = get();
        if (!activePlaylist || !currentMedia) return;

        const currentIndex = activePlaylist.items.findIndex(
          item => item.mediaFileId === currentMedia.id
        );
        const previousIndex = currentIndex - 1;

        if (previousIndex >= 0) {
          const previousItem = activePlaylist.items[previousIndex];
          // TODO: Buscar el archivo de medios y cargarlo
          console.log('Reproducir anterior:', previousItem.mediaFileId);
        }
      },

      // Presentación
      updatePresentationConfig: (updates: Partial<PresentationConfig>) => {
        set(state => ({
          presentationConfig: {
            ...state.presentationConfig,
            ...updates,
          },
        }));
      },

      startPresentation: (mediaFile: MediaFile) => {
        set({
          currentMedia: mediaFile,
          playbackState: {
            ...defaultPlaybackState,
            isLoading: true,
            isFullscreen: true,
          },
        });
      },

      stopPresentation: () => {
        set({
          currentMedia: null,
          playbackState: defaultPlaybackState,
        });
      },

      // Búsqueda
      searchMedia: (filter: MediaFilter) => {
        // TODO: Implementar lógica de búsqueda real
        set(state => {
          const allFiles = state.library.collections.flatMap(collection => collection.files);
          
          // Búsqueda simple por nombre
          let filteredFiles = allFiles;
          if (filter.searchQuery) {
            filteredFiles = allFiles.filter(file =>
              file.name.toLowerCase().includes(filter.searchQuery!.toLowerCase()) ||
              file.metadata.title?.toLowerCase().includes(filter.searchQuery!.toLowerCase())
            );
          }

          return {
            searchResults: {
              files: filteredFiles,
              totalCount: filteredFiles.length,
              hasMore: false,
              filters: filter,
              sortBy: 'name',
              sortOrder: 'asc',
            },
            currentFilter: filter,
          };
        });
      },

      clearSearch: () => {
        set({
          searchResults: null,
          currentFilter: {},
        });
      },

      setFilter: (filter: Partial<MediaFilter>) => {
        set(state => ({
          currentFilter: {
            ...state.currentFilter,
            ...filter,
          },
        }));
      },

      // Estadísticas
      recordPlayback: (fileId: string, duration: number) => {
        set(state => {
          const existingStats = state.mediaStats[fileId];
          const updatedStats: MediaStats = {
            fileId,
            timesPlayed: (existingStats?.timesPlayed || 0) + 1,
            totalPlayTime: (existingStats?.totalPlayTime || 0) + duration,
            lastPlayed: new Date(),
            averageWatchTime: 0, // TODO: Calcular basado en duración total del archivo
            popularSegments: existingStats?.popularSegments || [],
          };

          return {
            mediaStats: {
              ...state.mediaStats,
              [fileId]: updatedStats,
            },
          };
        });
      },

      getMediaStats: (fileId: string) => {
        return get().mediaStats[fileId];
      },
    }),
    {
      name: 'media-store',
      partialize: (state) => ({
        library: state.library,
        playlists: state.playlists,
        presentationConfig: state.presentationConfig,
        mediaStats: state.mediaStats,
        // No persistir estados de reproducción activos
      }),
    }
  )
);