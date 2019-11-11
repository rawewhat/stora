/**
 * StoRa is a global state management library in pure React hooks
 *
 * Author: Cheng Sokdara
 * License: MIT
 */
import { useEffect, useState } from 'react'

let stora = null

function initStore() {
  const newSetter = useState()[1]
  useEffect(() => {
    this.setters.push(newSetter)
    return () => {
      this.setters = this.setters.filter(setter => setter !== newSetter)
    }
  }, [])
  return [this.states, this.actions]
}

function initActions(store, actions) {
  const registeredActions = {}
  Object.keys(actions).forEach(key => {
    if (typeof actions[key] === 'function') {
      registeredActions[key] = actions[key].bind(null, store)
    }
    if (typeof actions[key] === 'object') {
      registeredActions[key] = initActions(store, actions[key])
    }
  })
  return registeredActions
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
}

function mutate() {
  const value = Object.values(arguments[0])[0]
  if (typeof value === 'object') {
    this.states = {
      ...this.states,
      ...arguments[0]
    }
  } else if (typeof value === 'function') {
    this.actions = {
      ...this.actions,
      ...arguments[0]
    }
  } else console.log('Unsupported mutate operation!')
}

function set() {
  if (typeof arguments[0] === 'object' && !Array.isArray(arguments[0])) {
    this.states = { ...this.states, ...arguments[0] }
    this.setters.forEach(set => {
      set(this.states)
    })
  } else if (typeof arguments[0] === 'object' && Array.isArray(arguments[0])) {
    for (let i in arguments[0]) {
      if (Object.prototype.hasOwnProperty.call(arguments[0], i)) {
        const key = Object.keys(arguments[0][i])[0]
        const value = Object.values(arguments[0][i])[0]
        if (typeof value === 'object') this.states[key] = value
      }
    }
    this.setters.forEach(set => {
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
        ...arguments[1]
      }
    }
    this.setters.forEach(set => {
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
  const store = { states: initialStates, setters: [] }
  store.get = get.bind(store)
  store.set = set.bind(store)
  if (initialActions) store.actions = initActions(store, initialActions)
  store.actions.mutate = mutate.bind(store)
  store.actions.query = query.bind(store)
  if (initializer) initializer(store)
  return initStore.bind(store)
}

function getConfig(config) {
  if (config) return config
  try {
    return require('../../../stora.config').default
  } catch (e) {
    console.log('error', e)
  }
  try {
    return require('../../../src/stora.config').default
  } catch (e) {
    console.log('error', e)
    return {
      states: {},
      actions: {},
      init: () => {}
    }
  }
}

export default config => {
  if (stora === null) {
    const { states, actions, init } = getConfig(config)
    stora = useStora(states, actions, init)
    return stora()
  } else {
    let [states, actions] = stora()
    if (config && config.mutate) actions.mutate(config.mutate)
    if (config && config.query) return actions.query(config.query)
    return [states, actions]
  }
}
