---
id: range_selection
title: Range Selection
---
import { useState } from 'react';
import SpreadSheet, { DefaultCell } from "@rowsncolumns/spreadsheet";

Multiple selection is enabled by default. You can disable it by setting `selectionPolicy` to `single`

### Example

```jsx
<SpreadSheet selectionPolicy='single'>
```

### Callback on Active cell change

```jsx
<SpreadSheet
  onActiveCellChange={(sheetId: string, cell: CellInterface) => {
    console.log(cell.rowIndex, cell.columnIndex)
  }}
>
```

### Callback on selection change

```jsx
<SpreadSheet  
  onSelectionChange={(sheetId: string, activeCell, selections: CellInterface) => {
    console.log(selections)
  }}
>
```