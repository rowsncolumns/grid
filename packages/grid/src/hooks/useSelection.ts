import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { SelectionArea, CellInterface, GridRef, AreaProps } from "./../Grid";
import {
  findNextCellWithinBounds,
  Align,
  getBoundedCells,
  cellIdentifier,
  extendAreaToMergedCells,
  isEqualCells,
  clampIndex,
  HiddenType,
  findNextCellInDataRegion,
  selectionFromActiveCell,
  selectionSpansCells,
  newSelectionFromDrag,
  clampCellCoords,
} from "./../helpers";
import {
  KeyCodes,
  Direction,
  MouseButtonCodes,
  SelectionPolicy,
} from "./../types";

export interface UseSelectionOptions {
  /**
   * Access grid functions
   */
  gridRef: React.MutableRefObject<GridRef | null>;
  /**
   * Initial selections
   */
  initialSelections?: SelectionArea[];
  /**
   * Option to set 0,0 as initially selected cell
   */
  initialActiveCell?: CellInterface | null;
  /**
   * No of columns in the grid
   */
  columnCount?: number;
  /**
   * No of rows in the grid
   */
  rowCount?: number;
  /**
   * Allow deselect a selected area
   */
  allowDeselectSelection?: boolean;
  /**
   * onFill
   */
  onFill?: (
    activeCell: CellInterface,
    selection: SelectionArea | null,
    selections: SelectionArea[]
  ) => void;
  /**
   * Hidden rows
   */
  isHiddenRow?: HiddenType;
  /**
   * Hidden columns
   */
  isHiddenColumn?: HiddenType;
  /**
   * Always scroll to active cell
   */
  alwaysScrollToActiveCell?: boolean;
  /**
   * Top bound of selection
   */
  selectionTopBound?: number;
  /**
   * Bottom bound
   */
  selectionBottomBound?: number;
  /**
   * Left bound
   */
  selectionLeftBound?: number;
  /**
   * Right bound
   */
  selectionRightBound?: number;
  /**
   * merged cells
   */
  mergedCells?: AreaProps[];
  /**
   * Mousedown
   */
  mouseDownInterceptor?: (
    e: React.MouseEvent<HTMLDivElement>,
    coords: CellInterface,
    start: React.MutableRefObject<CellInterface | null>,
    end: React.MutableRefObject<CellInterface | null>
  ) => boolean | undefined;
  mouseMoveInterceptor?: (
    e: globalThis.MouseEvent,
    coords: CellInterface,
    start: React.MutableRefObject<CellInterface | null>,
    end: React.MutableRefObject<CellInterface | null>
  ) => boolean | undefined;
  canSelectionSpanMergedCells?: (
    start: CellInterface,
    end: CellInterface
  ) => boolean;
  /**
   * Selection policy
   */
  selectionPolicy?: SelectionPolicy;
  /**
   * Value getter
   */
  getValue: (cell: CellInterface) => React.ReactText | undefined;
  /**
   * New selection mode
   */
  newSelectionMode?: NewSelectionMode;
  /**
   * When selection is moved
   */
  onSelectionMove?: (from: SelectionArea, to: SelectionArea) => void;
}

export type NewSelectionMode = "clear" | "modify" | "append";

export interface SelectionResults {
  /**
   * Active selected cell
   */
  activeCell: CellInterface | null;
  /**
   * Use this to invoke a new selection. All old selection will be cleared
   */
  newSelection: (coords: CellInterface) => void;
  /**
   * Use this to update selections without clearning old selection.
   */
  setSelections: (
    selections:
      | SelectionArea[]
      | ((selections: SelectionArea[]) => SelectionArea[])
  ) => void;
  /**
   * Modify selectio
   */
  modifySelection: (coords: CellInterface) => void;
  /**
   * Set the currently active cell
   */
  setActiveCell: (coords: CellInterface | null, shouldScroll?: boolean) => void;
  /**
   * Only saves internal state
   */
  setActiveCellState: (coords: CellInterface | null) => void;
  /**
   * Array of all selection bounds
   */
  selections: SelectionArea[];
  /**
   * Handler for mousedown, use to set activeCell
   */
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Used to move selections based on pressed key
   */
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  /**
   * Mousedown event on fillhandle
   */
  fillHandleProps?: Record<string, (e: any) => void>;
  /**
   *
   * Fill selections
   */
  fillSelection: SelectionArea | null;
  /**
   * Clears the last selection
   */
  clearLastSelection: () => void;
  /**
   * Select all cells
   */
  selectAll: () => void;
  /**
   * Add a new selection
   */
  appendSelection: (start: CellInterface, end: CellInterface) => void;
  /**
   * Clear all current selections
   */
  clearSelections: () => void;
  /**
   * On Selection mousedown
   */
  onSelectionMouseDown?: (
    e: React.MouseEvent<HTMLDivElement>,
    cell: CellInterface | undefined,
    selection: SelectionArea | undefined,
    index: number | undefined
  ) => void;
  /**
   * Boolean to indicate if a selection is being dragged
   */
  isDragging?: boolean;
  /**
   * Currently dragged selection
   */
  draggedSelection?: SelectionArea;
}

