// @ts-nocheck
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Grid, {
  IChildrenProps,
  Cell as DefaultCell,
  useSelection,
  useEditable,
  useSizer as useAutoSizer,
  useTooltip,
  Direction,
  SelectionProps,
  Selection,
} from "@rowsncolumns/grid";
import { useMeasure } from "react-use";
import { Rect, Text, Group, RegularPolygon } from "react-konva";

export default {
  title: "Grid",
  component: Grid,
};

export const BaseGrid: React.FC = () => {
  const width = 900;
  const height = 600;
  const App = () => {
    return (
      <Grid
        width={width}
        height={height}
        columnCount={200}
        rowCount={200}
        columnWidth={(index) => {
          return 100;
        }}
        itemRenderer={(props) => (
          <DefaultCell
            {...props}
            value={`${props.rowIndex}:${props.columnIndex}`}
          />
        )}
        rowHeight={(index) => {
          return 20;
        }}
      />
    );
  };

  return <App />;
};

export const BaseGridSnap: React.FC = () => {
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="white"
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  const App = () => {
    return (
      <Grid
        width={width}
        height={height}
        columnCount={200}
        rowCount={200}
        columnWidth={(index) => {
          return 100;
        }}
        snap
        itemRenderer={(props) => <Cell {...props} />}
        rowHeight={(index) => {
          return 20;
        }}
      />
    );
  };

  return <App />;
};

BaseGridSnap.story = {
  name: "Autosnap",
};

export const FullWidthGrid: React.FC = () => {
  const itemRenderer = (props) => (
    <DefaultCell value={`${props.rowIndex}:${props.columnIndex}`} {...props} />
  );
  const App = () => {
    const [containerRef, { width, height }] = useMeasure();
    return (
      <div
        style={{
          flex: 1,
          width: "100%",
          height: 600,
        }}
        ref={containerRef}
      >
        <Grid
          width={width}
          height={height}
          columnCount={200}
          rowCount={200}
          columnWidth={(index) => {
            return 100;
          }}
          itemRenderer={itemRenderer}
          rowHeight={(index) => {
            return 20;
          }}
        />
      </div>
    );
  };

  return <App />;
};

export const AutoSizer: React.FC = () => {
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
    value,
  }: IChildrenProps) => {
    const text = value || `${rowIndex}x${columnIndex}`;
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="white"
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="left"
          offsetX={-5}
        />
      </>
    );
  };
  const App = () => {
    const [data, setData] = useState({
      [[1, 2]]: "Hello, good morning",
      [[30, 4]]: "lorem asd asd as das dasd asd as da sdasdasda",
      [[2, 15]]: "lorem asd asd as das dasd asd as da sdasdasda",
    });
    const gridRef = useRef(null);
    const getCellValue = useCallback(
      ({ rowIndex, columnIndex }) => data[[rowIndex, columnIndex]],
      [data]
    );
    const autoSizerProps = useAutoSizer({
      gridRef,
      getValue: getCellValue,
    });
    return (
      <Grid
        ref={gridRef}
        width={width}
        height={height}
        columnCount={200}
        rowCount={200}
        columnWidth={(index) => {
          return 100;
        }}
        itemRenderer={(props) => (
          <Cell value={data[[props.rowIndex, props.columnIndex]]} {...props} />
        )}
        rowHeight={(index) => {
          return 20;
        }}
        {...autoSizerProps}
      />
    );
  };

  return <App />;
};

