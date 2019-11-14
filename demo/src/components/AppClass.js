import React, { Component } from 'react'
import App from './App'

class AppClass extends Component {
  render() {
    console.log('hi', this.props)
    return (
      <div>
        <App />
      </div>
    )
  }
}

export default AppClass
