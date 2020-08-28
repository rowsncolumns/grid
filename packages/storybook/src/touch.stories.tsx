import React, { useRef } from "react";
import Grid, { Cell, useSelection, useTouch } from "@rowsncolumns/grid";

export default {
  title: "Mobile (touch)",
  component: Grid,
};

export const TouchGrid = () => {
  const rowCount = 200;
  const columnCount = 200;
  const gridRef = useRef();
  const { selections, ...selectionProps } = useSelection({
    gridRef,
    rowCount,
    columnCount,
  });
  const touchProps = useTouch({
    gridRef,
  });
  return (
    <Grid
      ref={gridRef}
      itemRenderer={(props) => (
        <Cell {...props} value={`${props.rowIndex}:${props.columnIndex}`} />
      )}
      rowCount={rowCount}
      columnCount={columnCount}
      selections={selections}
      {...selectionProps}
      {...touchProps}
    />
  );
};

TouchGrid.story = {
  name: "Default",
};
