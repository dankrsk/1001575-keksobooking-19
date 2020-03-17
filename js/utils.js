'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  function addDisabledAttr(elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }
  }

  function removeDisabledAttr(elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    }
  }

  function resetSelectField(select) {
    for (var i = 0; i < select.options.length; i++) {
      select.options[i].disabled = false;
    }
  }

  function debounce(cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        lastTimeout = window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  }

  window.utils = {
    addDisabledAttr: addDisabledAttr,
    removeDisabledAttr: removeDisabledAttr,
    resetSelectField: resetSelectField,
    debounce: debounce
  };
})();
