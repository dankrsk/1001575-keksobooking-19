'use strict';

(function () {
  var removeDisabledAttr = window.utils.removeDisabledAttr;
  var addDisabledAttr = window.utils.addDisabledAttr;

  var adForm = document.querySelector('.ad-form');
  var adFormFields = adForm.children;
  var addressField = adForm.querySelector('#address');

  function activateForm() {
    removeDisabledAttr(adFormFields);
    adForm.classList.remove('ad-form--disabled');
  }

  function deactivateForm() {
    addDisabledAttr(adFormFields);
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