const EMPTY_SELECTION: SelectionArea[] = [];
const defaultIsHidden = (i: number) => false;
const defaultSelectionSpan = () => true;
/**
 * Hook to enable selection in datagrid
 * @param initialSelection
 */
const useSelection = ({
  gridRef,
  initialActiveCell = null,
  initialSelections = EMPTY_SELECTION,
  columnCount = 0,
  rowCount = 0,
  selectionPolicy = "multiple",
  newSelectionMode = "clear",
  allowDeselectSelection = true,
  onFill,
  isHiddenRow = defaultIsHidden,
  isHiddenColumn = defaultIsHidden,
  alwaysScrollToActiveCell = true,
  selectionTopBound = 0,
  selectionBottomBound = rowCount - 1,
  selectionLeftBound = 0,
  selectionRightBound = columnCount - 1,
  mouseDownInterceptor,
  mouseMoveInterceptor,
  mergedCells = [],
  canSelectionSpanMergedCells = defaultSelectionSpan,
  getValue,
  onSelectionMove,
}: UseSelectionOptions): SelectionResults => {
  const [activeCell, setActiveCell] = useState<CellInterface | null>(
    initialActiveCell
  );
  const [selections, setSelections] = useState<SelectionArea[]>(
    initialSelections
  );
  const [fillSelection, setFillSelection] = useState<SelectionArea | null>(
    null
  );
  const selectionStart = useRef<CellInterface | null>(null);
  const selectionEnd = useRef<CellInterface | null>(null);
  const isSelecting = useRef<boolean>(false);
  const isFilling = useRef<boolean>(false);
  const firstActiveCell = useRef<CellInterface | null>(null);

  /* Drag drop selection */
  const [_, forceRender] = useReducer((s) => s + 1, 0);
  const isDragging = useRef<boolean>(false);
  const initialDraggedSelection = useRef<SelectionArea>();
  const initialDraggedCell = useRef<CellInterface>();
  const draggedSelection = useRef<SelectionArea>();
  const draggedSelectionIndex = useRef<number>();
  /**
   * Need to store in ref because on mousemove and mouseup event that are
   * registered in document
   */
  const activeCellRef = useRef(activeCell);
  const activeSelectionsRef = useRef(selections);
  const mergedCellsRef = useRef(mergedCells);

  useEffect(() => {
    activeCellRef.current = activeCell;
  }, [activeCell]);
  useEffect(() => {
    activeSelectionsRef.current = selections;
  }, [selections]);
  useEffect(() => {
    mergedCellsRef.current = mergedCells;
  }, [mergedCells]);

  /* Check if cell is out of bounds */
  const isCellOutOfBounds = useCallback(
    (cell: CellInterface) => {
      return (
        cell.rowIndex < selectionTopBound ||
        cell.columnIndex < selectionLeftBound
      );
    },
    [selectionTopBound, selectionLeftBound]
  );

  /* New selection */
  const newSelection = (start: CellInterface, end: CellInterface = start) => {
    /* Validate bounds */
    if (isCellOutOfBounds(start)) {
      return;
    }
    selectionStart.current = start;
    selectionEnd.current = end;
    const bounds = selectionFromStartEnd(start, end);
    if (!bounds) return;
    const coords = { rowIndex: bounds.top, columnIndex: bounds.left };
    /* Keep track  of first cell that was selected by user */
    setActiveCell(coords);
    if (newSelectionMode === "clear") {
      firstActiveCell.current = coords;
      clearSelections();
    } else if (newSelectionMode === "modify") {
      modifySelection(coords);
    } else {
      appendSelection(coords);
    }
  };

  /**
   * selection object from start, end
   * @param start
   * @param end
   *
   * TODO
   * Cater to Merged cells
   */
  const selectionFromStartEnd = (start: CellInterface, end: CellInterface) => {
    if (!gridRef?.current) return null;
    const spanMerges = canSelectionSpanMergedCells?.(start, end);
    const boundsStart = gridRef.current.getCellBounds(start, spanMerges);
    const boundsEnd = gridRef.current.getCellBounds(end, spanMerges);
    const bounds = {
      top: Math.min(boundsStart.top, boundsEnd.top),
      bottom: Math.max(boundsStart.bottom, boundsEnd.bottom),
      left: Math.min(boundsStart.left, boundsEnd.left),
      right: Math.max(boundsStart.right, boundsEnd.right),
    };
    return spanMerges
      ? extendAreaToMergedCells(bounds, mergedCellsRef.current)
      : bounds;
  };

  /* Modify current selection */
  const modifySelection = (coords: CellInterface, setInProgress?: boolean) => {
    if (selectionPolicy === "single") {
      return;
    }
    if (!selectionStart.current) return;
    if (isCellOutOfBounds(coords)) {
      return;
    }
    selectionEnd.current = coords;
    const bounds = selectionFromStartEnd(selectionStart.current, coords);
    if (!bounds) return;

    /**
     * 1. Multiple selections on mousedown/mousemove
     * 2. Move the activeCell to newly selection. Done by appendSelection
     */
    setSelections((prevSelection) => {
      const len = prevSelection.length;
      if (!len) {
        return [{ bounds, inProgress: setInProgress ? true : false }];
      }
      return prevSelection.map((sel, i) => {
        if (len - 1 === i) {
          return {
            ...sel,
            bounds,
            inProgress: setInProgress ? true : false,
          };
        }
        return sel;
      });
    });
  };

  /* Adds a new selection, CMD key */
  const appendSelection = (
    start: CellInterface,
    end: CellInterface = start
  ) => {
    if (selectionPolicy !== "multiple") {
      return;
    }
    if (!start) return;
    /* Validate bounds */
    if (isCellOutOfBounds(start)) {
      return;
    }
    selectionStart.current = start;
    selectionEnd.current = end;
    const bounds = selectionFromStartEnd(start, end);
    if (!bounds) return;
    setActiveCell({ rowIndex: bounds.top, columnIndex: bounds.left });
    setSelections((prev) => [...prev, { bounds }]);
  };

  const removeSelectionByIndex = useCallback(
    (index: number): SelectionArea[] => {
      const newSelection = selections.filter((_, idx) => idx !== index);
      setSelections(newSelection);
      return newSelection;
    },
    [selections]
  );

  const clearSelections = () => {
    setSelections(EMPTY_SELECTION);
  };

  const getPossibleActiveCellFromSelections = (
    selections: SelectionArea[]
  ): CellInterface | null => {
    if (!selections.length) return null;
    const { bounds } = selections[selections.length - 1];
    return {
      rowIndex: bounds.top,
      columnIndex: bounds.left,
    };
  };

  const cellIndexInSelection = (
    cell: CellInterface,
    selections: SelectionArea[]
  ) => {
    const id = cellIdentifier(
      Math.max(selectionTopBound, cell.rowIndex),
      Math.max(selectionLeftBound, cell.columnIndex)
    );
    return selections.findIndex((sel) => {
      const boundedCells = getBoundedCells(sel.bounds);
      return boundedCells.has(id);
    });
  };

  const cellEqualsSelection = (
    cell: CellInterface | null,
    selections: SelectionArea[]
  ): boolean => {
    if (cell === null) return false;
    return selections.some((sel) => {
      return (
        sel.bounds.left === cell.columnIndex &&
        sel.bounds.top === cell.rowIndex &&
        sel.bounds.right === cell.columnIndex &&
        sel.bounds.bottom === cell.rowIndex
      );
    });
  };

  const boundsSubsetOfSelection = (bounds: AreaProps, selection: AreaProps) => {
    return (
      bounds.top >= selection.top &&
      bounds.bottom <= selection.bottom &&
      bounds.left >= selection.left &&
      bounds.right <= selection.right
    );
  };

  /**
   * Triggers a new selection start
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      /* Exit early if grid is not initialized */
      if (!gridRef || !gridRef.current) return;
      const coords = gridRef.current.getCellCoordsFromOffset(
        e.nativeEvent.clientX,
        e.nativeEvent.clientY
      );
      if (!coords) return;
      /* Check if its context menu click */
      const isContextMenuClick = e.nativeEvent.which === MouseButtonCodes.right;
      if (isContextMenuClick) {
        const cellIndex = cellIndexInSelection(coords, selections);
        if (cellIndex !== -1) return;
      }
      const isShiftKey = e.nativeEvent.shiftKey;
      const isMetaKey = e.nativeEvent.ctrlKey || e.nativeEvent.metaKey;
      const allowMultiple = isMetaKey;
      const allowDeselect = allowDeselectSelection;
      const hasSelections = selections.length > 0;
      const isDeselecting = isMetaKey && allowDeselect;

      if (!isContextMenuClick && selectionPolicy !== "single") {
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);
      }

      /* Activate selection mode */
      isSelecting.current = true;

      if (
        mouseDownInterceptor?.(e, coords, selectionStart, selectionEnd) ===
        false
      ) {
        return;
      }

      /* Shift key */
      if (isShiftKey) {
        modifySelection(coords);
        return;
      }

      /* Is the current cell same as active cell */
      const isSameAsActiveCell = isEqualCells(coords, activeCell);

      /* Command  or Control key */
      if (activeCell && allowMultiple) {
        /**
         * User is adding activeCell to selection
         *
         * 1. User is selecting and not de-selecting
         * 2. User has not made any selection
         * 3. Trying to add active cell to selection
         */
        if (isSameAsActiveCell && (!isDeselecting || !hasSelections)) {
          return;
        }

        /**
         * User is manually trying to select multiple selections,
         * So add the current active cell to the list
         */
        if (isMetaKey && !hasSelections) {
          appendSelection(activeCell);
        }

        /**
         * Check if this cell has already been selected (only for manual deselect)
         * Remove it from selection
         *
         * Future enhancements -> Split selection, so that 1 cell can be removed from range
         */
        if (isMetaKey && allowDeselect) {
          const cellIndex = cellIndexInSelection(coords, selections);
          if (cellIndex !== -1) {
            const newSelection = removeSelectionByIndex(cellIndex);
            const nextActiveCell = getPossibleActiveCellFromSelections(
              newSelection
            );
            if (nextActiveCell !== null) {
              setActiveCell(nextActiveCell);
            }
            if (
              newSelection.length === 1 &&
              cellEqualsSelection(nextActiveCell, newSelection)
            ) {
              /* Since we only have 1 cell, lets clear the selections and only keep activeCell */
              clearSelections();
            }
            return;
          }
        }

        /**
         * TODO
         * 1. Ability to remove selection
         * 2. Ability to remove from selection area
         * 3. Ability to switch activeCell if its part of removed selection
         */
        appendSelection(coords);
        return;
      }

      /**
       * Scroll to the selected cell
       */
      if (alwaysScrollToActiveCell) {
        gridRef.current?.scrollToItem(coords);
      }

      /**
       * If user is selecting the same same,
       * let not trigger another state change
       */
      if (isSameAsActiveCell) return;

      /* Trigger new selection */
      newSelection(coords);
    },
    [
      activeCell,
      selections,
      selectionPolicy,
      allowDeselectSelection,
      alwaysScrollToActiveCell,
      rowCount,
      columnCount,
      newSelectionMode,
    ]
  );

  /**
   * Mousemove handler
   */
  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    /* Exit if user is not in selection mode */
    if (!isSelecting.current || !gridRef?.current) return;

    const coords = gridRef.current.getCellCoordsFromOffset(
      e.clientX,
      e.clientY,
      false
    );

    if (!coords) return;

    if (
      mouseMoveInterceptor?.(e, coords, selectionStart, selectionEnd) === false
    ) {
      return;
    }

    if (isEqualCells(firstActiveCell.current, coords)) {
      return clearSelections();
    }

    modifySelection(coords, true);

    gridRef.current?.scrollToItem(coords);
  }, []);
  /**
   * Mouse up handler
   */
  const handleMouseUp = useCallback(() => {
    /* Reset selection mode */
    isSelecting.current = false;

    /* Remove listener */
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    /* Update last selection */
    setSelections((prevSelection) => {
      const len = prevSelection.length;
      if (!len) return EMPTY_SELECTION;
      return prevSelection.map((sel, i) => {
        if (len - 1 === i) {
          return {
            ...sel,
            inProgress: false,
          };
        }
        return sel;
      });
    });
  }, []);

  /**
   * Navigate selection using keyboard
   * @param direction
   * @param modify
   */
  const keyNavigate = useCallback(
    (direction: Direction, modify?: boolean, metaKeyPressed?: boolean) => {
      if (
        !selectionStart.current ||
        !selectionEnd.current ||
        !gridRef?.current ||
        !activeCell
      )
        return;
      const currentCell = modify ? selectionEnd.current : activeCell;
      var { rowIndex, columnIndex } = currentCell;
      const isMergedCell = gridRef?.current.isMergedCell({
        rowIndex,
        columnIndex,
      });

      const currentBounds = gridRef.current.getCellBounds({
        rowIndex,
        columnIndex,
      });

      switch (direction) {
        case Direction.Up:
          if (isMergedCell) rowIndex = currentBounds.top;
          rowIndex = clampIndex(
            Math.max(rowIndex - 1, selectionTopBound),
            isHiddenRow,
            direction
          );
          // Shift + Ctrl/Commmand
          // TODO: Scroll to last contentful cell
          if (metaKeyPressed) {
            const startCell = {
              ...currentCell,
              // Expand from the starting cell
              columnIndex: selectionStart.current.columnIndex,
            };
            rowIndex = findNextCellInDataRegion(
              startCell,
              getValue,
              isHiddenRow,
              direction,
              selectionTopBound
            );
          }
          break;

        case Direction.Down:
          if (isMergedCell) rowIndex = currentBounds.bottom;
          rowIndex = clampIndex(
            Math.min(rowIndex + 1, selectionBottomBound),
            isHiddenRow,
            direction
          );
          // Shift + Ctrl/Commmand
          if (metaKeyPressed) {
            const startCell = {
              ...currentCell,
              // Expand from the starting cell
              columnIndex: selectionStart.current.columnIndex,
            };
            rowIndex = findNextCellInDataRegion(
              startCell,
              getValue,
              isHiddenRow,
              direction,
              selectionBottomBound
            );
          }
          break;

        case Direction.Left:
          if (isMergedCell) columnIndex = currentBounds.left;
          columnIndex = clampIndex(
            Math.max(columnIndex - 1, selectionLeftBound),
            isHiddenColumn,
            direction
          );
          // Shift + Ctrl/Commmand
          if (metaKeyPressed) {
            const startCell = {
              ...currentCell,
              // Expand from the starting cell
              rowIndex: selectionStart.current.rowIndex,
            };
            columnIndex = findNextCellInDataRegion(
              startCell,
              getValue,
              isHiddenColumn,
              direction,
              selectionLeftBound
            );
          }
          break;

        case Direction.Right:
          if (isMergedCell) columnIndex = currentBounds.right;
          columnIndex = clampIndex(
            Math.min(columnIndex + 1, selectionRightBound),
            isHiddenColumn,
            direction
          );
          // Shift + Ctrl/Commmand
          if (metaKeyPressed) {
            const startCell = {
              ...currentCell,
              // Expand from the starting cell
              rowIndex: selectionStart.current.rowIndex,
            };
            columnIndex = findNextCellInDataRegion(
              startCell,
              getValue,
              isHiddenColumn,
              direction,
              selectionRightBound
            );
          }
          break;
      }

      const newBounds = gridRef.current.getCellBounds({
        rowIndex,
        columnIndex,
      });
      const coords = { rowIndex: newBounds.top, columnIndex: newBounds.left };
      const scrollToCell = modify
        ? selectionEnd.current.rowIndex === coords.rowIndex
          ? // Scroll to a column
            { columnIndex: coords.columnIndex }
          : // Scroll to row
            { rowIndex: coords.rowIndex }
        : // Scroll to cell
          { rowIndex, columnIndex };

      const isUserNavigatingToActiveCell = isEqualCells(
        firstActiveCell.current,
        coords
      );

      if (modify && !isUserNavigatingToActiveCell) {
        modifySelection(coords);
      } else {
        newSelection(coords);
      }

      /* Keep the item in view */
      gridRef.current.scrollToItem(scrollToCell);
    },
    [
      activeCell,
      isHiddenRow,
      isHiddenColumn,
      selectionLeftBound,
      selectionTopBound,
      selectionPolicy,
      newSelectionMode,
    ]
  );

  // ⌘A or ⌘+Shift+Space
  const selectAll = () => {
    selectionStart.current = {
      rowIndex: selectionTopBound,
      columnIndex: selectionLeftBound,
    };
    modifySelection({
      rowIndex: selectionBottomBound,
      columnIndex: selectionRightBound,
    });
  };

  // Ctrl+Space
  const selectColumn = useCallback(() => {
    if (!selectionEnd.current || !selectionStart.current) return;
    selectionStart.current = {
      rowIndex: selectionTopBound,
      columnIndex: selectionStart.current.columnIndex,
    };
    modifySelection({
      rowIndex: rowCount - 1,
      columnIndex: selectionEnd.current.columnIndex,
    });
  }, [selectionTopBound]);

  // Shift+Space
  const selectRow = useCallback(() => {
    if (!selectionEnd.current || !selectionStart.current) return;
    selectionStart.current = {
      rowIndex: selectionStart.current.rowIndex,
      columnIndex: selectionLeftBound,
    };
    modifySelection({
      rowIndex: selectionEnd.current.rowIndex,
      columnIndex: selectionRightBound,
    });
  }, [selectionLeftBound]);

  //  Home
  const selectFirstCellInRow = () => {
    if (!selectionStart.current || !gridRef?.current) return;
    const cell = {
      rowIndex: selectionStart.current.rowIndex,
      columnIndex: selectionLeftBound,
    };
    newSelection(cell);

    gridRef?.current.scrollToItem(cell);
  };
  //  End
  const selectLastCellInRow = () => {
    if (!selectionStart.current || !gridRef?.current) return;
    const cell = {
      rowIndex: selectionStart.current.rowIndex,
      columnIndex: selectionRightBound,
    };
    newSelection(cell);
    gridRef?.current.scrollToItem(cell);
  };

  //  ⌘+Home
  const selectFirstCellInColumn = () => {
    if (!selectionStart.current || !gridRef?.current) return;
    const cell = {
      rowIndex: selectionTopBound,
      columnIndex: selectionStart.current.columnIndex,
    };
    newSelection(cell);

    gridRef?.current.scrollToItem(cell);
  };
  //  ⌘+End
  const selectLastCellInColumn = () => {
    if (!selectionStart.current || !gridRef?.current) return;
    const cell = {
      rowIndex: rowCount - 1,
      columnIndex: selectionStart.current.columnIndex,
    };
    newSelection(cell);
    gridRef?.current.scrollToItem(cell);
  };

  //  ⌘+Backspace
  const scrollToActiveCell = () => {
    if (!activeCell || !gridRef?.current) return;
    gridRef?.current.scrollToItem(activeCell, Align.smart);
  };

  // Page down
  const pageDown = () => {
    if (!activeCell || !gridRef?.current) return;
    const {
      visibleRowStartIndex,
      visibleRowStopIndex,
    } = gridRef.current.getViewPort();
    const pageSize = visibleRowStopIndex - visibleRowStartIndex;
    const rowIndex = Math.min(activeCell.rowIndex + pageSize, rowCount - 1);
    const newActiveCell = {
      rowIndex,
      columnIndex: activeCell.columnIndex,
    };
    handleSetActiveCell(newActiveCell, false);
    /* Scroll to the new row */
    gridRef?.current.scrollToItem({ rowIndex }, Align.end);
  };

  // Page up
  const pageUp = () => {
    if (!activeCell || !gridRef?.current) return;
    const {
      visibleRowStartIndex,
      visibleRowStopIndex,
    } = gridRef.current.getViewPort();
    const pageSize = visibleRowStopIndex - visibleRowStartIndex;
    const rowIndex = Math.max(
      activeCell.rowIndex - pageSize,
      selectionTopBound
    );
    const newActiveCell = {
      rowIndex,
      columnIndex: activeCell.columnIndex,
    };
    handleSetActiveCell(newActiveCell, false);
    /* Scroll to the new row */
    gridRef?.current.scrollToItem({ rowIndex }, Align.end);
  };

  // Page right
  const pageRight = () => {
    if (!activeCell || !gridRef?.current) return;
    const {
      visibleColumnStartIndex,
      visibleColumnStopIndex,
    } = gridRef.current.getViewPort();
    const pageSize = visibleColumnStopIndex - visibleColumnStartIndex;
    const columnIndex = Math.min(
      activeCell.columnIndex + pageSize,
      selectionRightBound
    );
    const newActiveCell = {
      columnIndex,
      rowIndex: activeCell.rowIndex,
    };
    handleSetActiveCell(newActiveCell, false);
    /* Scroll to the new row */
    gridRef?.current.scrollToItem({ columnIndex }, Align.end);
  };

  // Page left
  const pageLeft = () => {
    if (!activeCell || !gridRef?.current) return;
    const {
      visibleColumnStartIndex,
      visibleColumnStopIndex,
    } = gridRef.current.getViewPort();
    const pageSize = visibleColumnStopIndex - visibleColumnStartIndex;
    const columnIndex = Math.max(
      activeCell.columnIndex - pageSize,
      selectionLeftBound
    );
    const newActiveCell = {
      columnIndex,
      rowIndex: activeCell.rowIndex,
    };
    handleSetActiveCell(newActiveCell, false);
    /* Scroll to the new row */
    gridRef?.current.scrollToItem({ columnIndex }, Align.end);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!gridRef?.current) return;
      const isShiftKey = e.nativeEvent.shiftKey;
      const isAltKey = e.nativeEvent.altKey;
      const isMetaKey = e.nativeEvent.ctrlKey || e.nativeEvent.metaKey;
      switch (e.nativeEvent.which) {
        case KeyCodes.Right:
          keyNavigate(Direction.Right, isShiftKey, isMetaKey);
          e.preventDefault();
          break;

        case KeyCodes.Left:
          keyNavigate(Direction.Left, isShiftKey, isMetaKey);
          e.preventDefault();
          break;

        // Up
        case KeyCodes.Up:
          keyNavigate(Direction.Up, isShiftKey, isMetaKey);
          e.preventDefault();
          break;

        case KeyCodes.Down:
          keyNavigate(Direction.Down, isShiftKey, isMetaKey);
          e.preventDefault();
          break;

        case KeyCodes.A:
          if (isMetaKey) {
            selectAll();
          }
          e.preventDefault();
          break;

        case KeyCodes.Home:
          if (isMetaKey) {
            selectFirstCellInColumn();
          } else {
            selectFirstCellInRow();
          }
          break;

        case KeyCodes.End:
          if (isMetaKey) {
            selectLastCellInColumn();
          } else {
            selectLastCellInRow();
          }
          break;

        case KeyCodes.BackSpace:
          if (isMetaKey) scrollToActiveCell();
          break;

        case KeyCodes.SPACE:
          if (isMetaKey && isShiftKey) {
            selectAll();
          } else if (isMetaKey) {
            selectColumn();
          } else if (isShiftKey) {
            selectRow();
          }
          break;

        case KeyCodes.Tab:
          /* Cycle through the selections if selections.length > 0 */
          if (selections.length && activeCell && gridRef) {
            const { bounds } = selections[selections.length - 1];
            const activeCellBounds = gridRef.current.getCellBounds(activeCell);
            const direction = isShiftKey ? Direction.Left : Direction.Right;
            const nextCell = findNextCellWithinBounds(
              activeCellBounds,
              bounds,
              direction
            );
            if (nextCell) {
              setActiveCell(nextCell);
              if (gridRef.current) gridRef.current.scrollToItem(nextCell);
            }
          } else {
            if (isShiftKey) {
              keyNavigate(Direction.Left);
            } else {
              keyNavigate(Direction.Right);
            }
          }
          e.preventDefault();
          break;

        case KeyCodes.PageDown:
          if (isAltKey) {
            pageRight();
          } else pageDown();
          break;

        case KeyCodes.PageUp:
          if (isAltKey) {
            pageLeft();
          } else pageUp();
          break;
      }
    },
    [
      rowCount,
      columnCount,
      activeCell,
      selections,
      selectionPolicy,
      newSelectionMode,
    ]
  );

  /**
   * User modified active cell deliberately
   */
  const handleSetActiveCell = useCallback(
    (coords: CellInterface | null, shouldScroll = true) => {
      selectionStart.current = coords;
      firstActiveCell.current = coords;
      selectionEnd.current = coords;
      setActiveCell(coords);
      /* Scroll to the cell */
      if (shouldScroll && coords && gridRef?.current) {
        gridRef.current.scrollToItem(coords);
      }
    },
    []
  );

  const handleFillHandleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      isFilling.current = true;
      document.addEventListener("mousemove", handleFillHandleMouseMove);
      document.addEventListener("mouseup", handleFillHandleMouseUp);
    },
    [selections]
  );

  /**
   * TODO
   * 1. Fill does not extend to merged cells
   */
  const handleFillHandleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    /* Exit if user is not in selection mode */
    if (!isFilling.current || !gridRef?.current || !activeCellRef.current)
      return;

    const coords = gridRef.current.getCellCoordsFromOffset(
      e.clientX,
      e.clientY,
      false
    );
    if (!coords) return;
    const selections = activeSelectionsRef.current;
    let bounds = selectionFromStartEnd(activeCellRef.current, coords);
    const hasSelections = selections.length > 0;
    const activeCellBounds = hasSelections
      ? selections[selections.length - 1].bounds
      : gridRef.current.getCellBounds(activeCellRef.current);
    if (!bounds) return;

    const direction =
      bounds.top < activeCellBounds.top
        ? Direction.Up
        : bounds.bottom > activeCellBounds.bottom
        ? Direction.Down
        : bounds.right > activeCellBounds.right
        ? Direction.Right
        : Direction.Left;

    if (direction === Direction.Right) {
      bounds = {
        ...activeCellBounds,
        right: Math.min(selectionRightBound, bounds.right),
      };
    }

    if (direction === Direction.Up) {
      bounds = {
        ...activeCellBounds,
        top: Math.max(selectionTopBound, bounds.top),
      };
    }

    if (direction === Direction.Left) {
      bounds = {
        ...activeCellBounds,
        left: Math.max(selectionLeftBound, bounds.left),
      };
    }

    if (direction === Direction.Down) {
      bounds = {
        ...activeCellBounds,
        bottom: Math.min(selectionBottomBound, bounds.bottom),
      };
    }

    /**
     * If user moves back to the same selection, clear
     */
    if (
      hasSelections &&
      boundsSubsetOfSelection(bounds, selections[0].bounds)
    ) {
      setFillSelection(null);
      return;
    }

    setFillSelection({ bounds });

    gridRef.current.scrollToItem(coords);
  }, []);

  const handleFillHandleMouseUp = useCallback((e: globalThis.MouseEvent) => {
    isFilling.current = false;

    /* Remove listener */
    document.removeEventListener("mousemove", handleFillHandleMouseMove);
    document.removeEventListener("mouseup", handleFillHandleMouseUp);

    /* Exit early */
    if (!gridRef || !activeCellRef.current) return;

    /* Update last selection */
    let fillSelection: SelectionArea | null = null;

    setFillSelection((prev) => {
      fillSelection = prev;
      return null;
    });

    /* Use ref, as we are binding to document */
    const selections = activeSelectionsRef.current;
    const activeCell = activeCellRef.current;
    if (!activeCell || !fillSelection) return;

    const newBounds = (fillSelection as SelectionArea)?.bounds;
    if (!newBounds) return;

    /* Focus on the grid */
    gridRef.current?.focus();

    /* Callback */
    onFill && onFill(activeCell, fillSelection, selections);

    /* Modify last selection */
    setSelections((prevSelection) => {
      const len = prevSelection.length;
      if (!len) {
        return [{ bounds: newBounds }];
      }
      return prevSelection.map((sel, i) => {
        if (len - 1 === i) {
          return {
            ...sel,
            bounds: newBounds,
          };
        }
        return sel;
      });
    });
  }, []);

  /**
   * Remove the last selection from state
   */
  const handleClearLastSelection = useCallback(() => {
    setSelections((prev) => prev.slice(0, -1));
  }, []);

  const fillHandleProps = useMemo(() => {
    return {
      onMouseDown: handleFillHandleMouseDown,
    };
  }, [handleFillHandleMouseDown]);

  /**
   * When user mouse downs on selection
   */
  const handleSelectionMouseDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      activeCell: CellInterface | undefined,
      selection: SelectionArea | undefined,
      index: number | undefined
    ) => {
      if (!gridRef.current) {
        return;
      }
      let coords = gridRef.current.getCellCoordsFromOffset(
        e.nativeEvent.clientX,
        e.nativeEvent.clientY
      );
      if (!coords) {
        return;
      }
      /* Make sure the coords do not extend selection bounds */
      coords = clampCellCoords(coords, activeCell, selection);

      /* Initial cell that is selected by user */
      initialDraggedCell.current = coords;
      /* Set selection */
      if (activeCell) {
        initialDraggedSelection.current = draggedSelection.current = {
          bounds: gridRef.current.getCellBounds(activeCell),
        };
      }
      if (selection) {
        initialDraggedSelection.current = draggedSelection.current = selection;
        draggedSelectionIndex.current = index;
      }

      /* Set dragging flag */
      isDragging.current = true;

      /* Listen to mousemove and mousedown events */
      document.addEventListener("mouseup", handleSelectionMouseUp);
      document.addEventListener("mousemove", handleSelectionMouseMove);

      /* Force a re-render */
      forceRender();
    },
    [selectionTopBound, selectionLeftBound, rowCount, columnCount, selections]
  );

  /**
   * Ond drag move
   */
  const handleSelectionMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!gridRef?.current) return;
    const coords = gridRef.current.getCellCoordsFromOffset(
      e.clientX,
      e.clientY,
      false
    );
    if (!coords) {
      return;
    }
    if (!initialDraggedSelection.current || !initialDraggedCell.current) {
      return;
    }
    let sel = newSelectionFromDrag(
      initialDraggedSelection.current,
      initialDraggedCell.current,
      coords,
      selectionTopBound,
      selectionLeftBound,
      rowCount,
      columnCount
    );
    // Not required
    // sel = { bounds : extendAreaToMergedCells(sel.bounds, mergedCellsRef.current) }
    draggedSelection.current = sel;

    /* Scroll to the cell */
    gridRef.current?.scrollToItem(coords);

    /* Re-render */
    forceRender();
  }, []);

  /**
   * When drag/drop is complete
   */
  const handleSelectionMouseUp = useCallback(() => {
    const sel = draggedSelection.current;
    if (sel) {
      /* Select the first cell in the selection area */
      const coords = { rowIndex: sel.bounds.top, columnIndex: sel.bounds.left };
      setActiveCell(coords);
      /* Update selection start */
      selectionStart.current = coords;

      if (selectionSpansCells(sel?.bounds)) {
        setSelections((prev) => {
          return prev.map((cur, index) => {
            if (index === draggedSelectionIndex.current) {
              return sel;
            }
            return cur;
          });
        });

        /* Update selection end */
        selectionEnd.current = {
          rowIndex: sel.bounds.bottom,
          columnIndex: sel.bounds.right,
        };
      }
    }

    if (initialDraggedSelection.current && sel) {
      onSelectionMove?.(initialDraggedSelection.current, sel);
    }

    /* Focus on the grid */
    gridRef.current?.focus();

    /* Reset all references */
    isDragging.current = false;
    draggedSelection.current = void 0;
    draggedSelectionIndex.current = void 0;

    /* Remove event handlers */
    document.removeEventListener("mouseup", handleSelectionMouseUp);
    document.removeEventListener("mousemove", handleSelectionMouseMove);

    /* Force render */
    forceRender();
  }, []);

  return {
    activeCell,
    selections,
    isDragging: isDragging.current,
    draggedSelection: draggedSelection.current,
    onSelectionMouseDown: handleSelectionMouseDown,
    onMouseDown: handleMouseDown,
    onKeyDown: handleKeyDown,
    newSelection,
    setSelections,
    setActiveCell: handleSetActiveCell,
    setActiveCellState: setActiveCell,
    fillHandleProps,
    fillSelection,
    clearLastSelection: handleClearLastSelection,
    modifySelection,
    selectAll,
    appendSelection,
    clearSelections,
  };
};

export default useSelection;
