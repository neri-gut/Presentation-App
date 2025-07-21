import { useState, useCallback, useRef, useEffect } from 'react';

interface UseResizableAsideOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidthPercent?: number; // Porcentaje de la pantalla (0.75 = 75%)
}

export function useResizableAside({
  initialWidth = 350,
  minWidth = 250,
  maxWidthPercent = 0.75
}: UseResizableAsideOptions = {}) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const getMaxWidth = useCallback(() => {
    return Math.floor(window.innerWidth * maxWidthPercent);
  }, [maxWidthPercent]);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = width;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX.current - e.clientX;
      const newWidth = startWidth.current + deltaX;
      const maxWidth = getMaxWidth();
      const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      setWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width, minWidth, getMaxWidth]);

  // Manejar cursor global durante resize
  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Ajustar ancho si cambia el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      const maxWidth = getMaxWidth();
      setWidth(prev => Math.min(prev, maxWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getMaxWidth]);

  // Componente del handle de resize
  const ResizeHandle = () => (
    <div
      onMouseDown={startResize}
      style={{
        position: 'absolute',
        left: '-5px',
        top: 0,
        bottom: 0,
        width: '10px',
        cursor: 'col-resize',
        zIndex: 1000,
        background: 'transparent',
        borderRadius: '0 4px 4px 0',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(34, 139, 230, 0.7)';
      }}
      onMouseLeave={(e) => {
        if (!isResizing) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
      title="Arrastra para redimensionar"
    />
  );

  return {
    width,
    isResizing,
    ResizeHandle,
    asideProps: {
      width: { base: width, sm: width, md: width, lg: width },
      style: { position: 'relative' }
    }
  };
}