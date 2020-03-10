'use strict';

(function () {
  var LEFT_MOUSE_BUTTON = 0;
  var ENTER_KEY = 13;
  var ESC_KEY = 27;

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
  var typeField = filterForm.querySelector('#housing-type');
  var priceField = filterForm.querySelector('#housing-price');
  var featuresField = filterForm.querySelector('#housing-features');
  var featureCheckboxes = featuresField.querySelectorAll('.map__checkbox');
  var pinsContainer = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var adsToShow;

  function addCardHandler(card, pins) {
    var closeButton = card.querySelector('.popup__close');
    closeButton.addEventListener('mousedown', function onCloseButtonMouseDown(evt) {
      if (evt.button === LEFT_MOUSE_BUTTON) {
        removeActiveCard(pins);
        closeButton.removeEventListener('mousedown', onCloseButtonMouseDown);
      }
    });
    closeButton.addEventListener('keydown', function onCloseButtonKeyDown(evt) {
      if (evt.keyCode === ENTER_KEY) {
        removeActiveCard(pins);
        closeButton.removeEventListener('keydown', onCloseButtonKeyDown);
      }
    });
    document.addEventListener('keydown', function onEscKeyDown(evt) {
      if (evt.keyCode === ESC_KEY) {
        removeActiveCard(pins);
        closeButton.removeEventListener('keydown', onEscKeyDown);
      }
    });
  }

  function createCard(pin, template, pins) {
    var card = template.cloneNode(true);
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capacity = card.querySelector('.popup__text--capacity');
    var time = card.querySelector('.popup__text--time');
    var features = card.querySelector('.popup__features');
    var description = card.querySelector('.popup__description');
    var photos = card.querySelector('.popup__photos');
    var avatar = card.querySelector('.popup__avatar');


    if (pin.ad.offer.title) {
      title.textContent = pin.ad.offer.title;
    } else {
      title.remove();
    }
    if (pin.ad.offer.address) {
      address.textContent = pin.ad.offer.address;
    } else {
      address.remove();
    }
    if (pin.ad.offer.price) {
      price.textContent = pin.ad.offer.price + '₽/ночь';
    } else {
      price.remove();
    }
    switch (pin.ad.offer.type) {
      case 'flat':
        type.textContent = 'Квартира';
        break;
      case 'bungalo':
        type.textContent = 'Бунгало';
        break;
      case 'house':
        type.textContent = 'Дом';
        break;
      case 'palace':
        type.textContent = 'Дворец';
        break;
      default:
        type.remove();
        break;
    }
    if (!(pin.ad.offer.rooms && pin.ad.offer.guests)) {
      price.remove();
    } else {
      if (pin.ad.offer.rooms) {
        capacity.textContent = pin.ad.offer.rooms + ' комнаты';
        if (pin.ad.offer.guests) {
          capacity.textContent += ' для ' + pin.ad.offer.guests + ' гостей';
        }
      } else {
        capacity.textContent += 'Для' + pin.ad.offer.guests + ' гостей';
      }
    }
    if (!(pin.ad.offer.checkin && pin.ad.offer.checkout)) {
      time.remove();
    } else {
      if (pin.ad.offer.checkin) {
        time.textContent = 'Заезд после ' + pin.ad.offer.checkin;
        if (pin.ad.offer.checkout) {
          time.textContent += ', выезд до ' + pin.ad.offer.checkout;
        }
      } else {
        time.textContent = 'Выезд до ' + pin.ad.offer.checkout;
      }
    }
    features.innerHTML = '';
    if (pin.ad.offer.features) {
      pin.ad.offer.features.forEach(function (feature) {
        switch (feature) {
          case 'wifi':
            features.insertAdjacentHTML('beforeend', '<li class="popup__feature popup__feature--wifi"></li>');
            break;
          case 'dishwasher':
            features.insertAdjacentHTML('beforeend', '<li class="popup__feature popup__feature--dishwasher"></li>');
            break;
          case 'parking':
            features.insertAdjacentHTML('beforeend', '<li class="popup__feature popup__feature--parking"></li>');
            break;
          case 'washer':
            features.insertAdjacentHTML('beforeend', '<li class="popup__feature popup__feature--washer"></li>');
            break;
          case 'elevator':
            features.insertAdjacentHTML('beforeend', '<li class="popup__feature popup__feature--elevator"></li>');
            break;
          case 'conditioner':
            features.insertAdjacentHTML('beforeend', '<li class="popup__feature popup__feature--conditioner"></li>');
            break;
          default:
            break;
        }
      });
    } else {
      features.remove();
    }
    if (pin.ad.offer.description) {
      description.textContent = pin.ad.offer.description;
    } else {
      description.remove();
    }
    photos.innerHTML = '';
    if (pin.ad.offer.photos) {
      pin.ad.offer.photos.forEach(function (photo) {
        photos.insertAdjacentHTML('beforeend', '<img src="' + photo + '" class="popup__photo" width="45" height="40" alt="Фотография жилья"></img>');
      });
    } else {
      photos.remove();
    }
    if (pin.ad.author.avatar) {
      avatar.src = pin.ad.author.avatar;
    } else {
      avatar.remove();
    }

    addCardHandler(card, pins);

    return card;
  }

  function renderCard(pins, index) {
    var pin = pins[index];
    pin.item.classList.add('map__pin--active');

    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

    var card = createCard(pin, cardTemplate, pins);
    mapSection.insertBefore(card, pinsContainer.nextSibling);
  }

  function removeActiveCard(pins) {
    pins.forEach(function (pin, index, pinsArray) {
      if (pin.item.classList.contains('map__pin--active')) {
        pin.item.classList.remove('map__pin--active');
        addPinHandler(pin, index, pinsArray);
        mapSection.querySelector('.map__card').remove();
      }
    });
  }

  function addPinHandler(pin, index, pins) {
    pin.item.addEventListener('mousedown', function onPinMouseDown(evt) {
      if (evt.button === LEFT_MOUSE_BUTTON) {
        removeActiveCard(pins);
        renderCard(pins, index);
        pin.item.removeEventListener('mousedown', onPinMouseDown);
      }
    });
    pin.item.addEventListener('keydown', function onPinKeyDown(evt) {
      if (evt.keyCode === ENTER_KEY) {
        removeActiveCard(pins);
        renderCard(pin);
        pin.item.removeEventListener('keydown', onPinKeyDown);
      }
    });
  }

  function renderPins(ads) {
    var oldPins = pinsContainer.querySelectorAll('.map__pin');
    oldPins.forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });

    if (ads.length > 0) {
      ads = ads.slice(0, 5);

      var mapPins = createPins(ads, pinTemplate);

      mapPins.forEach(addPinHandler);

      var pinsFragment = createPinsFragment(mapPins);
      pinsContainer.appendChild(pinsFragment);
    }
  }

  function onFilterChange() {
    mapSection.querySelector('.map__card').remove();
    var filteredAds = adsToShow.filter(function (ad) {
      if (typeField.value === ad.offer.type || typeField.value === 'any') {
        if ((priceField.value === 'low' && ad.offer.price < 10000) ||
        (priceField.value === 'middle' && ad.offer.price >= 10000 && ad.offer.price <= 50000) ||
        (priceField.value === 'high' && ad.offer.price > 50000) ||
        priceField.value === 'any') {
          if (parseInt(roomsField.value, 10) === ad.offer.rooms || roomsField.value === 'any') {
            if (parseInt(guestsField.value, 10) === ad.offer.guests || guestsField.value === 'any') {
              return true;
            }
          }
        }
      }
      return false;
    });
    renderPins(filteredAds);
  }

  function activateMap(ads) {
    removeDisabledAttr(filterFormFields);
    mapSection.classList.remove('map--faded');

    adsToShow = ads;
    renderPins(adsToShow);

    typeField.addEventListener('change', onFilterChange);
    priceField.addEventListener('change', onFilterChange);
    roomsField.addEventListener('change', onFilterChange);
    guestsField.addEventListener('change', onFilterChange);
    featureCheckboxes.forEach(function (it) {
      it.addEventListener('change', onFilterChange);
    });
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
