---
title: Datatypes
---
import SpreadSheet, { uuid } from "@rowsncolumns/spreadsheet";

SpreadSheet Grid supports the following `datatypes`

```jsx
export type DATATYPES =
  | "null"
  | "number"
  | "string"
  | "boolean"
  | "error"
  | "hyperlink";
```

:::note
We are actively working to add support for these datatypes

1. Date
1. Formula
1. RichText
:::

## Number

```jsx
const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    cells: {
      1: {
        1: {
          datatype: 'number',
          text: 200.00,
          format: '\\S$ #.00'
        }
      }
    }
  },
]
```

export const NumberType = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: uuid(),
      cells: {
        1: {
          1: {
            datatype: 'number',
            text: 200.00,
            format: '\\S$ #.00'
          }
        }
      }
    },
  ]
  return <SpreadSheet autoFocus={false} initialSheets={sheets} />
}

<NumberType />

## String

```jsx
const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    cells: {
      1: {
        1: {
          datatype: 'string',
          text: '1'
        }
      }
    }
  },
]
```

export const StringType = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: uuid(),
      cells: {
        1: {
          1: {
            datatype: 'string',
            text: 'Hello world'
          }
        }
      }
    },
  ]
  return <SpreadSheet autoFocus={false} initialSheets={sheets} />
}

<StringType />


## Boolean

Displays a checkbox

```jsx
const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    cells: {
      1: {
        1: {
          text: "TRUE",
          datatype: 'boolean',
          dataValidation: {
            allowBlank: true,
            type: "boolean",
            formulae: ["TRUE", "FALSE"],
          },
        }
      }
    }
  },
]
```

export const Boolean = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: uuid(),
      cells: {
        1: {
          1: {
            text: "TRUE",
            datatype: 'boolean',
            dataValidation: {
              allowBlank: true,
              type: "boolean",
              formulae: ["TRUE", "FALSE"],
            },
          }
        }
      }
    },
  ]
  return <SpreadSheet autoFocus={false} initialSheets={sheets} />
}

<Boolean />


## Hyperlink

```jsx
const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    cells: {
      1: {
        1: {
          datatype: 'hyperlink',
          text: "Hello world",
          color: "#1155CC",
          underline: true,
          hyperlink: "http://google.com",
        }
      }
    }
  },
]
```

export const HyperLink = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: uuid(),
      cells: {
        1: {
          1: {
            datatype: 'hyperlink',
            text: "Hello world",
            color: "#1155CC",
            underline: true,
            hyperlink: "http://google.com",
          }
        }
      }
    },
  ]
  return <SpreadSheet autoFocus={false} initialSheets={sheets} />
}

<HyperLink />

## Error

```jsx
const sheets = [
  {
    name: 'Sheet 1',
    id: uuid(),
    cells: {
      1: {
        1: {
          text: 'hello',
          valid: false,
          datatype: 'number',
          dataValidation: {
            type: 'decimal',
            prompt: 'Enter a valid number'
          }
        }
      }
    }
  },
]
```

export const Error = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: uuid(),
      cells: {
        1: {
          1: {
            text: 'hello',
            valid: false,
            dataValidation: {
              type: 'decimal',
              prompt: 'Enter a valid number'
            }
          }
        }
      }
    },
  ]
  return <SpreadSheet autoFocus={false} initialSheets={sheets} />
}

<Error />