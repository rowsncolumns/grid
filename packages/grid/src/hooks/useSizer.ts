import React, { useCallback, useState, useRef, useEffect } from "react";
import { ViewPortProps, GridRef, CellInterface, ItemSizer } from "./../Grid";
import {
  debounce,
  HiddenType,
  isNull,
  autoSizerCanvas,
  castToString,
  cellIdentifier,
} from "./../helpers";
import invariant from "tiny-invariant";

export interface IProps {
  /**
   * Used to access grid functions
   */
  gridRef: React.MutableRefObject<GridRef | null>;
  /**
   * Value getter for a cell
   */
  getValue: (cell: CellInterface) => any;
  /**
   * Visible rows when the grid is first visible, Since we do not know how many rows  can fit
   */
  initialVisibleRows?: number;
  /**
   * Restrict column width by this number
   */
  minColumnWidth?: number;
  /**
   * Cell padding, used for width calculation
   */
  cellSpacing?: number;
  /**
   * Scroll timeout
   */
  timeout?: number;
  /**
   * Calculate width and resize the grid on scroll
   */
  resizeOnScroll?: boolean;
  /**
   * Font used to calculate width
   */
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  /**
   * Strategy used to calculate column width
   * lazy = visible rows
   * full = all rows
   *
   * columns are always lazy
   */
  resizeStrategy?: ResizeStrategy;
  /**
   * No of rows in teh grid
   */
  rowCount?: number;
  /**
   * Enable autoresize
   */
  autoResize?: boolean;
  /**
   * Map of index to size
   */
  columnSizes?: SizeType;
  /**
   * Hidden rows
   */
  isHiddenRow: HiddenType;
  /**
   * Hidden columns
   */
  isHiddenColumn: HiddenType;
  /**
   * Number of frozen rows
   */
  frozenRows?: number;
  /**
   * Current scaling factor
   */
  scale?: number;
  /**
   * Get text value
   */
  getText: (config: any) => string | undefined;
}

export type ResizeStrategy = "lazy" | "full";

export interface AutoResizerResults {
  /**
   * Column width function consumed by the grid
   */
  columnWidth?: ItemSizer;
  /**
   * Callback when viewport is changed
   */
  onViewChange: (cells: ViewPortProps) => void;
  /**
   * Get column width based on resize strategy
   */
  getColumnWidth: (columnIndex: number, scale?: number) => number;
  /**
   * Text size getter
   */
  getTextMetrics: (text: React.ReactText) => TextDimensions;
}

export interface TextDimensions {
  width: number;
  height: number;
}

export type SizeType = {
  [key: number]: number;
};

const defaultGetText = (text: any) => text;

/**
 * Auto sizer hook
 * @param param
 *
 * TODO
 * Dynamically resize columns after user has scrolled down/view port changed ?
 */
