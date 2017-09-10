'use strict'

const Hapi = require('hapi')
let Joi = require('joi')
let Jwt = require('jsonwebtoken')
let Boom = require('boom')
let User = require('./models/user')
let app = new Hapi.Server({
  debug: {
    log: ['error'],
    request: ['error']
  }
})
const _SECRET = '123456'

app.connection({ port: 3000 })

app.register(require('hapi-auth-jwt2'), err => {
  if (err) throw err.message

  let validate = (jwt, request, cb) => {
    User.forge({ id: jwt.id })
      .fetch()
      .then(user => {
        if (user) {
          cb(null, true, user.toJSON())
        } else {
          cb(null, false)
        }
      })
      .catch(err => cb(err))
  }

  app.auth.strategy('jwt', 'jwt', {
    key: _SECRET,
    validateFunc: validate
  })
})

app.route({
  method: 'POST',
  path: '/api/v1/users',
  handler: function(request, reply) {
    console.log(request.payload)

    User.forge(request.payload)
      .save()
      .then(user => reply(user), err => reply(err))
  },
  config: {
    validate: {
      payload: Joi.object({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required(),
        user: Joi.string().required()
      })
    }
  }
})

app.route({
  method: 'POST',
  path: '/api/v1/sessions',
  handler: (request, reply) => {
    let user

    User.forge({ user: request.payload.user })
      .fetch({ require: true })
      .then(result => {
        user = result
        return result.compare(request.payload.password)
      })
      .then(isValid => {
        if (isValid) {
          reply({
            token: Jwt.sign(
              { user: user.user, email: user.email, uuid: user.id },
              _SECRET
            )
          })
        } else {
          reply(
            Boom.unauthorized(
              'Nenhum usuário encontrado com as informações digitadas'
            )
          )
        }
      })
  },
  config: {
    validate: {
      payload: Joi.object({
        password: Joi.string().required(),
        user: Joi.string().required()
      })
    }
  }
})

app.route({
  method: 'GET',
  path: '/api/v1/sessions',
  handler: (request, reply) => {
    reply(request.auth.credentials)
  },
  config: {
    // auth: 'jwt'
  }
})

app.start(err => {
  if (err) {
    throw err.name
  }

  console.log('Servidor rodando na porta:', app.info.port)
})
