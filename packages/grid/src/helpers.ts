// Utilities extracted from https://github.com/bvaughn/react-window
import {
  ItemSizer,
  InstanceInterface,
  AreaProps,
  CellInterface,
  CellMetaData,
  SelectionArea,
} from "./Grid";
import { Direction, KeyCodes } from "./types";

export enum Align {
  start = "start",
  end = "end",
  center = "center",
  auto = "auto",
  smart = "smart",
}

export enum ItemType {
  row = "row",
  column = "column",
}

export interface IItemMetaData {
  itemType: ItemType;
  offset: number;
  index: number;
  rowCount: number;
  columnCount: number;
  rowHeight: ItemSizer;
  columnWidth: ItemSizer;
  instanceProps: InstanceInterface;
  scale: number;
}

export const getRowStartIndexForOffset = ({
  rowHeight,
  columnWidth,
  rowCount,
  columnCount,
  instanceProps,
  offset,
  scale,
}: Omit<IItemMetaData, "index" | "itemType">): number => {
  return findNearestItem({
    itemType: ItemType.row,
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    instanceProps,
    offset,
    scale,
  });
};

interface IRowStopIndex
  extends Omit<IItemMetaData, "itemType" | "index" | "offset" | "columnCount"> {
  startIndex: number;
  containerHeight: number;
  scrollTop: number;
}
export const getRowStopIndexForStartIndex = ({
  startIndex,
  rowCount,
  rowHeight,
  columnWidth,
  scrollTop,
  containerHeight,
  instanceProps,
  scale,
}: IRowStopIndex): number => {
  const itemMetadata = getItemMetadata({
    itemType: ItemType.row,
    rowHeight,
    columnWidth,
    index: startIndex,
    instanceProps,
    scale,
  });
  const maxOffset = scrollTop + containerHeight;

  let offset = itemMetadata.offset + itemMetadata.size;
  let stopIndex = startIndex;

  while (stopIndex < rowCount - 1 && offset < maxOffset) {
    stopIndex++;
    offset += getItemMetadata({
      itemType: ItemType.row,
      rowHeight,
      columnWidth,
      index: stopIndex,
      instanceProps,
      scale,
    }).size;
  }

  return stopIndex;
};

export const getColumnStartIndexForOffset = ({
  rowHeight,
  columnWidth,
  rowCount,
  columnCount,
  instanceProps,
  offset,
  scale,
}: Omit<IItemMetaData, "index" | "itemType">): number => {
  return findNearestItem({
    itemType: ItemType.column,
    rowHeight,
    columnWidth,
    rowCount,
    columnCount,
    instanceProps,
    offset,
    scale,
  });
};

interface IColumnStopIndex
  extends Omit<IItemMetaData, "itemType" | "index" | "offset" | "rowCount"> {
  startIndex: number;
  containerWidth: number;
  scrollLeft: number;
}
export const getColumnStopIndexForStartIndex = ({
  startIndex,
  rowHeight,
  columnWidth,
  instanceProps,
  containerWidth,
  scrollLeft,
  columnCount,
  scale,
}: IColumnStopIndex): number => {
  const itemMetadata = getItemMetadata({
    itemType: ItemType.column,
    index: startIndex,
    rowHeight,
    columnWidth,
    instanceProps,
    scale,
  });
  const maxOffset = scrollLeft + containerWidth;

  let offset = itemMetadata.offset + itemMetadata.size;
  let stopIndex = startIndex;

  while (stopIndex < columnCount - 1 && offset < maxOffset) {
    stopIndex++;
    offset += getItemMetadata({
      itemType: ItemType.column,
      rowHeight,
      columnWidth,
      index: stopIndex,
      instanceProps,
      scale,
    }).size;
  }

  return stopIndex;
};

export const getBoundedCells = (area: AreaProps | null | undefined) => {
  const cells = new Set();
  if (!area) return cells;
  const { top, bottom, left, right } = area;
  for (let i = top; i <= bottom; i++) {
    for (let j = left; j <= right; j++) {
      cells.add(cellIdentifier(i, j));
    }
  }
  return cells;
};

export const itemKey = ({ rowIndex, columnIndex }: CellInterface) =>
  `${rowIndex}:${columnIndex}`;

