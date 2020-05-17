/**
 * StoRa is a global state management library in pure React hooks
 *
 * Author: Cheng Sokdara
 * License: MIT
 */
import { useEffect, useState } from 'react'

let stora = null

function getConfig(config) {
  if (config) return config
  try {
    return require('../../../stora.config').default
  } catch (e) {
    try {
      return require('../../../src/stora.config').default
    } catch (e) {
      return {
        states: {},
        actions: {},
        init: () => {},
      }
    }
  }
}

function initStore() {
  if (arguments[0] === 'store') return this
  const newSetter = useState()[1]
  useEffect(() => {
    this.setters.push(newSetter)
    return () => {
      this.setters = this.setters.filter((setter) => setter !== newSetter)
    }
  }, [])
  return [this.states, this.actions]
}

function initActions(store, actions) {
  const registeredActions = {}
  Object.keys(actions).forEach((key) => {
    if (typeof actions[key] === 'function') {
      registeredActions[key] = actions[key].bind(null, store)
    }
    if (typeof actions[key] === 'object') {
      registeredActions[key] = initActions(store, actions[key])
    }
  })
  return registeredActions
}

function visit() {
  this.set('routra', { route: arguments[0] })
}

function query() {
  if (typeof arguments[0] === 'string') {
    return [this.states[arguments[0]], this.actions]
  }
  if (Array.isArray(arguments[0])) {
    let result = {}
    for (let i in arguments[0]) {
      if (Object.prototype.hasOwnProperty.call(arguments[0], i)) {
        result[arguments[0][i]] = this.states[arguments[0][i]]
      }
    }
    return [result, this.actions]
  }
  return [this.states, this.actions]
}

function mutate() {
  Object.entries(arguments[0]).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([key1, value1]) => {
        if (typeof value1 === 'function') {
          if (this.actions[key] && this.actions[key][key1]) return
          this.actions[key] = {
            ...this.actions[key],
            [key1]: value1.bind(null, this),
          }
        } else {
          if (this.states[key] && this.states[key][key1]) return
          this.states[key] = {
            ...this.states[key],
            [key1]: value1,
          }
        }
      })
    } else if (typeof value === 'function') {
      if (this.actions[key]) return
      this.actions[key] = value.bind(null, this)
    } else console.log('Unsupported mutate operation!')
  })
}

function set() {
  if (typeof arguments[0] === 'object' && !Array.isArray(arguments[0])) {
    Object.entries(arguments[0]).forEach(([key, value]) => {
      this.states[key] = { ...this.states[key], ...value }
    })
    this.states = {
      ...this.states,
    }
    this.setters.forEach((set) => {
      set(this.states)
    })
  } else if (
    typeof arguments[0] === 'string' &&
    typeof arguments[1] === 'object'
  ) {
    this.states = {
      ...this.states,
      [arguments[0]]: {
        ...this.states[arguments[0]],
        ...arguments[1],
      },
    }
    this.setters.forEach((set) => {
      set(this.states)
    })
  } else console.info('Unsupported set operation!')
}

function get() {
  if (typeof arguments[0] === 'string') {
    return this.states[arguments[0]]
  }
  if (Array.isArray(arguments[0])) {
    let result = {}
    for (let i in arguments[0]) {
      if (Object.prototype.hasOwnProperty.call(arguments[0], i)) {
        result[arguments[0][i]] = this.states[arguments[0][i]]
      }
    }
    return result
  }
}

const useStora = (initialStates, initialActions, initializer) => {
  const store = {
    states: { ...initialStates, routra: { route: null } },
    setters: [],
  }
  store.get = get.bind(store)
  store.set = set.bind(store)
  if (initialActions) store.actions = initActions(store, initialActions)
  store.actions = {
    ...store.actions,
    internal: {
      mutate: mutate.bind(store),
      query: query.bind(store),
    },
    routra: {
      visit: visit.bind(store),
    },
  }
  if (initializer) initializer(store)
  return initStore.bind(store)
}

export default (config) => {
  if (stora === null) {
    const { states, actions, init } = getConfig(config)
    stora = useStora(states, actions, init)
    return stora()
  } else {
    if (config && config.store) return stora('store')
    let [states, actions] = stora()
    if (config && config.mutate) actions.internal.mutate(config.mutate)
    if (config && config.query) return actions.internal.query(config.query)
    return [states, actions]
  }
}
