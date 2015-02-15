/*jshint node: true, browser: false */
'use strict';
let express = require('express'),
  app = express(),
  compression = require('compression');
const port = process.env.PORT || 8000;
app.use(compression({
  threshold: 512
}));
app.use(express.static(__dirname + '/public'));
app.listen(port, () => console.log('listening on *:' + port));
