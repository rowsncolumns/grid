---
id: formatting
title: Data Formatting
---

Data formatting using ECMA-376 spreadsheet format codes is supported using [SSF](https://github.com/SheetJS/ssf)

------

### Example

Data | Format | Formatted value |
|---|---|---|
12 | $#.00 | $12.00 |
890123| #,##0.000 | 890,123.00 |
65 | 0.0% | 65.0%
new Date() | dd mm yyyy | 03 07 2020 |


```jsx
import SpreadSheet from '@rowsncolumns/spreadsheet'
const initialSheets = [
  {
    name: 'Sheet 1',
    id: 0,
    cells: {
      1: {
        1: {
          text: 100,
          datatype: 'number',
          format: '#.00'
        }
      }
    }
  }
]
<SpreadSheet
  initialSheets={initialSheets}
/>
```


### Demo

import SpreadSheet from "@rowsncolumns/spreadsheet"
const initialSheets = [
  {
    id: '0',
    name: 'Sheet 1',
    activeCell: null,
    cells: {
      1: {
        1: {
          text: 100,
          format: '#.00',
          datatype: 'number'
        }
      }
    }
  }
]

<SpreadSheet
  autoFocus={false}
  initialSheets={initialSheets}
/>