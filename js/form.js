'use strict';

(function () {
  var MIN_HEADER_LENGTH = 30;
  var MAX_HEADER_LENGTH = 100;
  var MAX_PRICE = 1000000;
  var INPUT_EVENT = new Event('input');
  var CHANGE_EVENT = new Event('change');

  var removeDisabledAttr = window.utils.removeDisabledAttr;
  var addDisabledAttr = window.utils.addDisabledAttr;
  var getTextFromType = window.map.getTextFromType;
  var resetSelectField = window.utils.resetSelectField;

  var adForm = document.querySelector('.ad-form');
  var adFormFields = adForm.children;
  var headerField = adForm.querySelector('#title');
  var priceField = adForm.querySelector('#price');
  var typeField = adForm.querySelector('#type');
  var addressField = adForm.querySelector('#address');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomsField = adForm.querySelector('#room_number');
  var guestsField = adForm.querySelector('#capacity');
  var avatarField = adForm.querySelector('#avatar');
  var imagesField = adForm.querySelector('#images');
  var fileLabels = {
    avatar: adForm.querySelector('[for=avatar]'),
    images: adForm.querySelector('[for=images]')
  };
  var minPrice;

  function addInvalidHandler(field) {
    field.addEventListener('invalid', function onFieldInvalid() {
      if (field.type === 'file') {
        fileLabels[field.id].style = 'box-shadow: 0 0 2px 2px red;';
      } else {
        field.style = 'box-shadow: 0 0 2px 2px red;';
      }
      field.removeEventListener('invalid', onFieldInvalid);
    });
  }

  function onGuestsFieldChange(evt) {
    var field = evt.target;

    if (field.selectedOptions[0].disabled) {
      field.setCustomValidity('1 комната - для 1 гостя, 2 комнаты - для 2 и для 1 гостей, 3 комнаты - для 3, 2 и 1 гостей, 100 комнат - не для гостей');
      addInvalidHandler(field);
    } else {
      field.setCustomValidity('');
      field.style = '';
    }
  }

  function onRoomsFieldChange(evt) {
    var innerChangeEvent = new Event('change');
    var field = evt.target;
    var rooms = parseInt(field.value, 10);

    resetSelectField(guestsField);

    if (rooms === 100) {
      Array.from(guestsField.options).forEach(function (it) {
        var guests = parseInt(it.value, 10);
        if (guests > 0) {
          it.disabled = true;
        }
      });
    } else {
      Array.from(guestsField.options).forEach(function (it) {
        var guests = parseInt(it.value, 10);
        if (guests > rooms || guests === 0) {
          it.disabled = true;
        }
      });
    }

    guestsField.dispatchEvent(innerChangeEvent);
  }

  function onHeaderFieldInput(evt) {
    var field = evt.target;
    if (field.value.length < MIN_HEADER_LENGTH || field.value.length > MAX_HEADER_LENGTH) {
      field.setCustomValidity('Поле является обязательным для заполнения. Количество символов в заголовке должно быть больше ' + MIN_HEADER_LENGTH + ' и меньше ' + MAX_HEADER_LENGTH + ' символов');
      addInvalidHandler(field);
    } else {
      field.setCustomValidity('');
      field.style = '';
    }
  }

  function onPriceFieldInput(evt) {
    var field = evt.target;
    var priceFieldValue = parseInt(evt.target.value, 10);
    var customValidityMessage = '';

    if (priceFieldValue > MAX_PRICE || isNaN(priceFieldValue) || priceFieldValue < minPrice) {
      customValidityMessage += 'Поле является обязательным для заполнения. Цена за ночь не должна превышать ' + MAX_PRICE + '. ';
      if (minPrice) {
        customValidityMessage += 'Для типа жилья ' + getTextFromType(typeField.value) + ' минимальная цена за ночь должна быть больше ' + minPrice;
      }
      addInvalidHandler(field);
    } else {
      field.style = '';
    }

    field.setCustomValidity(customValidityMessage);
  }

  function getPriceFromType(type) {
    switch (type) {
      case 'flat':
        return 1000;
      case 'house':
        return 5000;
      case 'palace':
        return 10000;
      default:
        return 0;
    }
  }

  function onTypeFieldChange(evt) {
    var field = evt.target;
    minPrice = getPriceFromType(field.value);

    priceField.placeholder = minPrice;

    priceField.dispatchEvent(INPUT_EVENT);
  }

  function onTimeFieldChange(evt) {
    var field = evt.target;
    switch (field.name) {
      case 'timein':
        timeOutField.value = field.value;
        break;
      case 'timeout':
        timeInField.value = field.value;
        break;
      default:
        break;
    }
  }


  function onFileFieldChange(evt) {
    var field = evt.target;

    if (field.files[0] && !field.files[0].type.includes('image')) {
      field.setCustomValidity('Выберите пожалуйста изображение (форматы изображений: jpg, png, tiff и т.п.)');
      addInvalidHandler(field);
    } else {
      field.setCustomValidity('');
      fileLabels[field.id].style = '';
    }
  }

  function activateForm() {
    removeDisabledAttr(adFormFields);
    adForm.classList.remove('ad-form--disabled');
    addressField.readOnly = true;

    headerField.addEventListener('input', onHeaderFieldInput);
    priceField.addEventListener('input', onPriceFieldInput);
    typeField.addEventListener('change', onTypeFieldChange);
    timeInField.addEventListener('change', onTimeFieldChange);
    timeOutField.addEventListener('change', onTimeFieldChange);
    guestsField.addEventListener('change', onGuestsFieldChange);
    avatarField.addEventListener('change', onFileFieldChange);
    imagesField.addEventListener('change', onFileFieldChange);
    roomsField.addEventListener('change', onRoomsFieldChange);

    headerField.dispatchEvent(INPUT_EVENT);
    priceField.dispatchEvent(INPUT_EVENT);
    typeField.dispatchEvent(CHANGE_EVENT);
    timeInField.dispatchEvent(CHANGE_EVENT);
    timeOutField.dispatchEvent(CHANGE_EVENT);
    roomsField.dispatchEvent(CHANGE_EVENT);
  }

  function deactivateForm() {
    adForm.reset();
    typeField.dispatchEvent(CHANGE_EVENT);
    addDisabledAttr(adFormFields);
    adForm.classList.add('ad-form--disabled');

    headerField.removeEventListener('input', onHeaderFieldInput);
    priceField.removeEventListener('input', onPriceFieldInput);
    typeField.removeEventListener('change', onTypeFieldChange);
    roomsField.removeEventListener('change', onRoomsFieldChange);
    timeInField.removeEventListener('change', onTimeFieldChange);
    timeOutField.removeEventListener('change', onTimeFieldChange);
    guestsField.removeEventListener('change', onGuestsFieldChange);
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
