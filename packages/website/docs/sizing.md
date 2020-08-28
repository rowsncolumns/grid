---
title: Row and column Sizing
---
import SpreadSheet from "@rowsncolumns/spreadsheet"

Use `rowSizes` and `columnSizes` prop to adjust row and column Height


```jsx
import SpreadSheet from "@rowsncolumns/spreadsheet"

const initialSheets = [
  {
    name: 'Sheet 1',
    id: '0',
    cells: {},
    rowSizes: {
      1: 40
    },
    columnSizes: {
      2: 40
    }
  }
]
<SpreadSheet
  initialSheets={initialSheets}
/>

```

<SpreadSheet
  autoFocus={false}
  initialSheets={
    [
      {
        name: 'Sheet 1',
        id: '0',
        cells: {},
        rowSizes: {
          1: 40
        },
        columnSizes: {
          2: 40
        }
      }
    ]
  }
/>