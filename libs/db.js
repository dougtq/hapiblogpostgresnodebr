'use strict'
let knexfile = require('../knexfile')
let knex = require('knex')(knexfile[process.env.NODE_ENV || 'development'])
let bookshelf = require('bookshelf')(knex)
let uuid = require('bookshelf-uuid')
let bcrypt = require('bookshelf-bcrypt')

bookshelf.plugin(uuid)
bookshelf.plugin(bcrypt)
bookshelf.plugin('visibility')

module.exports = bookshelf

