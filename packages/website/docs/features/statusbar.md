---
title: Status Bar
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

Status Bar provides various sheet statuses and summary values similar to Excel. It can display `Count`, `Average` and `Sum`, but can be completely customizable with your own component

### `showStatusBar`

Show or hide status Bar


```jsx
<SpreadSheet showStatusBar={true} />
```

export const App = () => {
  const initialSheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        1: {
          1: {
            text: 1,
            datatype: 'number'
          },
          2: {
            text: 2,
            datatype: 'number'
          }
        },
        2: {
          1: {
            text: 1,
            datatype: 'number'
          },
          2: {
            text: 2,
            datatype: 'number'
          }
        },
      },
      selections: [
        {
          bounds: {
            top: 1,
            left: 1,
            right: 2,
            bottom: 2
          }
        }
      ]
    }
  ]
  return (
    <SpreadSheet autoFocus={false} initialSheets={initialSheets} />
  )
}

<App />


## Customizing StatusBar

Pass any React component as `StatusBar` prop

```jsx
const MyStatusBar = (props: StatusBarProps) => {
  return (
    <div>Hello</div>
  )
}

return <SpreadSheet StatusBar={MyStatusBar} />
```

export const AppStatusBar = () => {
  const StatusBarComponent = () => {
    return (
      <div>Hello</div>
    )
  }
  const initialSheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        1: {
          1: {
            text: 1,
            datatype: 'number'
          },
          2: {
            text: 2,
            datatype: 'number'
          }
        },
        2: {
          1: {
            text: 1,
            datatype: 'number'
          },
          2: {
            text: 2,
            datatype: 'number'
          }
        },
      },
      selections: [
        {
          bounds: {
            top: 1,
            left: 1,
            right: 2,
            bottom: 2
          }
        }
      ]
    }
  ]
  return (
    <SpreadSheet autoFocus={false} initialSheets={initialSheets} StatusBar={StatusBarComponent} />
  )
}

<AppStatusBar />