'use strict';

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
  var similarAds = [{}];

  for (var i = 0; i < 8; i++) {
    var locationX = randomInteger(0, widthOfBlock);
    var locationY = randomInteger(130, 630);

    similarAds[i] = {
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

  return similarAds;
}

function createPins(ads) {
  var pins = [];
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var pinStyles = {
    width: 50,
    height: 70
  };

  for (var i = 0; i < ads.length; i++) {
    pins[i] = pinTemplate.cloneNode(true);
    var pinImg = pins[i].querySelector('img');
    pins[i].style.left = ads[i].location.x - pinStyles.width / 2 + 'px';
    pins[i].style.top = ads[i].location.y - pinStyles.height + 'px';
    pinImg.src = ads[i].author.avatar;
    pinImg.alt = ads[i].offer.title;
  }

  return pins;
}

function renderPins(pins) {
  var pinsContainer = document.querySelector('.map__pins');
  var tempFragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    tempFragment.appendChild(pins[i]);
  }

  pinsContainer.appendChild(tempFragment);
}

var mapSection = document.querySelector('.map');
var similarAds = createSimilarAds(mapSection.offsetWidth);
var mapPins = createPins(similarAds);

mapSection.classList.remove('map--faded');
renderPins(mapPins);
