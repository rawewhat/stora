import React from 'react'
import useStora from '@rawewhat/stora'
import JsonView from '../../components/JsonView'

function Demo1Screen() {
  const [states, actions] = useStora()
  const { test } = states
  actions.log('Demo', states)
  return test ? (
    <>
      <Child1 />
      <h3>State</h3>
      <JsonView obj={states} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TestArea stora={{ states, actions }} />
      </div>
    </>
  ) : (
    <>
      <Child2 />
      <Child3 />
      <h3>State</h3>
      <JsonView obj={states} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TestArea stora={{ states, actions }} />
      </div>
    </>
  )
}

function Child1() {
  const [states] = useStora()
  console.log('Child 1', states)
  return (
    <div>
      <h1>Child 1</h1>
    </div>
  )
}

function Child2() {
  const [states] = useStora()
  console.log('Child 2', states)
  return (
    <div>
      <h1>Child 2</h1>
    </div>
  )
}

function Child3() {
  const [states] = useStora()
  console.log('Child 3', states)
  return (
    <div>
      <h1>Child 3</h1>
    </div>
  )
}

function TestArea({ stora: { states, actions } }) {
  const { test } = states
  console.log('TestArea', test)
  return (
    <>
      <pre>actions.set('test', !test);</pre>
      <button onClick={() => actions.set('test', !test)}>
        Test actions.set
      </button>
      <pre>actions.get("test");</pre>
      <button
        onClick={() => {
          const result = actions.get('test')
          actions.set('result', result)
        }}
      >
        Test actions.get only one state
      </button>
      <pre>actions.get(["test", "nested"]);</pre>
      <button
        onClick={() => {
          const result = actions.get(['test', 'nested'])
          actions.set('result', result)
        }}
      >
        Test actions.get array of one or many states
      </button>
      <pre>actions.set("test", !test)</pre>
      <button onClick={() => actions.set('test', !test)}>
        Test actions.set only one state
      </button>
    </>
  )
}

export default Demo1Screen
