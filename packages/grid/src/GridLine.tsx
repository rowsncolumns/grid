import React from "react";
import { ShapeConfig } from "konva/types/Shape";
import { Line } from "react-konva";

const GridLine: React.FC<ShapeConfig> = (props) => {
  const { points, stroke, strokeWidth, offsetY, offsetX } = props
  return (
    <Line
      points={points}
      stroke={stroke}
      strokeWidth={strokeWidth}
      offsetY={offsetY}
      offsetX={offsetX}
      shadowForStrokeEnabled={false}
      strokeScaleEnabled={false}
      hitStrokeWidth={0}
      listening={false}
      perfectDrawEnabled={false}
    />
  )
};

export default GridLine;
