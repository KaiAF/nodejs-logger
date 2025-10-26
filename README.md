# NodeJS Logger

Just a simple logger.

```bash
[{namespace} - {filename}:{line number}:{line number}] (Info) This is a simple logger!
```

Usage:

```js
const Logger = require('@kaiaf/logger').create('namespace');
Logger.setLevel(USE_DEBUG === 'true' ? 'debug' : 'info');
Logger.debug('This is debug');
Logger.debugOr('This message will display if debug is enabled', 'This message will display if it\'s not');
Logger.info('Hi there');
Logger.warn('This is warn');
Logger.error('This is error');
```
