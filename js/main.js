'use strict';

var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 81;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var LEFT_MOUSE_BUTTON = 0;
var ENTER_KEY = 13;

var adForm = document.querySelector('.ad-form');
var adFormFields = adForm.children;
var filterForm = document.querySelector('.map__filters');
var filterFormFields = filterForm.children;
var mapSection = document.querySelector('.map');
var mainPin = mapSection.querySelector('.map__pin--main');
var addressField = adForm.querySelector('#address');
var roomsField = filterForm.querySelector('#housing-rooms');
var guestsField = filterForm.querySelector('#housing-guests');

function addDisabledAttr(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
}

function removeDisabledAttr(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
}

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function randomOfferType() {
  var offerType;
  var numberOfRandomOffer = randomInteger(1, 4);

  if (numberOfRandomOffer === 1) {
    offerType = 'palace';
  } else if (numberOfRandomOffer === 2) {
    offerType = 'flat';
  } else if (numberOfRandomOffer === 3) {
    offerType = 'house';
  } else {
    offerType = 'bungalo';
  }

  return offerType;
}

function createSimilarAds(widthOfBlock) {
  var ads = [{}];

  for (var i = 0; i < 8; i++) {
    var locationX = randomInteger(0, widthOfBlock);
    var locationY = randomInteger(130, 630);

    ads[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },

      offer: {
        title: 'Хорошее предложение!',
        address: locationX + ', ' + locationY,
        price: randomInteger(0, 100),
        type: randomOfferType(),
        rooms: randomInteger(1, 6),
        guests: randomInteger(1, 10),
        checkin: randomInteger(12, 14) + ':00',
        checkout: randomInteger(12, 14) + ':00',
        features: [
          'wifi',
          'washer'
        ],
        description: 'Описание',
        photos: [
          'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
          'http://o0.github.io/assets/images/tokyo/hotel2.jpg'
        ]
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
  }

  return ads;
}

function createPins(ads, template) {
  var pin;
  var pins = [];
  var pinStyles = {
    width: PIN_WIDTH,
    height: PIN_HEIGHT
  };

  for (var i = 0; i < ads.length; i++) {
    pin = template.cloneNode(true);
    var pinImg = pin.querySelector('img');
    pin.style.left = ads[i].location.x - pinStyles.width / 2 + 'px';
    pin.style.top = ads[i].location.y - pinStyles.height + 'px';
    pinImg.src = ads[i].author.avatar;
    pinImg.alt = ads[i].offer.title;
    pins.push(pin);
  }

  return pins;
}

function createPinsFragment(pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(pins[i]);
  }

  return fragment;
}

function activatePage() {
  removeDisabledAttr(adFormFields);
  removeDisabledAttr(filterFormFields);

  mapSection.classList.remove('map--faded');

  var similarAds = createSimilarAds(mapSection.offsetWidth);
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var mapPins = createPins(similarAds, pinTemplate);
  var pinsFragment = createPinsFragment(mapPins);
  var pinsContainer = document.querySelector('.map__pins');
  pinsContainer.appendChild(pinsFragment);

  adForm.classList.remove('ad-form--disabled');
}

function calculateMainPinCenter(pin) {
  var center = Math.floor(parseInt(pin.style.left, 10) + MAIN_PIN_WIDTH / 2) + ', ' + Math.floor(parseInt(pin.style.top, 10) + MAIN_PIN_WIDTH / 2);
  return center;
}

function changeAddress(pin) {
  var address = Math.floor(parseInt(pin.style.left, 10) + MAIN_PIN_WIDTH / 2) + ', ' + Math.floor(parseInt(pin.style.top, 10) + MAIN_PIN_HEIGHT);
  return address;
}

function resetSelectField(select) {
  for (var i = 0; i < select.options.length; i++) {
    select.options[i].disabled = false;
  }
}

function limitGuests(rooms, guests) {
  resetSelectField(guests);
  if (rooms.value === '1') {
    guests.querySelector('option[value="2"]').disabled = true;
    guests.querySelector('option[value="0"]').disabled = true;
  } else if (rooms.value === '2') {
    guests.querySelector('option[value="0"]').disabled = true;
  }
}

function limitRooms(rooms, guests) {
  resetSelectField(rooms);
  if (guests.value === '2') {
    rooms.querySelector('option[value="1"]').disabled = true;
  }
}

addDisabledAttr(adFormFields);
addDisabledAttr(filterFormFields);
addressField.value = calculateMainPinCenter(mainPin);

mainPin.addEventListener('mousedown', function onMainPinMouseDown(evt) {
  if (evt.button === LEFT_MOUSE_BUTTON) {
    activatePage();
    addressField.value = changeAddress(mainPin);
    mainPin.removeEventListener('mousedown', onMainPinMouseDown);
  }
});
mainPin.addEventListener('keydown', function onMainPinKeyDown(evt) {
  if (evt.keyCode === ENTER_KEY) {
    activatePage();
    addressField.value = changeAddress(mainPin);
    mainPin.removeEventListener('keydown', onMainPinKeyDown);
  }
});

roomsField.addEventListener('change', function onRoomsFieldChange() {
  limitGuests(roomsField, guestsField);
});

guestsField.addEventListener('change', function onGuestsFieldChange() {
  limitRooms(roomsField, guestsField);
});
