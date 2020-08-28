---
title: UI Customizations
---
import SpreadSheet from "@rowsncolumns/spreadsheet";

## Hide  Toolbar

Hides formatting toolbar

```jsx
<SpreadSheet
  showToolbar={false}
/>
```

<SpreadSheet
  showToolbar={false}
  autoFocus={false}
/>

## Hide formula  bar

Hides formula input box

```jsx
<SpreadSheet
  showFormulabar={false}
/>
```

<SpreadSheet
  showFormulabar={false}
  autoFocus={false}
/>

## Hide Tabstrip

Hides new tab, tab list section

```jsx
<SpreadSheet
  showTabStrip={false}
/>
```

<SpreadSheet
  showTabStrip={false}
  autoFocus={false}
/>

## Hide Status bar

Hides Count, Average and Sum status section

```jsx
<SpreadSheet
  showStatusBar={false}
/>
```

<SpreadSheet
  showStatusBar={false}
  autoFocus={false}
/>


## Barebone grid

Display only the grid without any toolbars

```jsx
<SpreadSheet
  showToolbar={false}
  showTabStrip={false}
  showFormulabar={false}
  showStatusBar={false}
/>
```

<SpreadSheet
  showToolbar={false}
  showTabStrip={false}
  showFormulabar={false}
  showStatusBar={false}
  autoFocus={false}
/>