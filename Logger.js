const path = require('path');

/**
 * @type {Logger[]}
 */
const LOGGERS = [];

class Logger {
  #NAMESPACE = null;
  #DEBUG = false;

  /**
   * @param {string} namespace 
   */
  constructor(namespace = '') {
    this.#NAMESPACE = namespace?.trim();
    LOGGERS.push(this);
  }

  /**
   * @returns {string|null}
   */
  getNameSpace() {
    return this.#NAMESPACE;
  }

  /**
   * @param {'info'|'debug'} level 
   */
  setLevel(level = '') {
    if (level && level.toString().trim().toLowerCase() === 'debug') {
      this.#DEBUG = true;
    } else {
      this.#DEBUG = false;
    }
  }

  /**
   * @param  {...any} data data to be logged
   * @returns {void}
   */
  log(...data) {
    if (!data?.length) return;
    const fileName = getOriginalFileName();
    console.log(`[${this.getNameSpace() ? this.getNameSpace() + ' - ' : ''}${fileName}] (\x1b[0;35mInfo\x1b[0m)`, ...data);
  }

  /**
 * @param  {...any} data data to be logged
 * @returns {void}
 */
  info(...data) {
    if (!data?.length) return;
    const fileName = getOriginalFileName();
    console.info(`[${this.getNameSpace() ? this.getNameSpace() + ' - ' : ''}${fileName}] (\x1b[0;35mInfo\x1b[0m)`, ...data);
  }

  /**
   * @param  {...any} data data to be logged
   * @returns {void}
   */
  warn(...data) {
    if (!data?.length) return;
    const fileName = getOriginalFileName();
    console.warn(`[${this.getNameSpace() ? this.getNameSpace() + ' - ' : ''}${fileName}] (\x1b[0;33mWarn\x1b[0m)`, ...data);
  }

  /**
   * @param  {...any} data data to be logged
   * @returns {void}
   */
  error(...data) {
    if (!data?.length) return;
    const fileName = getOriginalFileName();
    if (data[0] instanceof Error) {
      console.error(`[${this.getNameSpace() ? this.getNameSpace() + ' - ' : ''}${fileName}] (\x1b[0;91mError\x1b[0m)`, data[0].message, '-', getOriginalFileName(data[0]));
    } else {
      console.error(`[${this.getNameSpace() ? this.getNameSpace() + ' - ' : ''}${fileName}] (\x1b[0;91mError\x1b[0m)`, ...data);
    }
  }

  /**
   * @param  {...any} data data to be logged
   * @returns {void}
   */
  debug(...data) {
    if (!this.#DEBUG || !data?.length) return;
    const fileName = getOriginalFileName();
    console.debug(`[${this.getNameSpace() ? this.getNameSpace() + ' - ' : ''}${fileName}] (\x1b[0;94mDebug\x1b[0m)`, ...data);
  }

  /**
   * @param  {...any} data data to be logged
   * @returns {void}
   */
  debugOr(...data) {
    if (!data?.length) return;
    const fileName = getOriginalFileName();
    if (!this.#DEBUG) {
      console.info(`[${this.getNameSpace() ? this.getNameSpace() + ' - ' : ''}${fileName}] (\x1b[0;35mInfo\x1b[0m)`, data.pop());
    } else {
      console.debug(`[${this.getNameSpace() ? this.getNameSpace() + ' - ' : ''}${fileName}] (\x1b[0;94mDebug\x1b[0m)`, ...data.slice(0, -1));
    }
  }
}

function getOriginalFileName(providedError = null) {
  try {
    throw (providedError || new Error('test'));
  } catch (e) {
    const stackarr = e.stack.split('\n').filter(l => !l.includes('node_modules' + path.sep)).filter(l => !l.includes('node:'));
    const popped = stackarr.pop().trim();
    const match = popped.match(/at (.*) \((.*):(\d+):(\d+)\)$/) || popped.match(/(.*):(\d+):(\d+)$/);
    if (!match) return undefined;
    if (match.length === 5) {
      if (match[1].includes('<anonymous>')) return `${match[2].split(path.sep).pop().trim()}:${match[3]}:${match[4]}`;
      return `${match[2].split(path.sep).pop().trim()}:${match[3]}:${match[4]} - ${match[1]}()`;
    } else if (match.length === 4) {
      return `${match[1].split(path.sep).pop().trim()}:${match[2]}:${match[3]}`;
    } else return undefined;
  }

}

module.exports = {
  /**
   * @param {string|null} namespace 
   * @returns {Logger}
   */
  create: (namespace) => new Logger(namespace),
  /**
   * @param {string|null} namespace 
   * @returns {Logger}
   */
  get: (namespace) => LOGGERS.filter(n => n.getNameSpace()?.trim().toLowerCase() === namespace?.trim().toLowerCase())?.[0],
  log: (...data) => LOGGERS[LOGGERS.length - 1]?.log(...data),
  info: (...data) => LOGGERS[LOGGERS.length - 1]?.info(...data),
  warn: (...data) => LOGGERS[LOGGERS.length - 1]?.warn(...data),
  error: (...data) => LOGGERS[LOGGERS.length - 1]?.error(...data),
  debug: (...data) => LOGGERS[LOGGERS.length - 1]?.debug(...data),
  debugOr: (...data) => LOGGERS[LOGGERS.length - 1]?.debugOr(...data),
};
