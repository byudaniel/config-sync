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

  buildConfigurationManager: async ({ pgClient, redisConfig, log }) => {
    assert(pgClient)

    const pgStorage = new ConfigPgStorage({ pgClient, log })
    const configManager = new ConfigManager({ storage: pgStorage })
    await pgStorage.load(configManager)
    const broadcaster = new ConfigBroadcaster({ configManager, redisConfig })
    const configSubscriber = new ConfigSubscriber({
      configManager,
      redisConfig,
    })
    await configSubscriber.subscribe()

    // Close redis connections
    configManager.dispose = () => {
      broadcaster.dispose()
      configSubscriber.dispose()
    }

    return configManager
  },
}
