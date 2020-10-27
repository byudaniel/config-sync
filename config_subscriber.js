class ConfigSubscriber {
  constructor({ configManager, redisInstance }) {
    this.#redisClient = redisInstance.createClient()
    this.#redisClient.on(
      'message',
      (channel, { key, value, scopeKey, scopeValue }) => {
        configManager.set(key, value, { [scopeKey]: scopeValue })
      }
    )
  }

  subscribe() {
    this.#redisClient.subscribe('CONFIGURATION_KEY_SET')
  }
}
