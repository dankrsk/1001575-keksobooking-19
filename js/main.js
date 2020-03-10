'use strict';

(function () {
  var LEFT_MOUSE_BUTTON = 0;
  var ENTER_KEY = 13;

  var activateMap = window.map.activateMap;
  var activateForm = window.form.activateForm;
  var setAddress = window.form.setAddress;
  var deactivateMap = window.map.deactivateMap;
  var deactivateForm = window.form.deactivateForm;
  var limitGuests = window.map.limitGuests;
  var limitRooms = window.map.limitRooms;
  var calculateAddress = window.pin.calculateAddress;
  var loadAds = window.load.loadAds;

  var mainPin = window.map.mainPin;
  var roomsField = window.map.roomsField;
  var guestsField = window.map.guestsField;

  function onRoomsFieldChange() {
    limitGuests(roomsField, guestsField);
  }

  function onGuestsFieldChange() {
    limitRooms(roomsField, guestsField);
  }

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

    roomsField.addEventListener('change', onRoomsFieldChange);
    guestsField.addEventListener('change', onGuestsFieldChange);
  }

  function deactivatePage() {
    deactivateMap();
    deactivateForm();

    setAddress(calculateAddress(mainPin, 'center'));

    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    mainPin.addEventListener('keydown', onMainPinKeyDown);

    roomsField.removeEventListener('change', onRoomsFieldChange);
    guestsField.removeEventListener('change', onGuestsFieldChange);
  }

  deactivatePage();
})();
