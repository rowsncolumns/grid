---
title: Cell Renderer
---
import SpreadSheet from "@rowsncolumns/spreadsheet";
import { Rect, Text } from 'react-konva'

Use any React component from `React-Konva` as a Cell renderer. 

:::note
Cells are only rendered if they have any data. Eg: if you have 100x100 grid and only data in row: 1 and column 1, Only one cell is rendered.
:::

```jsx
import { Rect, Text } from 'react-konva'

const Cell = (props) => {
    return (
      <>
        <Rect
          {...props}
          fill='green'
          stroke='red'
        />
        <Text
          {...props}
        />
      </>
    )
  }
  const sheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        2: {
          2: {
            text: 'Hello emoji 💪'
          }
        }
      }
    }
  ]
  return <SpreadSheet CellRenderer={Cell} initialSheets={sheets} />
```

export const App = () => {
  const Cell = (props) => {
    return (
      <>
        <Rect
          {...props}
          fill='green'
          stroke='red'
        />
        <Text
          {...props}
        />
      </>
    )
  }
  const sheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        2: {
          2: {
            text: 'Hello emoji 💪'
          }
        }
      }
    }
  ]
  return <SpreadSheet autoFocus={false} CellRenderer={Cell} initialSheets={sheets} />
}

<App />