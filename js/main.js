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

  var mainPin = window.map.mainPin;
  var roomsField = window.map.roomsField;
  var guestsField = window.map.guestsField;

  function activatePage() {
    activateMap();
    activateForm();

    setAddress(calculateAddress(mainPin));
  }

  function deactivatePage() {
    deactivateMap();
    deactivateForm();

    setAddress(calculateAddress(mainPin, 'center'));
  }

  deactivatePage();

  mainPin.addEventListener('mousedown', function onMainPinMouseDown(evt) {
    if (evt.button === LEFT_MOUSE_BUTTON) {
      activatePage();
      mainPin.removeEventListener('mousedown', onMainPinMouseDown);
    }
  });

  mainPin.addEventListener('keydown', function onMainPinKeyDown(evt) {
    if (evt.keyCode === ENTER_KEY) {
      activatePage();
      mainPin.removeEventListener('keydown', onMainPinKeyDown);
    }
  });

  roomsField.addEventListener('change', function onRoomsFieldChange() {
    limitGuests(roomsField, guestsField);
  });

  guestsField.addEventListener('change', function onGuestsFieldChange() {
    limitRooms(roomsField, guestsField);
  });
})();
