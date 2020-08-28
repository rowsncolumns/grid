## Declarative Canvas Grid

<p align="center">
  <br />
  <img src='logo.png' width='400' />
  <br />
</p>

Canvas table grid to render large set of tabular data. Uses virtualization similar to `react-window` and [React-Konva](https://github.com/konvajs/react-konva/) for primitives such as Rect, Text, Shape etc

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![Build Status](https://travis-ci.org/rowsncolumns/grid.svg?branch=master)](https://travis-ci.org/rowsncolumns/grid)



[Demo](https://rowsncolumns.github.io/grid) | [Usage](#Usage) | [Wiki](https://github.com/rowsncolumns/grid/wiki/Extending-Konva-Grid-using-hooks)

<kbd>![Screen capture](screencapture.gif)</kbd>

## Features

- :electron: React powered declarative library
- :100: Virtualized: Only visible cells are rendered
- :bulb: Performant: Canvas implementation - 55-60fps (re-render) and  40-60fps (scroll)
- :scroll: Supports scrolling using native scrollbars
- :computer: Supports both Fixed and Variable sized grids
- :fire: Freeze rows and columns
- :white_square_button: Merge rows and columns
- :hand: Resizable headers
- :deciduous_tree: Create Tree tables
- :musical_keyboard: Keyboard accessible
- :page_with_curl: Pagination sync/async
- :hammer_and_wrench: Fully typed API written in TypeScript
- :rainbow: Full Theming and Context Support
- :anchor: Fill handle support
- :feet: Customizable undo/redo support
- :iphone: Mobile/Touch device support
- :muscle: Highly customizable using [react-konva](https://github.com/konvajs/react-konva/)

### Why another canvas grid library

Born out of frustration, having to deal with complicated imperative canvas libraries, I wanted to create something easy to understand and declarative in nature. This Grid primitive is built on top of [React Konva](https://github.com/konvajs/react-konva/) making it easy to customize and extend. Take a look at the storybook to learn more.

## Installation

#### npm
```
npm install @rowsncolumns/grid --save
```
#### yarn

```
yarn add @rowsncolumns/grid
```

## Compatiblity

Konva grid will work in any browser that supports [react](https://github.com/facebook/react/), [konva](https://konvajs.org/) and canvas element.

## Integrations/Examples

Konva Grid is a pure renderer, that will work with many third-party table plugins

#### 1. React-table

[https://github.com/rowsncolumns/grid/tree/master/examples/react-table](https://github.com/rowsncolumns/grid/tree/master/examples/react-table)

Uses [react-table](https://github.com/tannerlinsley/react-table) to create grouped headings and rows, and display on Konva Grid

#### 2. Excel worksheet

[https://github.com/rowsncolumns/grid/tree/master/examples/excel-worksheet](https://github.com/rowsncolumns/grid/tree/master/examples/excel-worksheet)

#### 3. Zustand - More control over cell level re-rendering

[https://github.com/rowsncolumns/grid/tree/master/examples/zustand](https://github.com/rowsncolumns/grid/tree/master/examples/zustand)

*More examples coming soon.*

## Usage

```js
import { Grid, Cell } from '@rowsncolumns/grid'
import { Group, Text, Rect } from 'react-konva'

const App = () => {
  const data = {
    [[1, 2]]: 'Hello world'
  }

  return (
    <Grid
      rowCount={100}
      columnCount={100}
      width={800}
      height={800}
      rowHeight={(rowIndex) => 20}
      columnWidth={(columnIndex) => 100}
      itemRenderer={(props) => (
        <Cell
          {...props}
          value={
            data[[props.rowIndex, props.columnIndex]]
          }
        />
      )}
    />
  )
}
```

## Props
This is the list of props that are meant to be used to customise the `konva-grid` behavior.

| Name | Required | Type | Description | Default |
|------|----------|------|-------------|---------|
| width | true | number | Width of the grid container | 800 |
| height| true | number | Height of the grid container | 800 |
| columnCount | true | number | No of columns in the grid | 200 |
| rowCount | true | number | No of rows in the grid | 200 |
| rowHeight | true | function | Function that returns height of the row based on rowIndex | (rowIndex) => 20 |
| columnWidth | true | function | Function that returns width of the column based on columnIndex | (columnIndex) => 100 |
| itemRenderer | true | Function | React component to render the cell | null |
| selectionRenderer | true | Function | React component to render selected cell | null |
| scrollbarSize | false | number | Size of the scrollbar | 17 |
| showScrollbar | false | boolean | Always show scrollbar | true |
| selectionBackgroundColor | false | string | Background color of selected cells | rgba(66, 133, 244, 0.3) |
| selectionBorderColor | false | string | Border color of bounding box of selected cells | rgba(66, 133, 244, 1) |
| selectionStrokeWidth | false |  number | Border width of selection | 1 |
| activeCellStrokeWidth | false |  number | Border width of activeCell | 2 |
| activeCell | false | { rowIndex, columnIndex } | Recently active cell that user has clicked | null |
| selections | false | Array | Array of selected cell areas | []|
| mergedCells | false | Array | Array of merged cell areas | []|
| cellAreas | false | Array | Increase the range of certain  cells | [] |
| snap | false | boolean | Snaps to the next row or column as you scroll | false |
| frozenRows | false | number | No of frozen rows | 0 |
| frozenColumns | false | number | No of frozen columns | 0 |
| showFrozenShadow| false | boolean | Show shadow in frozen columns/rows | true |
| shadowSettings| false | object | Customize shadow of frozen columns/rows | true |
| onBeforeRenderRow | false | Function | Called right before a row is rendered, useful for `react-table` | null |
| stageProps | false | Object | Konva stage props | null |
| children | false | Function | Inject React Konva shapes using children | null
| wrapper | false | Function | Inject custom context using a wrapper | (children) => children |
| showFillHandle | false | boolean | Show fill handle at bottom right corner | true |
| onFillHandleMouseDown |  false | Function | Callback fired user selects fill handle | null |
| fillSelection | false  | SelectionProp | Area of selected fill | null
| overscanCount | false | number | Number of items outside the visible viewport should be renderer at all times | 1 |

## Methods

#### `scrollTo({ scrollLeft, scrollTop }`

Scrolls the grid to a specified `x,y` position relative to the container

#### `resetAfterIndices({ rowIndex, columnIndex })`

Imperatively trigger re-render of the grid after specified `rowIndex` or `columnIndex`


#### `getScrollPosition()`

Get the current scroll position of the grid. 

````
const gridRef = useRef()
const { scrollLeft, scrollTop } = gridRef.current.getScrollPosition()
````

#### `isMergedCell({ rowIndex, columnIndex })`

Check if a cell at a coordinate is a merged cell

#### `getCellBounds({ rowIndex, columnIndex })`

Returns a selection `IArea` for a particular cell. Useful to get selection area of a merged cell

#### `getCellCoordsFromOffsets(x , y)`

Returns exact `rowIndex` and `columnIndex` from a `x`  and `y` cordinate. Useful if you want to get cell coords based on mouse position

#### `getCellOffsetFromCoords({ rowIndex, columnIndex })`

Returns offset position `{ x, y, width, height }` of a cell


#### `stage`

Access Konva `stage` instance

```js
const gridRef = useRef()

<Grid
  ref={gridRef}
>

const stage = gridRef.current.stage
````

## Passing Contexts

React Konva uses `react-reconciler` to create a custom React renderer. Which means Top Level Context is not available inside the canvas. We provide a simple `wrapper` prop to pass Context to the Grid

```js
const ThemeContext = React.createContext({})
const theme = { color: 'yellow' }
<Grid
  wrapper={(children) => {
    return (
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemContext.Provider>
    )
  }}
/>
```

This will let you use ThemeContext in any of the React Konva components. To access theme inside `Cell`, you could do

```js
const Cell = ({ x, y, width, height }) => {
  const theme = useContext(ThemeContext)

  return (
    <Rect
      fill={theme.color}
      x={x}
      y={y}
      width={width}
      height={height}
    >
  )
}
```

## Storybook

Examples can be found in `stories` directory. To run storybook, enter the following commands

```bash
yarn
yarn run storybook
```

### Contribution

Feel free to fork and submit pull requests

````
git clone https://github.com/rowsncolumns/grid.git
cd grid
yarn
// Run storybook
yarn storybook 
````
