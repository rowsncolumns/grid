---
id: conditional_formatting
title: Conditional formatting
---
import { useState, useRef } from 'react';
import SpreadSheet, { DefaultCell } from "@rowsncolumns/spreadsheet";

SpreadSheet Grid gives you full control over cell level rendering, hence its very easy to apply conditional formatting

### Example

```jsx
export const MySpreadSheet = () => {
  const initialSheets = [
    {
      name: 'Sheet 1',
      id: 0,      
      cells: {
        1: {
          1: {
            text: 'black'
          }
        },
        2: {
          3: {
            text: 'pink'
          }
        }
      }
    }
  ]
  const [ sheets, setSheets ] = useState(initialSheets)
  return (
    <SpreadSheet
      initialSheets={sheets}
      CellRenderer={(props) => {
        const { text } = props
        return <DefaultCell {...props} fill={text} color={text === 'black' ? 'white' : undefined} />
      }}
      onChangeCells={(sheetId, cells) => {
        
      }}
    />
  )
}

```

### Demo

export const MySpreadSheet = () => {
  const initialSheets = [
    {
      name: 'Sheet 1',
      id: 0,      
      cells: {
        1: {
          1: {
            text: 'black'
          }
        },
        2: {
          3: {
            text: 'pink'
          }
        }
      }
    }
  ]
  const [ sheets, setSheets ] = useState(initialSheets)
  const gridRef = useRef(null)  
  return (
    <SpreadSheet
      autoFocus={false}
      ref={gridRef}
      initialSheets={sheets}
      CellRenderer={(props) => {
        const { text } = props
        return <DefaultCell {...props} fill={text} color={text === 'black' ? 'white' : undefined} />
      }}
      onChangeCells={(sheetId, cells) => {
        console.log('gridRef', gridRef)
      }}
    />
  )
}

<MySpreadSheet />

<br />

:::note
For performance reasons move the `CellRenderer` to be its own independent component to prevent re-rendering when parent renders
:::