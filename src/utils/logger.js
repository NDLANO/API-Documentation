/*
 * Part of NDLA api-documentation.
 * Copyright (C) 2016 NDLA
 *
 * See LICENSE
 */

import bunyan from 'bunyan';

let log;

if (!log) {
  log = bunyan.createLogger({ name: 'api-documentation' });
}

log.logAndReturnValue = (level, value, msg) => {
  log[level](msg, value);
  return value;
};

module.exports = log;
