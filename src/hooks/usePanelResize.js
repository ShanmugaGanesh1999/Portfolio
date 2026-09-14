import { useState, useCallback, useRef } from "react";

/**
 * usePanelResize — Pointer-based panel resizing that works with mouse, touch,
 * and pen via setPointerCapture.
 *
 * The returned `handlers` (onPointerMove/onPointerUp/onPointerCancel) must be
 * spread onto the SAME element that receives onPointerDown={startResize};
 * pointer capture keeps the events flowing to it for the whole drag.
 *
 * @param {Object} opts
 * @param {"x"|"y"} opts.axis        - Resize axis ("x" for side panels, "y" for bottom panels)
 * @param {boolean} opts.invert      - true when the panel grows as the pointer moves toward 0
 *                                     (right-anchored chat panel, bottom-anchored terminal)
 * @param {number} opts.defaultSize  - Initial size in px
 * @param {number} opts.minSize      - Minimum visible size in px (clamped)
 * @param {number} opts.maxSize      - Maximum size in px (clamped)
 * @param {Function} opts.onCollapse - Called when the drag ends below collapseBelow
 * @param {number} opts.collapseBelow - Raw size under which releasing the drag collapses
 * @returns {{size:number, isResizing:boolean, startResize:Function, handlers:Object, nudge:Function, setSize:Function}}
 */
export default function usePanelResize({
  axis = "x",
  invert = false,
  defaultSize = 256,
  minSize = 200,
  maxSize = 600,
  onCollapse = null,
  collapseBelow = null,
} = {}) {
  const [size, setSizeState] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);

  const isResizingRef = useRef(false);
  const startPosRef = useRef(0);
  const startSizeRef = useRef(defaultSize);
  const rawSizeRef = useRef(defaultSize);
  const collapseRef = useRef(false);

  const clamp = useCallback(
    (v) => Math.max(minSize, Math.min(maxSize, v)),
    [minSize, maxSize]
  );

  const startResize = useCallback(
    (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      isResizingRef.current = true;
      setIsResizing(true);
      collapseRef.current = false;
      startPosRef.current = axis === "x" ? e.clientX : e.clientY;
      startSizeRef.current = size;
      rawSizeRef.current = size;
    },
    [axis, size]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isResizingRef.current) return;
      const pos = axis === "x" ? e.clientX : e.clientY;
      const delta = invert ? startPosRef.current - pos : pos - startPosRef.current;
      const raw = startSizeRef.current + delta;
      rawSizeRef.current = raw;
      collapseRef.current =
        collapseBelow != null && raw < collapseBelow && !!onCollapse;
      setSizeState(clamp(raw));
    },
    [axis, invert, clamp, collapseBelow, onCollapse]
  );

  const endResize = useCallback(
    (e) => {
      if (!isResizingRef.current) return;
      e?.currentTarget?.releasePointerCapture?.(e.pointerId);
      isResizingRef.current = false;
      setIsResizing(false);
      if (collapseRef.current) {
        onCollapse?.();
      } else {
        setSizeState(clamp(rawSizeRef.current));
      }
    },
    [clamp, onCollapse]
  );

  // Keyboard / programmatic adjustment. "grow" moves away from collapse,
  // "shrink" toward it; shrinking past the minimum collapses the panel.
  const nudge = useCallback(
    (direction, step = 24) => {
      if (direction === "min") return setSizeState(minSize);
      if (direction === "max") return setSizeState(maxSize);
      const next = direction === "grow" ? size + step : size - step;
      if (direction === "shrink" && next < minSize) {
        onCollapse?.();
        return;
      }
      setSizeState(clamp(next));
    },
    [size, minSize, maxSize, clamp, onCollapse]
  );

  return {
    size,
    isResizing,
    startResize,
    handlers: { onPointerMove, onPointerUp: endResize, onPointerCancel: endResize },
    nudge,
    setSize: setSizeState,
  };
}
