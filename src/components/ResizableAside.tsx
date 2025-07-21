import { useState, useRef, useCallback, useEffect } from 'react';

interface ResizableAsideProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  className?: string;
}

export function ResizableAside({ 
  children, 
  initialWidth = 350, 
  minWidth = 250,
  className 
}: ResizableAsideProps) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const getMaxWidth = useCallback(() => {
    return Math.floor(window.innerWidth * 0.75);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = width;
    const maxWidth = getMaxWidth();

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX;
      const newWidth = startWidth + deltaX;
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

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isResizing]);

  return (
    <div
      className={className}
      style={{ 
        width: `${width}px`,
        minWidth: `${minWidth}px`,
        height: '100%',
        background: 'var(--mantine-color-body)',
        borderLeft: '1px solid var(--mantine-color-gray-3)',
        position: 'relative',
        flexShrink: 0
      }}
    >
      {/* Handle de redimensionamiento */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          left: '-5px',
          top: 0,
          bottom: 0,
          width: '10px',
          cursor: 'col-resize',
          background: isResizing ? '#228be6' : 'transparent',
          zIndex: 1000,
          borderRadius: '0 4px 4px 0'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#228be6';
          e.currentTarget.style.opacity = '0.7';
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      />
      
      {/* Contenido */}
      <div style={{ padding: '16px', height: '100%', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}