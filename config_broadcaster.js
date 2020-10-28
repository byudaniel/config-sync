class ConfigBroadcaster {
  constructor({ configManager, redisConfig }) {
    const redisClient = require('redis').createClient(redisConfig)

    configManager.on('key_set', (event) => {
      redisClient.publish('CONFIGURATION_KEY_SET', JSON.stringify(event))
    })
  }
}

module.exports = ConfigBroadcaster
