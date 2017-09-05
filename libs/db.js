'use strict'
const knexfile = require('../knexfile')
const knex = require('knex')(knexfile[process.env.NODE_ENV || 'development' ])
let book = require('bookshelf')(knex)
