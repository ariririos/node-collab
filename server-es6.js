/*jshint node: true, browser: false */
'use strict';
require('babel/polyfill');
let express = require('express'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  compression = require('compression'),
  bodyParser = require('body-parser');
const port = process.env.PORT || 8001;
app.use(compression({
  threshold: 512
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.post('/test', (req, res) => {
  console.log('post to /test');
  console.log(req.body);
  res.end(req.body.stack);
});
server.listen(port, () => console.log('listening on *:' + port));
io.on('connection', socket => {
  //socket.emit('test');
  //socket.on('test', () => console.log('received test'));
  socket.on('register', type => {
    console.log(`registering ${type}`);
  });
});
