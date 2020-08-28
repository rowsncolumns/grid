---
title: Merging cells
---

Use `mergedCells` prop to merge columns and rows


```jsx
import SpreadSheet from "@rowsncolumns/spreadsheet"
const initialSheets = [
  {
    id: '0',
    name: 'Sheet 1',
    activeCell: null,
    mergedCells: [
      {
        top: 2,
        left: 2,
        right: 4,
        bottom: 5,
      }
    ],
    cells: {
      2: {
        2: {
          text: 'Hello world'
        }
      }
    }
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
    mergedCells: [
      {
        top: 2,
        left: 2,
        right: 4,
        bottom: 5,
      }
    ],
    cells: {
      2: {
        2: {
          text: 'Hello world'
        }
      }
    }
  }
]

<SpreadSheet
  autoFocus={false}
  initialSheets={initialSheets}
/>