export const MergedCells: React.FC = () => {
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="white"
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  const App = () => {
    const mergedCells = [
      {
        top: 5,
        left: 5,
        right: 6,
        bottom: 5,
      },
      {
        top: 1,
        left: 2,
        right: 4,
        bottom: 5,
      },
      {
        top: 5,
        left: 0,
        right: 1,
        bottom: 5,
      },
    ];
    const gridRef = useRef();
    const rowCount = 200;
    const columnCount = 200;
    const {
      selection,
      onSelectionMouseDown,
      isDragging,
      draggedSelection,
      ...selectionProps
    } = useSelection({
      gridRef,
      rowCount,
      columnCount,
      mergedCells: mergedCells,
    });
    const borderStyles = useMemo(() => {
      if (draggedSelection) {
        return [
          {
            ...draggedSelection,
            style: {
              strokeStyle: "dashed",
              strokeWidth: 2,
              stroke: "#1a73e8",
            },
          },
        ];
      }
      return [];
    }, [draggedSelection]);

    return (
      <Grid
        width={width}
        height={height}
        columnCount={200}
        rowCount={200}
        ref={gridRef}
        mergedCells={mergedCells}
        columnWidth={(index) => {
          return 100;
        }}
        itemRenderer={(props) => <Cell {...props} />}
        rowHeight={(index) => {
          return 20;
        }}
        isDraggingSelection={isDragging}
        selectionRenderer={(props: SelectionProps) => {
          return (
            <Selection
              {...props}
              onMouseDown={(e) => {
                onSelectionMouseDown?.(
                  e,
                  props.activeCell,
                  props.selection,
                  props.key
                );
              }}
            />
          );
        }}
        borderStyles={borderStyles}
        // borderStyles={
        //   [
        //     {
        //       bounds: {
        //         top: 10,
        //         left: 1,
        //         right: 3,
        //         bottom: 12
        //       },
        //       style: {
        //         strokeStyle: 'dashed',
        //         strokeWidth: 2,
        //         stroke: 'blue'
        //       }
        //     }
        //   ]
        // }
        {...selectionProps}
      />
    );
  };

  return <App />;
};

export const BaseGridWithSelection: React.FC = () => {
  const width = 900;
  const height = 600;
  const initialSelections = [
    {
      bounds: {
        top: 2,
        right: 3,
        left: 2,
        bottom: 20,
      },
      style: {
        // strokeWidth: 1,
        // stroke: "red",
        borderStyle: "dashed",
      },
    },
  ];

  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    return (
      <>
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  const App = () => {
    const gridRef = useRef();
    const rowCount = 200;
    const columnCount = 200;
    const { selections, activeCell, ...selectionProps } = useSelection({
      initialSelections,
      gridRef,
      rowCount,
      columnCount,
    });
    return (
      <Grid
        width={width}
        height={height}
        selections={selections}
        activeCell={activeCell}
        columnCount={2000}
        rowCount={2000}
        showGridLines
        gridLineColor="gray"
        showFillHandle={false}
        frozenColumns={1}
        frozenRows={1}
        snap
        ref={gridRef}
        {...selectionProps}
        columnWidth={(index) => {
          return 100;
        }}
        rowHeight={(index) => {
          return 20;
        }}
        itemRenderer={Cell}
      />
    );
  };

  return <App />;
};

export const VariableSizeGrid: React.FC = () => {
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="white"
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  return (
    <Grid
      width={width}
      height={height}
      columnCount={200}
      rowCount={200}
      columnWidth={(index) => {
        if (index % 3 === 0) return 200;
        return 100;
      }}
      rowHeight={(index) => {
        if (index % 2 === 0) return 40;
        return 20;
      }}
      itemRenderer={Cell}
    />
  );
};

export const LargeGrid: React.FC = () => {
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    const fill =
      columnIndex % 2 === 0
        ? rowIndex % 2 === 0
          ? "#f8f8f0"
          : "white"
        : rowIndex % 2
        ? "#f8f8f0"
        : "white";
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill={fill}
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  return (
    <Grid
      width={width}
      height={height}
      columnCount={1000000}
      rowCount={1000000}
      columnWidth={(index) => {
        if (index % 3 === 0) return 200;
        return 100;
      }}
      rowHeight={(index) => {
        if (index % 2 === 0) return 40;
        return 20;
      }}
      itemRenderer={Cell}
    />
  );
};

LargeGrid.story = {
  name: "1,000,000 rows and cols",
};

export const DataGrid: React.FC = () => {
  const width = 900;
  const height = 600;
  const gridRef = useRef();
  const frozenColumns = 1;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
    header,
  }: IChildrenProps) => {
    const text = header
      ? columnIndex < frozenColumns
        ? "S/No"
        : `Header ${columnIndex}`
      : `${rowIndex}x${columnIndex}`;
    const fill = header ? "#eee" : "white";
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill={fill}
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          fontStyle={header ? "bold" : "normal"}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  const columnCount = 100000;
  const rowCount = 100000;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Grid
        columnCount={columnCount}
        height={40}
        rowCount={1}
        frozenColumns={frozenColumns}
        ref={gridRef}
        width={width}
        columnWidth={(index) => {
          if (index === 0) return 80;
          if (index % 3 === 0) return 200;
          return 100;
        }}
        rowHeight={(index) => {
          if (index % 2 === 0) return 40;
          return 20;
        }}
        showScrollbar={false}
        itemRenderer={(props) => <Cell {...props} header />}
      />
      <Grid
        columnCount={columnCount}
        rowCount={rowCount}
        frozenColumns={frozenColumns}
        height={height}
        width={width}
        columnWidth={(index) => {
          if (index === 0) return 80;
          if (index % 3 === 0) return 200;
          return 100;
        }}
        rowHeight={(index) => {
          if (index % 2 === 0) return 40;
          return 20;
        }}
        onScroll={({ scrollLeft }) => {
          gridRef.current.scrollTo({ scrollLeft });
        }}
        itemRenderer={Cell}
      />
    </div>
  );
};

