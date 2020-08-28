---
title: Using ref
---

`Ref` can be used to access imperative functions of the grid. Only use it when absolutely necessary, instead use `props` to control the state of the grid

```jsx
// Imports type
import { SheetGridRef } from '@rowsncolumns/spreadsheet'

function App () {
  const sheetRef = useRef<SheetGridRef>(null)

  return (
    <SpreadSheet
      ref={sheetRef}
    />
  )
}
```

## Available methods

### `getNextFocusableCell: (cell: CellInterface, direction: Direction) => CellInterface | null`

```jsx
const activeCell = { rowIndex: 1, columnIndex: 1}
const nextCell = sheetRef.current.grid.getNextFocusableCell(cell, 'right')
```

### `setActiveCell: (cell: CellInterface | null) => void`

```jsx
const activeCell = { rowIndex: 1, columnIndex: 1}
const nextCell = sheetRef.current.grid.setActiveCell(cell, 'right')
```

### `setSelections: (selection: SelectionArea[]) => void;`

```jsx
const selections = [
  {
    bounds: {
      top: 1,
      right: 2,
      left: 3,
      bottom: 5
    }
  }
]
const nextCell = sheetRef.current.grid.setSelections(selections)
```

### `focus()`

Imperatively focus on the grid

### `makeEditable: (cell: CellInterface, value?: string, focus?: boolean) => void;`

Make a cell editable

### `setEditorValue: (value: string, activeCell: CellInterface) => void;`

Set value of a cell

### `hideEditor: () => void;`

Hides cell editor

### `submitEditor: (value: string, activeCell: CellInterface, nextActiveCell?: CellInterface | null) => void;`

Submit value of an edited cell

### `cancelEditor: () => void;`

Cancel editing and hide editor

### `resizeColumns?: (indices: number[]) => void;`

Resize column indices

### `resizeRows?: (indices: number[]) => void;`

Resize row indices

### `getCellBounds?: (coords: CellInterface) => AreaProps;`

Get bounds of a cell

### `getScrollPosition?: () => ScrollCoords;`

Get current scroll position of the grid

### `getCellOffsetFromCoords: (coords: CellInterface) => CellPosition`

Get cell x, y position relative to the container

### `getCellCoordsFromOffset: (x: number, y: number) => CellInterface | null`

Get cell coords `rowIndex, columnIndex` from relative position. Useful if you want to find cell based on mouse position