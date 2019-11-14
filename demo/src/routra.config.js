import React, { lazy } from 'react'
const Demo1 = lazy(() => import('./screens/Demo1'))
const Demo2 = lazy(() => import('./screens/Demo2'))
const Demo3 = lazy(() => import('./screens/Demo3'))

export default [
  {
    path: '/',
    screen: <span>Stora Demo</span>
  },
  {
    path: '/demo-1',
    screen: Demo1
  },
  {
    path: '/demo-2',
    screen: Demo2
  },
  {
    path: '/demo-3',
    screen: Demo3
  }
]
