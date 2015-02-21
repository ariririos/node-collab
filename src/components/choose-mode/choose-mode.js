/* jshint -W064 */
/* global Polymer, loadTemplate */
'use strict';
import {socket} from '/scripts/index.js';
console.log(socket);
//setInterval(() => socket.emit('test'), 1000);
Polymer('choose-mode', {
  userMode() {
    loadTemplate('waiting-page');
    socket.emit('register', 'user');
  },
  supervisorMode() {
    loadTemplate('enter-super-pass');
  }
});
