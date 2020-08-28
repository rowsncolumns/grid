---
title: Initialization
---
import { useState, useEffect } from 'react'
import SpreadSheet, { defaultSheets } from "@rowsncolumns/spreadsheet";

Initializing SpreadSheet is as easy as importing the component in your React app. SpreadSheet will pickup the height/width of the parent container automatically. It will also resize when parent container dimensions change.

```jsx
import SpreadSheet from "@rowsncolumns/spreadsheet";

return (
  <SpreadSheet />
)
```

<SpreadSheet autoFocus={false} />

## Initialize Sheets

Pass `sheets` prop to SpreadSheet to initialize (for controlled) and `initialSheets` for un-controlled component

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
    }
  },
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
      }
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


## Initialize from JSON data

Fetch and parse JSON data and convert it to `sheets` before passing it to SpreadSheet component

```jsx
import { useState, useEffect } from 'react'

export const SheetFromJSON = () => {
  const [sheets, setSheets] = useState()
  useEffect(() => {
    async function fetchJSON () {
      const resource = await (await fetch('/data.json').then(res => res.json()))
      const headers = []
      const data = []
      const sheet = {
        name: 'Sheet 1',
        cells: {},
        id: 1
      }
      for (let i = 0; i < resource.length; i++) {
        const item = resource[i]
        const keys = Object.keys(item)
        if (i === 0) {          
          for (const [index, key] of keys.entries()) {
            const rowIndex = i + 1
            const columnIndex = index + 1
            sheet.cells[rowIndex] = sheet.cells[rowIndex] ?? {}
            sheet.cells[rowIndex][columnIndex] = {
              text: key,
              bold: true,
            }
          }
        }
        for (const [index, key] of keys.entries()) {
          const rowIndex = i + 2
          const columnIndex = index + 1
          sheet.cells[rowIndex] = sheet.cells[rowIndex] ?? {}
          sheet.cells[rowIndex][columnIndex] = {
            text: item[key]
          }
        }
      }
      
      setSheets([sheet])
    }
    fetchJSON()
  }, [])
  return (
    <SpreadSheet
      sheets={sheets}
      onChange={setSheets}
    />
  )
}
```


export const SheetFromJSON = () => {
  const [sheets, setSheets] = useState(defaultSheets)
  useEffect(() => {
    async function fetchJSON () {
      const resource = await (await fetch('/data.json').then(res => res.json()))
      const headers = []
      const data = []
      const sheet = {
        name: 'Sheet 1',
        cells: {},
        id: 1
      }
      for (let i = 0; i < resource.length; i++) {
        const item = resource[i]
        const keys = Object.keys(item)
        if (i === 0) {          
          for (const [index, key] of keys.entries()) {
            const rowIndex = i + 1
            const columnIndex = index + 1
            sheet.cells[rowIndex] = sheet.cells[rowIndex] ?? {}
            sheet.cells[rowIndex][columnIndex] = {
              text: key,
              bold: true,
            }
          }
        }
        for (const [index, key] of keys.entries()) {
          const rowIndex = i + 2
          const columnIndex = index + 1
          sheet.cells[rowIndex] = sheet.cells[rowIndex] ?? {}
          sheet.cells[rowIndex][columnIndex] = {
            text: item[key]
          }
        }
      }      
      setSheets([sheet])
    }
    fetchJSON()
  }, [])
  return (
    <SpreadSheet      
      sheets={sheets}
      onChange={setSheets}
      autoFocus={false}
    />
  )
}

<SheetFromJSON />