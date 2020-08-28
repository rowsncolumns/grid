import React, { memo } from "react";
import { CellProps } from "./Cell";
import { Shape } from "react-konva";
import { RendererProps } from "./Grid";

/* Array placeholder */
const EMPTY_ARRAY: number[] = [];

export interface StrokeCellProps
  extends Omit<CellProps, "key" | "rowIndex" | "columnIndex"> {}

/**
 * Offset helps multiple borders to align properly
 * @param width
 */
export const getOffsetFromWidth = (width: number) => {
  return width / 2 - 0.5;
};

/**
 * Only used for strokes
 */
const CellOverlay: React.FC<StrokeCellProps> = memo(props => {
  const {
    x,
    y,
    width,
    height,
    strokeTopColor,
    strokeRightColor,
    strokeBottomColor,
    strokeLeftColor,
    strokeTopDash = EMPTY_ARRAY,
    strokeRightDash = EMPTY_ARRAY,
    strokeBottomDash = EMPTY_ARRAY,
    strokeLeftDash = EMPTY_ARRAY,
    strokeTopWidth,
    strokeRightWidth,
    strokeBottomWidth,
    strokeLeftWidth,
    lineCap
  } = props;
  const userStroke =
    strokeTopColor || strokeRightColor || strokeBottomColor || strokeLeftColor;
  if (!userStroke) return null;
  return (
    <Shape
      x={x}
      y={y}
      width={width}
      height={height}
      sceneFunc={(context, shape) => {
        /* Top border */
        if (strokeTopColor) {
          context.beginPath();
          context.moveTo(
            strokeLeftColor ? -getOffsetFromWidth(strokeLeftWidth) : 0,
            0.5
          );
          context.lineTo(
            shape.width() +
              (strokeRightColor ? getOffsetFromWidth(strokeRightWidth) + 1 : 1),
            0.5
          );
          context.setAttr("strokeStyle", strokeTopColor);
          context.setAttr("lineWidth", strokeTopWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeTopDash);
          context.stroke();
        }
        /* Bottom border */
        if (strokeBottomColor) {
          context.beginPath();
          context.moveTo(
            strokeLeftColor ? -getOffsetFromWidth(strokeLeftWidth) : 0,
            shape.height() + 0.5
          );
          context.lineTo(
            shape.width() +
              (strokeRightColor ? getOffsetFromWidth(strokeRightWidth) + 1 : 1),
            shape.height() + 0.5
          );
          context.setAttr("lineWidth", strokeBottomWidth);
          context.setAttr("strokeStyle", strokeBottomColor);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeBottomDash);
          context.stroke();
        }
        /* Left border */
        if (strokeLeftColor) {
          context.beginPath();
          context.moveTo(
            0.5,
            strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
          );
          context.lineTo(
            0.5,
            shape.height() +
              (strokeBottomColor
                ? getOffsetFromWidth(strokeBottomWidth) + 1
                : 1)
          );
          context.setAttr("strokeStyle", strokeLeftColor);
          context.setAttr("lineWidth", strokeLeftWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeLeftDash);
          context.stroke();
        }
        /* Right border */
        if (strokeRightColor) {
          context.beginPath();
          context.moveTo(
            shape.width() + 0.5,
            strokeTopColor ? -getOffsetFromWidth(strokeTopWidth) : 0
          );
          context.lineTo(
            shape.width() + 0.5,
            shape.height() +
              (strokeBottomColor
                ? getOffsetFromWidth(strokeBottomWidth) + 1
                : 1)
          );
          context.setAttr("strokeStyle", strokeRightColor);
          context.setAttr("lineWidth", strokeRightWidth);
          context.setAttr("lineCap", lineCap);
          context.setLineDash(strokeRightDash);
          context.stroke();
        }
      }}
    />
  );
});

/**
 * Default CellRenderer
 * @param props
 */
const CellRenderer = (props: RendererProps) => {
  const {
    x,
    y,
    width,
    height,
    stroke,
    strokeTopColor = stroke,
    strokeRightColor = stroke,
    strokeBottomColor = stroke,
    strokeLeftColor = stroke,
    strokeDash = EMPTY_ARRAY,
    strokeTopDash = EMPTY_ARRAY,
    strokeRightDash = EMPTY_ARRAY,
    strokeBottomDash = EMPTY_ARRAY,
    strokeLeftDash = EMPTY_ARRAY,
    strokeWidth = 1,
    strokeTopWidth = strokeWidth,
    strokeRightWidth = strokeWidth,
    strokeBottomWidth = strokeWidth,
    strokeLeftWidth = strokeWidth,
    lineCap = "butt",
    key
  } = props;
  const userStroke =
    strokeTopColor || strokeRightColor || strokeBottomColor || strokeLeftColor;
  if (!userStroke) return null;
  return (
    <CellOverlay
      key={key}
      x={x}
      y={y}
      width={width}
      height={height}
      strokeTopColor={strokeTopColor}
      strokeRightColor={strokeRightColor}
      strokeBottomColor={strokeBottomColor}
      strokeLeftColor={strokeLeftColor}
      strokeDash={strokeDash}
      strokeTopDash={strokeTopDash}
      strokeRightDash={strokeRightDash}
      strokeBottomDash={strokeBottomDash}
      strokeLeftDash={strokeLeftDash}
      strokeTopWidth={strokeTopWidth}
      strokeRightWidth={strokeRightWidth}
      strokeBottomWidth={strokeBottomWidth}
      strokeLeftWidth={strokeLeftWidth}
      lineCap={lineCap}
    />
  );
};

export default CellRenderer;
export { CellRenderer, CellOverlay };
