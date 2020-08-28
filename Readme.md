# Rows n' Columns

React Components for Tabular data.

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![Build Status](https://travis-ci.org/rowsncolumns/grid.svg?branch=master)](https://travis-ci.org/rowsncolumns/grid)


This monorepo contains

1. [Grid](https://github.com/rowsncolumns/grid/tree/master/packages/grid) - MIT Licensed Declarative Canvas Grid. Refer to [Storybook](https://rowsncolumns.github.io/grid) for all demos.


2. [SpreadSheet](https://github.com/rowsncolumns/grid/tree/master/packages/spreadsheet) - Excel-like Grid available as Non-commercial and Commercially licensed product

3. [Exporter](https://github.com/rowsncolumns/grid/tree/master/packages/export) - Excel Export plugin


### SpreadSheet Grid Documentation

If you are looking for documentation of SpreadSheet Grid, its here

[https://rowsncolumns.app/](https://rowsncolumns.app/)

## Local development

The monorepo is managed using `lerna` and `yarn` workspaces. To get started

1. Clone the repository to `rowsncolumns` directory

```sh
git clone https://github.com/rowsncolumns/grid.git rowsncolumns
```

2. Install npm dependencies using `yarn`

```js
// Switch to the new directory
cd rowsncolumns

// Install all dependencies
yarn
```

3. Compile typescript files to Javascript

```
yarn build
```

### Run storybook

```js
yarn storybook
```

And open `http://localhost:9002/` in Chrome and click on `SpreadSheet` section on the left navigation

All `stories` are located in `packages/storybook` directory

### Watch and compile typescript

```js
yarn build:watch
```