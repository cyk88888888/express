#!/usr/bin/env node
const app = require('../app');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const port = 3000;//默认端口
const isHttps = 1;//是否为https
let server;
createServer(port);
getIp();
function createServer(port) {
  if (isHttps) {
    const options = {
      key: fs.readFileSync(path.join(__dirname, '../ssl/server.key')),
      cert: fs.readFileSync(path.join(__dirname, '../ssl/server.crt')),
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  let errPort = error.port;
  let bind = typeof errPort === 'string' ? 'Pipe ' + errPort : 'Port ' + errPort;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE'://端口已被占用，自增1，直到找到空闲端口
      // console.error(bind + ' is already in use');
      createServer(errPort + 1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  let ip = getIp();
  console.log(`server running at http${isHttps ? 's' : ''}://${ip}:${addr.port}`);
}

/** 获取本机ip*/
function getIp() {
  let needHost = '' // 打开的host
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces()
    // console.log("network",network)
    for (let dev in network) {
      let iface = network[dev]
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i]
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          needHost = alias.address
        }
      }
    }
  } catch (e) {
    needHost = 'localhost'
  }
  return needHost;
}
