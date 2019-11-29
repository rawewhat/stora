import React from 'react'
import useStora from '@rawewhat/stora'

const Demo4Screen = () => {
  const [states, actions] = useStora({
    query: ['obj', 'obj1', 'obj2']
  })
  console.log('states', states)
  return (
    <div>
      <button
        onClick={() =>
          actions.setObj({
            obj: {
              test: 'hi'
            },
            obj1: {
              test: 'hii'
            },
            obj2: {
              test: 'hiii'
            }
          })
        }
      >
        Test
      </button>
    </div>
  )
}

export default Demo4Screen