const useAutoSizer = ({
  gridRef,
  getValue,
  initialVisibleRows = 20,
  cellSpacing = 10,
  minColumnWidth = 60,
  timeout = 300,
  resizeStrategy = "lazy",
  rowCount,
  resizeOnScroll = true,
  fontFamily = "Arial",
  fontSize = 12,
  fontWeight = "",
  fontStyle = "",
  autoResize = true,
  columnSizes = {},
  frozenRows = 0,
  scale = 1,
  isHiddenRow,
  isHiddenColumn,
  getText = defaultGetText,
}: IProps): AutoResizerResults => {
  invariant(
    !(resizeStrategy === "full" && rowCount === void 0),
    "Row count should be specified if resize stragtegy is full"
  );

  const autoSizer = useRef(autoSizerCanvas);
  const [viewport, setViewport] = useState<ViewPortProps>({
    rowStartIndex: 0,
    rowStopIndex: 0,
    columnStartIndex: 0,
    columnStopIndex: 0,
    visibleRowStartIndex: 0,
    visibleRowStopIndex: 0,
    visibleColumnStartIndex: 0,
    visibleColumnStopIndex: 0,
  });
  const isMounted = useRef(false);
  const getValueRef = useRef<typeof getValue>();
  const viewPortRef = useRef<typeof viewport>();
  const hiddenRowRef = useRef<typeof isHiddenRow>(isHiddenRow);
  const handleResize = useCallback(
    ({ rowIndex, columnIndex }: CellInterface) => {
      gridRef.current &&
        gridRef.current.resetAfterIndices({ rowIndex, columnIndex });
    },
    []
  );
  const debounceResizer = useRef<any>(null);

  useEffect(() => {
    getValueRef.current = getValue;
    viewPortRef.current = viewport;
    hiddenRowRef.current = isHiddenRow;
  });

  useEffect(() => {
    isMounted.current = true;
    debounceResizer.current = debounce(handleResize, timeout);
  }, []);

  /* Update any styles, fonts if necessary */
  useEffect(() => {
    autoSizer.current.setFont({ fontFamily, fontSize, fontWeight, fontStyle });
  }, [fontFamily, fontSize, fontWeight, fontStyle]);

  const getTextMetrics = useCallback((text: React.ReactText) => {
    return autoSizer.current.measureText(castToString(text) as string);
  }, []);

  /**
   * Get width of a single cell
   */
  const getCellWidth = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const cellValue =
        getValueRef.current?.({
          rowIndex,
          columnIndex,
        }) ?? null;
      let width = cellValue?.spacing ?? 0;
      /* Check if its null */
      if (cellValue !== null) {
        const isCellConfig = typeof cellValue === "object";
        const text = getText(cellValue);
        if (cellIdentifier !== void 0 && !isNull(text) && text !== void 0) {
          /* Reset fonts */
          autoSizer.current.reset();

          if (isCellConfig) {
            const isBold = cellValue.bold;
            autoSizer.current.setFont({
              fontWeight: isBold ? "bold" : "",
              fontSize: (cellValue.fontSize || fontSize) * scale,
              fontFamily: cellValue.fontFamily,
              fontStyle: cellValue.italic ? "italic" : "",
            });
          }
          const metrics = autoSizer.current.measureText(text);
          if (metrics) {
            width += Math.ceil(metrics.width) + cellSpacing;
          }
        }
      }
      return width;
    },
    [scale]
  );

  /**
   * Calculate column width
   */
  const getColumnWidth = useCallback(
    (columnIndex: number) => {
      const { rowStartIndex = 0, rowStopIndex = 0 } = viewPortRef.current ?? {};
      const visibleRows =
        resizeStrategy === "full"
          ? (rowCount as number)
          : rowStopIndex || initialVisibleRows;
      let start = resizeStrategy === "full" ? 0 : rowStartIndex;
      let maxWidth = minColumnWidth;

      /* Calculate for frozen rows */
      for (let i = 0; i < frozenRows; i++) {
        if (hiddenRowRef.current?.(i)) {
          continue;
        }
        const width = getCellWidth(i, columnIndex);
        if (width > maxWidth) maxWidth = width;
      }

      /* Loop through all visible rows */
      while (start < visibleRows) {
        if (hiddenRowRef.current?.(start)) {
          start++;
          continue;
        }
        const width = getCellWidth(start, columnIndex);
        if (width > maxWidth) maxWidth = width;
        start++;
      }

      return maxWidth / scale;
    },
    [viewport, initialVisibleRows, frozenRows, scale]
  );

  const handleViewChange = useCallback(
    (cells: ViewPortProps) => {
      /* Update viewport cells */
      setViewport(cells);

      /* Check if viewport has changed */
      if (
        resizeStrategy === "full" ||
        !resizeOnScroll ||
        (cells.rowStartIndex === viewport.rowStartIndex &&
          cells.columnStartIndex === viewport.columnStartIndex)
      )
        return;
      if (gridRef.current) {
        /* During first mount, column width is calculated. Do not re-calculate */
        if (!isMounted.current) return;
        debounceResizer.current({
          rowIndex: cells.rowStartIndex,
          columnIndex: cells.columnStartIndex,
        });
      }
    },
    [resizeOnScroll, viewport, resizeStrategy]
  );

  return {
    ...(autoResize ? { columnWidth: getColumnWidth } : undefined),
    getColumnWidth,
    // getRowHeight,
    onViewChange: handleViewChange,
    getTextMetrics,
  };
};

export default useAutoSizer;
