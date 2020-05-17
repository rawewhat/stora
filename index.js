'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports['default'] = void 0

var _react = require('react')

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
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
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(Object(source)).forEach(function (key) {
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
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  )
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  )
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen)
  var n = Object.prototype.toString.call(o).slice(8, -1)
  if (n === 'Object' && o.constructor) n = o.constructor.name
  if (n === 'Map' || n === 'Set') return Array.from(o)
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen)
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i]
  }
  return arr2
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr))) return
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

function _typeof(obj) {
  '@babel/helpers - typeof'
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

function getConfig(config) {
  if (config) return config

  try {
    return require('../../../stora.config')['default']
  } catch (e) {
    try {
      return require('../../../src/stora.config')['default']
    } catch (e) {
      return {
        states: {},
        actions: {},
        init: function init() {},
      }
    }
  }
}

function initStore() {
  var _this = this

  if (arguments[0] === 'store') return this
  var newSetter = (0, _react.useState)()[1]
  ;(0, _react.useEffect)(function () {
    _this.setters.push(newSetter)

    return function () {
      _this.setters = _this.setters.filter(function (setter) {
        return setter !== newSetter
      })
    }
  }, [])
  return [this.states, this.actions]
}

function initActions(store, actions) {
  var registeredActions = {}
  Object.keys(actions).forEach(function (key) {
    if (typeof actions[key] === 'function') {
      registeredActions[key] = actions[key].bind(null, store)
    }

    if (_typeof(actions[key]) === 'object') {
      registeredActions[key] = initActions(store, actions[key])
    }
  })
  return registeredActions
}

function visit() {
  this.set('routra', {
    route: arguments[0],
  })
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

  return [this.states, this.actions]
}

function mutate() {
  var _this2 = this

  Object.entries(arguments[0]).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1]

    if (_typeof(value) === 'object') {
      Object.entries(value).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          key1 = _ref4[0],
          value1 = _ref4[1]

        if (typeof value1 === 'function') {
          if (_this2.actions[key] && _this2.actions[key][key1]) return
          _this2.actions[key] = _objectSpread(
            _objectSpread({}, _this2.actions[key]),
            {},
            _defineProperty({}, key1, value1.bind(null, _this2))
          )
        } else {
          if (_this2.states[key] && _this2.states[key][key1]) return
          _this2.states[key] = _objectSpread(
            _objectSpread({}, _this2.states[key]),
            {},
            _defineProperty({}, key1, value1)
          )
        }
      })
    } else if (typeof value === 'function') {
      if (_this2.actions[key]) return
      _this2.actions[key] = value.bind(null, _this2)
    } else console.log('Unsupported mutate operation!')
  })
}

function set() {
  var _this3 = this

  if (_typeof(arguments[0]) === 'object' && !Array.isArray(arguments[0])) {
    Object.entries(arguments[0]).forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        value = _ref6[1]

      _this3.states[key] = _objectSpread(
        _objectSpread({}, _this3.states[key]),
        value
      )
    })
    this.states = _objectSpread({}, this.states)
    this.setters.forEach(function (set) {
      set(_this3.states)
    })
  } else if (
    typeof arguments[0] === 'string' &&
    _typeof(arguments[1]) === 'object'
  ) {
    this.states = _objectSpread(
      _objectSpread({}, this.states),
      {},
      _defineProperty(
        {},
        arguments[0],
        _objectSpread(
          _objectSpread({}, this.states[arguments[0]]),
          arguments[1]
        )
      )
    )
    this.setters.forEach(function (set) {
      set(_this3.states)
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
    states: _objectSpread(
      _objectSpread({}, initialStates),
      {},
      {
        routra: {
          route: null,
        },
      }
    ),
    setters: [],
  }
  store.get = get.bind(store)
  store.set = set.bind(store)
  if (initialActions) store.actions = initActions(store, initialActions)
  store.actions = _objectSpread(
    _objectSpread({}, store.actions),
    {},
    {
      internal: {
        mutate: mutate.bind(store),
        query: query.bind(store),
      },
      routra: {
        visit: visit.bind(store),
      },
    }
  )
  if (initializer) initializer(store)
  return initStore.bind(store)
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
    if (config && config.store) return stora('store')

    var _stora = stora(),
      _stora2 = _slicedToArray(_stora, 2),
      _states = _stora2[0],
      _actions = _stora2[1]

    if (config && config.mutate) _actions.internal.mutate(config.mutate)
    if (config && config.query) return _actions.internal.query(config.query)
    return [_states, _actions]
  }
}

exports['default'] = _default
