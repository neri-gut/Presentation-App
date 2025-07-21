# Multimedia Presentation App

Aplicación multiplataforma para gestionar y presentar contenido multimedia religioso en múltiples pantallas durante reuniones y presentaciones.

## 🚀 Inicio Rápido

### Prerrequisitos

1. **Node.js** (v18 o superior)
2. **pnpm** (gestor de paquetes)
3. **Rust** (para Tauri)
4. **Dependencias del sistema** (Linux)

### Instalación de Dependencias del Sistema (Linux)

```bash
# Actualizar repositorios
sudo apt update

# Instalar dependencias principales de Tauri
sudo apt install -y \
  libdbus-1-dev \
  libgtk-3-dev \
  libsoup-3.0-dev \
  libwebkit2gtk-4.1-dev \
  libjavascriptcoregtk-4.1-dev

# Verificar instalación
apt list --installed | grep -E "libdbus-1-dev|libgtk-3-dev|libsoup-3.0|libwebkit2gtk-4.1|libjavascriptcore"
```

### Configuración de Rust

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Cargar variables de entorno
source "$HOME/.cargo/env"

# Verificar instalación
cargo --version
rustc --version
```

### Instalación de Dependencias del Proyecto

```bash
# Navegar al directorio del proyecto
cd /home/neri/Documentos/Proyectos/Desktop-Presentation-App/Presentation-App

# Instalar dependencias de Node.js
pnpm install
```

## 🛠️ Comandos de Desarrollo

### Ejecutar en Modo Desarrollo (Tauri + Vite)

```bash
# Desarrollo completo con ventana nativa
pnpm dev

# Alternativa: Solo frontend en navegador
pnpm start  # Luego abrir http://localhost:3001
```

### Construcción y Compilación

```bash
# Build del frontend solamente
pnpm build

# Build completo de la aplicación nativa (Tauri)
pnpm tauri build

# Limpiar cache de Rust (si hay problemas)
cd src-tauri && cargo clean && cd ..
```

### Comandos de Testing

```bash
# Servir build en servidor local
python3 -m http.server 3002 -d build
# Luego abrir http://localhost:3002

# Verificar estado de Tauri
pnpm tauri info
```

## 🔧 Solución de Problemas Comunes

### Error: "System limit for number of file watchers reached"

```bash
# Aumentar límite de file watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Verificar aplicación
sysctl fs.inotify.max_user_watches
```

### Error: "Can't find variable: React"

Este es un error menor del error boundary, no afecta la funcionalidad principal.

### Error: "The system library `libsoup-3.0` was not found"

```bash
# Instalar dependencia faltante
sudo apt install libsoup-3.0-dev
```

### Ventana de Tauri se abre pero no muestra contenido

```bash
# Verificar que Vite esté corriendo en puerto correcto
# El archivo src-tauri/tauri.conf.json debe tener:
# "devUrl": "http://localhost:3001"
```

### Aplicación lenta en modo desarrollo

**Es normal que esté lenta en `pnpm dev`**. Tauri en desarrollo tiene que:
- Compilar Rust en tiempo real
- Ejecutar Vite con hot reload
- Sincronizar cambios entre Rust y React
- Renderizar en WebView nativo

**Soluciones:**
```bash
# Para mejor rendimiento, usar build de producción
pnpm build
python3 -m http.server 3002 -d build

# O compilar aplicación nativa completa (más rápida)
pnpm tauri build
```

## 📋 Estructura del Proyecto

```
src/
├── pages/
│   ├── main/
│   │   ├── Dashboard.tsx          # Dashboard principal
│   │   └── widgets/               # Widgets del dashboard
│   │       ├── SimpleTimerWidget.tsx      # Cronómetro avanzado
│   │       ├── QuickActionsWidget.tsx     # Acciones rápidas
│   │       ├── SystemStatusWidget.tsx     # Estado del sistema
│   │       └── ...                        # Otros widgets
│   └── speaker/
│       └── SpeakerDisplay.tsx     # Pantalla del orador (Display #3)
├── stores/
│   ├── appStore.ts               # Store principal de la aplicación
│   └── meetingStore.ts           # Store de reuniones y cronómetro
├── types/
│   ├── dashboard.ts              # Tipos para dashboard
│   └── meeting.ts                # Tipos para reuniones y cronómetro
└── ...
```

## 🎯 Funcionalidades Principales

### Dashboard Central
- **Acciones rápidas** con shortcuts
- **Estado del sistema** en tiempo real
- **Presentaciones recientes** con metadata
- **Reuniones programadas** con estado de preparación
- **Biblioteca de contenido** con estadísticas
- **Vista previa de pantallas** múltiples
- **Centro de notificaciones** del sistema

### Cronómetro Avanzado
- ⏱️ **Plantillas de reunión** predefinidas (Entre semana / Fin de semana)
- 🎯 **Navegación por secciones** automática
- 🚨 **Alertas visuales** por proximidad al final (normal → warning → critical → overtime)
- 📊 **Indicador de varianza** (atraso/adelanto general)
- ⏯️ **Controles completos**: Iniciar, Pausar, Detener, Reset, Saltar sección
- 🕐 **Información en tiempo real**: Hora actual, tiempo restante, fin estimado

### Pantalla del Orador (Display #3)
- 🖥️ **Pantalla fullscreen** para orador en segunda pantalla
- ⏰ **Tiempo de sección actual** con tipografía grande y clara
- 🎨 **Efectos visuales** para alertas críticas y overtime
- 📱 **Información secundaria**: Hora actual, tiempo restante de reunión
- 🔗 **Acceso directo** desde el modal de configuración del cronómetro

## 🌐 URLs y Rutas

- **Dashboard Principal**: `/dashboard` o `/`
- **Pantalla del Orador**: `/speaker-display` (para segunda pantalla)
- **Desarrollo**: `http://localhost:3001/`
- **Build Local**: `http://localhost:3002/` (con python server)

