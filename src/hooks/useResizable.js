import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useResizable - Custom hook for panel resizing functionality
 * @param {number} defaultWidth - Default width in pixels
 * @param {number} minWidth - Minimum width in pixels
 * @param {number} maxWidth - Maximum width in pixels
 * @param {Function} onCollapse - Optional callback when width goes below collapse threshold
 * @param {number} collapseThreshold - Width threshold to trigger auto-collapse (default: 120)
 * @returns {Object} - { width, isResizing, startResize }
 */
export default function useResizable(defaultWidth = 256, minWidth = 200, maxWidth = 600, onCollapse = null, collapseThreshold = 120) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(defaultWidth);

  const handleMouseMove = useCallback((e) => {
    const delta = e.clientX - startXRef.current;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + delta));
    setWidth(newWidth);
  }, [minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    // Check if we should auto-collapse
    if (onCollapse && width < collapseThreshold) {
      onCollapse();
    }
  }, [width, collapseThreshold, onCollapse]);

  const startResize = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  }, [width]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return { width, isResizing, startResize };
}
