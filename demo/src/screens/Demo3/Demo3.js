import React from 'react'
import useStora from '@rawewhat/stora'
import JsonView from '../../components/JsonView'

const Demo3Screen = () => {
  const [states, actions] = useStora({
    mutate: {
      someComponent: {
        someState: 'someState',
        someAction: stora => {
          console.log('stora', stora)
        },
        anotherState: true,
        thatState: 777,
        thisState: {
          thoseState: 'thoseState'
        },
        anotherAction: () => {
          console.log('hello world!')
        },
        thatAction: ({ set }, open) => {
          set({
            someComponent: {
              someState: open
            }
          })
        }
      },
      bigComponent: {
        bigState: true,
        bigAction: () => console.log('hello world!')
      }
    },
    query: ['someComponent', 'bigComponent']
  })
  console.log('states', states, 'actions', actions)
  return (
    <div style={{ flexDirection: 'column' }}>
      <h1>States</h1>
      <JsonView obj={states} />
      <h1>Actions</h1>
      <JsonView obj={actions} />
    </div>
  )
}

export default Demo3Screen
