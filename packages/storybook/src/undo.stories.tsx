// @ts-nocheck
import React, { useRef, useEffect, useCallback, useState } from "react";
import Grid, {
  Cell,
  GridRef,
  useSelection,
  useEditable,
  useUndo,
  createPatches,
} from "@rowsncolumns/grid";

export default {
  title: "Undo Redo",
  component: Grid,
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const UndoRedo = () => {
  const App = () => {
    const rowCount = 100;
    const columnCount = 100;
    const gridRef = useRef<GridRef>();
    const {
      undo,
      redo,
      add: addToUndoStack,
      canUndo,
      canRedo,
      ...undoProps
    } = useUndo({
      onUndo: (patches) => {
        const { path, value } = patches;
        const [key, { rowIndex, columnIndex }] = path;
        if (key === "data") {
          setData((prev) => {
            return {
              ...prev,
              [[rowIndex, columnIndex]]: value,
            };
          });
          setActiveCell({ rowIndex, columnIndex });
        }
      },
      onRedo: (patches) => {
        const { path, value } = patches;
        const [key, { rowIndex, columnIndex }] = path;
        if (key === "data") {
          setData((prev) => {
            return {
              ...prev,
              [[rowIndex, columnIndex]]: value,
            };
          });
          setActiveCell({ rowIndex, columnIndex });
        }
      },
    });
    const [data, setData] = useState({
      "1,1": "Hello",
    });
    const getCellValue = useCallback(
      ({ rowIndex, columnIndex }) => data[[rowIndex, columnIndex]],
      [data]
    );
    const cellValueRef = useRef();
    cellValueRef.current = getCellValue;
    const {
      selections,
      activeCell,
      setActiveCell,
      ...selectionProps
    } = useSelection({
      rowCount,
      columnCount,
      gridRef,
    });
    const {
      editorComponent,
      editingCell,
      isEditInProgress,
      ...editableProps
    } = useEditable({
      gridRef,
      getValue: getCellValue,
      selections,
      activeCell,
      onDelete: (activeCell, selections) => {
        if (selections.length) {
          const newValues = selections.reduce((acc, { bounds: sel }) => {
            for (let i = sel.top; i <= sel.bottom; i++) {
              for (let j = sel.left; j <= sel.right; j++) {
                acc[[i, j]] = "";
              }
            }
            return acc;
          }, {});
          setData((prev) => ({ ...prev, ...newValues }));
          const selectionBounds = selections[0].bounds;

          gridRef.current.resetAfterIndices(
            {
              columnIndex: selectionBounds.left,
              rowIndex: selectionBounds.top,
            },
            true
          );
        } else if (activeCell) {
          addToUndoStack(
            createPatches(
              ["data", activeCell],
              void 0,
              cellValueRef.current(activeCell)
            )
          );

          setData((prev) => {
            return {
              ...prev,
              [[activeCell.rowIndex, activeCell.columnIndex]]: "",
            };
          });
          gridRef.current.resetAfterIndices(activeCell);
        }
      },
      onSubmit: (value, cell, nextActiveCell) => {
        const { rowIndex, columnIndex } = cell;
        const previousValue = cellValueRef.current(cell);
        setData((prev) => ({ ...prev, [[rowIndex, columnIndex]]: value }));
        gridRef.current.resizeColumns([columnIndex]);
        addToUndoStack(createPatches(["data", cell], value, previousValue));

        /* Select the next cell */
        if (nextActiveCell) {
          setActiveCell(nextActiveCell);
        }
      },
    });

    return (
      <div>
        <Grid
          ref={gridRef}
          activeCell={activeCell}
          rowCount={rowCount}
          columnCount={columnCount}
          selections={selections}
          itemRenderer={(props) => (
            <Cell
              {...props}
              padding={0}
              value={getCellValue({
                rowIndex: props.rowIndex,
                columnIndex: props.columnIndex,
              })}
            />
          )}
          {...selectionProps}
          {...editableProps}
          onKeyDown={(...args) => {
            selectionProps.onKeyDown(...args);
            editableProps.onKeyDown(...args);
            undoProps.onKeyDown(...args);
          }}
          onMouseDown={(...args) => {
            selectionProps.onMouseDown(...args);
            editableProps.onMouseDown(...args);
          }}
        />
        {editorComponent}
        <button disabled={!canUndo} onClick={undo}>
          Undo
        </button>
        <button disabled={!canRedo} onClick={redo}>
          Redo
        </button>
      </div>
    );
  };

  return <App />;
};

UndoRedo.story = {
  name: "Default",
};
