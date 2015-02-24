/*jshint node: true, browser: false */
'use strict';
import 'babel/polyfill';
import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import compression from 'compression';
import bodyParser from 'body-parser';
let app = express(),
    server = http.Server(app),
    io = socketIo(server);
const port = process.env.PORT || 8001;
app.use(compression({
  threshold: 512
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.post('/test', (req, res) => {
  console.log('post to /test');
  res.end('');
});
server.listen(port, () => console.log('listening on *:' + port));
io.on('connection', socket => {
  socket.on('register', (type, pass) => {
    console.log(type, pass);
  });
});
