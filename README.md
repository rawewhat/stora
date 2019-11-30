# StoRa

is a global **state management** library with **no dependency** and written purely on **React hooks**.

## How it works?

- in every component that call **useStora()** hook will **subscribe** to the **global store** on component **mounted**.
- anytime you call **set()** to change state, all components that **subscribed** to global store will **re-render**.
- when subscribed component **unmounted**, global store will **un-subscribe** it to prevent **re-render**.
- with **proper** usage of **useMemo()** and **useCallback()** hook, we can control re-render to **quantum** level.

_so basically, only mounted component that call useStora() hook will re-render when state change_


## What's next?

- implement automatically memoization with useMemo and useCallback.
- state specific component re-render, currently re-render all subscribed component.

## [Changelog](https://github.com/rawewhat/stora/blob/master/CHANGELOG.md)

## Content

- [Install](#install)
- [Setup](#setup)
  - [With stora.config.js](#1-initialize-states-and-actions-in-storaconfigjs)
  - [With top-level component](#2-initialize-states-and-actions-in-top-level-component)
  - [With next.js ssr](#3-nextjs-server-side-rendering)
- [Usage](#usage)
- [API](#api)
  - [1. In Actions Config](#1-in-actions-config)
    - [1.1 set(string, obj)](#11-setstring-obj)
    - [1.2 set(obj)](#12-setobj)
    - [1.3 get(string)](#13-getstring)
    - [1.4 get([string, string])](#14-getstring-string)
  - [2. In React Component](#2-in-react-component)
    - [2.1 [{ component: { state }}]](#21--component--state-)
    - [2.2 [{ component: { action }}]](#22--component--action-)
    - [2.3 [, actions]](#23--actions)
    - [2.4 actions.component.actions()](#24-actionscomponentaction)
  - [3. useStora({ mutate: { obj, func }})](#3-usestora-mutate--obj-func-)
  - [4. useStora({ query: { string | [string, string] }})](#4-usestora-query--string--string-string-)
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

* [project_root]/stora.config.js  
or
* [project_root]/src/stora.config.js

```javascript
export default {
  // This will be where you initialize your states
  states: {
    testComponent: {
      testState: 'testState'
    },
    demoComponent: {
      demoState: 'demoState'
    }
  },
  // This will be where you initialize your actions
  actions: {
    testComponent: {
      testAction: stora => {
        console.log('stora', stora)
      }
    },
    demoComponent: {
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

_Note: states and actions object use component based naming convention_

### 2. Initialize states and actions in top-level component

if you don't want to use stora.config.js to initialize your states and actions, use below syntax instead

* change your **App.js** or any top-level component

```javascript
import React from 'react'
import useStora from '@rawewhat/stora'
// you can also import it from another place such as your config directory
import { initialStates, initialActions, initializer } from '../config'

const initialStates = {
  testComponent: {
    testState: 'testState'
  },
  demoComponent: {
    demoState: 'demoState'
  }
}

const initialActions = {
  testComponent: {
    testAction: stora => {
      console.log('stora', stora)
    }
  },
  demoComponent: {
    demoAction: ({ states, actions }) => {
      console.log('states', states, 'actions', actions)
    }
  }
}

const initializer = stora => {
  console.log('stora', stora)
}

const App = props => {
  const [states, actions] = useStora({
    states: initialStates,
    actions: initialActions,
    init: initializer
  })
  console.log('states', states, 'actions', actions)
  return <span>Stora is awesome!</span>
}

export default App
```

_Note: states and actions object use component based naming convention_

### 3. Next.js server-side rendering

to get it working with server-side rendering, we need to make a custom HOC to wrap our \_app.js.  
if you don't use \_app.js, you need to wrap the HOC in every pages.

- create a HOC in anywhere you want, for example src/service/hoc.js

```javascript
import React from 'react'
import useStora from '@rawewhat/stora'
// Import our stora config here
import config from '../stora.config'

export const withStora = (PageComponent, { ssr = true } = {}) => {
  const WithStora = props => {
    const { states, actions, init } = config
    useStora({ states, actions, init })
    return <PageComponent {...props} />
  }

  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'
    WithStora.displayName = `withStora(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithStora.getInitialProps = async context => {
      const pageProps =
        typeof PageComponent.getInitialProps === 'function'
          ? await PageComponent.getInitialProps(context)
          : {}

      return {
        ...pageProps
      }
    }
  }

  return WithStora
}
```

- after that wrap your \_app.js or page component with withStora HOC

in \_app.js

```javascript
import React from 'react'
import NextApp from 'next/app'
// import our withStora hoc from service/hoc.js
import { withStora } from '../service/hoc'

class App extends NextApp {
  static async getInitialProps(appContext) {
    const appProps = await NextApp.getInitialProps(appContext)

    return { ...appProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}

// wrap our app with withStora HOC here
export default withStora(App)
```

in each page component

```javascript
import { withStora } from '../service/hoc'
import HomeScreen from './screens/Home'
export default withStora(HomeScreen)
```

## Usage

after initialized states and actions in stora.config.

- just import useStora in any component you want to use it

`import useStora from '@rawewhat/stora'`

- then run it in your function component

`const [states, actions] = useStora()`

## API

### 1. In Actions Config

#### 1.1 set(string, obj)

change only one component states using key and value arguments

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

_any previous states in testComponent will be added automatically_

#### 1.2 set(obj)

change multiple component states with new states object

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

_any previous component states will be added automatically_

#### 1.3 get(string)

get only one component states using string name

```javascript
const EXAMPLE_ACTIONS = {
  exampleComponent: {
    exampleAction: ({ get }) => {
      const testComponent = get('testComponent')
    }
  }
}
```

#### 1.4 get([string, string])

get multiple component states using arrays of string name

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

### 2. In React Component

#### 2.1 [{ component: { state }}]

access states of specific component or even multiple component states using destructuring syntax.

```javascript
const [
  {
    testComponent: { testState },
    demoComponent: { demoState }
  },
  actions
] = useStora()
```

#### 2.2 [{ component: { action }}]

access actions of specific component or even multiple component actions using destructuring syntax.

```javascript
const [
  states,
  {
    testComponent: { testAction },
    demoComponent: { demoAction }
  }
] = useStora()
```

#### 2.3 [, actions]

skip states object and directly access actions.

```javascript
const [, actions] = useStora()
```

#### 2.4 actions.component.action()

use dot to access states and actions

```javascript
const [states, actions] = useStora()

console.log('testState:', states.testComponent.testState)
actions.demoComponent.demoAction()
```

### 3. useStora({ mutate: { obj, func }})

sometimes you want to add more states, actions or both when using useStora hook on a component

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

### 4. useStora({ query: { string | [string, string] }})

if you want to return only some component states from useStora hook

- **query** for selecting specific component states

Example: select only one component states

```javascript
const [states] = useStora({
  query: 'testComponent'
})
// states for this component contains only testComponent states
const {
  testComponent: { testState }
} = states
```

Example: select multiple component states

```javascript
const [states] = useStora({
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
- `yarn dev` it will be ready on http://localhost:1234

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
