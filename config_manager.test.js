const ConfigManager = require('./config_manager')

test('sets global properties', () => {
  const config = new ConfigManager()
  config.set('hello', 'world')
  expect(config.get('hello')).toBe('world')
})

test('sets scoped properties with 1 scope', () => {
  const config = new ConfigManager()
  config.setHierarchy(['locationId', 'dealerId', 'marketId', 'marketplaceId'])

  config.set('my-setting', 'SETTING_VALUE', { locationId: 'my-location' })

  // Global setting should not exist
  expect(config.get('my-setting')).toBeFalsy()
  // Scoped setting for different scope value should not exist
  expect(
    config.get('my-setting', { locationId: 'another-location' })
  ).toBeFalsy()
  // Scoped setting for correct scope should exist
  expect(config.get('my-setting', { locationId: 'my-location' })).toBe(
    'SETTING_VALUE'
  )
})

test('sets scoped properties with correct scope hierarcy', () => {
  const config = new ConfigManager()
  config.setHierarchy(['locationId', 'dealerId', 'marketId', 'marketplaceId'])

  config.set('my-setting', 'SETTING_VALUE_MARKETPLACE', {
    marketplaceId: 'marketplace-id',
  })
  config.set('my-setting', 'SETTING_VALUE_MARKET', { marketId: 'market-id' })
  config.set('my-setting', 'SETTING_VALUE_LOCATION', {
    locationId: 'location-id',
  })
  config.set('my-setting', 'SETTING_VALUE_GLOBAL')

  expect(
    config.get('my-setting', {
      locationId: 'location-id',
      marketId: 'market-id',
      marketplaceId: 'marketplace-id',
    })
  ).toBe('SETTING_VALUE_LOCATION')
  expect(
    config.get('my-setting', {
      locationId: 'location-id2',
      marketId: 'market-id',
      marketplaceId: 'marketplace-id',
    })
  ).toBe('SETTING_VALUE_MARKET')
  expect(
    config.get('my-setting', {
      locationId: 'location-id2',
      marketId: 'market-id2',
      marketplaceId: 'marketplace-id',
    })
  ).toBe('SETTING_VALUE_MARKETPLACE')
  expect(
    config.get('my-setting', {
      locationId: 'location-id2',
      marketId: 'market-id2',
      marketplaceId: 'marketplace-id2',
    })
  ).toBe('SETTING_VALUE_GLOBAL')
})

test('set emits', () => {
  expect.assertions(4)

  return new Promise((resolve) => {
    const config = new ConfigManager()
    config.on('key_set', (event) => {
      expect(event.key).toBe('testKey')
      expect(event.value).toBe('testValue')
      expect(event.scopeKey).toBe('locationId')
      expect(event.scopeValue).toBe('123')
      resolve()
    })
    config.set('testKey', 'testValue', { locationId: '123' })
  })
})
