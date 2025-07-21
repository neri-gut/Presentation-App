# 📱 Estructura de Pantallas - Multimedia Presentation App

Esta carpeta contiene todas las pantallas (35 total) organizadas por categorías según el análisis de
mockups.

## 📂 Organización de Carpetas

### 🏠 **main/** - Pantallas Principales (8 pantallas)

1. `Dashboard.tsx` - Hub central con widgets de acceso rápido
2. `SetupInicial.tsx` - Configuración primera vez (idioma, pantallas)
3. `PanelControlOperador.tsx` - Interface principal para operador técnico
4. `PantallaAudiencia.tsx` - Display para público general
5. `PantallaOrador.tsx` - Monitor exclusivo para presentador
6. `VistaPreviaPantallas.tsx` - Monitor en tiempo real de todas las pantallas
7. `ModoEmergencia.tsx` - Interface simplificada para crisis técnicas
8. `ModoKiosco.tsx` - Interface pública simplificada

### 📚 **content/** - Biblioteca de Contenido (6 pantallas)

9. `BibliotecaMusica.tsx` - Gestión de cánticos y música instrumental
10. `BibliotecaCanticos.tsx` - Cancionero "Cantemos a Jehová"
11. `BibliotecaReuniones.tsx` - Programa semanal y materiales
12. `BibliotecaPublicaciones.tsx` - Revistas, libros, folletos
13. `ComparadorBiblias.tsx` - Vista paralela de traducciones
14. `GestionDescargas.tsx` - Control de descargas activas

### 📖 **bible/** - Sección Bíblica (3 pantallas)

15. `BuscadorBiblico.tsx` - Motor búsqueda avanzado textos
16. `VisorVersiculos.tsx` - Editor con previsualización
17. `ListaVersiculosGuardados.tsx` - Gestión de versículos preparados

### 🌐 **browser/** - Navegador Integrado (1 pantalla)

18. `NavegadorWeb.tsx` - Browser para wol.jw.org y jw.org

### 🎮 **controls/** - Controles Presentación (4 pantallas)

19. `CronometroAvanzado.tsx` - Sistema temporización múltiple
20. `MensajeriaOrador.tsx` - Comunicación con presentador
21. `SidebarControles.tsx` - Barra lateral flotante con controles
22. `ConfiguradorPantallas.tsx` - Setup gestión múltiples displays

### ⚙️ **config/** - Configuración (7 pantallas)

23. `ConfiguracionGeneral.tsx` - Ajustes principales aplicación
24. `GestionUsuarios.tsx` - Sistema roles y permisos
25. `ConfiguracionContenido.tsx` - Fuentes datos y sincronización
26. `SistemaPlugins.tsx` - Gestión extensiones
27. `EditorTemas.tsx` - Personalización visual
28. `TemplatesPresentacion.tsx` - Diseñador layouts diapositivas
29. `CentroDiagnostico.tsx` - Troubleshooting y reparación

### 🌍 **translation/** - Traducción (3 pantallas)

30. `EditorTraducciones.tsx` - Interface traducir aplicación
31. `GestionIdiomas.tsx` - Administración idiomas disponibles
32. `PanelTraductor.tsx` - Workspace dedicado traductores

### 📊 **stats/** - Estadísticas (3 pantallas)

33. `DashboardStats.tsx` - Métricas uso y rendimiento
34. `RegistroActividades.tsx` - Log completo actividades sistema
35. `AsistenteConfiguracion.tsx` - Wizard setup automático

## 🎯 Priorización de Desarrollo

### MVP - FASE 1 (12 Pantallas Críticas)

- main/Dashboard.tsx
- main/SetupInicial.tsx
- main/PanelControlOperador.tsx
- main/PantallaAudiencia.tsx
- main/PantallaOrador.tsx
- bible/BuscadorBiblico.tsx
- bible/VisorVersiculos.tsx
- bible/ListaVersiculosGuardados.tsx
- content/BibliotecaMusica.tsx
- controls/CronometroAvanzado.tsx
- config/ConfiguracionGeneral.tsx
- main/ModoEmergencia.tsx

### FASE 2 (12 Pantallas Funcionales)

### FASE 3 (11 Pantallas Avanzadas)

## 🔧 Convenciones de Naming

- **PascalCase** para componentes React
- **Descriptivo** basado en funcionalidad
- **Sufijo** .tsx para componentes TypeScript React
- **Prefijo** por categoría clara

## 📝 Estructura de cada pantalla

```tsx
// Ejemplo: pages/main/Dashboard.tsx
export interface DashboardProps {
  // Props específicas
}

export default function Dashboard({ ...props }: DashboardProps) {
  // Implementación
  return <div>{/* UI del Dashboard */}</div>;
}
```
