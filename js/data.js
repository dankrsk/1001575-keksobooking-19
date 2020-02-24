'use strict';

(function () {
  var MIN_HEIGHT = 130;
  var MAX_HEIGHT = 630;
  var MAX_PRICE = 100;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 6;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 10;
  var MIN_TIME = 12;
  var MAX_TIME = 12;

  function createSimilarAds(widthOfBlock) {
    var ads = [{}];
    var locationX;
    var locationY;

    for (var i = 0; i < 8; i++) {
      locationX = window.utils.randomInteger(0, widthOfBlock);
      locationY = window.utils.randomInteger(MIN_HEIGHT, MAX_HEIGHT);

      ads[i] = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },

        offer: {
          title: 'Хорошее предложение!',
          address: locationX + ', ' + locationY,
          price: window.utils.randomInteger(0, MAX_PRICE),
          type: window.utils.randomOfferType(),
          rooms: window.utils.randomInteger(MIN_ROOMS, MAX_ROOMS),
          guests: window.utils.randomInteger(MIN_GUESTS, MAX_GUESTS),
          checkin: window.utils.randomInteger(MIN_TIME, MAX_TIME) + ':00',
          checkout: window.utils.randomInteger(MIN_TIME, MAX_TIME) + ':00',
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

  window.data = {
    createSimilarAds: createSimilarAds
  };
})();
