class ConfigPgStorage {
  #pgClient = null
  #log = null

  constructor({ pgClient, log = { error: console.error } }) {
    this.#pgClient = pgClient
    this.#log = log
  }

  #setFromRow = (row, configManager) => {
    let scopeOpts = undefined

    if (row.scopeKey && row.scopeValue) {
      scopeOpts = {
        [row.scopeKey]: row.scopeValue,
      }
    }

    configManager.set(row.key, row.value, scopeOpts, {
      silent: true,
      skipStorage: true,
    })
  }

  async load(configManager) {
    const res = await this.#pgClient.query(
      'SELECT * FROM configuration_manager_values'
    )
    res.rows.forEach((row) => {
      this.#setFromRow(row, configManager)
    })
  }

  async loadFromStorage(key, configManager) {
    const rows = await pgClient.query(
      'SELECT * FROM configuration_manager_values WHERE key = $1',
      [key]
    )

    rows.forEach((row) => this.#setFromRow(row, configManager))
  }

  async saveKey(key, value, scopeKey, scopeValue) {
    try {
      if (typeof value === 'undefined') {
        await pgClient.query(
          'DELETE FROM configuration_manager_values WHERE key = $ AND scope_key = $',
          [key, scopeKey]
        )
      } else {
        await pgClient.query(
          'INSERT INTO configuration_manager_values(key, value, scope_key, scope_value) VALUES ($1, $2, $3, $4) ON CONFLICT ON CONSTRAINT key_scope_key DO UPDATE SET value = $4',
          [key, value, scopeKey, scopeValue]
        )
      }
    } catch (err) {
      this.#log.error(
        { err, key, value, scopeKey, scopeValue },
        'Unable to save configuration value'
      )
      throw new Error('Unable to save configuration value')
    }
  }
}

module.exports = ConfigPgStorage