export const DataGridResize: React.FC = () => {
  const dragHandleWidth = 5;
  const DraggableRect = (props) => {
    return (
      <Rect
        fill="blue"
        draggable
        hitStrokeWidth={20}
        onMouseEnter={() => (document.body.style.cursor = "ew-resize")}
        onMouseLeave={() => (document.body.style.cursor = "default")}
        dragBoundFunc={(pos) => {
          return {
            ...pos,
            y: 0,
          };
        }}
        {...props}
      />
    );
  };
  const HeaderComponent = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
    frozenColumns,
    onResize,
  }) => {
    const text = columnIndex < frozenColumns ? "S/No" : `Header ${columnIndex}`;
    const fill = "#eee";
    return (
      <Group>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill={fill}
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          fontStyle="bold"
          verticalAlign="middle"
          align="center"
        />
        <DraggableRect
          x={x + width - dragHandleWidth}
          y={y}
          width={dragHandleWidth}
          height={height}
          onDragMove={(e) => {
            const node = e.target;
            const newWidth = node.x() - x + dragHandleWidth;

            onResize(columnIndex, newWidth);
          }}
        />
      </Group>
    );
  };
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
    key,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    const fill = "white";
    return (
      <React.Fragment key={key}>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill={fill}
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          fontStyle="normal"
          verticalAlign="middle"
          align="center"
        />
      </React.Fragment>
    );
  };
  const columnCount = 100000;
  const rowCount = 100000;
  const App = () => {
    const width = 900;
    const height = 600;
    const gridRef = useRef();
    const mainGridRef = useRef();
    const frozenColumns = 1;
    const [columnWidthMap, setColumnWidthMap] = useState({});
    const handleResize = (columnIndex, newWidth) => {
      setColumnWidthMap((prev) => {
        return {
          ...prev,
          [columnIndex]: newWidth,
        };
      });
      gridRef.current.resizeColumns([columnIndex]);
      mainGridRef.current.resizeColumns([columnIndex]);
    };
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Grid
          columnCount={columnCount}
          height={40}
          rowCount={1}
          frozenColumns={frozenColumns}
          ref={gridRef}
          width={width}
          columnWidth={(index) => {
            if (index in columnWidthMap) return columnWidthMap[index];
            if (index === 0) return 80;
            if (index % 3 === 0) return 200;
            return 100;
          }}
          rowHeight={(index) => {
            if (index % 2 === 0) return 40;
            return 20;
          }}
          showScrollbar={false}
          itemRenderer={(props) => (
            <HeaderComponent
              onResize={handleResize}
              frozenColumns={frozenColumns}
              {...props}
            />
          )}
        />
        <Grid
          columnCount={columnCount}
          rowCount={rowCount}
          frozenColumns={frozenColumns}
          height={height}
          width={width}
          ref={mainGridRef}
          columnWidth={(index) => {
            if (index in columnWidthMap) return columnWidthMap[index];
            if (index === 0) return 80;
            if (index % 3 === 0) return 200;
            return 100;
          }}
          rowHeight={(index) => {
            if (index % 2 === 0) return 40;
            return 20;
          }}
          onScroll={({ scrollLeft }) => {
            gridRef.current.scrollTo({ scrollLeft });
          }}
          itemRenderer={Cell}
        />
      </div>
    );
  };
  return <App />;
};

DataGridResize.story = {
  name: "Grid with resizable headers",
};

export const GridWithFrozenRow: React.FC = () => {
  const frozenRows = 1;
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    const isFrozen = rowIndex < frozenRows;
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill={isFrozen ? "lightblue" : "white"}
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  return (
    <Grid
      width={width}
      height={height}
      columnCount={200}
      rowCount={200}
      frozenRows={frozenRows}
      columnWidth={(index) => {
        return 100;
      }}
      rowHeight={(index) => {
        return 20;
      }}
      itemRenderer={Cell}
    />
  );
};
GridWithFrozenRow.story = {
  name: "Frozen rows",
};

