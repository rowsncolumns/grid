import React, { useRef } from "react";
import Grid, {
  Cell,
  GridRef,
  useSelection,
  usePagination,
} from "@rowsncolumns/grid";

export default {
  title: "Pagination",
  component: Grid,
};

export const Pagination = () => {
  const App = () => {
    const rowCount = 100;
    const columnCount = 100;
    const gridRef = useRef<GridRef>();
    const { selections, ...selectionProps } = useSelection({
      gridRef,
    });
    const pageSize = 8;
    const { currentPage, paginationComponent } = usePagination({
      pageSize,
      total: rowCount,
      onChange: (page) => {
        /* Async call to fetch data from the server? */
      },
    });
    return (
      <div>
        <Grid
          ref={gridRef}
          rowCount={pageSize}
          columnCount={columnCount}
          selections={selections}
          rowHeight={() => 60}
          itemRenderer={(props) => (
            <Cell
              {...props}
              padding={0}
              value={`Page: ${currentPage} Row: ${
                props.rowIndex + (currentPage - 1) * pageSize
              }`}
            />
          )}
          {...selectionProps}
        />
        {paginationComponent}
      </div>
    );
  };

  return <App />;
};

Pagination.story = {
  name: "Pagination",
};
