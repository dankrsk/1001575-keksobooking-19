'use strict';

(function () {
  var mainPin = window.map.mainPin;
  var setAddress = window.form.setAddress;
  var calculateAddress = window.pin.calculateAddress;
  var getYOffsetCoord = window.pin.getYOffsetCoord;
  var getXOffsetCoord = window.pin.getXOffsetCoord;

  var limits = {
    top: getYOffsetCoord(130),
    right: getXOffsetCoord(mainPin.offsetParent.offsetWidth),
    bottom: getYOffsetCoord(630),
    left: getXOffsetCoord(0)
  };

  function onMainPinMouseDown(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMainPinMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.x,
        y: startCoords.y - moveEvt.y
      };

      var topOffsetInPx = mainPin.offsetTop - shift.y;
      var leftOffsetInPx = mainPin.offsetLeft - shift.x;

      if (topOffsetInPx > limits.bottom) {
        topOffsetInPx = limits.bottom;
      } else if (topOffsetInPx < limits.top) {
        topOffsetInPx = limits.top;
      }

      if (leftOffsetInPx < limits.left) {
        leftOffsetInPx = limits.left;
      } else if (leftOffsetInPx > limits.right) {
        leftOffsetInPx = limits.right;
      }

      mainPin.style.top = topOffsetInPx + 'px';
      mainPin.style.left = leftOffsetInPx + 'px';

      setAddress(calculateAddress(mainPin));

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
    }

    function onMainPinMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    }

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  }

  mainPin.addEventListener('mousedown', onMainPinMouseDown);
})();
