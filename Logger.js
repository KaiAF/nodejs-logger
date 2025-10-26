const path = require('path');

let NAMESPACE = require.main.filename.split(path.sep).pop().toLowerCase().split('.')[0];
let DEBUG = false;

const Logger = {
  /**
   * @param {string} name 
   * @returns {void}
   */
  namespace: (name) => NAMESPACE = name,
  /**
   * @param {'info'|'debug'} level 
   * @returns {void}
   */
  setLevel: (level) => {
    if (level?.toLowerCase() == 'debug') {
      DEBUG = true;
    } else {
      DEBUG = false;
    }
  },
  log,
  info,
  warn,
  error,
  debug,
  debugOr,
};

/**
 * @param  {...any} data data to be logged
 * @returns {void}
 */
function log(...data) {
  if (!data?.length) return;
  const fileName = getOriginalFileName();
  console.log(`[${NAMESPACE} - ${fileName}] (\x1b[0;35mInfo\x1b[0m)`, ...data);
}

/**
 * @param  {...any} data data to be logged
 * @returns {void}
 */
function info(...data) {
  if (!data?.length) return;
  const fileName = getOriginalFileName();
  console.info(`[${NAMESPACE} - ${fileName}] (\x1b[0;35mInfo\x1b[0m)`, ...data);
}

/**
 * @param  {...any} data data to be logged
 * @returns {void}
 */
function warn(...data) {
  if (!data?.length) return;
  const fileName = getOriginalFileName();
  console.warn(`[${NAMESPACE} - ${fileName}] (\x1b[0;33mWarn\x1b[0m)`, ...data);
}

/**
 * @param  {...any} data data to be logged
 * @returns {void}
 */
function error(...data) {
  if (!data?.length) return;
  const fileName = getOriginalFileName();
  if (data[0] instanceof Error) {
    console.error(`[${NAMESPACE} - ${fileName}] (\x1b[0;91mError\x1b[0m)`, data[0].message, '-', getOriginalFileName(data[0]));
  } else {
    console.error(`[${NAMESPACE} - ${fileName}] (\x1b[0;91mError\x1b[0m)`, ...data);
  }
}

/**
 * @param  {...any} data data to be logged
 * @returns {void}
 */
function debug(...data) {
  if (!DEBUG || !data?.length) return;
  const fileName = getOriginalFileName();
  console.debug(`[${fileName}] (\x1b[0;94mDebug\x1b[0m)`, ...data);
}

/**
 * @param  {...any} data data to be logged
 * @returns {void}
 */
function debugOr(...data) {
  if (!data?.length) return;
  const fileName = getOriginalFileName();
  if (!DEBUG) {
    console.info(`[${NAMESPACE} - ${fileName}] (\x1b[0;35mInfo\x1b[0m)`, data.pop());
  } else {
    console.debug(`[${NAMESPACE} - ${fileName}] (\x1b[0;94mDebug\x1b[0m)`, ...data.slice(0, -1));
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

module.exports = Logger;
