---
id: options
title: Configuration
---

These are some of the available options to customize SpreadSheet Grid

### `sheets`

Initial sheets that will be displayed in the grid

```ts
interface Sheet {
  id: string;
  name: string;
  cells: Cells;
  activeCell: CellInterface | null;
  selections: SelectionArea[];
  scrollState?: ScrollCoords;
  columnSizes?: SizeType;
  rowSizes?: SizeType;
  mergedCells?: AreaProps[];
  frozenRows?: number;
  frozenColumns?: number;
  hiddenRows?: number []
  hiddenColumns?: number []
  showGridLines?: boolean;
  filterViews?: FilterView[];
  rowCount?: number;
  columnCount?: number;
  locked?: boolean;
  hidden?: boolean;
  tabColor?: string
}

type Cells = Record<string, Cell>;
type Cell = Record<string, CellConfig>;
interface CellConfig extends CellFormatting {
  text?: string | number;
}

const sheets = [
  {
    name: 'Sheet 1',
    id: 0,
    cells: {
      1, {
        1: {
          text: 'value'
        }
      }
    }
  }
]
```

And initialize the grid by passing the `sheets` prop

```jsx
<SpreadSheet sheets={sheets}>
```

### `Cells` Typescript definition

```jsx
export interface CellConfig  {
  /**
   * Text that will be displayed in the cell.
   * For formulas, result will be displayed instead
   */
  text?: string | number;
  /**
   * Add tooltip
   */
  tooltip?: string;
  /**
   * Result from formula calculation
   */
  result?: string | number | boolean | Date;
  /**
   * Formula errors
   */
  error?: string;
  /**
   * Validation errors
   */
  valid?: boolean;
  datatype?: DATATYPES;
  /**
   * Used for formulas to indicate datatype of result
   */
  effectiveType?: DATATYPES;
  /**
   * Formulas can extend range of a cell
   * When a cell with `range` is deleted, all cells within that range will be cleared
   */
  effectiveRange?: AreaProps;

  plaintext?: boolean;
  bold?: boolean;
  color?: string;
  italic?: boolean;
  horizontalAlign?: HORIZONTAL_ALIGNMENT;
  verticalAlign?: VERTICAL_ALIGNMENT;
  underline?: boolean;
  strike?: boolean;
  fill?: string;

  stroke?: string;
  strokeTopColor?: string;
  strokeRightColor?: string;
  strokeBottomColor?: string;
  strokeLeftColor?: string;
  strokeWidth?: number;
  strokeTopWidth?: number;
  strokeRightWidth?: number;
  strokeBottomWidth?: number;
  strokeLeftWidth?: number;
  strokeDash?: number[];
  strokeTopDash?: number[];
  strokeRightDash?: number[];
  strokeBottomDash?: number[];
  strokeLeftDash?: number[];
  lineCap?: string;
  padding?: number;
  fontSize?: number;
  fontFamily?: string;
  locked?: boolean;
  wrap?: Wrap;
  rotation?: number;
  dataValidation?: DataValidation;
  hyperlink?: string;
  percent: boolean;
  decimnls?: number;
  currencySymbol?: string;
  format?: string;
  /* Allow any arbitrary values */
  [key: string]: any;
}
```

### `activeSheet`

Initial active sheet id

### `onChange`

Callback when sheets is changed

```jsx
<SpreadSheet
  sheets={sheets}
  onChange={(sheets: Sheet[]) => {
    // Persist in your data model
  }}
>
```

### `onChangeSelectedSheet`

Callback fired when selected sheet changes

```jsx
<SpreadSheet
  onChangeSelectedSheet={(sheetId: string) => {
    // Persist in your data model
  }}
>
```

### `onChangeCell`

Callback fired when a cell or group of cells change

```jsx
<SpreadSheet
  onChangeCell={(sheetId: string, value: React.ReactText, cell: CellInterface) => {
    // Persist in your data model
  }}
>
```

### `onChangeCells`

Callback fired when a single cell or a group of cells are changed. Fired during onDelete, onFill etc

```jsx
<SpreadSheet
  onChangeCells={(activeSheetId: string, changes: Cells) => {
    // Persist in your data model
  }}
>
```

### `CellRenderer`

React component to customize cell rendering

