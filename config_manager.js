const EventEmitter = require('events')
const get = require('lodash.get')
const set = require('lodash.set')

const HIERARCHY_KEY = 'HIERARCHIES'
const GLOBAL_SCOPE_KEY = '__global'

class ConfigManager extends EventEmitter {
  #config = {
    [HIERARCHY_KEY]: {
      [GLOBAL_SCOPE_KEY]: {
        [GLOBAL_SCOPE_KEY]: [],
      },
    },
  }

  #storage = null

  constructor({ storage } = {}) {
    super()
    this.#storage = storage
  }

  getHierarchy() {
    return this.#config[HIERARCHY_KEY][GLOBAL_SCOPE_KEY][GLOBAL_SCOPE_KEY]
  }

  setHierarchy(value) {
    if (!Array.isArray(value)) {
      throw new Error('value must be an array')
    }

    return (this.#config[HIERARCHY_KEY][GLOBAL_SCOPE_KEY][
      GLOBAL_SCOPE_KEY
    ] = value)
  }

  get(key, scopes = {}) {
    const hierarchies = this.getHierarchy()

    let scopeKey = hierarchies.find((h) => {
      if (typeof scopes[h] === 'undefined') return false
      return get(this.#config, `${key}.${h}.${scopes[h]}`)
    })
    let scopeValue

    if (!scopeKey) {
      scopeKey = GLOBAL_SCOPE_KEY
      scopeValue = GLOBAL_SCOPE_KEY
    } else {
      scopeValue = scopes[scopeKey]
    }

    return get(this.#config, `${key}.${scopeKey}.${scopeValue}`)
  }

  // Retrieve key from storage
  async loadKey(key, scopes = {}) {
    if (this.#storage) {
      await this.#storage.loadFromStorage(key, this)
    }

    return this.get(key, scopes)
  }

  async set(key, value, scope, opts = { silent: false }) {
    let keyScope = scope
    if (!keyScope) {
      keyScope = {
        [GLOBAL_SCOPE_KEY]: GLOBAL_SCOPE_KEY,
      }
    }

    const [scopeKey, scopeValue] = Object.entries(keyScope)[0]
    set(this.#config, `${key}.${scopeKey}.${scopeValue}`, value)

    if (!opts.silent) {
      if (this.#storage) {
        await this.#storage.saveKey(key, value, scopeKey, scopeValue)
      }
      this.emit('key_set', { key, value, scopeKey, scopeValue })
    }
  }

  del(key, scope, opts = {}) {
    return this.set(key, undefined, scope, opts)
  }

  dispose() {
    // Intentionally empty, overriden by builder
  }
}

module.exports = ConfigManager
