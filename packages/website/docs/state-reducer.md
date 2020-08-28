---
title: State reducer
---

You can pass a state reducer to modify internal state of SpreadSheet Grid. The reducer receives the current state and action and should always return the new state.

:::note
This is a handy feature to modify internal state. Internal state is powered by [Immer](https://github.com/immerjs/immer/)
:::


```jsx
import { ACTION_TYPE, Actiontypes, initialState } from '@rowsncolumns/spreadsheet'

const stateReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.SELECT_SHEET:
      // Using immer
      return produce(state, draft => {
        draft.selectedSheet = state.sheets[0].id
      })

      // Using Spread operator
      return {
        ...state,
        selectedSheet: state.sheets[0].id
      }
  
    default:
      return state
  }
}

return <SpreadSheet stateReducer={stateReducer} />
```

This is similar to how [Downshift](https://github.com/downshift-js/downshift#statereducer) manages internal state.