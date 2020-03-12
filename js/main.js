'use strict';

(function () {
  var LEFT_MOUSE_BUTTON = 0;
  var ENTER_KEY = 13;

  var activateMap = window.map.activateMap;
  var activateForm = window.form.activateForm;
  var setAddress = window.form.setAddress;
  var deactivateMap = window.map.deactivateMap;
  var deactivateForm = window.form.deactivateForm;
  var calculateAddress = window.pin.calculateAddress;
  var loadAds = window.load.loadAds;

  var mainPin = window.map.mainPin;

  function onMainPinMouseDown(evt) {
    if (evt.button === LEFT_MOUSE_BUTTON) {
      activatePage();
      mainPin.removeEventListener('mousedown', onMainPinMouseDown);
    }
  }

  function onMainPinKeyDown(evt) {
    if (evt.keyCode === ENTER_KEY) {
      activatePage();
      mainPin.removeEventListener('keydown', onMainPinKeyDown);
    }
  }

  function activatePage() {
    loadAds(activateMap);
    activateForm();

    setAddress(calculateAddress(mainPin));
  }

  function deactivatePage() {
    deactivateMap();
    deactivateForm();

    setAddress(calculateAddress(mainPin, 'center'));

    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    mainPin.addEventListener('keydown', onMainPinKeyDown);
  }

  deactivatePage();
})();
