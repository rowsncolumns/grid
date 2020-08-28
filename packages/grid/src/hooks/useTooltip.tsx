import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { CellInterface, GridRef } from "../Grid";
import { debounce, throttle } from "../helpers";

export interface TooltipOptions {
  /**
   * Tooltip component
   */
  getTooltip?: (cell: CellInterface | null) => React.ElementType | null;
  /**
   * Grid references
   */
  gridRef: React.MutableRefObject<GridRef | null>;
}

export interface TooltipResults {
  /**
   * Tooltip component to inject into the page
   */
  tooltipComponent: React.ReactElement | null;
  /**
   * Mousemove listener to align tooltip
   */
  onMouseMove: ((e: React.MouseEvent<HTMLInputElement>) => void) | undefined;
  /**
   * Mouse leave listener to hide tooltip
   */
  onMouseLeave: ((e: React.MouseEvent<HTMLInputElement>) => void) | undefined;
}

export interface DefaultTooltipProps {
  /**
   * Tooltip x position
   */
  x?: number;
  /**
   * Tooltip y position
   */
  y?: number;
  width?: number;
  height?: number;
  scrollLeft?: number;
  scrollTop?: number;
}

const DefaultTooltipComponent: React.FC<DefaultTooltipProps> = ({
  x = 0,
  y = 0,
  scrollLeft = 0,
  scrollTop = 0,
  width = 0,
  height = 0,
}) => {
  const posX = x + width - scrollLeft;
  const posY = y - scrollTop;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${posX}px, ${posY}px)`,
        maxWidth: 200,
        minWidth: 160,
        background: "white",
        boxShadow: "0 4px 8px 3px rgba(60,64,67,.15)",
        padding: 12,
        borderRadius: 4,
        fontSize: 13,
      }}
    >
      {x}
    </div>
  );
};

const getDefaultTooltip = () => DefaultTooltipComponent;

const useTooltip = ({
  gridRef,
  getTooltip = getDefaultTooltip,
}: TooltipOptions): TooltipResults => {
  const [activeCell, setActiveCell] = useState<CellInterface | null>(null);
  const isTooltipActive = useRef(false);
  const activeCellRef = useRef(activeCell);
  const [tooltipPosition, setTooltipPosition] = useState<
    Pick<
      DefaultTooltipProps,
      "x" | "y" | "width" | "height" | "scrollLeft" | "scrollTop"
    >
  >({});
  const showTooltip = !!activeCell;
  const TooltipComponent = useMemo(() => {
    return getTooltip(activeCell);
  }, [activeCell, getTooltip]);

  const handleTooltipMouseEnter = useCallback(() => {
    isTooltipActive.current = true;
  }, []);
  const handleTooltipMouseLeave = useCallback(() => {
    isTooltipActive.current = false;
    setActiveCell(null);
  }, []);

  const tooltipComponent =
    showTooltip && TooltipComponent ? (
      <TooltipComponent
        {...tooltipPosition}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      />
    ) : null;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!gridRef.current) return;
    const coords = gridRef.current.getCellCoordsFromOffset(
      e.clientX,
      e.clientY
    );

    if (!coords) return;
    const { rowIndex, columnIndex } = coords;
    /* Exit if its the same cell */
    if (
      activeCellRef.current &&
      activeCellRef.current.rowIndex === rowIndex &&
      activeCellRef.current.columnIndex === columnIndex
    )
      return;

    const pos = gridRef.current.getCellOffsetFromCoords(coords);
    const scrollPosition = gridRef.current.getScrollPosition();
    setTooltipPosition({
      ...pos,
      ...scrollPosition,
    });
    setActiveCell({ rowIndex, columnIndex });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isTooltipActive.current) return;
    setActiveCell(null);
  }, []);

  /* Raf throttler */
  const mouseMoveThrottler = useRef<
    (e: React.MouseEvent<HTMLElement>) => void
  >();
  const mouseLeaveThrottler = useRef<() => void>();
  useEffect(() => {
    mouseMoveThrottler.current = throttle(handleMouseMove, 100);
    mouseLeaveThrottler.current = debounce(handleMouseLeave, 2000);
  }, []);

  /* Update activecell ref */
  useEffect(() => {
    activeCellRef.current = activeCell;
  }, [activeCell]);

  return {
    tooltipComponent,
    onMouseMove: mouseMoveThrottler.current,
    onMouseLeave: mouseLeaveThrottler.current,
  };
};

export default useTooltip;
