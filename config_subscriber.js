class ConfigSubscriber {
  #redisClient = null

  constructor({ configManager, redisInstance }) {
    this.#redisClient = redisInstance.createClient()
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
}

module.exports = ConfigSubscriber
