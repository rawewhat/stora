import React from 'react'
import { render } from 'react-dom'
import useStora from '@rawewhat/stora'
import App from './components/App'
import AppClass from './components/AppClass'
import Demo from './screens/Demo1/Demo1'

render(<App />, document.getElementById('__ra'))

// noinspection JSUnresolvedVariable
if (module.hot) {
  module.hot.accept()
}