export const getRowOffset = ({
  index,
  rowHeight,
  columnWidth,
  instanceProps,
  scale,
}: Omit<IGetItemMetadata, "itemType">): number => {
  return getItemMetadata({
    itemType: ItemType.row,
    index,
    rowHeight,
    columnWidth,
    instanceProps,
    scale,
  }).offset;
};

export const getColumnOffset = ({
  index,
  rowHeight,
  columnWidth,
  instanceProps,
  scale,
}: Omit<IGetItemMetadata, "itemType">): number => {
  return getItemMetadata({
    itemType: ItemType.column,
    index,
    rowHeight,
    columnWidth,
    instanceProps,
    scale,
  }).offset;
};

export const getRowHeight = (
  index: number,
  instanceProps: InstanceInterface
) => {
  return instanceProps.rowMetadataMap[index].size;
};

export const getColumnWidth = (
  index: number,
  instanceProps: InstanceInterface
) => {
  return instanceProps.columnMetadataMap[index].size;
};

interface IGetItemMetadata
  extends Pick<
    IItemMetaData,
    | "itemType"
    | "index"
    | "rowHeight"
    | "columnWidth"
    | "instanceProps"
    | "scale"
  > {}
export const getItemMetadata = ({
  itemType,
  index,
  rowHeight,
  columnWidth,
  instanceProps,
  scale = 2,
}: IGetItemMetadata): CellMetaData => {
  let itemMetadataMap, itemSize, lastMeasuredIndex, recalcIndices: number[];
  if (itemType === "column") {
    itemMetadataMap = instanceProps.columnMetadataMap;
    itemSize = columnWidth;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
    recalcIndices = instanceProps.recalcColumnIndices;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    itemSize = rowHeight;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
    recalcIndices = instanceProps.recalcRowIndices;
  }
  const recalcWithinBoundsOnly = recalcIndices.length > 0;
  if (index > lastMeasuredIndex) {
    let offset = 0;
    if (lastMeasuredIndex >= 0) {
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }

    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      // Only recalculates specified columns
      let size = recalcWithinBoundsOnly
        ? recalcIndices.includes(i)
          ? itemSize(i) * scale
          : itemMetadataMap[i]?.size || itemSize(i) * scale
        : itemSize(i) * scale;

      itemMetadataMap[i] = {
        offset,
        size,
      };

      offset += size;
    }

    if (itemType === "column") {
      instanceProps.lastMeasuredColumnIndex = index;
    } else {
      instanceProps.lastMeasuredRowIndex = index;
    }
  }

  return itemMetadataMap[index];
};

const findNearestItem = ({
  itemType,
  rowHeight,
  columnWidth,
  rowCount,
  columnCount,
  instanceProps,
  offset,
  scale,
}: Omit<IItemMetaData, "index">): number => {
  let itemMetadataMap, lastMeasuredIndex;
  if (itemType === "column") {
    itemMetadataMap = instanceProps.columnMetadataMap;
    lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
  } else {
    itemMetadataMap = instanceProps.rowMetadataMap;
    lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
  }

  const lastMeasuredItemOffset =
    lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;
  if (lastMeasuredItemOffset >= offset) {
    // If we've already measured items within this range just use a binary search as it's faster.
    return findNearestItemBinarySearch({
      itemType,
      rowHeight,
      columnWidth,
      instanceProps,
      high: lastMeasuredIndex,
      low: 0,
      offset,
      scale,
    });
  } else {
    // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
    // The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
    // The overall complexity for this approach is O(log n).
    return findNearestItemExponentialSearch({
      itemType,
      rowHeight,
      rowCount,
      columnCount,
      columnWidth,
      instanceProps,
      index: Math.max(0, lastMeasuredIndex),
      offset,
      scale,
    });
  }
};

interface IBinarySearchArgs
  extends Omit<IItemMetaData, "index" | "rowCount" | "columnCount"> {
  high: number;
  low: number;
}
const findNearestItemBinarySearch = ({
  itemType,
  rowHeight,
  columnWidth,
  instanceProps,
  high,
  low,
  offset,
  scale,
}: IBinarySearchArgs): number => {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const currentOffset = getItemMetadata({
      itemType,
      rowHeight,
      columnWidth,
      index: middle,
      instanceProps,
      scale,
    }).offset;

    if (currentOffset === offset) {
      return middle;
    } else if (currentOffset < offset) {
      low = middle + 1;
    } else if (currentOffset > offset) {
      high = middle - 1;
    }
  }

  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};

