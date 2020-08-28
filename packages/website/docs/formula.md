---
id: formula
title: Formula (beta)
---
import SpreadSheet, { FormulaError } from "@rowsncolumns/spreadsheet"
import { FormulaParser } from '@rowsncolumns/calc'

Formula support is now in beta. We have added a new Calculation Engine for SpreadSheet Grid. Calculations are always async and is an independent module.

## Adding custom formula

A simple formula to add `+1` to any number

```jsx
const formulas = {
  'PLUS_ONE': (parser: FormulaParser, arg: FunctionArgument) => {
    if (!arg) {
      return new FormulaError('#NA', 'Wrong number of arguments')
    }
    const { value } = arg
    if (isNaN(Number(value))) {
      return new FormulaError('#NA', 'Please enter a number.')
    }
    return value + 1
  }
}

return (
  <SpreadSheet formulas={formulas} />
)
```

#### Demo

Enter `=PLUS_ONE(12)`

export const App = () => {
  const formulas = {
    'PLUS_ONE': (parser, arg) => {
      if (!arg) {
        return new FormulaError('#NA', 'Wrong number of arguments')
      }
      const { value } = arg
      if (isNaN(Number(value))) {
        return new FormulaError('#NA', 'Please enter a number.')
      }
      return value + 1
    }
  }
  return (
  <SpreadSheet autoFocus={false} formulas={formulas} />
  )
}

<App />

## Asynchronous formula

```jsx
const formulas = {
  'FETCH_USER_INFO': (parser, arg: FunctionArgument) => {
    if (!arg) {
      return new FormulaError('#NA', 'Wrong number of arguments')
    }
    return fetch('/api')
  }
}

return (
  <SpreadSheet formulas={formulas} />
)
```

### Spanning multiple cells

```jsx
const formulas = {
  FETCH_EXCHANGE_RATES: async () => {
    return fetch("https://api.exchangeratesapi.io/latest")
      .then(r => r.json())
      .then(response => {
        const data = [];
        const rates = response.rates;
        for (const currency in rates) {
          data.push([currency, rates[currency]]);
        }
        return data;
      });
  }
}

return (
  <SpreadSheet formulas={formulas} />
)
```

#### Demo

Type `=FETCH_EXCHANGE_RATES()`

export const App2 = () => {
  const formulas = {
    FETCH_EXCHANGE_RATES: async () => {
    return fetch("https://api.exchangeratesapi.io/latest")
      .then(r => r.json())
      .then(response => {
        const data = [];
        const rates = response.rates;
        for (const currency in rates) {
          data.push([currency, rates[currency]]);
        }
        return data;
      });
  }
  }
  return (
  <SpreadSheet autoFocus={false} formulas={formulas} />
  )
}

<App2 />

## Multi-selection mode

Multi-selection mode allows user to select multiple cells and selections when user is in formula mode.

:::note
Multi-selection in Formula mode is currently in beta
:::