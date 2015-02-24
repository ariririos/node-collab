'use strict';
export function errorToJSON() {
  Object.defineProperty(Error.prototype, 'toJSON', {
    value() {
        let alt = {};
        Object.getOwnPropertyNames(this).forEach(key => alt[key] = this[key]);
        return alt;
    },
    configurable: true
  });
}
export const pageNames = {
  'choose-mode': 'Choose Mode',
  'waiting-page': '',
  //'question-page': 'Question' || '',
  'submit-questions': 'Submit Questions',
  'results-page': 'Results',
  //'view-question-info': 'Question' || '',
  'collaboration-request': 'Collaboration',
  'enter-super-pass': 'Enter Password',
  'dashboard-page': 'Dashboard',
  //'view-user-info': 'User' || '',
  'leaderboard-page': 'Leaderboard',
  //'view-group-info': 'Group' || ''
};
export function zeptoMethods($) {
  $.fn.class = function(className) {
    $(this).attr('class', className);
  };
}
