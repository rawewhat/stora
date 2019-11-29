import React from 'react'
import Router, { Link } from '@rawewhat/routra'

const App = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%'
      }}
    >
      <NavContainer>
        <Link title="Home" path="/" />
        <Link title="Demo 1" path="/demo-1" />
        <Link title="Demo 2" path="/demo-2" />
        <Link title="Demo 3" path="/demo-3" />
        <Link title="Demo 4" path="/demo-4" />
      </NavContainer>
      <Router />
    </div>
  )
}

const NavContainer = ({ children }) => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
      {children}
    </nav>
  )
}

export default App
