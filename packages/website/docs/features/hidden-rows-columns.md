---
title: Hidden rows and columns
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

Any row or columns can be hidden using `hiddenColumns` or `hiddenRows` attribute in sheets

```jsx
const sheets = [
  {
    name: 'Sheet 1',
    id: 1,
    hiddenRows: [2],
    hiddenColumns: [2],
    cells: {
      1: {
        1: {
          text: 200.00,
          format: '\\S$ #.00'
        }
      }
    }
  },
]

<SpreadSheet initialSheets={sheets} />
```