'use strict';
(function () {
  function createPin(data) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var pin = template.cloneNode(true);
    pin.style.left = data.location.x + 'px';
    pin.style.top = data.location.y + 'px';
    pin.querySelector('img').alt = data.offer.title;
    pin.querySelector('img').src = data.author.avatar;
    pin.tabindex = '0';
    return pin;
  }

  window.createPin = createPin;
})();