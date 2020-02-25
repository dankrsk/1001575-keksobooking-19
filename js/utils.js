'use strict';

(function () {
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

  function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  function randomOfferType() {
    var offerType;
    var numberOfRandomOffer = randomInteger(1, 4);

    if (numberOfRandomOffer === 1) {
      offerType = 'palace';
    } else if (numberOfRandomOffer === 2) {
      offerType = 'flat';
    } else if (numberOfRandomOffer === 3) {
      offerType = 'house';
    } else {
      offerType = 'bungalo';
    }

    return offerType;
  }

  function resetSelectField(select) {
    for (var i = 0; i < select.options.length; i++) {
      select.options[i].disabled = false;
    }
  }

  window.utils = {
    addDisabledAttr: addDisabledAttr,
    removeDisabledAttr: removeDisabledAttr,
    randomInteger: randomInteger,
    randomOfferType: randomOfferType,
    resetSelectField: resetSelectField
  };
})();