export const GridWithFrozenColumns: React.FC = () => {
  const frozenColumns = 1;
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    const isFrozen = columnIndex < frozenColumns;
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill={isFrozen ? "lightblue" : "white"}
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  return (
    <Grid
      width={width}
      height={height}
      columnCount={200}
      rowCount={200}
      frozenColumns={frozenColumns}
      columnWidth={(index) => {
        return 100;
      }}
      rowHeight={(index) => {
        return 20;
      }}
      itemRenderer={Cell}
    />
  );
};
GridWithFrozenColumns.story = {
  name: "Frozen columns",
};

export const GridWithFrozenEdges: React.FC = () => {
  const frozenRows = 2;
  const frozenColumns = 2;
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    const isFrozen = rowIndex < frozenRows || columnIndex < frozenColumns;
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill={isFrozen ? "lightblue" : "white"}
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  const App = () => {
    const gridRef = useRef();
    const rowCount = 200;
    const columnCount = 200;
    const { selection, ...selectionProps } = useSelection({
      gridRef,
      rowCount,
      columnCount,
    });
    return (
      <Grid
        ref={gridRef}
        selection={selection}
        width={width}
        height={height}
        columnCount={100000}
        rowCount={100000}
        frozenColumns={frozenColumns}
        frozenRows={frozenRows}
        columnWidth={(index) => {
          return 100;
        }}
        rowHeight={(index) => {
          return 20;
        }}
        itemRenderer={Cell}
        {...selectionProps}
      />
    );
  };

  return <App />;
};

GridWithFrozenEdges.story = {
  name: "Frozen columns and rows",
};

export const EditableGrid: React.FC = () => {
  const width = 900;
  const height = 600;
  const SelectEditor: React.FC<EditorProps> = (props) => {
    const {
      position,
      onSubmit,
      value,
      cell,
      nextFocusableCell,
      onBlur,
    } = props;
    return (
      <div
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
        }}
      >
        <select
          style={{ width: "100%" }}
          autoFocus
          value={value}
          onBlur={onBlur}
          value={value}
          onChange={(e) => {
            onSubmit(
              e.target.value,
              cell,
              nextFocusableCell(cell, Direction.Down)
            );
          }}
        >
          <option>Yay Select</option>
          <option>This can be any React Component</option>
        </select>
      </div>
    );
  };
  const App = () => {
    const [data, setData] = useState({
      [[1, 2]]: "Hello lorem ipsum lorem",
      [[1, 1]]: "Select editor",
      [[2, 3]]: "Cannot be edited",
      [[30, 4]]: "lorem asd asd as das dasd asd as da sdasdasda",
      [[2, 15]]: "lorem asd asd as das dasd asd as da sdasdasda",
      [[100, 80]]: "asdhasd asd asd asd as dasdas",
    });
    const rowCount = 200;
    const columnCount = 200;
    const gridRef = useRef(null);
    const getCellValue = useCallback(
      ({ rowIndex, columnIndex }) => data[[rowIndex, columnIndex]],
      [data]
    );
    const frozenRows = 2;
    const frozenColumns = 2;
    const {
      activeCell,
      selections,
      setActiveCell,
      ...selectionProps
    } = useSelection({
      gridRef,
      rowCount,
      columnCount,
      onFill: (activeCell, fillSelection) => {
        if (!fillSelection) return;
        const { bounds } = fillSelection;
        const changes = {};
        const value = getCellValue(activeCell);
        for (let i = bounds.top; i <= bounds.bottom; i++) {
          for (let j = bounds.left; j <= bounds.right; j++) {
            changes[[i, j]] = value;
          }
        }
        setData((prev) => ({ ...prev, ...changes }));
      },
    });
    const { getTextMetrics, ...autoSizerProps } = useAutoSizer({
      gridRef,
      getValue: getCellValue,
      resizeStrategy: "lazy",
      rowCount,
      autoResize: false,
    });
    const { editorComponent, isEditInProgress, ...editableProps } = useEditable(
      {
        rowCount,
        columnCount,
        gridRef,
        getValue: getCellValue,
        selections,
        frozenRows,
        frozenColumns,
        getEditor: ({ rowIndex, columnIndex }) => {
          if (rowIndex == 1 && columnIndex === 1) {
            return SelectEditor;
          }
          return undefined;
        },
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
            setData((prev) => {
              return {
                ...prev,
                [[activeCell.rowIndex, activeCell.columnIndex]]: "",
              };
            });
            gridRef.current.resetAfterIndices(activeCell);
          }
        },
        canEdit: ({ rowIndex, columnIndex }) => {
          if (rowIndex === 2 && columnIndex === 3) return false;
          return true;
        },
        onSubmit: (value, { rowIndex, columnIndex }, nextActiveCell) => {
          setData((prev) => ({ ...prev, [[rowIndex, columnIndex]]: value }));
          gridRef.current.resizeColumns([columnIndex]);

          /* Select the next cell */
          if (nextActiveCell) {
            setActiveCell(nextActiveCell);
          }
        },
      }
    );
    const rowHeight = useCallback(() => 20, []);
    const columnWidth = useCallback(() => 100, []);
    return (
      <div style={{ position: "relative" }}>
        <Grid
          frozenColumns={frozenColumns}
          frozenRows={frozenRows}
          width={width}
          height={height}
          columnCount={100000}
          rowCount={100000}
          ref={gridRef}
          activeCell={activeCell}
          selections={selections}
          columnWidth={columnWidth}
          showFillHandle={!isEditInProgress}
          itemRenderer={(props) => (
            <DefaultCell
              value={data[[props.rowIndex, props.columnIndex]]}
              align="left"
              {...props}
            />
          )}
          rowHeight={rowHeight}
          {...selectionProps}
          {...editableProps}
          {...autoSizerProps}
          onKeyDown={(...args) => {
            selectionProps.onKeyDown(...args);
            editableProps.onKeyDown(...args);
          }}
          onMouseDown={(...args) => {
            selectionProps.onMouseDown(...args);
            editableProps.onMouseDown(...args);
          }}
        />
        {editorComponent}
      </div>
    );
  };

  return <App />;
};

