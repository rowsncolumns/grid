// @ts-nocheck
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import Grid, {
  Cell,
  useSelection,
  SelectionArea,
  GridRef,
  useCopyPaste,
} from "@rowsncolumns/grid";

export default {
  title: "Copy Paste",
  component: Grid,
};

export const Default = () => {
  const rowCount = 100;
  const columnCount = 100;
  const App = () => {
    const [data, setData] = useState({
      [[1, 2]]: "Hello world",
    });
    const gridRef = useRef<GridRef>();
    const getValue = useCallback(
      ({ rowIndex, columnIndex }) => {
        return data[[rowIndex, columnIndex]];
      },
      [data]
    );
    const {
      activeCell,
      selections,
      setSelections,
      ...selectionProps
    } = useSelection({
      gridRef,
      columnCount,
      rowCount,
    });

    const { copy, paste } = useCopyPaste({
      gridRef,
      selections,
      activeCell,
      getValue,
      onPaste: (rows, activeCell) => {
        const { rowIndex, columnIndex } = activeCell;
        const endRowIndex = Math.max(rowIndex, rowIndex + rows.length - 1);
        const endColumnIndex = Math.max(
          columnIndex,
          columnIndex + (rows.length && rows[0].length - 1)
        );
        const changes = {};
        for (const [i, row] of rows.entries()) {
          for (const [j, cell] of row.entries()) {
            changes[[rowIndex + i, columnIndex + j]] = cell;
          }
        }
        setData((prev) => ({ ...prev, ...changes }));

        /* Should select */
        if (rowIndex === endRowIndex && columnIndex === endColumnIndex) return;

        setSelections([
          {
            bounds: {
              top: rowIndex,
              left: columnIndex,
              bottom: endRowIndex,
              right: endColumnIndex,
            },
          },
        ]);
      },
      onCut: (selection) => {
        const { bounds } = selection;
        const changes = {};
        for (let i = bounds.top; i <= bounds.bottom; i++) {
          for (let j = bounds.left; j <= bounds.right; j++) {
            changes[[i, j]] = undefined;
          }
        }
        setData((prev) => ({ ...prev, ...changes }));
      },
    });
    return (
      <>
        <button onClick={() => copy()}>Copy</button>
        <button onClick={() => paste()}>Paste</button>
        <Grid
          activeCell={activeCell}
          selections={selections}
          ref={gridRef}
          rowCount={rowCount}
          columnCount={columnCount}
          columnWidth={() => 100}
          itemRenderer={(props) => {
            return (
              <Cell
                {...props}
                value={data[[props.rowIndex, props.columnIndex]]}
              />
            );
          }}
          {...selectionProps}
        />
      </>
    );
  };
  return <App />;
};

Default.story = {
  name: "Copy cells",
};