const findNearestItemExponentialSearch = ({
  itemType,
  rowHeight,
  columnWidth,
  rowCount,
  columnCount,
  instanceProps,
  index,
  offset,
  scale,
}: IItemMetaData) => {
  const itemCount = itemType === "column" ? columnCount : rowCount;
  let interval = 1;

  while (
    index < itemCount &&
    getItemMetadata({
      itemType,
      rowHeight,
      columnWidth,
      index,
      instanceProps,
      scale,
    }).offset < offset
  ) {
    index += interval;
    interval *= 2;
  }

  return findNearestItemBinarySearch({
    itemType,
    rowHeight,
    columnWidth,
    instanceProps,
    high: Math.min(index, itemCount - 1),
    low: Math.floor(index / 2),
    offset,
    scale,
  });
};

export const getEstimatedTotalHeight = (
  rowCount: number,
  instanceProps: InstanceInterface
) => {
  const { estimatedRowHeight } = instanceProps;
  let totalSizeOfMeasuredRows = 0;
  let { lastMeasuredRowIndex, rowMetadataMap } = instanceProps;

  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredRowIndex >= rowCount) {
    lastMeasuredRowIndex = rowCount - 1;
  }

  if (lastMeasuredRowIndex >= 0) {
    const itemMetadata = rowMetadataMap[lastMeasuredRowIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }

  const numUnmeasuredItems = rowCount - lastMeasuredRowIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedRowHeight;

  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

export const getEstimatedTotalWidth = (
  columnCount: number,
  instanceProps: InstanceInterface
) => {
  const { estimatedColumnWidth } = instanceProps;
  let totalSizeOfMeasuredRows = 0;
  let { lastMeasuredColumnIndex, columnMetadataMap } = instanceProps;
  // Edge case check for when the number of items decreases while a scroll is in progress.
  // https://github.com/bvaughn/react-window/pull/138
  if (lastMeasuredColumnIndex >= columnCount) {
    lastMeasuredColumnIndex = columnCount - 1;
  }

  if (lastMeasuredColumnIndex >= 0) {
    const itemMetadata = columnMetadataMap[lastMeasuredColumnIndex];
    totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
  }

  const numUnmeasuredItems = columnCount - lastMeasuredColumnIndex - 1;
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedColumnWidth;

  return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

/* Create a stringified cell identifier */
export const cellIdentifier = (rowIndex: number, columnIndex: number): string =>
  `${rowIndex},${columnIndex}`;

/**
 * @desc Throttle fn
 * @param func function
 * @param limit Delay in milliseconds
 */
export function throttle<T extends Function>(func: T, limit: number) {
  var lastEventTimestamp: number | null = null;
  let callable = (...args: any) => {
    const now = Date.now();
    if (!lastEventTimestamp || now - lastEventTimestamp >= limit) {
      lastEventTimestamp = now;
      func(...args);
    }
  };
  return <T>(<any>callable);
}

export function debounce<T extends Function>(cb: T, wait = 300) {
  let h = 0;
  let callable = (...args: any) => {
    clearTimeout(h);
    h = window.setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

export function rafThrottle(callback: Function) {
  var active = false; // a simple flag
  var evt: any; // to keep track of the last event
  var handler = function () {
    // fired only when screen has refreshed
    active = false; // release our flag
    callback(evt);
  };
  return function handleEvent(e: any) {
    // the actual event handler
    evt = e; // save our event at each call
    evt && evt.persist && evt.persist();
    if (!active) {
      // only if we weren't already doing it
      active = true; // raise the flag
      requestAnimationFrame(handler); // wait for next screen refresh
    }
  };
}

export interface AlignmentProps extends Omit<IItemMetaData, "offset"> {
  containerHeight: number;
  containerWidth: number;
  align?: Align;
  scrollOffset: number;
  scrollbarSize: number;
  frozenOffset: number;
}

export const getOffsetForIndexAndAlignment = ({
  itemType,
  containerHeight,
  containerWidth,
  rowHeight,
  columnWidth,
  columnCount,
  rowCount,
  index,
  align = Align.smart,
  scrollOffset,
  instanceProps,
  scrollbarSize,
  frozenOffset = 0,
  scale,
}: AlignmentProps): number => {
  const size = itemType === "column" ? containerWidth : containerHeight;
  const itemMetadata = getItemMetadata({
    itemType,
    rowHeight,
    columnWidth,
    index,
    instanceProps,
    scale,
  });

  // Get estimated total size after ItemMetadata is computed,
  // To ensure it reflects actual measurements instead of just estimates.
  const estimatedTotalSize =
    itemType === "column"
      ? getEstimatedTotalWidth(columnCount, instanceProps)
      : getEstimatedTotalHeight(rowCount, instanceProps);

  const maxOffset = Math.max(
    0,
    Math.min(estimatedTotalSize - size, itemMetadata.offset - frozenOffset)
  );
  const minOffset = Math.max(
    0,
    itemMetadata.offset - size + scrollbarSize + itemMetadata.size
  );

  if (align === Align.smart) {
    if (scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size) {
      align = Align.auto;
    } else {
      align = Align.center;
    }
  }

  switch (align) {
    case Align.start:
      return maxOffset;
    case Align.end:
      return minOffset;
    case Align.center:
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    case Align.auto:
    default:
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return scrollOffset;
      } else if (minOffset > maxOffset) {
        // Because we only take into account the scrollbar size when calculating minOffset
        // this value can be larger than maxOffset when at the end of the list
        return minOffset;
      } else if (scrollOffset < minOffset) {
        return minOffset;
      } else {
        return maxOffset;
      }
  }
};

export const getOffsetForColumnAndAlignment = (
  props: Omit<AlignmentProps, "itemType">
) => {
  return getOffsetForIndexAndAlignment({
    itemType: ItemType.column,
    ...props,
  });
};

export const getOffsetForRowAndAlignment = (
  props: Omit<AlignmentProps, "itemType">
) => {
  return getOffsetForIndexAndAlignment({
    itemType: ItemType.row,
    ...props,
  });
};

// Animation frame based implementation of setTimeout.
// Inspired by Joe Lambert, https://gist.github.com/joelambert/1002116#file-requesttimeout-js

const hasNativePerformanceNow =
  typeof performance === "object" && typeof performance.now === "function";

const now = hasNativePerformanceNow
  ? () => performance.now()
  : () => Date.now();

export type TimeoutID = {
  id: number;
};

export function cancelTimeout(timeoutID: TimeoutID) {
  cancelAnimationFrame(timeoutID.id);
}

/**
 * Create a throttler based on RAF
 * @param callback
 * @param delay
 */
export function requestTimeout(callback: Function, delay: number): TimeoutID {
  const start = now();

  function tick() {
    if (now() - start >= delay) {
      callback.call(null);
    } else {
      timeoutID.id = requestAnimationFrame(tick);
    }
  }

  const timeoutID: TimeoutID = {
    id: requestAnimationFrame(tick),
  };

  return timeoutID;
}

export const selectionFromActiveCell = (
  activeCell: CellInterface | null
): SelectionArea[] => {
  if (!activeCell) return [];
  return [
    {
      bounds: {
        top: activeCell.rowIndex,
        left: activeCell.columnIndex,
        bottom: activeCell.rowIndex,
        right: activeCell.columnIndex,
      },
    },
  ];
};

/**
 * Check if a selection are spans multiple cells
 * @param sel 
 */
export const selectionSpansCells = (sel: AreaProps | undefined) => {
  if (!sel) return false
  return sel.bottom !== sel.top || sel.left !== sel.right
}

/**
 * When user tries to drag a selection
 * @param initialSelection 
 * @param from 
 * @param to 
 */
export const newSelectionFromDrag = (initialSelection: SelectionArea, from: CellInterface, to: CellInterface, topBound: number = 0, leftBound: number = 0, rowCount: number, columnCount: number) => {
  const currentBounds = initialSelection.bounds
  const top = Math.max(topBound, Math.min(rowCount, to.rowIndex + currentBounds.top - from.rowIndex))
  const left = Math.max(leftBound, Math.min(columnCount, to.columnIndex + currentBounds.left - from.columnIndex))
  return {
    bounds: {
      top,
      left,
      bottom: top + (currentBounds.bottom - currentBounds.top),
      right: left + (currentBounds.right - currentBounds.left)
    }
  }
}

/**
 * Clamp cell coordinates to be inside activeCell and selection
 * @param coords 
 * @param activeCell 
 * @param selection 
 */
export const clampCellCoords = (coords: CellInterface, activeCell: CellInterface | undefined, selection: SelectionArea | undefined) => {
  if (activeCell) {
    coords.rowIndex = Math.max(activeCell.rowIndex, coords.rowIndex)
    coords.columnIndex = Math.min(activeCell.columnIndex, coords.columnIndex)
  }
  if (selection) {
    coords.rowIndex = Math.min(selection.bounds.bottom, Math.max(selection.bounds.top, coords.rowIndex))
    coords.columnIndex = Math.min(selection.bounds.right, Math.max(selection.bounds.left, coords.columnIndex))
  }
  return coords
}

/**
 * Converts a number to alphabet
 * @param i
 */
export const numberToAlphabet = (i: number): string => {
  return (
    (i >= 26 ? numberToAlphabet(((i / 26) >> 0) - 1) : "") +
    "abcdefghijklmnopqrstuvwxyz"[i % 26 >> 0]
  ).toUpperCase();
};

/**
 * Convert selections to html and csv data
 * @param rows
 */
export const prepareClipboardData = (
  rows: (string | undefined)[][]
): [string, string] => {
  const html = ["<table>"];
  const csv: string[] = [];
  const sanitizeCell = (value: any) => {
    if (isNull(value)) return ''
    return value
  }
  rows.forEach((row) => {
    html.push("<tr>");
    const csvRow: string[] = [];
    row.forEach((cell) => {
      html.push(`<td>${sanitizeCell(cell)}</td>`);
      csvRow.push(`${castToString(cell)?.replace(/"/g, '""')}`);
    });
    csv.push(csvRow.join(","));
    html.push("</tr>");
  });
  html.push("</table>");
  return [html.join(""), csv.join("\n")];
};

/**
 * Cycles active cell within selecton bounds
 * @param activeCellBounds
 * @param selectionBounds
 * @param direction
 */
export const findNextCellWithinBounds = (
  activeCellBounds: AreaProps,
  selectionBounds: AreaProps,
  direction: Direction = Direction.Right
): CellInterface | null => {
  const intersects = areaIntersects(activeCellBounds, selectionBounds);
  if (!intersects) return null;
  let rowIndex, columnIndex;
  let nextActiveCell: CellInterface | null = null;
  if (direction === Direction.Right) {
    rowIndex = activeCellBounds.top;
    columnIndex = activeCellBounds.left + 1;
    if (columnIndex > selectionBounds.right) {
      rowIndex = rowIndex + 1;
      columnIndex = selectionBounds.left;
      if (rowIndex > selectionBounds.bottom) {
        rowIndex = selectionBounds.top;
      }
    }
    nextActiveCell = { rowIndex, columnIndex };
  }
  if (direction === Direction.Left) {
    rowIndex = activeCellBounds.bottom;
    columnIndex = activeCellBounds.left - 1;
    if (columnIndex < selectionBounds.left) {
      rowIndex = rowIndex - 1;
      columnIndex = selectionBounds.right;
      if (rowIndex < selectionBounds.top) {
        rowIndex = selectionBounds.bottom;
      }
    }
    nextActiveCell = { rowIndex, columnIndex };
  }

  if (direction === Direction.Down) {
    rowIndex = activeCellBounds.bottom + 1;
    columnIndex = activeCellBounds.left;
    if (rowIndex > selectionBounds.bottom) {
      columnIndex = activeCellBounds.left + 1;
      rowIndex = selectionBounds.top;
      if (columnIndex > selectionBounds.right) {
        columnIndex = selectionBounds.left;
      }
    }
    nextActiveCell = { rowIndex, columnIndex };
  }

  if (direction === Direction.Up) {
    rowIndex = activeCellBounds.top - 1;
    columnIndex = activeCellBounds.left;
    if (rowIndex < selectionBounds.top) {
      columnIndex = activeCellBounds.left - 1;
      rowIndex = selectionBounds.bottom;
      if (columnIndex < selectionBounds.left) {
        columnIndex = selectionBounds.right;
      }
    }
    nextActiveCell = { rowIndex, columnIndex };
  }

  return nextActiveCell;
};

/**
 * Check if 2 areas overlap
 * @param area1
 * @param area2
 */
export const areaIntersects = (area1: AreaProps, area2: AreaProps): boolean => {
  if (area1.left > area2.right || area2.left > area1.right) {
    return false;
  }
  if (area1.top > area2.bottom || area2.top > area1.bottom) {
    return false;
  }
  return true;
};

/**
 * Check if area is inside another area
 * @param needle 
 * @param haystack 
 */
export const areaInsideArea = (needle: AreaProps, haystack: AreaProps) => {
  return needle.top >= haystack.top && needle.bottom <= haystack.bottom && needle.left >= haystack.left && needle.right <= haystack.right
}

/**
 * Check if two areas are equal
 * @param area1 
 * @param area2 
 */
export const isAreasEqual = (area1: AreaProps, area2: AreaProps) => {
  return (
    area1.bottom === area2.bottom &&
    area1.top === area2.top &&
    area1.left === area2.left &&
    area1.right === area2.right
  )
}

/**
 * Get maximum bound of an area, caters to merged cells
 * @param area
 * @param boundGetter
 */
export const extendAreaToMergedCells = (
  _area: AreaProps,
  mergedCells: AreaProps[]
): AreaProps => {
  const area = { ..._area };
  for (const bounds of mergedCells) {
    if (areaIntersects(area, bounds)) {
      area.top = Math.min(area.top, bounds.top);
      area.bottom = Math.max(area.bottom, bounds.bottom);
      area.right = Math.max(area.right, bounds.right);
      area.left = Math.min(area.left, bounds.left);
    }
  }
  return area;
};

export const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

/**
 * Simple Canvas element to measure text size
 *
 * Usage
 *
 * ```
 * const textSizer = new AutoSizer()
 * textSizer.measureText('Hello world').width
 * ```
 */
interface AutoSizerProps {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: number;
  scale?: number;
}

type IOptions = {
  [key: string]: any;
};

export const AutoSizerCanvas = (defaults: AutoSizerProps = {}) => {
  const {
    fontFamily = "Arial",
    fontSize = 12,
    fontWeight = "",
    fontStyle = "",
    lineHeight = 16,
    scale = 1,
  } = defaults;
  var o: IOptions = {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    lineHeight,
    scale,
  };
  const canvas =
    canUseDOM && <HTMLCanvasElement>document.createElement("canvas");
  const context = canvas ? canvas.getContext("2d") : null;

  const setFont = (options: IOptions = {}) => {
    for (const key in options) {
      o[key] = options[key] ?? o[key];
    }
    if (context) {
      context.font = `${o.fontStyle} ${o.fontWeight} ${
        o.fontSize * o.scale
      }px ${o.fontFamily}`;
    }
  };
  const getWidthOfLongestText = (text: string | undefined) => {
    let width = 0;
    let height = 0;
    if (text === void 0) return { width, height };
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineWidth = context?.measureText(line).width ?? 0;
      width = Math.max(width, lineWidth);
      height += o.fontSize * 1.2 * o.scale;
    }
    return { width: Math.ceil(width), height: Math.ceil(height) };
  };
  const measureText = (text: React.ReactText) =>
    getWidthOfLongestText(castToString(text));
  const reset = () => setFont(defaults);
  /* Set font in constructor */
  setFont(o);

  return {
    context,
    measureText,
    setFont,
    reset,
  };
};

/* Export a singleton */
export const autoSizerCanvas = AutoSizerCanvas();

/* Check if a value is null */
export const isNull = (value: any) =>
  value === void 0 || value === null || value === "";

export const isEqualCells = (
  a: CellInterface | null,
  b: CellInterface | null
) => {
  if (isNull(a) || isNull(b) || a === null || b === null) return false;
  return a.rowIndex === b.rowIndex && a.columnIndex === b.columnIndex;
};

/**
 * Find next row Index
 * @param rowIndex
 * @param direction
 */
export type HiddenType = (i: number) => boolean;
export const clampIndex = (
  index: number,
  isHidden: HiddenType | undefined,
  direction: Direction
) => {
  switch (direction) {
    case Direction.Right:
    case Direction.Down:
      let hidden = isHidden?.(index);
      while (hidden === true) {
        hidden = isHidden?.(++index);
      }
      break;

    case Direction.Left:
    case Direction.Up: {
      let hidden = isHidden?.(index);
      while (hidden === true) {
        hidden = isHidden?.(--index);
      }
      break;
    }
  }
  return index;
};

type ValueGetter = (cell: CellInterface) => React.ReactText | undefined;

/**
 * Find a cell with content if the current cell is out of the current dataregion
 * [
 *  1, 2, 3,
 *  x, x, x
 *  7, 8, 9
 * ]
 * activeCel = 2
 * direction = Down
 * New Cell = 8
 *
 * @param activeCell
 * @param getValue
 * @param isHidden
 * @param direction
 * @param limit
 */
export const findNextContentfulCell = (
  activeCell: CellInterface,
  getValue: ValueGetter,
  isHidden: HiddenType | undefined,
  direction: Direction,
  limit: number
) => {
  var { rowIndex, columnIndex } = activeCell;
  switch (direction) {
    case Direction.Down: {
      rowIndex = clampIndex(Math.min(rowIndex + 1, limit), isHidden, direction);
      let value = getValue({ rowIndex, columnIndex });
      while (isNull(value) && rowIndex < limit) {
        rowIndex = clampIndex(Math.min(++rowIndex, limit), isHidden, direction);
        value = getValue({ rowIndex, columnIndex });
      }
      return { rowIndex, columnIndex };
    }

    case Direction.Up: {
      rowIndex = clampIndex(Math.max(rowIndex - 1, limit), isHidden, direction);
      let value = getValue({ rowIndex, columnIndex });
      while (isNull(value) && rowIndex > limit) {
        rowIndex = clampIndex(Math.max(--rowIndex, limit), isHidden, direction);
        value = getValue({ rowIndex, columnIndex });
      }
      return { rowIndex, columnIndex };
    }

    case Direction.Right: {
      columnIndex = clampIndex(
        Math.min(columnIndex + 1, limit),
        isHidden,
        direction
      );
      let value = getValue({ rowIndex, columnIndex });
      while (isNull(value) && columnIndex < limit) {
        columnIndex = clampIndex(
          Math.min(++columnIndex, limit),
          isHidden,
          direction
        );
        value = getValue({ rowIndex, columnIndex });
      }
      return { rowIndex, columnIndex };
    }

    case Direction.Left: {
      columnIndex = clampIndex(
        Math.max(columnIndex - 1, limit),
        isHidden,
        direction
      );
      let value = getValue({ rowIndex, columnIndex });
      while (isNull(value) && columnIndex > limit) {
        columnIndex = clampIndex(
          Math.max(--columnIndex, limit),
          isHidden,
          direction
        );
        value = getValue({ rowIndex, columnIndex });
      }
      return { rowIndex, columnIndex };
    }

    default:
      return activeCell;
  }
};

/**
 * Find the next cell
 * @param activeCell
 * @param getValue
 * @param isHidden
 * @param direction
 * @param limit
 */
export const findLastContentfulCell = (
  activeCell: CellInterface,
  getValue: ValueGetter,
  isHidden: HiddenType | undefined,
  direction: Direction,
  limit: number
): CellInterface => {
  var { rowIndex, columnIndex } = activeCell;
  switch (direction) {
    case Direction.Down: {
      rowIndex = clampIndex(Math.min(rowIndex + 1, limit), isHidden, direction);
      let value = getValue({ rowIndex, columnIndex });
      while (!isNull(value) && rowIndex < limit) {
        rowIndex = clampIndex(Math.min(++rowIndex, limit), isHidden, direction);
        value = getValue({ rowIndex, columnIndex });
      }
      return {
        columnIndex,
        rowIndex: isNull(getValue({ columnIndex, rowIndex }))
          ? rowIndex - 1
          : rowIndex,
      };
    }
    case Direction.Up: {
      rowIndex = clampIndex(Math.max(rowIndex - 1, limit), isHidden, direction);
      let value = getValue({ rowIndex, columnIndex });
      while (!isNull(value) && rowIndex > limit) {
        rowIndex = clampIndex(Math.max(--rowIndex, limit), isHidden, direction);
        value = getValue({ rowIndex, columnIndex });
      }
      return {
        columnIndex,
        rowIndex: isNull(getValue({ columnIndex, rowIndex }))
          ? rowIndex + 1
          : rowIndex,
      };
    }
    case Direction.Right: {
      columnIndex = clampIndex(
        Math.min(columnIndex + 1, limit),
        isHidden,
        direction
      );
      let value = getValue({ rowIndex, columnIndex });
      while (!isNull(value) && columnIndex < limit) {
        columnIndex = clampIndex(
          Math.min(++columnIndex, limit),
          isHidden,
          direction
        );
        value = getValue({ rowIndex, columnIndex });
      }
      return {
        rowIndex,
        columnIndex: isNull(getValue({ columnIndex, rowIndex }))
          ? columnIndex - 1
          : columnIndex,
      };
    }

    case Direction.Left: {
      columnIndex = clampIndex(
        Math.max(columnIndex - 1, limit),
        isHidden,
        direction
      );
      let value = getValue({ rowIndex, columnIndex });
      while (!isNull(value) && columnIndex > limit) {
        columnIndex = clampIndex(
          Math.max(--columnIndex, limit),
          isHidden,
          direction
        );
        value = getValue({ rowIndex, columnIndex });
      }
      return {
        rowIndex,
        columnIndex: isNull(getValue({ columnIndex, rowIndex }))
          ? columnIndex + 1
          : columnIndex,
      };
    }

    default:
      return activeCell;
  }
};

/**
 * Ex
 */
export const findNextCellInDataRegion = (
  activeCell: CellInterface,
  getValue: ValueGetter,
  isHidden: HiddenType | undefined,
  direction: Direction,
  limit: number
): number => {
  var { rowIndex, columnIndex } = activeCell;
  const isCurrentCellEmpty = isNull(getValue(activeCell));
  const didWeReachTheEdge = (cur: boolean, next: boolean): boolean => {
    return (cur && next) || (cur && !next) || (!cur && next);
  };
  switch (direction) {
    case Direction.Down: {
      const nextCellValue = getValue({ rowIndex: rowIndex + 1, columnIndex });
      const isNextCellEmpty = isNull(nextCellValue);
      const isEdge = didWeReachTheEdge(isCurrentCellEmpty, isNextCellEmpty);
      const nextCell = isEdge
        ? findNextContentfulCell(
            activeCell,
            getValue,
            isHidden,
            direction,
            limit
          )
        : findLastContentfulCell(
            activeCell,
            getValue,
            isHidden,
            direction,
            limit
          );
      return nextCell?.rowIndex;
    }

    case Direction.Up: {
      const nextCellValue = getValue({ rowIndex: rowIndex - 1, columnIndex });
      const isNextCellEmpty = isNull(nextCellValue);
      const isEdge = didWeReachTheEdge(isCurrentCellEmpty, isNextCellEmpty);
      const nextCell = isEdge
        ? findNextContentfulCell(
            activeCell,
            getValue,
            isHidden,
            direction,
            limit
          )
        : findLastContentfulCell(
            activeCell,
            getValue,
            isHidden,
            direction,
            limit
          );
      return nextCell?.rowIndex;
    }

    case Direction.Right: {
      const nextCellValue = getValue({
        rowIndex,
        columnIndex: columnIndex + 1,
      });
      const isNextCellEmpty = isNull(nextCellValue);
      const isEdge = didWeReachTheEdge(isCurrentCellEmpty, isNextCellEmpty);
      const nextCell = isEdge
        ? findNextContentfulCell(
            activeCell,
            getValue,
            isHidden,
            direction,
            limit
          )
        : findLastContentfulCell(
            activeCell,
            getValue,
            isHidden,
            direction,
            limit
          );
      return nextCell?.columnIndex;
    }

    case Direction.Left: {
      const nextCellValue = getValue({
        rowIndex,
        columnIndex: columnIndex - 1,
      });
      const isNextCellEmpty = isNull(nextCellValue);
      const isEdge = didWeReachTheEdge(isCurrentCellEmpty, isNextCellEmpty);
      const nextCell = isEdge
        ? findNextContentfulCell(
            activeCell,
            getValue,
            isHidden,
            direction,
            limit
          )
        : findLastContentfulCell(
            activeCell,
            getValue,
            isHidden,
            direction,
            limit
          );
      return nextCell?.columnIndex;
    }
  }
};

/* Focusable node names */
export const focusableNodeNames = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/**
 * Converts a value to string
 * @param value
 */
export const castToString = (value: any): string | undefined => {
  if (value === null || value === void 0) return void 0;
  return typeof value !== "string" ? "" + value : value;
};

export const isArrowKey = (keyCode: number) => {
  return [KeyCodes.Up, KeyCodes.Down, KeyCodes.Left, KeyCodes.Right].includes(
    keyCode
  );
};
