const { Client } = require('pg')

const { buildConfigurationManager } = require('../index')

let pgClient
let configManager

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
  configManager = await buildConfigurationManager({ pgClient })
})

afterEach(() => {
  configManager.dispose()
})

test('stores and retrieves objects', async () => {
  await configManager.set('test', { hello: 'world' })

  const loadedValue = await configManager.loadKey('test')
  expect(typeof loadedValue).toEqual('object')
  expect(loadedValue).toStrictEqual({ hello: 'world' })
})

test('stores and retrieves arrays', async () => {
  await configManager.set('test', [{ hello: 'world' }])

  const loadedValue = await configManager.loadKey('test')
  expect(Array.isArray(loadedValue)).toBe(true)
  expect(loadedValue).toStrictEqual([{ hello: 'world' }])
})
