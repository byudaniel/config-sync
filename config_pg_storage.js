class ConfigPgStorage {
  constructor({ pgClient, configManager, logger = { error: console.error } }) {
    this.#pgClient = pgClient
    this.#configManager = configManager
    configManager.on(
      'key_set',
      async ({ key, value, scopeKey, scopeValue }) => {
        try {
          if (typeof value === 'undefined') {
            await pgClient.query(
              'DELETE FROM configuration_manager_values WHERE key = $ AND scope_key = $',
              [key, scopeKey]
            )
          } else {
            await pgClient.query(
              'INSERT INTO configuration_manager_values(key, value, scope_key, scope_value) VALUES ($1, $2, $3, $4) ON CONFLICT ON CONSTRAINT key_value_scope_key DO UPDATE SET value = $4',
              [key, value, scopeKey, scopeValue]
            )
          }
        } catch (err) {
          logger.error(
            { err, key, value, scopeKey, scopeValue },
            'Unable to save configuration value'
          )
        }
      }
    )
  }

  async load() {
    const res = await this.#pgClient.query(
      'SELECT * FROM configuration_manager_values'
    )
    res.rows.forEach((row) => {
      let scopeOpts = undefined

      if (row.scopeKey && row.scopeValue) {
        scopeOpts = {
          [row.scopeKey]: row.scopeValue,
        }
      }

      configManager.set(row.key, row.value, scopeOpts, { silent: true })
    })
  }
}

module.exports = ConfigPgStorage
