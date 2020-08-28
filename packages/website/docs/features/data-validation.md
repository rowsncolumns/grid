---
title: Data Validation
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

SpreadSheet Grid supports the following cell level data Validation

1. List (static)
1. Checkbox
1. Decimal
1. List (formula range) - Coming soon
1. Date - Coming soon

## List (static)

```jsx
const sheets = [
  {
    name: "Sheet 1",
    id: 0,
    cells: {
      2: {
        2: {
          text: "",
          valid: false,
          dataValidation: {
            prompt: "Enter a country",
            type: 'list',
            formulae: ['Singapore', 'Japan', 'China']
          },
        },
      },
    },
  },
];

<Spreadsheet initialSheets={sheets}  />
```

### Demo 

export const Demo1 = ()  => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        2: {
        2: {
            text: 'Select a country',
            valid: false,
            dataValidation: {
              prompt: "Enter a country",
              type: 'list',
              formulae: ['Singapore', 'Japan', 'China']
            }
          }
        }
      }
    }
  ]
  return (
    <SpreadSheet
      initialSheets={sheets}
    />
  )
}

<Demo1 />

## Checkbox

Checkbox validation schema is as per below

```jsx
const initialValidationSheet: Sheet[] = [
  {
    name: "Sheet 1",
    id: 0,
    activeCell: null,
    selections: [],
    cells: {
      4: {
        2: {
          text: 'TRUE',
          datatype: 'boolean',
          dataValidation: {
            allowBlank: true,
            type: "boolean",
            formulae: ["TRUE", "FALSE"]
          }
        }
      }
    }
  }
];
```

### Demo

export const Demo2 = ()  => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        4: {
          2: {
            text: 'TRUE',
            datatype: 'boolean',
            dataValidation: {
              allowBlank: true,
              type: "boolean",
              formulae: ["TRUE", "FALSE"]
            }
          }
        }
      }
    }
  ]
  return (
    <SpreadSheet
      autoFocus={false}
      initialSheets={sheets}
    />
  )
}

<Demo2 />


## Decimal

Validation for decimals number can be added using this schema

```jsx
const initialValidationSheet: Sheet[] = [
  {
    name: "Sheet 1",
    id: 0,
    activeCell: null,
    selections: [],
    cells: {
      4: {
        2: {
          text: '',
          dataValidation: {
            allowBlank: true,
            type: "decimal",
            operator: 'between',
            prompt: 'Enter a decimal between 0 and 10',
            formulae: [0, 10]
          }
        }
      }
    }
  }
];
```

:::note
Supported operators
```jsx
export type DataValidationOperator =
  | "between"
  | "notBetween"
  | "equal"
  | "notEqual"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual";
```
:::