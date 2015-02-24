'use strict';
import {socket, loadTemplate} from '/scripts/index.js';
Polymer('choose-mode', {
  userMode() {
    loadTemplate('waiting-page');
    socket.emit('register', 'user');
  },
  supervisorMode() {
    loadTemplate('enter-super-pass');
  }
});
