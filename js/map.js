'use strict';

(function () {
  var createSimilarAds = window.data.createSimilarAds;
  var createPins = window.pin.createPins;
  var createPinsFragment = window.pin.createPinsFragment;
  var removeDisabledAttr = window.utils.removeDisabledAttr;
  var addDisabledAttr = window.utils.addDisabledAttr;

  var filterForm = document.querySelector('.map__filters');
  var filterFormFields = filterForm.children;
  var mapSection = document.querySelector('.map');
  var mainPin = mapSection.querySelector('.map__pin--main');
  var roomsField = filterForm.querySelector('#housing-rooms');
  var guestsField = filterForm.querySelector('#housing-guests');

  function renderRandomPins() {
    var pinTemplate = document.querySelector('#pin').content.querySelector('button');
    var pinsContainer = document.querySelector('.map__pins');

    var similarAds = createSimilarAds(mapSection.offsetWidth);
    var mapPins = createPins(similarAds, pinTemplate);
    var pinsFragment = createPinsFragment(mapPins);
    pinsContainer.appendChild(pinsFragment);
  }

  function activateMap() {
    removeDisabledAttr(filterFormFields);
    mapSection.classList.remove('map--faded');

    renderRandomPins();
  }

  function deactivateMap() {
    addDisabledAttr(filterFormFields);
  }

  function limitGuests(roomsSelect, guestsSelect) {
    window.utils.resetSelectField(guestsField);
    if (roomsSelect.value === '1') {
      guestsSelect.querySelector('option[value="2"]').disabled = true;
      guestsSelect.querySelector('option[value="0"]').disabled = true;
    } else if (roomsSelect.value === '2') {
      guestsSelect.querySelector('option[value="0"]').disabled = true;
    }
  }

  function limitRooms(roomsSelect, guestsSelect) {
    window.utils.resetSelectField(roomsField);
    if (guestsSelect.value === '2') {
      roomsSelect.querySelector('option[value="1"]').disabled = true;
    }
  }

  window.map = {
    activateMap: activateMap,
    deactivateMap: deactivateMap,
    limitGuests: limitGuests,
    limitRooms: limitRooms,
    mainPin: mainPin,
    roomsField: roomsField,
    guestsField: guestsField
  };
})();
