# @byudaniel/config-sync

## Quick start

```sh
npm install @byudaniel/config-sync
```

```javascript
const { buildConfigurationManager } = require('@byudaniel/config-sync')

const configManager = await buildConfigurationManager({ redis, pgClient })
await configManager.set('myKey', 'myValue', { sampleScope: 'scope1' })
const value = configManager.get('myKey', { sampleScope: 'scope1' })
```
