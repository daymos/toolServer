'use strict'

const Assert = require('assert'),
  Hapi = require('hapi'),
  Path = require('path'),
    fs = require('fs');

const OPTIONS = {
   key  : fs.readFileSync('./server.key'),
   cert : fs.readFileSync('./server.crt')
};

const data = {
    "hello": "hello", 
    "how": "are you?"
}

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3002, routes: { cors: true }, tls: OPTIONS });



server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }

server.route({
  method:'GET',
  path:'/',
  handler:function(request,reply){
    reply('im listening')
  }
})

server.route({
  method:'GET',
  path:'/data',
  handler:function(request,reply){
    reply(data)
  }
})

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'sounds'
        }
    }
});

server.on('response', function (request) {
    console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
});


});
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
