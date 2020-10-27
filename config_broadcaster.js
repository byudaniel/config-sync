class ConfigBroadcaster {
  constructor({ configManager, redisInstance }) {
    const redisClient = redisInstance.createClient()

    configManager.on('key_set', (event) => {
      redisClient.publish('CONFIGURATION_KEY_SET', JSON.stringify(event))
    })
  }
}

module.exports = ConfigBroadcaster
