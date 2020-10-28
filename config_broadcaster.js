class ConfigBroadcaster {
  #redisClient = null

  constructor({ configManager, redisConfig }) {
    const redisClient = require('redis').createClient(redisConfig)
    this.#redisClient = redisClient

    configManager.on('key_set', (event) => {
      redisClient.publish('CONFIGURATION_KEY_SET', JSON.stringify(event))
    })
  }

  dispose() {
    this.#redisClient.quit()
  }
}

module.exports = ConfigBroadcaster
