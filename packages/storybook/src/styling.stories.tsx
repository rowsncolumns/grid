import React, { useRef } from "react";
import Grid, { Cell, GridRef, useSelection } from "@rowsncolumns/grid";

export default {
  title: "Styling",
  component: Grid,
};

export const Borders = () => {
  const App = () => {
    const rowCount = 100;
    const columnCount = 100;
    const borderStyles = [
      {
        bounds: {
          top: 1,
          left: 1,
          right: 1,
          bottom: 1,
        },
        style: {
          strokeWidth: 1,
          stroke: "red",
        },
      },
      {
        bounds: {
          top: 5,
          left: 5,
          right: 8,
          bottom: 8,
        },
        style: {
          strokeWidth: 1,
          stroke: "green",
          fill: "red",
        },
      },
    ];
    const gridRef = useRef<GridRef>();
    const { selections, ...selectionProps } = useSelection({
      gridRef,
    });
    return (
      <Grid
        ref={gridRef}
        rowCount={rowCount}
        columnCount={columnCount}
        selections={selections}
        borderStyles={borderStyles}
        {...selectionProps}
      />
    );
  };

  return <App />;
};

Borders.story = {
  name: "Borders",
};
