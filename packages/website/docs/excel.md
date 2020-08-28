---
id: excel
title: Excel Import/Export
---
<!-- import { useState, useCallback } from 'react'; -->
<!-- import Spreadsheet, { Sheet, defaultSheets } from "@rowsncolumns/spreadsheet"; -->
<!-- import { excelToSheets, createExcelFileFromSheets } from '@rowsncolumns/export' -->

You will need to install `@rowsncolumns/export` npm package to add support for reading and writing excel file. Values that are preserved are

1. Cell values
1. Datatypes
1. Fill
1. Border
1. Frozen columns and rows
1. Merge cells

## Import from Excel


```jsx
import { parse, download } from '@rowsncolumns/export'
import Spreadsheet, { Sheet, defaultSheets } from "@rowsncolumns/spreadsheet";

const App = () => {
  const [ sheets, setSheets] = useState(defaultSheets)
  const handleFileSelect = (e) => {
    const getSheets = async (file) => {
      const newSheets = await parse({ file })
      setSheets(newSheets.sheets)
    }
    getSheets(e.target.files[0])
  }
  return (
    <>
      <input type="file" onChange={handleFileSelect} />
      <Spreadsheet
        sheets={sheets}
        onChange={setSheets}
      />
    </>
  )
}
```


## Export to excel

```jsx
const App = () => {
  const [ sheets, setSheets] = useState(defaultSheets)
  const handleExport = useCallback((sheets) => {
    download({ sheets })
  }, [])
  return (
    <>
      <button onClick={() => handleExport({ sheets })}>Export to excel</button>
      <Spreadsheet
        autoFocus={false}
        sheets={sheets}
        onChange={setSheets}
      />
    </>
  );
};
```


## Demo

https://rowsncolumns.github.io/grid/?path=/story/spreadsheet--import