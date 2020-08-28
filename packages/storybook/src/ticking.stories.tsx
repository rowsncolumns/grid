// @ts-nocheck
import React, { memo, useRef, useState, useCallback, useEffect } from "react";
import Grid, { Cell, CellRenderer, useSelection } from "@rowsncolumns/grid";

export default {
  title: "Ticking",
  component: Grid,
};

const generateKey = (min = 0, max = 10) => {
  const rowIndex = Math.floor(Math.random() * 30) + min;
  const columnIndex = Math.floor(Math.random() * 30) + min;
  return [rowIndex, columnIndex];
};

const DataCell = memo((props) => {
  const { value } = props;
  const color = value > 0 ? "green" : "red";
  return <Cell {...props} textColor={color} align="right" padding={5} />;
});

export const TickingGrid = () => {
  const [data, setData] = useState({
    [[0, 0]]: 1,
    [[0, 2]]: -20,
  });
  const gridRef = useRef();

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      setData((prev) => {
        const isNegative = Math.random() < 0.5 ? -1 : 1;
        const key = generateKey();
        const key2 = generateKey();
        return {
          ...prev,
          [key]: isNegative * Math.floor(Math.random() * 100) + 1,
          [key2]: isNegative * Math.floor(Math.random() * 100) + 1,
        };
      });
      /* Refresh grid sizes, works with autosizer */
      // gridRef.current.resetAfterIndices({rowIndex:0, columnIndex:0}, false)
    }, 20);

    return () => clearInterval(interval);
  }, []);
  const getValue = useCallback(
    ({ rowIndex, columnIndex }) => {
      return data[[rowIndex, columnIndex]];
    },
    [data]
  );
  const rowCount = 200;
  const columnCount = 200;
  const { selections, ...selectionProps } = useSelection({
    gridRef,
    rowCount,
    columnCount,
  });
  // const autoSizerProps = useAutoSizer({ gridRef, getValue, minColumnWidth: 40 })
  return (
    <Grid
      ref={gridRef}
      itemRenderer={(props) => (
        <DataCell
          {...props}
          value={getValue({
            rowIndex: props.rowIndex,
            columnIndex: props.columnIndex,
          })}
        />
      )}
      rowCount={rowCount}
      columnCount={columnCount}
      selections={selections}
      {...selectionProps}
      // {...autoSizerProps}
    />
  );
};

TickingGrid.story = {
  name: "Default",
};
