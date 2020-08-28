// @ts-nocheck
import React, { useEffect, useState, useRef, useReducer } from "react";
import { Layer, Group, Image, Transformer, Rect } from "react-konva";
import Grid from "@rowsncolumns/grid";

// More info https://konvajs.org/docs/react/Transformer.html

export default {
  title: "Overlays",
  component: Grid,
};

const Resizable = ({ scrollTop, scrollLeft, isSelected, onSelect }) => {
  const trRef = useRef(null);
  const shapeRef = useRef();
  useEffect(() => {
    if (!isSelected) return;
    trRef.current.attachTo(shapeRef.current);
    trRef.current.getLayer().batchDraw();
  }, [isSelected]);
  const [dimensions, setDimensions] = useState({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
  });
  const x = dimensions.x - scrollLeft;
  const y = dimensions.y - scrollTop;
  return (
    <>
      <Rect
        onMouseDown={onSelect}
        ref={shapeRef}
        draggable
        onDragEnd={(e) => {
          setDimensions((prev) => {
            return {
              ...prev,
              x: e.target.x() + scrollLeft,
              y: e.target.y() + scrollTop,
            };
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          setDimensions({
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
        fill="lightblue"
        stroke="#aaa"
        strokeWidth={1}
        x={x}
        y={y}
        width={dimensions.width}
        height={dimensions.height}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export const CanvasOverlay = () => {
  const App = () => {
    const [isSelected, setIsSelected] = useState(false);
    const handleMouseDown = (e) => {
      // Handle it better, maybe using `ids`
      const clickedOnEmpty = e.target.attrs.draggable !== true;
      if (clickedOnEmpty) setIsSelected(false);
    };
    return (
      <Grid
        rowCount={100}
        columnCount={100}
        stageProps={{
          onMouseDown: handleMouseDown,
        }}
      >
        {({ scrollTop, scrollLeft }) => {
          return (
            <Layer>
              <Resizable
                scrollTop={scrollTop}
                scrollLeft={scrollLeft}
                isSelected={isSelected}
                onSelect={() => {
                  setIsSelected(true);
                }}
              />
            </Layer>
          );
        }}
      </Grid>
    );
  };
  return <App />;
};

const ChartJSLayer = () => {
  const canvasRef = useRef(null);
  const [_, forceRender] = useReducer((s) => s + 1, 0);
  const width = 600;
  const height = 400;
  useEffect(() => {
    canvasRef.current = document.createElement("canvas");
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    /* We need to append it to dom. ChartJS does not allow rendering on offscreen canvas */
    document.body.appendChild(canvasRef.current);

    const ctx = canvasRef.current.getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "bar",

      // The data for our dataset
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [0, 10, 5, 2, 20, 30, 45],
          },
        ],
      },
      options: {
        animation: false,
      },
    });
    document.body.removeChild(canvasRef.current);
    forceRender();
  }, []);

  if (!canvasRef.current) return null;
  return (
    <Image
      image={canvasRef.current}
      draggable
      fill="white"
      stroke="#aaa"
      x={100}
      y={100}
      width={width}
      height={height}
    />
  );
};

export const ChartJs = () => {
  return (
    <Grid rowCount={100} columnCount={100}>
      {({ scrollTop, scrollLeft }) => {
        return (
          <Layer>
            <ChartJSLayer />
          </Layer>
        );
      }}
    </Grid>
  );
};
