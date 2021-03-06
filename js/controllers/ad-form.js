'use strict';
(function () {
  var Constant = window.Constant;
  var util = window.util;

  // Индекс значения по умолчанию
  var DefaultIndex = {
    ROOMS: 0,
    TYPE: 1,
    CHECK_IN: 0,
  };

  var NOT_GUESTS = 0;
  var MAX_ROOMS_COUNT = 100;
  var INVALID_STYLE = 'border: 2px solid #ff0000;';
  var PREVIEW_SELECTOR = 'img';
  var AD_GUESTS_ITEM_SELECTOR = 'option';
  var AD_AVATAR_SELECTOR = 'img';

  function AdFormController(adFormComponent) {
    this._adFormComponent = adFormComponent;
    this._adRoomsChangeHandler = this._adRoomsChangeHandler.bind(this);
    this._adTypeChangeHandler = this._adTypeChangeHandler.bind(this);
    this._adCheckInChangeHandler = this._adCheckInChangeHandler.bind(this);
    this._adCheckOutChangeHandler = this._adCheckOutChangeHandler.bind(this);
    this._adAvatarChangeHandler = this._adAvatarChangeHandler.bind(this);
    this._addAdImagesChangeHandler = this._addAdImagesChangeHandler.bind(this);
  }

  /**
   * @description Активирует контроллер
   */

  AdFormController.prototype.activate = function () {
    // Синхронизировать fieldsets и form
    if (this._adFormComponent.isActivate() !== this._adFormComponent.isActivateFieldsets()) {
      this._adFormComponent.toggleStateFieldsets();
    }

    this.setDefaultAdForm();
  };

  /**
   * @description Деактивирует контроллер
   */

  AdFormController.prototype.deactivate = function () {
    // Переключить форму в неактивное состояние
    this.toggleState();
    this.setDefaultAdForm();
    this.stopValidity();
    this.stopLoadImagesListeners();
  };

  /**
   * @description Переключает состояние формы и поля
   */

  AdFormController.prototype.toggleState = function () {
    this._adFormComponent.toggleState();
    this._adFormComponent.toggleStateFieldsets();
  };

  /**
   * @description Запустить валидацию
   */

  AdFormController.prototype.runValidity = function () {
    // Установить функцию для обработчиков событий валидации
    this._setValidityHandlers();
    // Запустить обработчики событий для валидации формы
    this._adFormComponent.addAdFormValidityListeners();
  };

  /**
   * @description Остановливает валидацию формы
   */

  AdFormController.prototype.stopValidity = function () {
    this._adFormComponent.removeAdFormValidityListeners();
  };

  /**
   * @description Устанавливает адресс в поле адресса
   */

  AdFormController.prototype.setAddress = function (coords) {
    this._adFormComponent.getAdAddress().value = coords.x + ', ' + coords.y;
  };

  /**
   * @description Устанавливает значения по умолчанию
   */

  AdFormController.prototype.setDefaultAdForm = function () {
    // Значения по умолчанию
    var Default = {
      EMPTY_STRING: '',
      ROOMS: this._adFormComponent.getAdRooms()[DefaultIndex.ROOMS].value,
      TYPE: this._adFormComponent.getAdType()[DefaultIndex.TYPE].value,
      CHECK_IN: this._adFormComponent.getAdCheckIn()[DefaultIndex.CHECK_IN].value,
      DEFAULT_AVATAR: 'img/muffin-grey.svg',
    };

    function toggleDefaultFeature($feature) {
      $feature.checked = false;
    }

    this._adFormComponent.getAdAvatar().value = Default.EMPTY_STRING;
    this._adFormComponent.getAdAvatarPreview().querySelector(AD_AVATAR_SELECTOR).src = Default.DEFAULT_AVATAR;
    this._adFormComponent.getAdImages().value = Default.EMPTY_STRING;
    this._clearAdImagesContainer();
    this._resetRequiredElement(this._adFormComponent.getAdTitle());
    this._adFormComponent.getAdRooms().value = Default.ROOMS;
    this._adFormComponent.getAdGuests().value = this._getGuests(Default.ROOMS);
    this._disabledGuestsValues(Default.ROOMS);
    this._adFormComponent.getAdType().value = Default.TYPE;
    this._setMinPrice(Constant.bookingType[Default.TYPE].minPrice);
    this._resetRequiredElement(this._adFormComponent.getAdPrice());
    this._adFormComponent.getAdCheckIn().value = Default.CHECK_IN;
    this._adFormComponent.getAdCheckOut().value = this._adFormComponent.getAdCheckIn().value;
    this._adFormComponent.getAdDescription().value = Default.EMPTY_STRING;
    this._adFormComponent._getFeatures().forEach(toggleDefaultFeature);
  };

  /**
   * @description Сбрасывает значение обязательного поля. Меняет состояние required, что бы избежать ошибки в MS Eadge
   * @param {Object} $element Элемент который неоюъодимо сбросить
   * @param {*} defaultValue Значение по умолчанию, необязательный параметр
   */

  AdFormController.prototype._resetRequiredElement = function ($element, defaultValue) {
    defaultValue = defaultValue || '';
    $element.required = false;
    $element.width = $element.width;
    $element.required = true;
    $element.value = defaultValue;
    $element.style = '';
  };

  /**
   * @description Запустить обработчики событий по загрузке файлов
   */

  AdFormController.prototype.runLoadImagesListeners = function () {
    this._setLoadHandlers();
    this._adFormComponent.addAdAvatarListener();
    this._adFormComponent.addAdImagesListener();
  };

  /**
   * @description Остановливает загрузку файлов
   */

  AdFormController.prototype.stopLoadImagesListeners = function () {
    this._adFormComponent.removeAdAvatarListener();
    this._adFormComponent.removeAdImagesListener();
  };

  /**
   * @description Устанавливает callbacks для валидации
   */

  AdFormController.prototype._setValidityHandlers = function () {
    this._adFormComponent.adRoomsChangeHandler = this._adRoomsChangeHandler;
    this._adFormComponent.adTypeChangeHandler = this._adTypeChangeHandler;
    this._adFormComponent.adCheckInChangeHandler = this._adCheckInChangeHandler;
    this._adFormComponent.adCheckOutChangeHandler = this._adCheckOutChangeHandler;
    this._adFormComponent.adPriceChangeHandler = this.checkValidity;
    this._adFormComponent.adTitleChangeHandler = this.checkValidity;
  };

  /**
   * @description Валидация количества комнат
   * @param evt Событие
   */

  AdFormController.prototype._adRoomsChangeHandler = function (evt) {
    var roomsCount = parseInt(evt.target.value, 10);
    this._adFormComponent.getAdGuests().value = this._getGuests(roomsCount);
    this._disabledGuestsValues(this._adFormComponent.getAdGuests().value);
  };

  /**
   * @description Валидация цен типа жилья
   */

  AdFormController.prototype._adTypeChangeHandler = function (evt) {
    var minPrice = Constant.bookingType[evt.target.value].minPrice;
    this._setMinPrice(minPrice);
  };

  /**
   * @description Валидация времени заезада
   */

  AdFormController.prototype._adCheckInChangeHandler = function (evt) {
    this._adFormComponent.getAdCheckOut().value = evt.target.value;
  };

  /**
   * @description Валидация времени выезда
   */

  AdFormController.prototype._adCheckOutChangeHandler = function (evt) {
    this._adFormComponent.getAdCheckIn().value = evt.target.value;
  };

  /**
   * @description Если ошибка, установить стиль ошибки
   */

  AdFormController.prototype.checkValidity = function (evt) {
    evt.target.style = evt.target.validity.valid ? '' : INVALID_STYLE;
  };

  /**
   * @param {number} rooms Количество комнат
   * @return {number} Количество гостей
   */

  AdFormController.prototype._getGuests = function (rooms) {
    if (rooms === MAX_ROOMS_COUNT) {
      return NOT_GUESTS;
    }

    return rooms;
  };

  /**
   * @description Переключает элементы фильтра количества гостей: enabled || diasabled
   * @param {string} validValue
   */

  AdFormController.prototype._disabledGuestsValues = function (validValue) {
    /**
     * @description Переключает элемент фильтра: enabled || diasabled
     * @param {Object} $item Элемент филтра (option у select)
     */

    function toggleItem($item) {
      var itemValue = parseInt($item.value, 10);
      if (validValue === NOT_GUESTS) {
        $item.disabled = itemValue !== validValue;
      } else {
        $item.disabled = !((itemValue <= validValue) && (itemValue !== NOT_GUESTS));
      }
    }

    validValue = parseInt(validValue, 10);
    this._adFormComponent.getAdGuests().querySelectorAll(AD_GUESTS_ITEM_SELECTOR).forEach(toggleItem);
  };

  /**
   * @description Валидация цен типа жилья
   */

  AdFormController.prototype._setMinPrice = function (minPrice) {
    this._adFormComponent.getAdPrice().placeholder = minPrice;
    this._adFormComponent.getAdPrice().min = minPrice;
  };

  /**
   * @description Устанавливает callbacks для загрузки изображений
   */

  AdFormController.prototype._setLoadHandlers = function () {
    this._adFormComponent.adAvatarChangeHandler = this._adAvatarChangeHandler;
    this._adFormComponent.adAdImagesChangeHandler = this._addAdImagesChangeHandler;
  };

  /**
   * @description Загружает изображение для аватара
   */

  AdFormController.prototype._adAvatarChangeHandler = function () {
    var file = this._adFormComponent.getAdAvatar().files[0];
    var $previewImage = this._adFormComponent.getAdAvatarPreview().querySelector(PREVIEW_SELECTOR);
    util.loadImage(file, $previewImage);
  };

  /**
   * @description Загружает изображение для фотографии жилья
   */

  AdFormController.prototype._addAdImagesChangeHandler = function () {
    var files = this._adFormComponent.getAdImages().files;
    this._clearAdImagesContainer();
    var $previewContainer = this._adFormComponent.getAdImagesContainer();
    var $preview = this._adFormComponent.getAdImagesPreview();

    Array.from(files).forEach(function (file, index) {
      if (!$preview.querySelector(PREVIEW_SELECTOR)) {
        var $previewImage = document.createElement('img');
        util.loadImage(files[index], $previewImage);
        util.render($preview, $previewImage, Constant.RenderPosition.BEFOREEND);
      } else {
        $preview = $preview.cloneNode(true);
        $previewImage = $preview.querySelector(PREVIEW_SELECTOR);
        util.loadImage(files[index], $previewImage);
        util.render($previewContainer, $preview, Constant.RenderPosition.BEFOREEND);
      }
    });
  };

  /**
   * @description Очищает контейнер с Preview изображений
   */

  AdFormController.prototype._clearAdImagesContainer = function () {
    this._adFormComponent.getAllAdImagesPreviews().forEach(function ($adImagesPreview, index) {
      if (index === 0) {
        $adImagesPreview.innerHTML = '';
      } else {
        $adImagesPreview.parentElement.removeChild($adImagesPreview);
      }
    });
  };

  window.AdFormController = AdFormController;
})();
