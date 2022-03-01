'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // ENV_CONFIG: '"dev"',
    // BASE_API: '"http://111.231.233.47:8016"',
})
