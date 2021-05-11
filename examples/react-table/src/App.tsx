import React, { useRef } from "react";
import Grid, { RendererProps, GridRef, useSelection } from "@rowsncolumns/grid";
import { Group, Rect, Text } from "react-konva";
import { useTable } from "react-table";
import makeData from "./makeData";

export default function App() {
  const data = React.useMemo(() => makeData(2000), []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age",
          },
          {
            Header: "Visits",
            accessor: "visits",
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Profile Progress",
            accessor: "progress",
          },
        ],
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    ...rest
  } = useTable({
    columns,
    data,
  });
  const frozenRows = headerGroups.length;
  const mergedCells = [];
  const headerCellMap = {};
  headerGroups.forEach((headerGroup, rowIdx) => {
    let prevSpan = 0;
    headerGroup.headers.forEach((column, idx) => {
      const { colSpan } = column.getHeaderProps();
      if (colSpan > 1) {
        mergedCells.push({
          top: rowIdx,
          left: prevSpan,
          right: colSpan + prevSpan - 1,
          bottom: rowIdx,
        });

        headerCellMap[[rowIdx, prevSpan]] = column;
      } else {
        headerCellMap[[rowIdx, idx]] = column;
      }
      prevSpan += colSpan;
    });
  });
  const gridRef = useRef<GridRef>(null);
  const rowCount = rows.length;
  const columnCount = visibleColumns.length;
  const { selections, activeCell, ...selectionProps } = useSelection({
    gridRef,
    rowCount,
    columnCount,
  });
  return (
    <div className="App">
      <Grid
        ref={gridRef}
        selections={selections}
        activeCell={activeCell}
        columnCount={columnCount}
        rowCount={rowCount}
        rowHeight={() => 20}
        columnWidth={() => 100}
        mergedCells={mergedCells}
        itemRenderer={(props) => {
          if (props.rowIndex < frozenRows) {
            const value =
              headerCellMap[[props.rowIndex, props.columnIndex]].Header;
            return <Header {...props} value={value} />;
          }

          const row = rows[props.rowIndex];
          const cell = row.cells[props.columnIndex];
          // console.log('d', row, cell, cell.render('Cell'))
          return <Cell value={cell.value} {...props} />;
        }}
        onBeforeRenderRow={(rowIndex) => {
          prepareRow(rows[rowIndex]);
        }}
        width={600}
        height={600}
        frozenRows={frozenRows}
        {...selectionProps}
      />
    </div>
  );
}

const Cell = ({
  rowIndex,
  columnIndex,
  key,
  x,
  y,
  width,
  height,
  value,
}: RendererProps) => {
  return (
    <Group key={key}>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="white"
        stroke="#ccc"
        strokeWidth={1}
      />
      <Text
        x={x}
        y={y}
        width={width}
        height={height}
        text={value}
        verticalAlign="middle"
        offsetX={-10}
      />
    </Group>
  );
};

const Header = ({ rowIndex, columnIndex, x, y, width, height, key, value }) => {
  return (
    <Group key={key}>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#eee"
        stroke="#bbb"
        strokeWidth={1}
      />
      <Text
        x={x}
        y={y}
        width={width}
        height={height}
        text={value}
        verticalAlign="middle"
        offsetX={-10}
      />
    </Group>
  );
};
