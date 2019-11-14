import React, { useEffect } from 'react'
import useStora from '@rawewhat/stora'

const Demo2Screen = () => {
  const [states, actions] = useStora()
  console.log('App states', states, 'actions', actions)
  return (
    <div>
      StoRa Demo {`${states.test}`}
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
  console.log('Test states', states)
  console.log('Test actions', actions)
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
    query: ['test', 'test100']
  })
  console.log('Test2 states', states)
  console.log('Test2 actions', actions)
  useEffect(() => {
    console.log('store', actions.internal.query())
    actions.set('test', 'hello')
  }, [])
  return (
    <div>
      Test2<button onClick={() => actions.set('test', 'hello')}>Fire</button>
    </div>
  )
}

export default Demo2Screen
