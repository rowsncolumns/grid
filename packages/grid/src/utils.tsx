import React, { useState, useCallback } from "react";
import { ShapeConfig } from "konva/types/Shape";
import { Line, Rect } from "react-konva";

interface BoxConfig extends ShapeConfig {
  strokeLeftColor?: string;
  strokeTopColor?: string;
  strokeRightColor?: string;
  strokeBottomColor?: string;
  strokeWidth?: number;
  strokeTopWidth?: number;
  strokeRightWidth?: number;
  strokeBottomWidth?: number;
  strokeLeftWidth?: number;
  fillOpacity?: number
}

/**
 * Create a box with custom top/right/bottom/left colors and widths
 * @param param0
 */
export const createCanvasBox = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill,
  stroke,
  strokeLeftColor = stroke,
  strokeTopColor = stroke,
  strokeRightColor = stroke,
  strokeBottomColor = stroke,
  strokeWidth = 0,
  strokeTopWidth = strokeWidth,
  strokeRightWidth = strokeWidth,
  strokeBottomWidth = strokeWidth,
  strokeLeftWidth = strokeWidth,
  dash,
  dashEnabled,
  lineCap = "square",
  key,
}: ShapeConfig) => {
  const commonProps = {
    perfectDrawEnabled: false,
    shadowForStrokeEnabled: false,
    hitStrokeWidth: 0,
    listening: false,
  };
  const composite = undefined;
  const lines = [
    <Line
      points={[x, y, x + width, y]}
      stroke={strokeTopColor}
      strokeWidth={strokeTopWidth}
      dash={dash}
      dashEnabled={dashEnabled}
      lineCap={lineCap}
      key="top"
      globalCompositeOperation={composite}
      {...commonProps}
    />,
    <Line
      points={[x + width, y, x + width, y + height]}
      stroke={strokeRightColor}
      strokeWidth={strokeRightWidth}
      dash={dash}
      dashEnabled={dashEnabled}
      lineCap={lineCap}
      key="right"
      globalCompositeOperation={composite}
      {...commonProps}
    />,
    <Line
      points={[x + width, y + height, x, y + height]}
      stroke={strokeBottomColor}
      strokeWidth={strokeBottomWidth}
      dash={dash}
      dashEnabled={dashEnabled}
      lineCap={lineCap}
      key="bottom"
      globalCompositeOperation={composite}
      {...commonProps}
    />,
    <Line
      points={[x, y + height, x, y]}
      stroke={strokeLeftColor}
      strokeWidth={strokeLeftWidth}
      dash={dash}
      dashEnabled={dashEnabled}
      lineCap={lineCap}
      key="left"
      globalCompositeOperation={composite}
      {...commonProps}
    />,
  ];

  return (
    <React.Fragment key={key}>
      {fill && (
        <Rect
          globalCompositeOperation={composite}
          fill={fill}
          x={x}
          y={y}
          width={width}
          height={height}
          {...commonProps}
        />
      )}
      {lines}
    </React.Fragment>
  );
};

export const createHTMLBox = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill,
  stroke,
  strokeLeftColor = stroke,
  strokeTopColor = stroke,
  strokeRightColor = stroke,
  strokeBottomColor = stroke,
  strokeWidth = 0,
  strokeTopWidth = strokeWidth,
  strokeRightWidth = strokeWidth,
  strokeBottomWidth = strokeWidth,
  strokeLeftWidth = strokeWidth,
  key,
  strokeStyle = "solid",
  fillOpacity = 1,
}: BoxConfig) => {
  const commonProps = {};
  width = width - Math.floor(strokeWidth / 2);
  height = height - Math.floor(strokeWidth / 2);
  // y = y - Math.ceil(strokeWidth / 2);
  const lines = [
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: strokeTopWidth,
        borderWidth: 0,
        borderColor: strokeTopColor,
        borderTopWidth: strokeTopWidth,
        borderStyle: strokeStyle,
        pointerEvents: 'none',
      }}
      key="top"
      {...commonProps}
    />,
    <div
      style={{
        position: "absolute",
        left: x + width,
        top: y,
        width: strokeRightWidth,
        height: height,
        borderWidth: 0,
        borderColor: strokeRightColor,
        borderRightWidth: strokeRightWidth,
        borderStyle: strokeStyle,
        pointerEvents: 'none',
      }}
      key="right"
      {...commonProps}
    />,
    ,
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + height,
        width: width + strokeTopWidth,
        height: strokeBottomWidth,
        borderWidth: 0,
        borderColor: strokeBottomColor,
        borderBottomWidth: strokeBottomWidth,
        borderStyle: strokeStyle,
        pointerEvents: 'none',
      }}
      key="bottom"
      {...commonProps}
    />,
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: strokeLeftWidth,
        height: height,
        borderWidth: 0,
        borderColor: strokeLeftColor,
        borderLeftWidth: strokeLeftWidth,
        borderStyle: strokeStyle,
        pointerEvents: 'none',
      }}
      key="left"
      {...commonProps}
    />,
  ];
  return (
    <React.Fragment key={key}>      
      {fill && (
        <div
          style={{
            position: "absolute",
            top: y,
            left: x,
            height,
            width,
            backgroundColor: fill,
            opacity: fillOpacity,
            userSelect: "none",
            pointerEvents: 'none',
          }}
          {...commonProps}
        />
      )}
      {lines}
    </React.Fragment>
  );
};

