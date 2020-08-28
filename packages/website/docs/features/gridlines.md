---
title: Gridlines
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

Gridlines can be shown or hidden for each sheet using `showGridLines` prop

```jsx
import SpreadSheet, { uuid } from "@rowsncolumns/spreadsheet";

const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    cells: {
      1: {
        1: {
          text: 'Hello'
        },
        2: {
          text: 'World'
        }
      }
    },
    showGridLines: false,
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
        1: {
          1: {
            text: 'Hello'
          },
          2: {
            text: 'World'
          }
        }
      },
      showGridLines: false,
    }
  ]
  return (
    <SpreadSheet
      autoFocus={false}
      initialSheets={sheets}
    />
  )
}

<Demo1 />