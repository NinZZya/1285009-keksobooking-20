'use strict';
(function () {
  var Util = window.Util;
  var CoordsUtil = window.CoordsUtil;
  var ORDERS_COUNT = 8;

  // Массив объявлений
  var orders = window.generateOrders(ORDERS_COUNT);
  // Модель с объявлениями
  var ordersModel = new window.OrdersModel();
  // Карта страницы
  var mainMapComponent = new window.MainMapComponent();
  // Контейнер с пинами
  var mapPinsComponent = new window.MapPinsComponent(mainMapComponent.getElement());
  // Форма для размещения объявления
  var adFormConponent = new window.AdFormComponent();
  // Контроллер контейнера с пинами
  var mapPinsController = new window.MapPinsController(mapPinsComponent, ordersModel);
  // Контроллер формы
  var adFormController = new window.AdFormController(adFormConponent);
  // Координаты главного пина
  var coordsMainPin = null;
  // Координаты события
  var coordsEvt = CoordsUtil.create();
  // Сдвиг координат главного пина
  var coordsShift = CoordsUtil.create();

  /**
   * @description Устанавливает значение пина по умолчанию в поле адресс формы
   */

  function setDefaultCoordsToForm() {
    // Получить координаты главного пина утсановленные по умолчанию
    coordsMainPin = mapPinsController.getMainPinDefaultCoords();
    // Установить адрес на форму объявлений
    adFormController.setAddress(coordsMainPin);
  }

  /**
   * @description Активация карты
   */

  function activateMap() {
    // Если карта не активирована, активировать
    if (!mainMapComponent.isActivate()) {
      // Получить координаты главного пина
      coordsMainPin = mapPinsController.getMainPinCoords();
      // Установить адресс в форму
      adFormController.setAddress(coordsMainPin);
      // Переключить состояние карты на активное
      mainMapComponent.toggleState();
      // Переключить форму в активное состояние
      adFormConponent.toggleState();
      // Запустить валидацию формы
      adFormController.runValidity();
      // Положить данные в модель данных
      ordersModel.setOrders(orders);
      // Отрисовать пины на карте
      mapPinsController.renderPins();
      // Установить контейнер, куда отрисовывать карточку
      mapPinsController.setCardContainer(mainMapComponent.getElement());
      // Установить место, куда отрисовывать карточку
      mapPinsController.setCardPlace(mainMapComponent.getMapFilterContainer());
      // Установить callbak для обработчика события кнопки reset
      adFormConponent.adFormResetHandler = deactivateMap;
      // Запустить обработчики события кнопки reset
      adFormConponent.addAdFormResetListener();
    }
  }

  /**
   * @param {Object} evt Событие
   * @description Деактивация карты
   */

  function deactivateMap(evt) {
    evt.preventDefault();
    // Переключить состояние карты на неактивное
    mainMapComponent.toggleState();
    // Установить значение пина по умолчанию в поле адресс формы
    setDefaultCoordsToForm();
    // Деактивировать контроллер контейнера с пинами (сброс настроек компонента по умолчанию)
    mapPinsController.deactivate();
    // Деактивировать контроллер контейнера с пинами (сброс настроек компонента по умолчанию)
    adFormController.deactivate();
  }

  function mapPinsMouseDownHandler(evt) {
    activateMap();
    // Зафиксировать текущие координаты главного пина
    coordsEvt.x = evt.clientX;
    coordsEvt.y = evt.clientY;
    // Активировать обработчик события на перемещение мыши у главного пина
    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    // Активировать обработчик события на отпускание клавиши мыши у главного пина
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  }

  function mainPinMouseMoveHandler(evt) {
    evt.preventDefault();
    // Расчитать смещение главного пина
    coordsShift.x = coordsEvt.x - evt.clientX;
    coordsShift.y = coordsEvt.y - evt.clientY;
    // Зафиксировать текущие координаты главного пина
    coordsEvt.x = evt.clientX;
    coordsEvt.y = evt.clientY;
    // Вычислить координаты главного пина в допустимых пределах карты
    coordsMainPin.x = CoordsUtil.setX(mapPinsComponent.getMainPin().offsetLeft - coordsShift.x);
    coordsMainPin.y = CoordsUtil.setY(mapPinsComponent.getMainPin().offsetTop - coordsShift.y);
    // Установить координаты главного пина в допустимых пределах карты
    mapPinsComponent.getMainPin().style.left = coordsMainPin.x + 'px';
    mapPinsComponent.getMainPin().style.top = coordsMainPin.y + 'px';
    // Сконвертировать координаты в адресс
    coordsMainPin = CoordsUtil.convertToLocation(coordsMainPin);
    // Установить адресс в форму
    adFormController.setAddress(coordsMainPin);
  }

  function mainPinMouseUpHandler(evt) {
    evt.preventDefault();
    document.removeEventListener('mousemove', mainPinMouseMoveHandler);
    document.removeEventListener('mouseup', mainPinMouseUpHandler);
  }

  // Активировать контроллер контейнера с пинами (сброс настроек компонента по умолчанию)
  mapPinsController.activate();
  // Активировать контроллер формы объявлений
  adFormController.activate();
  // Установить значение пина по умолчанию в поле адресс формы
  setDefaultCoordsToForm();

  // Установить обработчик клика мыши у главного пина
  mapPinsComponent.getMainPin().addEventListener('mousedown', function (evt) {
    if (Util.isLeftMouseButtonPressed(evt)) {
      evt.preventDefault();
      mapPinsMouseDownHandler(evt);
    }
  });

  // Установить обработчик клика клавиши у главного пина
  mapPinsComponent.getMainPin().addEventListener('keydown', function (evt) {
    if (Util.isEnterPressed(evt)) {
      evt.preventDefault();
      activateMap();
    }
  });
})();
