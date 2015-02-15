define(["exports"], function (exports) {
  "use strict";
  exports["default"] = asyncXhr;
  exports.get = get;
  exports.post = post;
  function asyncXhr(method, url) {
    var data = arguments[2] === undefined ? null : arguments[2];
    var opts = arguments[3] === undefined ? {} : arguments[3];
    var xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
      try {
        xhr.open(method, url, true);
      } catch (e) {
        reject(e);
      }
      xhr.onload = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var result = undefined;
            if (opts.json === true) {
              result = JSON.parse(xhr.response);
            } else {
              result = xhr.response;
            }
            resolve(result);
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };
      xhr.onerror = function (e) {
        reject(e);
      };
      xhr.send(data);
    });
  }
  function get(url) {
    return asyncXhr("GET", url);
  }
  function post(url, data) {
    return asyncXhr("POST", url, data);
  }
  exports.__esModule = true;
});
