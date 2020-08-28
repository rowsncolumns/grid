---
title: Using images in cells
---
import SpreadSheet, { DefaultCell, Image, uuid } from "@rowsncolumns/spreadsheet";

Images can be added in cells either by adding it as part of the cell or using a custom cell renderer

## Add image urls in the cell config

```jsx
import SpreadSheet, { uuid } from "@rowsncolumns/spreadsheet";

const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    cells: {
      2: {
        2: {
          image: 'https://picsum.photos/200/300',
        }
      },
    }
  }
]
return (
  <SpreadSheet
    initialSheets={sheets}
  />
)
```

export const App = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: uuid(),
      cells: {
        2: {
          2: {
            image: 'https://picsum.photos/200/300',
          }
        },
      }
    }
  ]
  return (
    <SpreadSheet
      initialSheets={sheets}
    />
  )
}

<App />


## Adding image as data URL

Replacing `image` with the data URL will just work

```jsx
image: 'data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw=='
```

## Using a Custom Cell renderer

```jsx
import SpreadSheet, { DefaultCell, Image, uuid } from "@rowsncolumns/spreadsheet";
const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    rowSizes: {
      2: 100
    },
    cells: {
      2: {
        2: {
          image: 'https://picsum.photos/200/300',
        }
      },
    }
  }
]

const Cell = (props) => {
  const { image, ...rest } = props
  if (image) {
    return <Image stroke='red' spacing={1} strokeWidth={1} url={image} x={props.x} y={props.y} width={props.width} height={props.height} />
  }
  return <DefaultCell {...rest}  />
}

<SpreadSheet
  CellRenderer={Cell}
  initialSheets={sheets}
/>
```

export const ImageApp = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: uuid(),
      rowSizes: {
        2: 100
      },
      cells: {
        2: {
          2: {
            image: 'https://picsum.photos/200/300',
          }
        },
      }
    }
  ]
  const Cell = (props) => {
    const { image, ...rest } = props
    if (image) {
      return <Image stroke='red' spacing={1} strokeWidth={1} url={image} x={props.x} y={props.y} width={props.width} height={props.height} />
    }
    return <DefaultCell {...rest}  />
  }
  return (
    <SpreadSheet
      autoFocus={false}
      initialSheets={sheets}
      CellRenderer={Cell}
    />
  )
}

<ImageApp />