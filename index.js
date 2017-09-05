'use strict'

const Hapi = require('hapi')
let app = new Hapi.Server()

app.connection({ 
  port : 3000
})

app.route({
  method : 'GET',
  path : '/',
  handler: function (request, reply) {
    reply({ msg : 'Hello World' })
  } 
})




app.start((err)=>{
  if (err){
    throw err.message
  }

  console.log('Servidor rodando na porta:', app.info.port)
})