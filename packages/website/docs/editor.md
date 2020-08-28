---
id: editor
title: Custom editors
---
import SpreadSheet, { DefaultEditor } from "@rowsncolumns/spreadsheet"

Cells support custom editor via `CellEditor` prop

```jsx
const CustomEditor = (props) => {
  const { rowIndex, columnIndex, position, onSubmit, cell, value } = props
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
      }}
    >
      <select
        autoFocus
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          verticalAlign: 'top'
        }}
        value={value}
        onChange={(e) => {
          onSubmit(e.target.value, cell)
        }}
      >
        <option value=''>Select a car model</option>
        <option>Honda</option>
        <option>Mazda</option>
        <option>Ferrari</option>
      </select>
    </div>
  )
}

<SpreadSheet
  CellEditor={CustomEditor}
/>
```

### Demo

<SpreadSheet
  autoFocus={false}
  CellEditor={(props) => {
    const { rowIndex, columnIndex, position, onSubmit, cell, value } = props
    return (
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
        }}
      >
        <select
          autoFocus
          style={{
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            verticalAlign: 'top'
          }}
          value={value}
          onChange={(e) => {
            onSubmit(e.target.value, cell)
          }}
        >
          <option value=''>Select a car model</option>
          <option>Honda</option>
          <option>Mazda</option>
          <option>Ferrari</option>
        </select>
      </div>
    )
  }}
/>