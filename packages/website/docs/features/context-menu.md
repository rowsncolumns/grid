---
title: Context menu
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

You can pass your own Context Menu component using `ContextMenu` prop

```jsx
const MyContextMenu = (props: ContextMenuComponentProps) => {
  const { left, top, onInsertRow, onDeleteRow ...rest } = props
  return (
    <div style={{
      position: 'absolute',
      background: 'teal',
      left,
      top
    }}>
        Hello world
    </div>
  )
}

<SpreadSheet
  ContextMenu={MyContextMenu}
/>
```

### Demo 

export const App = () => {
  const MyContextMenu = (props) => {
    const { left, top, onInsertRow, onDeleteRow } = props
    return (
      <div style={{
        position: 'absolute',
        background: 'teal',
        left,
        top
      }}>
          Hello world
      </div>
    )
  }
  return (
    <SpreadSheet
      autoFocus={false}
      ContextMenu={MyContextMenu}
    />
  )
}

<App />