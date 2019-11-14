import React from 'react'

const JsonView = ({ obj }) => {
  return (
    obj && (
      <pre id="json">
        {typeof obj === 'boolean'
          ? obj.toString()
          : JSON.stringify(obj, undefined, 2)}
      </pre>
    )
  )
}

export default JsonView
