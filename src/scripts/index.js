/* jshint devel: true */
/* global Polymer, io, $ */
'use strict';
import {post} from 'xhr';
import {errorToJSON, pageNames, zeptoMethods} from 'utils';
zeptoMethods($);
let socket = io(), currPage = '';
function loadTemplate(name, title = pageNames[name], attrs = new Map(), content = '') { //TODO: Promise interface? or ee interface
  //FIXME create map for templatename -> title
 Polymer.import([`components/${name}/${name}.html`], () => {
    let fadeTime = 500;
    $('main').fadeOut(fadeTime, () => {
      let str = '';
      for (let [name, value] of attrs) {
        str += ` ${name}='${value}'`;
      }
      $('main').html(`<${name}${str}>${content}</${name}>`);
      $('#page-title, title').text(title);
      $('main').fadeIn(fadeTime);
    });
  });
}
window.loadTemplate = loadTemplate; //FIXME remove this line
errorToJSON();
window.onerror = (message, url, line, col, err) => {
  let result = err || {
    message, url, line, col
  };
  post('/test', result instanceof Error ? result.toJSON() : JSON.stringify(result)).catch(err => console.error(err));
};
loadTemplate('choose-mode');
socket.on('connect', () => {
  setTimeout(() => {
    $('#status-indicator').class('fa fa-link');
    $('#status-text').text(' Connection established').fadeIn(1000);
    setTimeout(() => {
      $('#status-text').fadeOut(1000, () => $('#status-indicator').addClass('no-text'));
    }, 2500);
  }, 2500);
});
//error
//disconnect
//reconnecting, reconnect_attempt, reconnect_error, reconnect_failed
export {socket, currPage, loadTemplate};
