'use strict';

(function () {
  var LEFT_MOUSE_BUTTON = 0;
  var ENTER_KEY = 13;
  var ESC_KEY = 27;
  var DEFAULT_POSITION = window.pin.DEFAULT_POSITION;

  var createPins = window.pin.createPins;
  var createPinsFragment = window.pin.createPinsFragment;
  var removeDisabledAttr = window.utils.removeDisabledAttr;
  var addDisabledAttr = window.utils.addDisabledAttr;
  var debounce = window.utils.debounce;

  var filterForm = document.querySelector('.map__filters');
  var filterFormFields = filterForm.children;
  var mapSection = document.querySelector('.map');
  var mainPin = mapSection.querySelector('.map__pin--main');
  var roomsField = filterForm.querySelector('#housing-rooms');
  var guestsField = filterForm.querySelector('#housing-guests');
  var typeField = filterForm.querySelector('#housing-type');
  var priceField = filterForm.querySelector('#housing-price');
  var featuresField = filterForm.querySelector('#housing-features');
  var filterCheckboxes = featuresField.querySelectorAll('.map__checkbox');
  var pinsContainer = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var mapPins = [];
  var adsToShow;

  function addCardHandler(card, pins) {
    var closeButton = card.querySelector('.popup__close');
    closeButton.addEventListener('mousedown', function onCloseButtonMouseDown(evt) {
      if (evt.button === LEFT_MOUSE_BUTTON) {
        removeActiveCard(pins);
      }
    });
    closeButton.addEventListener('keydown', function onCloseButtonKeyDown(evt) {
      if (evt.keyCode === ENTER_KEY) {
        removeActiveCard(pins);
      }
    });
    document.addEventListener('keydown', function onEscKeyDown(evt) {
      if (evt.keyCode === ESC_KEY) {
        removeActiveCard(pins);
      }
    });
  }

  function getTextFromType(type) {
    switch (type) {
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
      default:
        return type;
    }
  }


  function getTextFromCapacity(rooms, guests) {
    var text = '';

    if (rooms) {
      text = rooms + ' комнаты';
      if (guests) {
        text += ' для ' + guests + ' гостей';
      }
    } else {
      text = 'Для ' + guests + ' гостей';
    }

    return text;
  }

  function getTextFromTime(checkin, checkout) {
    var text = '';

    if (checkin) {
      text = 'Заезд после ' + checkin;
      if (checkout) {
        text += ', выезд до ' + checkout;
      }
    } else {
      text = 'Выезд до ' + checkout;
    }

    return text;
  }

  function getHTMLFromFeatures(features) {
    var html = '';

    features.forEach(function (feature) {
      html += '<li class="popup__feature popup__feature--' + feature + '"></li>';
    });

    return html;
  }

  function getHTMLFromPhotos(photos) {
    var html = '';

    photos.forEach(function (photo) {
      html += '<img src="' + photo + '" class="popup__photo" width="45" height="40" alt="Фотография жилья"></img>';
    });

    return html;
  }

  function getContentFromOffer(offer, key) {
    switch (key) {
      case 'price':
        return offer[key] + '₽/ночь';
      case 'type':
        return getTextFromType(offer.type);
      case 'capacity':
        return getTextFromCapacity(offer.rooms, offer.guests);
      case 'time':
        return getTextFromTime(offer.checkin, offer.checkout);
      case 'features':
        return getHTMLFromFeatures(offer.features);
      case 'photos':
        return getHTMLFromPhotos(offer.photos);
      default:
        return offer[key];
    }
  }

  function createCardFields(fields, pin) {
    var pinOffer = pin.ad.offer;
    for (var key in fields) {
      if (pinOffer[key] || key === 'capacity' && (pinOffer.rooms || pinOffer.guests) || key === 'time' && (pinOffer.checkin || pinOffer.checkout)) {
        if (key === 'features' || key === 'photos') {
          fields[key].innerHTML = getContentFromOffer(pinOffer, key);
        } else {
          fields[key].textContent = getContentFromOffer(pinOffer, key);
        }
      } else if (key === 'avatar' && pin.ad.author.avatar) {
        fields[key].src = pin.ad.author.avatar;
      } else {
        fields[key].remove();
      }
    }
  }

  function createCard(pin, template, pins) {
    var card = template.cloneNode(true);
    var cardFields = {
      title: card.querySelector('.popup__title'),
      address: card.querySelector('.popup__text--address'),
      price: card.querySelector('.popup__text--price'),
      type: card.querySelector('.popup__type'),
      capacity: card.querySelector('.popup__text--capacity'),
      time: card.querySelector('.popup__text--time'),
      features: card.querySelector('.popup__features'),
      description: card.querySelector('.popup__description'),
      photos: card.querySelector('.popup__photos'),
      avatar: card.querySelector('.popup__avatar')};

    createCardFields(cardFields, pin);

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
        renderCard(pins, index);
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
      mapPins = createPins(ads, pinTemplate);

      mapPins.forEach(addPinHandler);

      var pinsFragment = createPinsFragment(mapPins);
      pinsContainer.appendChild(pinsFragment);
    }
  }

  function checkType(ad) {
    return typeField.value === ad.offer.type || typeField.value === 'any';
  }

  function checkPrice(ad) {
    return (priceField.value === 'low' && ad.offer.price < 10000) || (priceField.value === 'middle' && ad.offer.price >= 10000 && ad.offer.price <= 50000) || (priceField.value === 'high' && ad.offer.price > 50000) || priceField.value === 'any';
  }

  function checkRooms(ad) {
    return parseInt(roomsField.value, 10) === ad.offer.rooms || roomsField.value === 'any';
  }

  function checkGuests(ad) {
    var numberOfGuests = parseInt(guestsField.value, 10);
    if (numberOfGuests === 0) {
      return ad.offer.guests === 0;
    } else {
      return numberOfGuests <= ad.offer.guests || guestsField.value === 'any';
    }
  }

  function checkFeatures(ad) {
    var checkedFeatures = Array.from(filterCheckboxes).filter(function (it) {
      return it.checked;
    });

    for (var j = 0; j < checkedFeatures.length; j++) {
      var feature = checkedFeatures[j];
      if (ad.offer.features.indexOf(feature.value) === -1) {
        return false;
      }
    }

    return true;
  }

  var onFilterChange = debounce(function () {
    removeActiveCard(mapPins);
    var filteredAds = [];

    for (var i = 0; i < adsToShow.length && filteredAds.length < 5; i++) {
      var ad = adsToShow[i];
      if (checkType(ad) && checkPrice(ad) && checkRooms(ad) && checkGuests(ad) && checkFeatures(ad)) {
        filteredAds.push(ad);
      }
    }

    renderPins(filteredAds);
  });

  function removePins(pins) {
    pins.forEach(function (it) {
      it.item.remove();
    });
  }

  function moveMainPinToDefaultPosition(pin) {
    pin.style.top = DEFAULT_POSITION.top + 'px';
    pin.style.left = DEFAULT_POSITION.left + 'px';
  }

  function activateMap(ads) {
    removeDisabledAttr(filterFormFields);
    mapSection.classList.remove('map--faded');

    adsToShow = ads.filter(function (it) {
      return it.offer;
    });

    renderPins(adsToShow.slice(0, 5));

    typeField.addEventListener('change', onFilterChange);
    priceField.addEventListener('change', onFilterChange);
    roomsField.addEventListener('change', onFilterChange);
    guestsField.addEventListener('change', onFilterChange);
    filterCheckboxes.forEach(function (it) {
      it.addEventListener('change', onFilterChange);
    });
  }

  function deactivateMap() {
    filterForm.reset();
    addDisabledAttr(filterFormFields);
    if (mapPins) {
      removeActiveCard(mapPins);
      removePins(mapPins);
    }
    moveMainPinToDefaultPosition(mainPin);
    mapSection.classList.add('map--faded');

    typeField.removeEventListener('change', onFilterChange);
    priceField.removeEventListener('change', onFilterChange);
    roomsField.removeEventListener('change', onFilterChange);
    guestsField.removeEventListener('change', onFilterChange);
    filterCheckboxes.forEach(function (it) {
      it.removeEventListener('change', onFilterChange);
    });
  }

  window.map = {
    activateMap: activateMap,
    deactivateMap: deactivateMap,
    getTextFromType: getTextFromType,
    mainPin: mainPin
  };
})();