```jsx
import SpreadSheet, { RendererProps } from '@rowsncolumns/spreadsheet'
import { Rect, Text } from 'react-konva'

const Cell = (props: RendererProps) => {
  const { x, y, width, height, rowIndex, columnIndex, text } = props
  if (!text) return null
  return (
    <>
      <Text
        x={x}
        y={y}
        width={width}
        height={height}
        text={text}
      >
    </>
  )
}

function App () {
  return (
    <SpreadSheet
      CellRenderer={Cell}
    >
  )
}

```

### `HeaderCellRenderer`

Customize header cell component

```jsx
import SpreadSheet, { RendererProps } from '@rowsncolumns/spreadsheet'
import { Rect, Text } from 'react-konva'

const HeaderCell = (props: RendererProps) => {
  const { x, y, width, height, rowIndex, columnIndex, text } = props
  if (!text) return null
  return (
    <>
      <Text
        x={x}
        y={y}
        width={width}
        height={height}
        text={text}
      >
    </>
  )
}

function App () {
  return (
    <SpreadSheet
      HeaderCellRenderer={HeaderCell}
    >
  )
}

```

### `hiddenRows`

Array of rowIndexes to be hidden

### `hiddenColumns`

Array of columnIndexes to be hidden

### `showFormulabar`

Boolean to show hide formula bar

### `showToolbar`

Boolean to show hide bottom toolbar

### `showGridLines`

Boolean to show hide grid lines

### `minHeight`

Min height of the Sheet

### `fontFamily`

Font family of text that is rendered on the grid. Defaults to system font

### `formattter`

Formatter function that will be run for each cell. 

```jsx
import SpreadSheet from '@rowsncolumns/spreadsheet'

<SpreadSheet
  formattter={(value, datatype) => {
    if (datatype === 'number') return value.toFixed(2)
    return value
  }}
/>
```

### `selectionPolicy?: 'single' | 'range' | 'multiple'`

Boolean to enable to disable multiple cell and range selection,

### `onActiveCellChange`

Callback fired when activeCell changes

```jsx
<SpreadSheet
  onActiveCellChange={(sheetId: string, cell: CellInterface, value: React.ReactText | undefined) => {
    console.log(cell.rowIndex, cell.columnIndex)
  }}
>
```

### `onActiveCellValueChange`

Callback fired when value of active cell changes

```jsx
<SpreadSheet
  onActiveCellValueChange={(sheetId: string, cell: CellInterface, value: React.ReactText | undefined) => {
    console.log(cell.rowIndex, cell.columnIndex)
  }}
>
```

### `onSelectionChange?: (sheetId: string, activeCell: CellInterface | null, selections: SelectionArea[]) => void;`

Callback fired when selection changes

### `selectionMode`

One of `row|cell|column`. Highlights the selected cell area

## `fontList: string[]`

List of all fonts that will appear in the font selector toolbar

## `fontLoaderConfig`

WebFont loader Configuration. Learn more about loading custom fonts using [WebfontLoader](https://github.com/typekit/webfontloader)

## `onValidate (value: React.ReactText, id: SheetID, cell: CellInterface, cellConfig: CellConfig | undefined ) => Promise<ValidationResponse>)`

Custom Sync/Async validation of user input

## `stateReducer(state: StateInterface, action: ActionTypes) => StateInterface;`

Hook into internal state dispatch calls.

## `snap?: boolean;`

Enable scroll snap

## `onScaleChange?: (scale: number) => void;`

Callback when user scales up/down the grid

## `StatusBar?: React.ReactType<StatusBarProps>;`

Custom StatusBar component

## `ContextMenu?: React.ReactType<ContextMenuComponentProps>;`

Custom Context Menu component

## `Tooltip?: React.ReactType<TooltipProps>;`

Custom tooltip component

## `showTabStrip?: boolean;`

Show or hide tab strip
  
## `isTabEditable?: boolean;`

Enable or disable users to edit tabs


## `allowNewSheet?: boolean;`

Enable or disable users from adding new sheets

## `CellEditor?: React.ReactType<CustomEditorProps>;`

Custom Cell Editor

## `enableDarkMode?: true;`

Enable or disable dark mode support

## `enableGlobalKeyHandlers?: boolean`

Enable global key handlers for undo, redo events

## `columnHeaderHeight`

Default column header height

## `rowHeaderWidth`

Default row header width

## `disableFormula`

Disable formula mode.