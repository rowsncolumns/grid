import React, { createContext, useContext, useState, useRef } from "react";
import Grid, { Cell } from "@rowsncolumns/grid";

export default {
  title: "Themes",
  component: Grid
};

const darkTheme = {
  cellColor: "#ccc",
  cellBackground: "#181E20",
  cellOddBackground: "#444"
};
const lightTheme = {
  cellColor: "#333",
  cellBackground: "white",
  cellOddBackground: "#eee"
};
const ThemeContext = createContext(lightTheme);

export const ThemedGrid = () => {
  const rowCount = 100;
  const columnCount = 100;
  const App = () => {
    const [theme, setTheme] = useState(lightTheme);
    const switchTheme = () => {
      setTheme(prev => {
        return prev === lightTheme ? darkTheme : lightTheme;
      });
    };
    const gridRef = useRef(null);

    return (
      <>
        <button type="button" onClick={switchTheme}>
          Switch to {theme === lightTheme ? "Dark" : "Light"}
        </button>
        <Grid
          ref={gridRef}
          rowCount={rowCount}
          columnCount={columnCount}
          itemRenderer={props => <ThemedCell {...props} />}
          wrapper={children => {
            /**
             * Since We are using a custom canvas renderer (Konva), we have to create a bridge
             * between Top context to Konva Context
             * Hence we have to wrap the children with context again
             */
            return (
              <ThemeContext.Provider value={theme}>
                {children}
              </ThemeContext.Provider>
            );
          }}
        />
      </>
    );
  };
  return <App />;
};

const ThemedCell = props => {
  const theme = useContext(ThemeContext);
  const fill =
    props.rowIndex % 2 === 0 ? theme.cellBackground : theme.cellOddBackground;
  return (
    <Cell
      {...props}
      value={`${props.rowIndex} x ${props.columnIndex}`}
      fill={fill}
      textColor={theme.cellColor}
    />
  );
};

ThemedGrid.story = {
  name: "Dark mode"
};
