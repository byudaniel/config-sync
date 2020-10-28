const { Client } = require('pg')
const waitForExpect = require('wait-for-expect')

const { buildConfigurationManager } = require('../index')

let pgClient
let configManager1
let configManager2

beforeAll(async () => {
  pgClient = new Client({
    user: 'user',
    password: 'password',
    host: 'localhost',
    port: '5432',
    database: 'test_config_db',
  })
  await pgClient.connect()

  // await pgClient.query('DROP DATABASE test_config_db')
  // await pgClient.query("CREATE DATABASE test_config_db OWNER 'user'")
  await pgClient.query('TRUNCATE TABLE configuration_manager_values')
})

afterAll(async () => {
  await pgClient.end()
})

beforeEach(async () => {
  configManager1 = await buildConfigurationManager({ pgClient })
  configManager2 = await buildConfigurationManager({ pgClient })
})

afterEach(() => {
  configManager1.dispose()
  configManager2.dispose()
})

test('other config manager receives updated values', async () => {
  expect.assertions(2)
  await configManager1.set('testKey', 'testValue')
  expect(configManager1.get('testKey')).toBe('testValue')
  await waitForExpect(() => {
    expect(configManager2.get('testKey')).toBe('testValue')
  })
})
