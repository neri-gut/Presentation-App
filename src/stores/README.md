# 🗃️ State Management - Zustand Stores

Esta carpeta contiene todos los stores de Zustand para gestión de estado global.

## 📂 Organización de Stores

### 🎯 **appStore.ts** - Estado General de la Aplicación

- Configuración global
- Usuario actual
- Idioma/localización
- Tema visual (dark/light)
- Estado de la aplicación

### 📱 **presentationStore.ts** - Estado de Presentación

- Pantallas activas
- Contenido actual en display
- Configuración de múltiples pantallas
- Estado del cronómetro
- Mensajes entre operador/orador

### 📚 **contentStore.ts** - Gestión de Contenido

- Biblioteca de música
- Cánticos cargados
- Publicaciones disponibles
- Versículos guardados
- Estado de descargas

### 🔍 **searchStore.ts** - Búsquedas y Filtros

- Historial de búsquedas bíblicas
- Filtros activos
- Resultados de búsqueda
- Índices de contenido

### ⚙️ **settingsStore.ts** - Configuraciones

- Configuraciones de usuario
- Ajustes de pantallas
- Configuración de plugins
- Preferencias de interfaz

### 🌐 **networkStore.ts** - Estado de Red y Sincronización

- Estado de conectividad
- Progreso de descargas
- Sincronización con jw.org
- Cache de contenido

## 🏗️ Patrón de Store Base

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface StoreState {
  // Estado
}

interface StoreActions {
  // Acciones
}

type Store = StoreState & StoreActions;

export const useStoreExample = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        // Implementación del store
      }),
      {
        name: 'store-name', // Para persistencia
      }
    )
  )
);
```

## 🔗 Integración con Componentes

```tsx
import { useAppStore } from '@/stores/appStore';

function Component() {
  const { state, actions } = useAppStore();

  return (
    // JSX usando estado y acciones
  );
}
```
