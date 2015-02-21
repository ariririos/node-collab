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
