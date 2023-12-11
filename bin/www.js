#!/usr/bin/env node
var app = require('../app');
var http = require('http');
let port = 3000;
var server;
createServer(port);

function createServer(port) {
  server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  let errPort = error.port;
  var bind = typeof errPort === 'string' ? 'Pipe ' + errPort : 'Port ' + errPort;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE'://端口已被占用
      // console.error(bind + ' is already in use');
      createServer(errPort + 1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  console.log(`server running on http://localhost:${addr.port}`);
}
