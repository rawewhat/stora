# StoRa

is a global **state management** library with **no dependency** and written purely on **React hooks**.

## Content

- [Install](#install)
- [Setup](#setup)
  - [With stora.config.js](#1-initialize-states-and-actions-in-storaconfigjs)
  - [With top-level component](#2-initialize-states-and-actions-in-top-level-component)
- [Usage](#usage)
  - [Change state inside action function](#1-change-state-inside-action-function)
    - [Set a states with key value pair](#11-change-a-component-state-using-key-value-pair)
    - [Set multiple states with object](#12-change-multiple-component-states-using-object)
    - [Set multiple states with arrays](#13-change-multiple-component-states-using-arrays)
    - [Get a state with string](#14-get-a-component-states-using-state-name)
    - [Get multiple states with arrays](#15-get-multiple-component-states-using-arrays-of-state-name)
  - [Accessing states and actions](#2-accessing-states-and-actions)
    - [Get one or multiple states](#21-get-one-or-multiple-component-states)
    - [Get one or multiple actions](#22-get-one-or-multiple-component-actions)
    - [Get only actions and skip states](#23-get-only-actions-and-skip-states)
    - [Get states and actions with dot](#24-get-states-and-actions-with-dot)
  - [Add more states or actions](#3-adding-additional-states-or-actions)
  - [Select one or multiple states](#4-selecting-one-or-multiple-states)
- [Demo](#demo)
- [Example](#example)
- [Acknowledgment](#acknowledgement)
- [License](#license)

## Install

using npm  
`npm i @rawewhat/stora`

using yarn  
`yarn add @rawewhat/stora`

## Setup

### 1. Initialize states and actions in stora.config.js

create a stora config file in either root or src directory of your project.

Example:  
/stora.config.js  
/src/stora.config.js

```javascript
export default {
  // This will be where you initialize your states
  states: {
    testScreen: {
      testState: 'testState'
    },
    demoScreen: {
      demoState: 'demoState'
    }
  },
  // This will be where you initialize your actions
  actions: {
    testScreen: {
      testAction: stora => {
        console.log('stora', stora)
      }
    },
    demoScreen: {
      demoAction: ({ states, actions }) => {
        console.log('states', states, 'actions', actions)
      }
    }
  },
  // If you need to do something before global state initialization
  init: stora => {
    console.log('stora', stora)
  }
}
```

_Note: states and actions object uses component based naming convention_

### 2. Initialize states and actions in top-level component

if you don't want to use stora.config.js to initialize your states and actions, use below syntax instead

Example: change your **App.js** like below

```javascript
import React from 'react'
import useStora from '@rawewhat/stora'
// you can also import it from another place such as your config directory
import { STATES, ACTIONS, INIT } from '../config'

const STATES = {
  testScreen: {
    testState: 'testState'
  },
  demoScreen: {
    demoState: 'demoState'
  }
}

const ACTIONS = {
  testScreen: {
    testAction: stora => {
      console.log('stora', stora)
    }
  },
  demoScreen: {
    demoAction: ({ states, actions }) => {
      console.log('states', states, 'actions', actions)
    }
  }
}

const INIT = stora => {
  console.log('stora', stora)
}

const App = props => {
  const [states, actions] = useStora(STATES, ACTIONS, INIT)
  console.log('states', states, 'actions', actions)
  return <div>App</div>
}

export default App
```

_Note: states and actions object uses component based naming convention_

## Usage

### 1. Change state inside action function

in your action function you have access to the global store where you can change and access state.

#### 1.1 Change a component state using key value pair

change only one component states using key and value argument

```javascript
const EXAMPLE_ACTIONS = {
  exampleComponent: {
    exampleAction: ({ set }) => {
      set('testComponent', {
        testState: 'changed'
      })
    }
  }
}
```

_Any other states in testComponent will be added automatically_

#### 1.2 Change multiple component states using object

change multiple component states using new states object, stora will automatically keep previous states

```javascript
const EXAMPLE_ACTIONS = {
  exampleComponent: {
    exampleAction: ({ set }) => {
      set({
        testComponent: {
          testState: 'changed'
        },
        demoComponent: {
          demoState: 'changed'
        }
      })
    }
  }
}
```

_Any other component states will be added automatically_

#### 1.3 Change multiple component states using arrays

change multiple component states using arrays of new states object, stora will automatically keep previous

```javascript
const EXAMPLE_ACTIONS = {
  exampleComponent: {
    exampleAction: ({ set }) => {
      set([
        {
          testComponent: {
            testState: 'changed'
          }
        },
        {
          demoComponent: {
            demoState: null
          }
        }
      ])
    }
  }
}
```

_Any other component states will be added automatically_

#### 1.4 Get a component states using state name

get only one component states using string of state name

```javascript
const EXAMPLE_ACTIONS = {
  exampleComponent: {
    exampleAction: ({ get }) => {
      const testComponent = get('testComponent')
    }
  }
}
```

#### 1.5 Get multiple component states using arrays of state name

get multiple component states using arrays of state name string

```javascript
const EXAMPLE_ACTIONS = {
  exampleComponent: {
    exampleAction: ({ get }) => {
      const {
        testComponent: { testState },
        demoComponent: { demoState }
      } = get(['testComponent', 'demoComponent'])
    }
  }
}
```

### 2. Accessing states and actions

#### 2.1 Get one or multiple component states

you can access states of specific component or even multiple component states using destructuring syntax.

```javascript
const [
  {
    testComponent: { testState },
    demoComponent: { demoState }
  },
  actions
] = useStora()
```

#### 2.2 Get one or multiple component actions

you can access actions of specific component or even multiple component actions using destructuring syntax.

```javascript
const [
  states,
  {
    testComponent: { testAction },
    demoComponent: { demoAction }
  }
] = useStora()
```

#### 2.3 Get only actions and skip states

you can also skip states object and directly access actions using below syntax.

```javascript
const [, actions] = useStora()
```

#### 2.4 Get states and actions with dot

you may also use dot access on states and actions too

```javascript
const [states, actions] = useStora()

console.log('testState:', states.testComponent.testState)
actions.demoComponent.demoAction()
```

### 3. Adding additional states or actions

sometimes you want add more states when using useStora hook on a component

- **mutate** for adding additional states and actions.

Example: adding another component states

```javascript
const [
  {
    newComponent: { newState }, // here you have access to the new added state
    testComponent: { testState },
    demoComponent: { demoState }
  },
  actions
] = useStora({
  mutate: {
    newComponent: {
      newState: 'newState'
    }
  }
})
```

Example: adding another component actions

```javascript
const [
  ,
  {
    newComponent: { newActions }, // here you have access to the new added action
    testComponent: { testAction },
    demoComponent: { demoAction }
  }
] = useStora({
  mutate: {
    newComponent: {
      newAction: stora => {
        console.log('stora', stora)
      }
    }
  }
})
```

Example: you can even mix states and actions inside mutate object

```javascript
const [
  {
    newComponent: { newState }, // here you have access to the new added state
    testComponent: { testState },
    demoComponent: { demoState }
  },
  {
    newComponent: { newActions }, // here you have access to the new added action
    testComponent: { testAction },
    demoComponent: { demoAction }
  }
] = useStora({
  mutate: {
    newComponent: {
      newState: 'newState',
      newAction: stora => {
        console.log('stora', stora)
      }
    }
  }
})
```

_by checking mutation object type, useStora is smart enough to know whether you want to add state or action_

### 4. Selecting one or multiple states

if you want to return only some component states from useStora hook

- **query** for selecting specific component states

Example: select only one component states

```javascript
const [states, ] = useStora({
  query: 'testComponent'
})
// states for this component contains only testComponent states
const {
  testComponent: { testState }
} = states
```

Example: select multiple component states

```javascript
const [states, ] = useStora({
  query: ['testComponent', 'demoComponent']
})
// states for this component contains only testComponent and demoComponent states
const {
  testComponent: { testState },
  demoComponent: { demoState }
} = states
```

## Demo

I wrote a simple router using StoRa + [RoutRa](https://github.com/rawewhat/routra) in this demo project.

- `git clone git@github.com:rawewhat/routra.git` to clone the project
- `cd demo` change to demo directory
- `yarn install` to install dependencies
- `yarn dev` it will be read on http://localhost:1234

## Example

```javascript
import React, { useEffect } from 'react'
import useStora from '@rawewhat/stora'

const App = () => {
  const [, actions] = useStora()
  useEffect(() => {
    actions.testing()
  }, [])
  return (
    <div>
      StoRa Demo
      <Test />
    </div>
  )
}

const Test = () => {
  const [states, actions] = useStora({
    mutate: {
      love: () => {}
    }
  })
  console.log('states', states, 'actions', actions)
  return (
    <div>
      Test
      <Test2 />
    </div>
  )
}

const Test2 = () => {
  const [states, actions] = useStora({
    mutate: {
      test100: {
        test111: 'test111'
      }
    },
    query: ['test100']
  })
  console.log('states', states, 'actions', actions)
  return <div>Test2</div>
}

export default App
```

## Acknowledgement

_This library is written and improved based on an article on [medium](https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8) by_ **André Gardi**

## License

```
MIT License
-----------

Copyright (c) 2019 Cheng Sokdara (https://rawewhat-team.com)
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```