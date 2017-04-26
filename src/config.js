/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.API_DOCUMENTATION_HOST || 'localhost',
  port: process.env.API_DOCUMENTATION_PORT || '3000',
  ndlaApiGatewayUrl: process.env.NDLA_API_URL || 'http://api-gateway.ndla-local:8001',
  apiDocPath: new RegExp('api-docs'),

  app: {
    title: 'NDLA API Documentation',
  },

}, environment);
