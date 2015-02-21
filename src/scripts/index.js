/* jshint devel: true */
/* global Polymer, io */
'use strict';
import {post} from 'xhr';
import {errorToJSON} from 'utils';
import $ from 'jquery';
let socket = io();

function loadTemplate(name, title = '', attrs = new Map(), content = '') { //TODO: Promise interface? or ee interface
  Polymer.import([`components/${name}/${name}.html`], () => {
    $('main').fadeOut(1000, () => {
      let str = '';
      for (let [name, value] of attrs) {
        str += ` ${name}='${value}'`;
      }
      $('main').html(`<${name}${str}>${content}</${name}>`);
      $('#page-title, title').text(title);
      $('main').fadeIn(1000);
    });
  });
}
window.loadTemplate = loadTemplate;
errorToJSON();
window.onerror = (message, url, line, col, err) => {
  let result = err || {
    message, url, line, col
  };
  post('/test', result instanceof Error ? result.toJSON() : JSON.stringify(result)).catch(err => console.error(err));
  return true;
};
loadTemplate('choose-mode', 'Choose Mode');
socket.on('connect', () => {
  setTimeout(() => {
    $('#status-indicator').removeClass('fa-chain-broken').addClass('fa-link');
    $('#status-text').text(' Connection established').fadeIn(1000);
    setTimeout(() => {
      $('#status-text').fadeOut(1000, () => $('#status-indicator').addClass('no-text'));
    }, 2500);
  }, 2500);
});
//error
//disconnect
//reconnecting, reconnect_attempt, reconnect_error, reconnect_failed
export {socket};
