---
title: Selection modes
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

You can customize how rows and columns are selected when user selects a cell.

```jsx
<SpreadSheet
  selectionMode='row|column|both'
/>
```

### Row selection mode

<SpreadSheet
  autoFocus={false}
  selectionMode='row'
/>

### Column selection mode

<SpreadSheet
  autoFocus={false}
  selectionMode='column'
/>

### Row and Column selection mode

<SpreadSheet
  autoFocus={false}
  selectionMode='both'
/>

## Selection policy

The following policies are accepted

| Policy | Summary |
|---|---|
| single | Only once cell will be selected at a time |
| range | Only single cell or range can be selected at a time |
| multiple | Multiple cells or ranges can be selected |

```jsx
<SpreadSheet
  selectionPolicy='single'
/>
```

<SpreadSheet
  autoFocus={false}
  selectionPolicy='single'
/>