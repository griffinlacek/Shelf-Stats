var Hapi = require('hapi');
var routes = require('./routes');

var server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 3000
});

server.route(routes);

server.start((err) => {
  if(err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
})
