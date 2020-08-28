---
id: csv
title: CSV Import/Export
---

You will need to install `@rowsncolumns/export` npm package to add support for reading and writing csv file.

## Import from CSV


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


## Export to csv

```jsx
const App = () => {
  const [ sheets, setSheets] = useState(defaultSheets)
  const handleExport = useCallback((sheets) => {
    download({ sheets, type: 'csv' })
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

