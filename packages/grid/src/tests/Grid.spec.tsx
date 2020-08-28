// @ts-nocheck
import React from "react";
import Grid from "../Grid";
import { Rect } from "react-konva";
import { render, fireEvent, screen } from "@testing-library/react";

describe("Grid", () => {
  let itemRenderer;
  let rowCount;
  let columnCount;
  let rowHeight;
  let columnWidth;

  beforeEach(() => {
    jest.useFakeTimers();
    itemRenderer = jest.fn((props) => <Rect />);
    columnWidth = jest.fn((index) => 50 + index);
    rowHeight = jest.fn((index) => 25 + index);
  });

  test("renders the grid", () => {
    const renderGrid = () =>
      render(
        <Grid
          itemRenderer={itemRenderer}
          rowCount={1}
          columnCount={1}
          rowHeight={rowHeight}
          columnWidth={columnWidth}
        />
      );
    expect(renderGrid).not.toThrow();
    expect(itemRenderer).toHaveBeenCalled();
    expect(rowHeight).toHaveBeenCalled();
    expect(columnWidth).toHaveBeenCalled();
  });

  test("renders empty grid", () => {
    const renderGrid = () => render(<Grid itemRenderer={itemRenderer} />);
    expect(renderGrid).not.toThrow();
    expect(itemRenderer).not.toHaveBeenCalled();
  });

  // test("throws error if itemRenderer is not a valid konva element", () => {
  //   const renderGrid = () => render(<Grid itemRenderer={() => <div />} />);
  //   expect(renderGrid).toThrow();
  // });
});
