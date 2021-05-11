import React, { useRef, memo } from "react";
import ReactDOM from "react-dom";
import Grid, {
  Cell,
  useEditable,
  useSelection,
  useSizer as useAutoSizer,
} from "@rowsncolumns/grid";
import create from "zustand";

const [dataStore] = create((set, get) => {
  return {
    data: {
      [[1, 0]]: "Hello world",
    },
    setValue: (changes) => {
      set((state) => {
        return {
          data: {
            ...state.data,
            ...changes,
          },
        };
      });
    },
    getValue: ({ rowIndex, columnIndex }) => {
      return get().data[[rowIndex, columnIndex]];
    },
  };
});

const DataCell = memo((props) => {
  const { rowIndex, columnIndex } = props;
  const value = dataStore((state) => state.data[[rowIndex, columnIndex]]);
  return <Cell {...props} value={value} />;
});

const App = () => {
  const rowCount = 100;
  const columnCount = 100;
  const gridRef = useRef();
  const [getValue, setValue] = dataStore((state) => [
    state.getValue,
    state.setValue,
  ]);
  const { selections, newSelection, ...selectionProps } = useSelection({
    gridRef,
    rowCount,
    columnCount,
  });
  const { editorComponent, ...editableProps } = useEditable({
    gridRef,
    getValue,
    selections,
    onSubmit: (value, { rowIndex, columnIndex }) => {
      const changes = {
        [[rowIndex, columnIndex]]: value,
      };
      setValue(changes);
      /* Trigger redraw visible cells after this cell */
      gridRef.current.resetAfterIndices({ rowIndex, columnIndex });
    },
  });
  const autoSizerProps = useAutoSizer({
    gridRef,
    getValue,
    rowCount,
    resizeStrategy: "full",
  });
  return (
    <div style={{ position: "relative" }}>
      <Grid
        selections={selections}
        ref={gridRef}
        rowCount={rowCount}
        columnCount={columnCount}
        itemRenderer={(props) => <DataCell {...props} />}
        {...selectionProps}
        {...editableProps}
        {...autoSizerProps}
        onKeyDown={(...args) => {
          selectionProps.onKeyDown(...args);
          editableProps.onKeyDown(...args);
        }}
      />
      {editorComponent}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