## 📖 Uso del Cronómetro

1. **Seleccionar Plantilla**:
   - Abrir configuración del cronómetro (⚙️)
   - Elegir "Reunión Entre Semana" o "Reunión Fin de Semana"
   
2. **Iniciar Reunión**:
   - Hacer clic en "Iniciar" para comenzar cronómetro
   - El timer se actualiza cada segundo
   - Las alertas cambian automáticamente por color
   
3. **Pantalla del Orador**:
   - Hacer clic en "Abrir Pantalla Orador"
   - Mover la ventana a segunda pantalla
   - Poner en pantalla completa (F11)

4. **Navegación**:
   - Usar botones ◀ ▶ para cambiar secciones manualmente
   - Botón ⏭️ para saltar sección durante reunión activa
   - Reset ↻ para reiniciar completamente

## 🔄 Estados del Cronómetro

- **🟢 Normal**: Tiempo suficiente (>60 segundos restantes)
- **🟡 Warning**: Advertencia (≤60 segundos restantes)  
- **🔴 Critical**: Crítico (≤30 segundos restantes)
- **⚫ Overtime**: Tiempo excedido (≤0 segundos)

## ✅ Estado Actual del Proyecto (21 Enero 2025)

### **Completado y Funcionando:**
- [x] **Dashboard principal** con 8 widgets funcionales
- [x] **Cronómetro avanzado** con plantillas de reunión predefinidas
- [x] **Pantalla del orador** (`/speaker-display`) en modo fullscreen  
- [x] **Alertas visuales** por proximidad al final del tiempo
- [x] **Navegación entre secciones** automática y manual
- [x] **Persistencia de datos** con Zustand store
- [x] **Aplicación Tauri nativa** funcionando en Linux
- [x] **Sistema de tipos TypeScript** completo
- [x] **Documentación técnica** completa

### **Arquitectura de Pantallas Implementada:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   PANTALLA 1    │  │   PANTALLA 2    │  │   PANTALLA 3    │
│   (Operador)    │  │   (Audiencia)   │  │    (Orador)     │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ Dashboard       │  │ Contenido       │  │ Cronómetro      │
│ + Aside Timer   │  │ Multimedia      │  │ Grande          │
│ (Control Total) │  │ (Pendiente)     │  │ (Funcionando)   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### **Funcionalidades del Cronómetro:**
- ⏱️ **Timer en tiempo real** con actualización cada segundo
- 📋 **Plantillas predefinidas**: Entre semana (12 secciones), Fin de semana (7 secciones)
- 🚨 **4 estados visuales**: Normal (azul) → Warning (naranja) → Critical (rojo) → Overtime (rojo brillante)
- 🎛️ **Controles completos**: Iniciar, Pausar, Detener, Reset, Navegación manual
- 📊 **Información en tiempo real**: Hora actual, tiempo restante, fin estimado, varianza
- 🖥️ **Pantalla del orador**: Apertura automática en nueva ventana/pestaña

## 🚧 Próximos Desarrollos Priorizados

### **Prioridad Alta - Arquitectura**
- [ ] **Mover cronómetro al sidebar** derecho del Dashboard (Aside)
- [ ] **Detección automática de pantallas** con API de Tauri
- [ ] **Auto-apertura pantalla orador** cuando se conecte 3ra pantalla
- [ ] **Optimización de rendimiento** para modo desarrollo

### **Prioridad Media - Funcionalidades**
- [ ] **Sistema de presentación multimedia** (videos/imágenes)
- [ ] **Reportes detallados** de tiempo por sección con variaciones
- [ ] **Sistema de usuarios** con configuraciones personales
- [ ] **GitHub Actions** para actualización automática de plantillas JW.org

### **Prioridad Baja - Mejoras**
- [ ] **Optimización de componentes** React (memo, lazy loading)
- [ ] **Testing automatizado** para cronómetro y funcionalidades críticas
- [ ] **Accesibilidad mejorada** con shortcuts de teclado
- [ ] **Temas personalizados** y configuración de colores

## 🐛 Reportar Problemas

Si encuentras algún problema:

1. Verifica que todas las dependencias estén instaladas
2. Revisa los logs en la terminal
3. Intenta limpiar cache: `cd src-tauri && cargo clean`
4. Consulta la sección de solución de problemas arriba

## 📄 Licencia

Copyright (c) 2025 Multimedia Presentation App. Ver [LICENSE.md](./LICENSE.md) para más detalles.

---

**Última actualización**: 21 de Enero 2025