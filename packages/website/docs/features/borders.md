---
title: Borders
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

Borders are added on a cell level. Row and Column styling is not currently supported, but it is in our [roadmap](https://github.com/rowsncolumns/grid/issues/34).

```jsx
import SpreadSheet, { uuid } from "@rowsncolumns/spreadsheet";

const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    cells: {
      2: {
        2: {
          text: 'Hello',
          stroke: 'red',
          strokeWidth: 1,
        }
      },
      3: {
        1: {
          text: 'top',
          strokeTopColor: 'green'
        },
        3: {
          text: 'right',
          strokeRightColor: 'green',
          strokeRightWidth: 2,
        }
      }
    }
  }
]
return (
  <SpreadSheet
    initialSheets={sheets}
  />
)
```

export const Demo1 = ()  => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        2: {
          2: {
            text: 'Hello',
            stroke: 'red',
            strokeWidth: 1,
          }
        },
        3: {
          1: {
            text: 'top',
            strokeTopColor: 'green'
          },
          3: {
            text: 'right',
            strokeRightColor: 'green',
            strokeRightWidth: 2,
          }
        }
      }
    }
  ]
  return (
    <SpreadSheet
      initialSheets={sheets}
    />
  )
}

<Demo1 />