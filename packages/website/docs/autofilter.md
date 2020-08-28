---
id: autofilter
title: AutoFilter views
---
import SpreadSheet from "@rowsncolumns/spreadsheet"

You can specify autofilter views in SpreadSheet Grid using `filterViews` options


```jsx
import SpreadSheet from '@rowsncolumns/spreadsheet'
const initialSheets = [
  {
    name: 'Sheet 1',
    id: 0,
    cells: {
      1: {
        1: {
          text: 'First Name',
        },
        2: {
          text: 'Last Name'
        },
        3: {
          text: 'Gender'
        }
      },
      2: {
        1: {
          text: 'Dulce'
        },
        2: {
          text: 'Abril'
        },
        3: {
          text: 'Female',
        }
      },
      2: {
        1: {
          text: 'Mara'
        },
        2: {
          text: 'Hashimoto'
        },
        3: {
          text: 'Male',
        }
      }
    },
    filterViews: [
      {
        bounds: {
          top: 1,
          bottom: 5,
          left: 1,
          right: 3
        }
      }
    ]
  }
]
<SpreadSheet
  initialSheets={initialSheets}
/>
```

### Demo

export const App = () => {
  const initialSheets = [
    {
      name: 'Sheet 1',
      id: 0,
      cells: {
        1: {
          1: {
            text: 'First Name',
          },
          2: {
            text: 'Last Name'
          },
          3: {
            text: 'Gender'
          }
        },
        2: {
          1: {
            text: 'Dulce'
          },
          2: {
            text: 'Abril'
          },
          3: {
            text: 'Female',
          }
        },
        3: {
          1: {
            text: 'Mara'
          },
          2: {
            text: 'Hashimoto'
          },
          3: {
            text: 'Male',
          }
        }
      },
      filterViews: [
        {
          bounds: {
            top: 1,
            bottom: 5,
            left: 1,
            right: 3
          }
        }
      ]
    }
  ]
  return (
    <SpreadSheet
      initialSheets={initialSheets}
      autoFocus={false}
    />
  )
}

<App />