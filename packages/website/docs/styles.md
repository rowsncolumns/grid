---
id: styles
title: Styling
---
import SpreadSheet from "@rowsncolumns/spreadsheet"

Cells support varietly of styling options to change color, fill, stroke etc

```ts
export interface CellFormatting extends CellDataFormatting {
  datatype?: number | 'string';
  bold?: boolean;
  color?: string;
  italic?: boolean;
  horizontalAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  underline?: boolean;
  strike?: boolean;
  fill?: string;
  stroke?: string;
  strokeTopColor?: string;
  strokeRightColor?: string;
  strokeBottomColor?: string;
  strokeLeftColor?: string;
  strokeWidth?: number;
  strokeTopWidth?: number;
  strokeRightWidth?: number;
  strokeBottomWidth?: number;
  strokeLeftWidth?: number;
  strokeDash?: number[];
  strokeTopDash?: number[];
  strokeRightDash?: number[];
  strokeBottomDash?: number[];
  strokeLeftDash?: number[];
  lineCap?: string;
  padding?: number;
  fontSize?: number;
  fontFamily?: string;
  locked?: boolean;
  wrap?: string
}
```

## Cell color and fill

```jsx
import SpreadSheet from "@rowsncolumns/spreadsheet"
const initialSheets = [
  {
    id: '0',
    name: 'Sheet 1',
    activeCell: null,
    cells: {
      2: {
        2: {
          text: 'Hello world',
          fill: '#5110ed',
          color: 'white'
        }
      }
    }
  }
]

<SpreadSheet
  sheets={initialSheets}
/>

```


### Demo

<SpreadSheet
  sheets={ [
  {
    id: '0',
    name: 'Sheet 1',
    activeCell: null,
    cells: {
      2: {
        2: {
          text: 'Hello world',
          fill: '#5110ed',
          color: 'white'
        }
      }
    }
  }
]}
/>

## Cell stroke

```jsx
import SpreadSheet from "@rowsncolumns/spreadsheet"

<SpreadSheet
  sheets={[
  {
    id: '0',
    name: 'Sheet 1',
    activeCell: null,
    cells: {
      2: {
        2: {
          text: 'Hello world',
          fill: 'teal',
          stroke: 'red'
        }
      }
    }
  }
]}
/>

```


### Demo

<SpreadSheet
  sheets={[
    {
      id: '0',
      name: 'Sheet 1',
      activeCell: null,
      cells: {
        2: {
          2: {
            text: 'Hello world',
            fill: 'teal',
            stroke: 'red'
          }
        }
      }
    }
  ]}
/>


## Text alignment

```jsx
import SpreadSheet from "@rowsncolumns/spreadsheet"

<SpreadSheet
  sheets={[
  {
    id: '0',
    name: 'Sheet 1',
    activeCell: null,
    cells: {
      2: {
        2: {
          text: 'Hello world',
          horizontalAlign: 'right',
          verticalAlign: 'top'
        }
      }
    }
  }
]}
/>

```


### Demo

<SpreadSheet
  sheets={[
    {
      id: '0',
      name: 'Sheet 1',
      activeCell: null,
      rowSizes: {
        2: 100
      },
      cells: {
        2: {
          2: {
            text: 'Hello world',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            
          }
        }
      }
    }
  ]}
/>