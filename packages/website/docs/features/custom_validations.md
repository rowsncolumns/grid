---
title: Custom Validation
---
import { useCallback } from 'react'
import SpreadSheet, { format as defaultFormatter, DefaultCell, validate as defaultValidation } from "@rowsncolumns/spreadsheet";
import { Rect, Text } from 'react-konva'


SpreadSheet Grid supports validation for the following datatypes

1. List (static)
2. Number
3. Boolean
4. Custom validation rules
5. Formula (coming soon)

:::note
`onValidate` is called everytime a cell value is changed by the user.
:::

## Adding a custom validation (sync)

```jsx
import { validate as defaultValidation } from '@rowsncolumns/spreadsheet'

const handleValidate = async (value, sheet, cell, cellConfig) => {
  if (value !== 'hello') return {
    valid: false,
    message: 'We only accept hello... Sorry'
  }
  return defaultValidation(value, sheet, cell, cellConfig)
}
return (
  <SpreadSheet onValidate={handleValidate} />
)
```

## Demo

Cells only accepts `hello`. Anything else is invalid

export const App = () => {
  const handleValidate = async (value, sheet, cell, cellConfig) => {
    if (value !== 'hello') return {
      valid: false,
      message: 'We only accept hello... Sorry'
    }
    return defaultValidation(value, sheet, cell, cellConfig)
  }
  return (
    <SpreadSheet autoFocus={false} onValidate={handleValidate} />
  )
}

<App />

## Example: Email validation

```jsx
const sheets = [
  {
    name: 'Sheet 1',
    cells: {
      1: {
        1: {
          text: '',
          dataValidation: {
            type: 'text',
            operator: 'email'
          }
        }
      }
    }
  }
]

import { validate as defaultValidation } from '@rowsncolumns/spreadsheet'

const handleValidate = async (value, sheet, cell, cellConfig) => {
  const dataValidation = cellConfig?.dataValidation
  if (dataValidation?.type === 'text' &&
      dataValidation?.operator === 'email') {
    return {
      valid: value.indexOf('@') !== -1,
    }
  }
  return defaultValidation(value, sheet, cell, cellConfig)
}
return (
  <SpreadSheet onValidate={handleValidate} />
)
```

Enter `hello` in `row: 1, col: 1`

export const EmailValidation = () => {
  const sheets = [
    {
      name: 'Sheet 1',
      id: 1,
      cells: {
        1: {
          1: {
            text: '',
            dataValidation: {
              type: 'text',
              operator: 'email',
              prompt: 'Invalid email'
            }
          }
        }
      }
    }
  ]
  const handleValidate = async (value, sheet, cell, cellConfig) => {
    const dataValidation = cellConfig?.dataValidation
    if (dataValidation?.type === 'text' &&
        dataValidation?.operator === 'email') {
      return {
        valid: value.indexOf('@') !== -1,
      }
    }
    return defaultValidation(value, sheet, cell, cellConfig)
  }
  return (
    <SpreadSheet autoFocus={false} onValidate={handleValidate} sheets={sheets} />
  )
}

<EmailValidation />

## Async validation

```jsx
const handleValidate = async (value, sheet, cell, cellConfig) => {
  if (cellConfig.type === 'email') {
    const resp = fetch('/validate_email', { body: value })
    if (resp.ok) {
      return {
        valid: true
      }
    } else {
      return {
        valid: false,
        message: 'Invalid email'
      }
    }
  }
  return defaultValidation(value, sheet, cell, cellConfig)
}
return (
  <SpreadSheet  onValidate={handleValidate} />
)
```
