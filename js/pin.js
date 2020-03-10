'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 81;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  function createPins(ads, template) {
    var pin;
    var pins = [{}];
    var pinStyles = {
      width: PIN_WIDTH,
      height: PIN_HEIGHT
    };
    var pinImg;

    for (var i = 0; i < ads.length; i++) {
      pin = template.cloneNode(true);
      pinImg = pin.querySelector('img');
      pin.style.left = ads[i].location.x - pinStyles.width / 2 + 'px';
      pin.style.top = ads[i].location.y - pinStyles.height + 'px';
      pinImg.src = ads[i].author.avatar;
      pinImg.alt = ads[i].offer.title;
      pins[i] = {
        item: pin,
        ad: ads[i]
      };
    }

    return pins;
  }

  function createPinsFragment(pins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(pins[i].item);
    }

    return fragment;
  }

  function calculateAddress(pin, isCenter) {
    var address;

    if (isCenter === 'center') {
      address = Math.floor(parseInt(pin.style.left, 10) + MAIN_PIN_WIDTH / 2) + ', ' + Math.floor(parseInt(pin.style.top, 10) + MAIN_PIN_WIDTH / 2);
    } else {
      address = Math.floor(parseInt(pin.style.left, 10) + MAIN_PIN_WIDTH / 2) + ', ' + Math.floor(parseInt(pin.style.top, 10) + MAIN_PIN_HEIGHT);
    }

    return address;
  }

  window.pin = {
    createPins: createPins,
    createPinsFragment: createPinsFragment,
    calculateAddress: calculateAddress
  };
})();
