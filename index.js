const ConfigManager = require('./config_manager')
const ConfigPgStorage = require('./config_pg_storage')

module.exports = {
  ConfigManager = require('./config_manager'),
  ConfigBroadcaster = require('./config_broadcaster'),
  ConfigSubscriber = require('./config_subscriber'),
  ConfigPgStorage = require('./config_pg_storage'),

  buildConfigurationManager: async ({ pgClient, redis }) => {
    const configManager = new ConfigManager()
    new ConfigPgStorage({ pgClient, configManager }).load()
    new ConfigBroadcaster({ configManager, redisInstance: redis })
    new ConfigSubscriber({ configManager, redisInstance: redis }).subscribe()

    return configManager
  }
}