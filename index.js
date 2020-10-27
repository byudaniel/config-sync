const ConfigManager = require('./config_manager')
const ConfigPgStorage = require('./config_pg_storage')

module.exports = {
  ConfigManager = require('./config_manager'),
  ConfigBroadcaster = require('./config_broadcaster'),
  ConfigSubscriber = require('./config_subscriber'),
  ConfigPgStorage = require('./config_pg_storage'),

  buildConfigurationManager: async ({ pgClient, redis, log }) => {
    const pgStorage = new ConfigPgStorage({ pgClient, log })
    const configManager = new ConfigManager({ storage: pgStorage })
    await pgStorage.load(configManager)
    new ConfigBroadcaster({ configManager, redisInstance: redis })
    await new ConfigSubscriber({ configManager, redisInstance: redis }).subscribe()

    return configManager
  }
}