---
title: Sheets
---
import { useState, useEffect } from 'react'
import SpreadSheet from "@rowsncolumns/spreadsheet";

You can modify sheet by changing your data. SpreadSheet will act as a controlled and uncontrolled component based on the `props` that is injected

### Using `SpreadSheet` as controlled component

```jsx
const App = () => {
  const [sheets, setSheets] = useState()

  return (
    <SpreadSheet
      sheets={sheets}
      onChange={newSheet => setSheets(sheets)}
    />
  )
}
```

### Using `SpreadSheet` as uncontrolled component


```jsx
const App = () => {
  const [sheets, setSheets] = useState()

  return (
    <SpreadSheet
      initialSheets={sheets}
      onChange={newSheet => setSheets(sheets)}
    />
  )
}
```

## Initializing Active sheet

```jsx
const defaultSheets = [
  {
    name: 'Sheet 1',
    cells: {},
    id: 1
  },
  {
    name: 'Sheet 2',
    cells: {},
    id: 2
  }
]
const App = () => {
  const [sheets, setSheets] = useState(defaultSheets)

  return (
    <SpreadSheet
      sheets={sheets}
      activeSheet={2}
    />
  )
}
```

export const App = () => {
  const defaultSheets = [
    {
      name: 'Sheet 1',
      cells: {},
      id: 1
    },
    {
      name: 'Sheet 2',
      cells: {},
      id: 2
    }
  ]
  const [sheets, setSheets] = useState(defaultSheets)
  return (
    <SpreadSheet
      autoFocus={false}
      sheets={sheets}
      activeSheet={2}
    />
  )
}

<App />