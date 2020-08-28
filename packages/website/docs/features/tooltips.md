---
title: Tooltips
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

Tooltips can be easily added using the `tooltip` attribute for a cell

```jsx
const sheets = [
  {
    name: 'Sheet 1',
    id: 1,
    cells: {
      1: {
        1: {
          text: 200.00,
          tooltip: 'Hello world'
        }
      }
    }
  },
]
```

export const App = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        1: {
          1: {
            text: 'Hover over me',
            tooltip: 'Hello world'
          }
        }
      }
    },
  ]
  return <SpreadSheet initialSheets={sheets} />
}

<App />

## Custom tooltip component

```jsx
const TooltipComponent = (props: TooltipProps) => {
  const {
    x = 0,
    y = 0,
    width = 0,
    position = "right",
    scrollLeft = 0,
    scrollTop = 0,
    height = 0,
    content,
    text
  } = props
  const posX = position === "right" ? x + width - scrollLeft : x - scrollLeft;
  const posY = position === "bottom" ? y + height - scrollTop : y - scrollTop;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${posX}px, ${posY}px)`,
      }}
    >
      {content} {text}
    </div>
  )
}

<SpreadSheet autoFocus={false} Tooltip={TooltipComponent} />
```