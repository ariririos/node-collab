'use strict';
import {socket, loadTemplate} from '/scripts/index.js';
Polymer('enter-super-pass', {
  cancel() {
    //back to choose-mode
    loadTemplate('choose-mode');
  },
  validate() {
    //show waiting, send to socket, wait for response, either advance to dashboard or show incorrectness
    socket.emit('register', 'super', this.$['super-pass-input'].value);
  }
});
