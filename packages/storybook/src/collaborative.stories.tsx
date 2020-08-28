import React, { useRef } from "react";
import Grid, {
  Cell,
  useSelection,
  useTouch,
  GridRef,
  useTooltip,
  DefaultTooltipProps,
} from "@rowsncolumns/grid";

export default {
  title: "Collaboration",
  component: Grid,
};

export const SharedActiveCells = () => {
  const rowCount = 200;
  const columnCount = 200;
  const gridRef = useRef<GridRef>();
  const { selections, ...selectionProps } = useSelection({
    gridRef,
    rowCount,
    columnCount,
    getValue: () => {
      return "";
    },
  });
  const touchProps = useTouch({
    gridRef,
  });
  const sharedActiveCells = [
    {
      label: "User A",
      isEditing: false,
      cell: {
        rowIndex: 1,
        columnIndex: 2,
      },
      style: {
        fill: "rgba(0,0,0,0.2)",
        stroke: "green",
        strokeWidth: 2,
      },
    },
    {
      label: "User B",
      isEditing: false,
      cell: {
        rowIndex: 4,
        columnIndex: 6,
      },
      style: {
        stroke: "green",
        strokeWidth: 2,
      },
    },
  ];
  const { tooltipComponent, ...tooltipProps } = useTooltip({
    gridRef,
    getTooltip: (cell) => {
      return (props: DefaultTooltipProps) => {
        const {
          x = 0,
          y = 0,
          scrollLeft = 0,
          scrollTop = 0,
          width = 0,
          height = 0,
        } = props;
        const isSharedActiveCell = sharedActiveCells.find(
          (item) =>
            item.cell.rowIndex === cell.rowIndex &&
            item.cell.columnIndex === cell.columnIndex
        );
        if (!isSharedActiveCell) return null;
        const posX = x + width - scrollLeft;
        const posY = y - scrollTop;
        return (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translate(${posX}px, ${posY}px)`,
              background: "green",
              boxShadow: "0 4px 8px 3px rgba(60,64,67,.15)",
              padding: 2,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
              fontSize: 12,
              fontFamily: "Arial",
              color: "white",
            }}
          >
            {isSharedActiveCell.label}
          </div>
        );
      };
    },
  });
  const borderStyles = sharedActiveCells.map(({ cell, style }) => {
    return {
      bounds: {
        top: cell.rowIndex,
        bottom: cell.rowIndex,
        left: cell.columnIndex,
        right: cell.columnIndex,
      },
      style,
    };
  });
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Grid
        ref={gridRef}
        itemRenderer={(props) => (
          <Cell {...props} value={`${props.rowIndex}:${props.columnIndex}`} />
        )}
        showFillHandle
        rowCount={rowCount}
        columnCount={columnCount}
        selections={selections}
        borderStyles={borderStyles}
        {...selectionProps}
        {...touchProps}
        {...tooltipProps}
      />
      {tooltipComponent}
    </div>
  );
};

SharedActiveCells.story = {
  name: "Default",
};
