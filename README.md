# <div align="center">Vklight<div>

## Installation
Install with npm:
```
npm i vklight
```
Install with yarn:
```
yarn add vklight
```

## Example

```js
const VK = require('vklight');
const vk = new VK({ token: 'access_token' });

const [user] = await vk.api('users.get', { user_ids: '1' };
```
