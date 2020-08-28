---
id: freezing
title: Frozen rows and columns
---

Use `frozenRows` and `frozenColumn` prop to freeze sections in the grid


```jsx
import SpreadSheet from "@rowsncolumns/spreadsheet"
const initialSheets = [
  {
    id: '0',
    name: 'Sheet 1',
    activeCell: null,
    frozenRows: 2,
    frozenColumns: 2,
    cells: {}
  }
]

<SpreadSheet
  initialSheets={initialSheets}
/>

```


### Demo

import SpreadSheet from "@rowsncolumns/spreadsheet"
const initialSheets = [
  {
    id: '0',
    name: 'Sheet 1',
    activeCell: null,
    frozenRows: 2,
    frozenColumns: 2,
    cells: {}
  }
]

<SpreadSheet
  autoFocus={false}
  initialSheets={initialSheets}
/>