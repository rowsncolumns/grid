---
title: Hide Sheet Headers
---
import SpreadSheet from "@rowsncolumns/spreadsheet"

You can use `hiddenRows` and `hiddenColumns` prop on a sheet to hide grid headers


```jsx
import SpreadSheet from '@rowsncolumns/spreadsheet'
const initialSheets = [
  {
    name: 'Sheet 1',
    id: 0,
    cells: {},
    hiddenRows: [0],
    hiddenColumns: [0],
  }
]
<SpreadSheet
  initialSheets={initialSheets}
/>
```

### Demo

export const App = () => {
  const initialSheets = [
    {
      name: 'Sheet 1',
      id: 0,
      cells: {},
      hiddenRows: [0],
      hiddenColumns: [0],
    }
  ]
  return (
    <SpreadSheet
      autoFocus={false}
      initialSheets={initialSheets}
    />
  )
}

<App />