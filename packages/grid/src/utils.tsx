import React, { useState, useCallback } from "react";
import { ShapeConfig } from "konva/types/Shape";
import { Line, Rect } from "react-konva";
import { SelectionProps } from "./Grid";

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
  draggable,
  isDragging,
  borderCoverWidth = 5,
  type,
  ...props
}: SelectionProps) => {
  const lineStyles: Partial<React.CSSProperties> = {
    borderWidth: 0,
    position: 'absolute',
    pointerEvents: 'none'
  };
  /**
   * Border cover is so that there is enough
   * draggable handle area for the user.
   * Default is 5px
   */
  const showBorderCover = draggable
  const borderCoverStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: draggable
      ? 'auto'
      : 'none',
    cursor: draggable
      ? isDragging
        ? 'grabbing'
        : 'grab'
      : 'initial'
  }
  width = width - Math.floor(strokeWidth / 2);
  height = height - Math.floor(strokeWidth / 2);
  // y = y - Math.ceil(strokeWidth / 2);
  const lines = [
    <div
      style={{     
        ...lineStyles,   
        left: x,
        top: y,
        width: width,
        height: strokeTopWidth,
        borderColor: strokeTopColor,
        borderTopWidth: strokeTopWidth,
        borderStyle: strokeStyle,        
      }}
      key="top"
      {...props}
    />,
    <div
      style={{
        ...lineStyles,
        left: x + width,
        top: y,
        width: strokeRightWidth,
        height: height,
        borderColor: strokeRightColor,
        borderRightWidth: strokeRightWidth,
        borderStyle: strokeStyle,
      }}
      key="right"
      {...props}
    />,
    <div
      style={{
        ...lineStyles,
        left: x,
        top: y + height,
        width: width + strokeTopWidth,
        height: strokeBottomWidth,
        borderColor: strokeBottomColor,
        borderBottomWidth: strokeBottomWidth,
        borderStyle: strokeStyle,
      }}
      key="bottom"
      {...props}
    />,
    <div
      style={{
        ...lineStyles,
        left: x,
        top: y,
        width: strokeLeftWidth,
        height: height,        
        borderColor: strokeLeftColor,
        borderLeftWidth: strokeLeftWidth,
        borderStyle: strokeStyle,
      }}
      key="left"
      {...props}
    />,
  ];
  const borderCovers = [
    <div
      style={{     
        ...borderCoverStyle,   
        left: x,
        top: y,
        width: width,
        height: 5,        
      }}
      key="top"
      {...props}
    />,
    <div
      style={{
        ...borderCoverStyle,
        left: x + width - borderCoverWidth + strokeRightWidth,
        top: y,
        width: borderCoverWidth,
        height: height,
      }}
      key="right"
      {...props}
    />,
    <div
      style={{
        ...borderCoverStyle,
        left: x,
        top: y + height - borderCoverWidth + strokeBottomWidth,
        width: width + strokeTopWidth,
        height: borderCoverWidth,
      }}
      key="bottom"
      {...props}
    />,
    <div
      style={{
        ...borderCoverStyle,
        left: x,
        top: y,
        width: borderCoverWidth,
        height: height,
      }}
      key="left"
      {...props}
    />,
  ]
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
        />
      )}
      {lines}
      {showBorderCover && borderCovers}
    </React.Fragment>
  );
};

