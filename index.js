'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports['default'] = void 0

var _react = require('react')

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  )
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance')
}

function _iterableToArrayLimit(arr, i) {
  if (
    !(
      Symbol.iterator in Object(arr) ||
      Object.prototype.toString.call(arr) === '[object Arguments]'
    )
  ) {
    return
  }
  var _arr = []
  var _n = true
  var _d = false
  var _e = undefined
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value)
      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }
  return _arr
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    keys.push.apply(keys, symbols)
  }
  return keys
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        )
      })
    }
  }
  return target
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    })
  } else {
    obj[key] = value
  }
  return obj
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj
    }
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }
  return _typeof(obj)
}

var stora = null

function initStore() {
  var _this = this

  var newSetter = (0, _react.useState)()[1]
  ;(0, _react.useEffect)(function() {
    _this.setters.push(newSetter)

    return function() {
      _this.setters = _this.setters.filter(function(setter) {
        return setter !== newSetter
      })
    }
  }, [])
  return [this.states, this.actions]
}

function initActions(store, actions) {
  var registeredActions = {}
  Object.keys(actions).forEach(function(key) {
    if (typeof actions[key] === 'function') {
      registeredActions[key] = actions[key].bind(null, store)
    }

    if (_typeof(actions[key]) === 'object') {
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
    var result = {}

    for (var i in arguments[0]) {
      if (Object.prototype.hasOwnProperty.call(arguments[0], i)) {
        result[arguments[0][i]] = this.states[arguments[0][i]]
      }
    }

    return [result, this.actions]
  }
}

function mutate() {
  var value = Object.values(arguments[0])[0]

  if (_typeof(value) === 'object') {
    this.states = _objectSpread({}, this.states, {}, arguments[0])
  } else if (typeof value === 'function') {
    this.actions = _objectSpread({}, this.actions, {}, arguments[0])
  } else console.log('Unsupported mutate operation!')
}

function set() {
  var _this2 = this

  if (_typeof(arguments[0]) === 'object' && !Array.isArray(arguments[0])) {
    this.states = _objectSpread({}, this.states, {}, arguments[0])
    this.setters.forEach(function(set) {
      set(_this2.states)
    })
  } else if (
    _typeof(arguments[0]) === 'object' &&
    Array.isArray(arguments[0])
  ) {
    for (var i in arguments[0]) {
      if (Object.prototype.hasOwnProperty.call(arguments[0], i)) {
        var key = Object.keys(arguments[0][i])[0]
        var value = Object.values(arguments[0][i])[0]
        if (_typeof(value) === 'object') this.states[key] = value
      }
    }

    this.setters.forEach(function(set) {
      set(_this2.states)
    })
  } else if (
    typeof arguments[0] === 'string' &&
    _typeof(arguments[1]) === 'object'
  ) {
    this.states = _objectSpread(
      {},
      this.states,
      _defineProperty(
        {},
        arguments[0],
        _objectSpread({}, this.states[arguments[0]], {}, arguments[1])
      )
    )
    this.setters.forEach(function(set) {
      set(_this2.states)
    })
  } else console.info('Unsupported set operation!')
}

function get() {
  if (typeof arguments[0] === 'string') {
    return this.states[arguments[0]]
  }

  if (Array.isArray(arguments[0])) {
    var result = {}

    for (var i in arguments[0]) {
      if (Object.prototype.hasOwnProperty.call(arguments[0], i)) {
        result[arguments[0][i]] = this.states[arguments[0][i]]
      }
    }

    return result
  }
}

var useStora = function useStora(initialStates, initialActions, initializer) {
  var store = {
    states: initialStates,
    setters: []
  }
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
    return require('../../../stora.config')['default']
  } catch (e) {
    console.log('error', e)
  }

  try {
    return require('../../../src/stora.config')['default']
  } catch (e) {
    console.log('error', e)
    return {
      states: {},
      actions: {},
      init: function init() {}
    }
  }
}

var _default = function _default(config) {
  if (stora === null) {
    var _getConfig = getConfig(config),
      states = _getConfig.states,
      actions = _getConfig.actions,
      init = _getConfig.init

    stora = useStora(states, actions, init)
    return stora()
  } else {
    var _stora = stora(),
      _stora2 = _slicedToArray(_stora, 2),
      _states = _stora2[0],
      _actions = _stora2[1]

    if (config && config.mutate) _actions.mutate(config.mutate)
    if (config && config.query) return _actions.query(config.query)
    return [_states, _actions]
  }
}

exports['default'] = _default
