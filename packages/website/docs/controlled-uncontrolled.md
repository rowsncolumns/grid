---
title: Controlled/Uncontrolled mode
---

You can use SpreadSheet Grid as a controlled or as an uncontrolled component

## Controlled mode

In controlled mode, your parent component state drives the grid. SpreadSheet Grid will be stateless.

```jsx

const [ sheets, setSheets ] = useState(initialSheets)

return (
  <SpreadSheet
    sheets={sheets}
    onChange={setSheets}
  />
)
```

## Uncontrolled mode

Pass your `initialSheets` and let SpreadSheet Grid handle the state. Change in `initialSheets` will not trigger a re-render of SpreadSheet


```jsx

return (
  <SpreadSheet
    autoFocus={false}
    initialSheets={initialSheets}
    onChange={(sheets) => {
      // Persist state
    }}
  />
)
```