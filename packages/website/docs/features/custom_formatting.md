---
title: Custom formatting
---
import SpreadSheet, { format as defaultFormatter, DefaultCell } from "@rowsncolumns/spreadsheet";
import { Rect, Text } from 'react-konva'

There are 3 ways to add custom formatting to your Grid

## Formatter

SpreadSheet Grid exposes `formatter` prop, which can be used to modify the value that is rendered

```jsx
import { format as defaultFormatter } from '@rowsncolumns/spreadsheet'

const Sheets = [
  {
    name: 'Sheet 1',
    cells: {
      1: {
        1: {
          type: 'email',
          text: 'support@rowsncolumns.app'
        }
      }
    }
  }
]

const formatter = (value, datatype, cellConfig) => {
  if (cellConfig.type === 'email') {
    return 'This is an email'
  }
  return defaultFormatter(value, datatype, cellConfig)
}

<SpreadSheet formatter={formatter} />
```

### Demo

Type `hello` and `hello world` will be rendered

export const FormatterApp = () => {
  const customformatter = (value, datatype, config) => {
    if (value === 'hello') return `hello world`
    return defaultFormatter(value, datatype, config)
  }
  return (
    <SpreadSheet
      formatter={customformatter}
    />
  )
}

<FormatterApp />

<br />
<br />

## Custom Cell Renderer

You can render your own Cell to fully custom formatting and style

```jsx
import { DefaultCell } from '@rowsncolumns/spreadsheet'
import { Rect, Text } from 'react-konva'

const CellRenderer = (props) => {
  if (props.text === 'hello') {
    const { x, y, height, width } = props
    return (
      <>
        <Text
          x={x}
          y={y}
          width={width}
          height={height}
          text='Hello world'
        />
      </>
    )
  }
  return <DefaultCell {...props} />
}

return (
  <SpreadSheet
    CellRenderer={CellRenderer}
  />
)
```

### Demo

Type `hello` and `hello world` will be rendered

export const CellRendererApp = () => {
  const CellRenderer = (props) => {
    if (props.text === 'hello') {
      const { x, y, height, width } = props
      return (
        <>
          <Text
            x={x}
            y={y}
            width={width}
            height={height}
            text='Hello world'
          />
        </>
      )
    }
    return <DefaultCell {...props} />
  }
  return (
    <SpreadSheet
      autoFocus={false}
      CellRenderer={CellRenderer}
    />
  )
}

<CellRendererApp />

## Extending DefaultCell

Coming soon