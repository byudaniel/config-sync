class ConfigSubscriber {
  #redisClient = null

  constructor({ configManager, redisConfig }) {
    this.#redisClient = require('redis').createClient(redisConfig)
    this.#redisClient.on('message', (channel, message) => {
      const { key, value, scopeKey, scopeValue } = JSON.parse(message)
      configManager.set(
        key,
        value,
        { [scopeKey]: scopeValue },
        { silent: true }
      )
    })
  }

  subscribe() {
    return this.#redisClient.subscribe('CONFIGURATION_KEY_SET')
  }

  dispose() {
    return this.#redisClient.quit()
  }
}

module.exports = ConfigSubscriber