export const WithTooltip: React.FC = () => {
  const width = 900;
  const height = 600;
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = `${rowIndex}x${columnIndex}`;
    return (
      <>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="white"
          stroke="grey"
          strokeWidth={0.5}
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </>
    );
  };
  const App = () => {
    const gridRef = useRef();
    const { tooltipComponent, ...tooltipProps } = useTooltip({
      gridRef,
      getValue: ({ rowIndex, columnIndex }) => {
        return `You are at: ${rowIndex}, ${columnIndex}`;
      },
    });
    return (
      <div style={{ position: "relative" }}>
        <Grid
          ref={gridRef}
          width={width}
          height={height}
          columnCount={200}
          rowCount={200}
          columnWidth={(index) => {
            return 100;
          }}
          itemRenderer={(props) => <Cell {...props} />}
          rowHeight={(index) => {
            return 20;
          }}
          {...tooltipProps}
        />
        {tooltipComponent}
      </div>
    );
  };

  return <App />;
};

export const GridWithContextMenu: React.FC = () => {
  const width = 900;
  const height = 600;
  const ContextMenu = ({ left, top, rowIndex, columnIndex }) => {
    return (
      <div
        style={{
          left,
          top,
          position: "absolute",
          padding: 8,
          background: "white",
          boxShadow: "0 1px 2px 3px rgba(0,0,0,0.2)",
        }}
      >
        <div>
          You selected {rowIndex}: {columnIndex}
        </div>
        <a href="#" style={{ display: "block", padding: 8 }}>
          Hide column
        </a>
      </div>
    );
  };
  const App = () => {
    const gridRef = useRef();
    const [contextMenuPostion, setContextMenuPosition] = useState(null);
    return (
      <div style={{ position: "relative" }}>
        <Grid
          ref={gridRef}
          onContextMenu={(e) => {
            const {
              rowIndex,
              columnIndex,
            } = gridRef.current.getCellCoordsFromOffset(e.clientX, e.clientY);
            setContextMenuPosition({
              left: e.clientX + 10,
              top: e.clientY + 10,
              rowIndex,
              columnIndex,
            });
            e.preventDefault();
          }}
          onMouseDown={() => setContextMenuPosition(null)}
          width={width}
          height={height}
          columnCount={200}
          rowCount={200}
          columnWidth={(index) => {
            return 100;
          }}
          itemRenderer={(props) => (
            <DefaultCell
              {...props}
              value={`${props.rowIndex}:${props.columnIndex}`}
            />
          )}
          rowHeight={(index) => {
            return 20;
          }}
        />
        {contextMenuPostion && <ContextMenu {...contextMenuPostion} />}
      </div>
    );
  };

  return <App />;
};
