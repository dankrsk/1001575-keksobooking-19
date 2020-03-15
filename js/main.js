'use strict';

(function () {
  var LEFT_MOUSE_BUTTON = 0;
  var ENTER_KEY = 13;
  var ESC_KEY = 27;

  var activateMap = window.map.activateMap;
  var activateForm = window.form.activateForm;
  var setAddress = window.form.setAddress;
  var deactivateMap = window.map.deactivateMap;
  var deactivateForm = window.form.deactivateForm;
  var calculateAddress = window.pin.calculateAddress;
  var loadAds = window.load.loadAds;
  var adForm = window.form.adForm;
  var uploadForm = window.load.uploadForm;
  var mainPin = window.map.mainPin;

  var resetFormButton = adForm.querySelector('.ad-form__reset');

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

  function showLoadMessage(state) {
    var message = document.querySelector('#' + state).content.querySelector('.' + state);

    document.querySelector('main').appendChild(message);

    document.addEventListener('keydown', function onEscKeyDown(evt) {
      evt.preventDefault();

      if (evt.keyCode === ESC_KEY) {
        message.remove();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    });

    document.addEventListener('click', function onClick(evt) {
      evt.preventDefault();

      if (evt.target.className !== (state + '__message')) {
        message.remove();
        document.removeEventListener('click', onClick);
      }
    });

    if (state === 'error') {
      var errorButton = message.querySelector('.error__button');

      errorButton.focus();

      errorButton.addEventListener('click', function onErrorButtonClick(evt) {
        evt.preventDefault();

        message.remove();
        document.removeEventListener('click', onErrorButtonClick);
      });

      errorButton.addEventListener('keydown', function onErrorButtonKeyDown(evt) {
        evt.preventDefault();

        if (evt.keyCode === ENTER_KEY) {
          message.remove();
          document.removeEventListener('keydown', onErrorButtonKeyDown);
        }
      });
    }
  }

  function onAdFormSubmit(evt) {
    evt.preventDefault();

    function onSuccess() {
      deactivatePage();
      showLoadMessage('error');
    }

    function onError() {
      showLoadMessage('error');
    }

    uploadForm(onSuccess, onError, adForm);
  }

  function onResetFormButtonClick(evt) {
    evt.preventDefault();
    deactivatePage();
  }

  function activatePage() {
    loadAds(activateMap);
    activateForm();

    setAddress(calculateAddress(mainPin));

    adForm.addEventListener('submit', onAdFormSubmit);
    resetFormButton.addEventListener('click', onResetFormButtonClick);
  }

  function deactivatePage() {
    deactivateMap();
    deactivateForm();

    setAddress(calculateAddress(mainPin, 'center'));

    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    mainPin.addEventListener('keydown', onMainPinKeyDown);
    adForm.removeEventListener('submit', onAdFormSubmit);
    resetFormButton.removeEventListener('click', onResetFormButtonClick);
  }

  deactivatePage();
})();
