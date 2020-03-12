'use strict';

(function () {
  var MIN_HEADER_LENGTH = 30;
  var MAX_HEADER_LENGTH = 100;

  var removeDisabledAttr = window.utils.removeDisabledAttr;
  var addDisabledAttr = window.utils.addDisabledAttr;

  var adForm = document.querySelector('.ad-form');
  var adFormFields = adForm.children;
  var headerField = adForm.querySelector('#title');
  var addressField = adForm.querySelector('#address');
  var roomsField = adForm.querySelector('#room_number');
  var guestsField = adForm.querySelector('#capacity');

  function limitGuests(roomsSelect, guestsSelect) {
    var rooms = parseInt(roomsSelect.value, 10);

    window.utils.resetSelectField(guestsField);

    if (rooms === 100) {
      Array.from(guestsSelect.options).forEach(function (it) {
        var guests = parseInt(it.value, 10);
        if (guests > 0) {
          it.disabled = true;
        }
      });
    } else {
      Array.from(guestsSelect.options).forEach(function (it) {
        var guests = parseInt(it.value, 10);
        if (guests > rooms || guests === 0) {
          it.disabled = true;
        }
      });
    }
  }

  function onRoomsFieldChange() {
    limitGuests(roomsField, guestsField);
  }

  function onTextInputValidation(evt) {
    var target = evt.target;
    headerField.setCustomValidity('!');
    if (target.value.length < MIN_HEADER_LENGTH || target.value.length > MAX_HEADER_LENGTH) {
      target.setCustomValidity('Количество символов в заголовке должно быть больше ' + MIN_HEADER_LENGTH + ' и меньше ' + MAX_HEADER_LENGTH + ' символов');
    } else {
      target.setCustomValidity('');
    }
  }

  function activateForm() {
    removeDisabledAttr(adFormFields);
    adForm.classList.remove('ad-form--disabled');

    headerField.addEventListener('input', onTextInputValidation);

    limitGuests(roomsField, guestsField);
    roomsField.addEventListener('change', onRoomsFieldChange);
  }

  function deactivateForm() {
    addDisabledAttr(adFormFields);

    headerField.removeEventListener('input', onTextInputValidation);
    roomsField.removeEventListener('change', onRoomsFieldChange);
  }

  function setAddress(address) {
    addressField.value = address;
  }

  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    setAddress: setAddress,
    adForm: adForm
  };
})();
