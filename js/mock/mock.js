'use strict';
(function () {
  var MIN_FEATURES = 2;
  var AVATARS_COUNT = 8;
  var avatarIndex = 0;

  var avatars = generateAvatars();

  var timePeriods = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var price = {
    min: 1000,
    max: 1000000,
  };

  var rooms = {
    min: 1,
    max: 10,
  };

  var guests = {
    min: 1,
    max: 10,
  };

  var bookingTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
  };

  var descriptions = [
    'Великолепный вариан в центре Токио. Подходит как туристам, так и бизнесменам. Дом полностью укомплектован и имеет свежий ремонт.',
    'Без интернета, регистрации и СМС. Расположена на краю парка',
    'Уютное гнездышко для молодоженов',
    'Подходит для всех кто любит тишину.',
    'Находится в старинном центре города. Только для тех кто может себе позволить роскошь. Лакеев и прочих жокеев просим не беспокоить.',
    'Минимализм во всем. Для самых не требовательных.',
    'У нас тут все ништяк. Ларек за углом. Шава 24 часа. Приезжайте! Интернетов нет!',
    'Тут красиво, светло и уютно. Кофе и печеньки бесплатно.',
    'Квартира на первом этаже. Соседи тихие. Для всех, кто терпеть не может шума и суеты.',
  ];

  var photos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  ];

  var titles = [
    'object находится недалеко от метро',
    'object с самым красивым видом на центр года',
    'object для требовательных и богатых',
    'object для командировок',
    'object для одиноких путешественников',
    'object для компании друзей',
    'object для влюбленной пары',
  ];


  /**
   *
   * @param {string} type Тип объекта бронирования
   * @return {string} Заголовок объекта бронирования
   */

  function generateTitle(type) {
    var REPLACE = 'object';

    return window.Utils.getRandomArrValue(titles).replace(REPLACE, type);
  }

  /**
   *
   * @param {number} count Колочество аватаров для генерации
   * @return {string[]} Массив аваторов, строка типа img/avatars/user01.png'
   */

  function generateAvatars() {
    var genAvatars = new Array(AVATARS_COUNT).fill('').map(function (genAvatar, index) {
      return 'img/avatars/user0' + genAvatar + (++index) + '.png';
    });
    return window.Utils.getRandomArr(genAvatars);
  }

  function getAvatar() {
    avatarIndex = avatarIndex < avatars.length - 1 ? avatarIndex + 1 : 0;
    return avatars[avatarIndex];
  }

  /**
   * @return {Object}
   */

  function generateOrder() {
    var locationX = window.Utils.setCoordX(window.Utils.getRandomInt(window.inf.mapMinX, window.inf.mapMaxX));
    var locationY = window.Utils.setCoordY(window.Utils.getRandomInt(window.inf.mapMinY, window.inf.mapMaxY));
    var offerType = window.Utils.getRandomArrValue(Object.keys(bookingTypes));

    return (
      {
        'author': {
          'avatar': getAvatar()
        },
        'offer': {
          'title': generateTitle(bookingTypes[offerType]),
          'address': locationX + ', ' + locationY,
          'price': window.Utils.getRandomInt(price.min, price.max),
          'type': offerType,
          'rooms': window.Utils.getRandomInt(rooms.min, rooms.max),
          'guests': window.Utils.getRandomInt(guests.min, guests.max),
          'checkin': window.Utils.getRandomArrValue(timePeriods),
          'checkout': window.Utils.getRandomArrValue(timePeriods),
          'features': window.Utils.getRandomArr(features, window.Utils.getRandomInt(MIN_FEATURES, features.length)),
          'description': window.Utils.getRandomArrValue(descriptions),
          'photos': window.Utils.getRandomArr(photos)
        },
        'location': {
          'x': locationX,
          'y': locationY
        }
      }
    );
  }

  /**
   * @param {number} count Количество карточек букинга
   * @return {Object[]} Массив карточек букинга
   */

  function generateOrders(count) {
    return new Array(count).fill('').map(generateOrder);
  }

  window.generateOrders = generateOrders;
})();
