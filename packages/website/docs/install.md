---
id: install
title: Installation
---

You can install SpreadSheet Grid using `yarn` or `npm`

```sh
yarn add @rowsncolumns/spreadsheet
```

or using `npm`

```sh
npm install @rowsncolumns/spreadsheet
```

Once installed you can render the grid using


```jsx
import SpreadSheet from '@rowsncolumns/spreadsheet'

function App () {
  return (
    <SpreadSheet autoFocus={false} />
  )
}
```