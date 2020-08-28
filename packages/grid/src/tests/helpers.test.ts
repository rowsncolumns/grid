// @ts-nocheck
import {
  getEstimatedTotalWidth,
  getEstimatedTotalHeight,
  getBoundedCells,
  cellIdentifier,
  extendAreaToMergedCells,
  areaIntersects,
  findNextContentfulCell,
  findLastContentfulCell,
} from "../helpers";
import { Direction } from "../types";

describe("getBoundedCells", () => {
  it("returns empty for undefined area", () => {
    const cells = getBoundedCells(undefined);
    expect(cells.size).toBe(0);
  });

  it("returns accurate top, left, right and bottom indexs", () => {
    const cells = getBoundedCells({
      top: 1,
      right: 5,
      left: 1,
      bottom: 5,
    });
    expect(cells.has(cellIdentifier(1, 1))).toBeTruthy();
    expect(cells.has(cellIdentifier(5, 5))).toBeTruthy();
  });
});

describe("getEstimatedTotalWidth", () => {
  it("returns estimated width during initial load", () => {
    const columnCount = 200;
    const instanceProps = {
      lastMeasuredColumnIndex: -1,
      columnMetadataMap: {},
      estimatedColumnWidth: 30,
    };

    expect(getEstimatedTotalWidth(columnCount, instanceProps)).toBe(6000);
  });

  it("returns correct width", () => {
    const columnCount = 200;
    const instanceProps = {
      lastMeasuredColumnIndex: 1,
      columnMetadataMap: {
        0: {
          offset: 0,
          size: 20,
        },
        1: {
          offset: 20,
          size: 70,
        },
      },
      estimatedColumnWidth: 30,
    };

    expect(getEstimatedTotalWidth(columnCount, instanceProps)).toBe(6030);
  });
});

describe("getEstimatedTotalHeight", () => {
  it("returns estimated height during initial load", () => {
    const rowCount = 200;
    const instanceProps = {
      lastMeasuredRowIndex: -1,
      rowMetadataMap: {},
      estimatedRowHeight: 30,
    };

    expect(getEstimatedTotalHeight(rowCount, instanceProps)).toBe(6000);
  });

  it("returns correct height after load", () => {
    const rowCount = 200;
    const instanceProps = {
      lastMeasuredRowIndex: 0,
      rowMetadataMap: {
        0: {
          offset: 0,
          size: 20,
        },
        1: {
          offset: 20,
          size: 70,
        },
      },
      estimatedRowHeight: 30,
    };

    expect(getEstimatedTotalHeight(rowCount, instanceProps)).toBe(5990);
  });
});

describe("extendAreaToMergedCells", () => {
  it("expands to merged cells", () => {
    const mergedCells = [
      {
        top: 2,
        left: 2,
        right: 5,
        bottom: 5,
      },
    ];
    const originalArea = {
      top: 2,
      left: 1,
      bottom: 2,
      right: 3,
    };
    const area = extendAreaToMergedCells(originalArea, mergedCells);
    expect(area.bottom).toBe(5);
    expect(area.right).toBe(5);
  });
});

describe("areaIntersects", () => {
  it("checks if two areas intersects", () => {
    const area1 = {
      top: 2,
      left: 1,
      right: 3,
      bottom: 4,
    };
    const area2 = {
      top: 5,
      left: 2,
      bottom: 3,
      right: 2,
    };

    expect(areaIntersects(area1, area2)).toBeFalsy();
  });
  it("returns true for intersecting area", () => {
    const area1 = {
      top: 2,
      left: 1,
      right: 3,
      bottom: 4,
    };
    const area2 = {
      top: 2,
      left: 2,
      bottom: 3,
      right: 2,
    };

    expect(areaIntersects(area1, area2)).toBeTruthy();
  });
});

describe("findNextContentfulCell", () => {
  let activeCell, cell;
  it("returns last cell if no contentful cell is found", () => {
    activeCell = { rowIndex: 1, columnIndex: 2 };
    const getValue = () => null;
    cell = findNextContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Down,
      20
    );
    expect(cell.rowIndex).toBe(20);

    activeCell = { rowIndex: 10, columnIndex: 2 };
    cell = findNextContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Up,
      1
    );
    expect(cell.rowIndex).toBe(1);

    activeCell = { rowIndex: 10, columnIndex: 5 };
    cell = findNextContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Left,
      1
    );
    expect(cell.columnIndex).toBe(1);

    activeCell = { rowIndex: 10, columnIndex: 5 };
    cell = findNextContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Right,
      100
    );
    expect(cell.columnIndex).toBe(100);
  });

  it("returns next cell with content", () => {
    activeCell = { rowIndex: 1, columnIndex: 2 };
    const getValue = (cell) => {
      if (cell.rowIndex == 5) return "hello";
      return null;
    };
    cell = findNextContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Down,
      20
    );
    expect(cell.rowIndex).toBe(5);
  });
});

describe("findLastContentfulCell", () => {
  let activeCell, cell;
  it("returns last cell if no contentful cell is found", () => {
    activeCell = { rowIndex: 1, columnIndex: 2 };
    let getValue = (cell) => {
      if (cell.rowIndex === 5) return null;
      return "hello";
    };
    cell = findLastContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Down,
      20
    );
    expect(cell.rowIndex).toBe(4);

    activeCell = { rowIndex: 20, columnIndex: 2 };
    getValue = (cell) => {
      if (cell.rowIndex === 5) return null;
      return "hello";
    };
    cell = findLastContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Up,
      1
    );
    expect(cell.rowIndex).toBe(6);

    activeCell = { rowIndex: 1, columnIndex: 2 };
    getValue = (cell) => {
      if (cell.columnIndex === 5) return null;
      return "hello";
    };
    cell = findLastContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Right,
      10
    );
    expect(cell.columnIndex).toBe(4);

    activeCell = { rowIndex: 1, columnIndex: 20 };
    getValue = (cell) => {
      if (cell.columnIndex === 5) return null;
      return "hello";
    };
    cell = findLastContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Left,
      1
    );
    expect(cell.columnIndex).toBe(6);
  });

  it("returns same cell if its already in the edge", () => {
    const activeCell = { rowIndex: 1, columnIndex: 2 };
    const getValue = (cell) => {
      if (cell.rowIndex === 5) return "hello";
      return null;
    };
    const cell = findLastContentfulCell(
      activeCell,
      getValue,
      undefined,
      Direction.Down,
      20
    );
    expect(cell.rowIndex).toBe(1);
  });
});
