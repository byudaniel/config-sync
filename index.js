const assert = require('assert')
const ConfigManager = require('./config_manager')
const ConfigBroadcaster = require('./config_broadcaster')
const ConfigPgStorage = require('./config_pg_storage')
const ConfigSubscriber = require('./config_subscriber')

module.exports = {
  ConfigManager,
  ConfigBroadcaster,
  ConfigSubscriber,
  ConfigPgStorage,

  buildConfigurationManager: async ({ pgClient, redis, log }) => {
    assert(pgClient)
    assert(redis)

    const pgStorage = new ConfigPgStorage({ pgClient, log })
    const configManager = new ConfigManager({ storage: pgStorage })
    await pgStorage.load(configManager)
    new ConfigBroadcaster({ configManager, redisInstance: redis })
    await new ConfigSubscriber({
      configManager,
      redisInstance: redis,
    }).subscribe()

    return configManager
  },
}
