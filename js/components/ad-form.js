'use strict';
(function () {
  var AdFormClass = {
    AD_FORM: '.ad-form',
    TOGGLE_CLASS: 'ad-form--disabled',
    AD_TITLE: '#title',
    AD_AFATAR: '#avatar',
    AD_ADDRESS: '#address',
    AD_ROOM: '#room_number',
    AD_GUEST: '#capacity',
    AD_IMAGE: '#images',
    AD_PRICE: '#price',
    AD_TYPE: '#type',
    AD_CHECK_IN: '#timein',
    AD_CHECK_OUT: '#timeout',
    FIELDSET: 'fieldset',
  };

  function AdForm() {
    window.AbsctractElement.call(this);
    this._SELECTOR = AdFormClass.AD_FORM;
    this._TOGGLE_CLASS = AdFormClass.TOGGLE_CLASS;
    this._$adTitle = null;
    this._$adAvatar = null;
    this._$adAddress = null;
    this._$adRoom = null;
    this._$adGuest = null;
    this._$adImage = null;
    this._$adPrice = null;
    this._$adType = null;
    this._$adCheckIn = null;
    this._$adCheckOut = null;
    this._$fieldsets = null;
  }

  AdForm.prototype = Object.create(window.AbsctractElement.prototype);
  AdForm.prototype.constructor = AdForm;

  AdForm.prototype.getAdTitle = function () {
    return this.getCustomElement(this._$adTitle, AdFormClass.AD_TITLE, this.getElement());
  };

  AdForm.prototype.getAdAvatar = function () {
    return this.getCustomElement(this._$adAvatar, AdFormClass.AD_AFATAR, this.getElement());
  };

  AdForm.prototype.getAdAddress = function () {
    return this.getCustomElement(this._$adAddress, AdFormClass.AD_ADDRESS, this.getElement());
  };

  AdForm.prototype.getAdRooms = function () {
    return this.getCustomElement(this._$adRoom, AdFormClass.AD_ROOM, this.getElement());
  };

  AdForm.prototype.getAdGuests = function () {
    return this.getCustomElement(this._$adGuest, AdFormClass.AD_GUEST, this.getElement());
  };

  AdForm.prototype.getAdImages = function () {
    return this.getCustomElement(this._$adImage, AdFormClass.AD_IMAGE, this.getElement());
  };

  AdForm.prototype.getAdPrice = function () {
    return this.getCustomElement(this._$adPrice, AdFormClass.AD_PRICE, this.getElement());
  };

  AdForm.prototype.getAdType = function () {
    return this.getCustomElement(this._$adType, AdFormClass.AD_TYPE, this.getElement());
  };

  AdForm.prototype.getAdCheckIn = function () {
    return this.getCustomElement(this._$adCheckIn, AdFormClass.AD_CHECK_IN, this.getElement());
  };

  AdForm.prototype.getAdCheckOut = function () {
    return this.getCustomElement(this._$adCheckOut, AdFormClass.AD_CHECK_OUT, this.getElement());
  };

  AdForm.prototype._getFieldsets = function () {
    return this.getCustomElements(this._$fieldsets, AdFormClass.FIELDSET, this.getElement());
  };

  AdForm.prototype.toggleStateFieldsets = function () {
    this._getFieldsets().forEach(function ($fieldset) {
      $fieldset.disabled = !$fieldset.disabled;
    });
  };

  AdForm.prototype.toggleStateCallback = function () {
    this.toggleStateFieldsets();
  };

  AdForm.prototype.isActivateFieldsets = function () {
    return !this._getFieldsets()[0].disabled;
  };

  AdForm.prototype.setAddress = function (coords) {
    coords = window.coords.convertToLocation(coords);
    this.getAdAddress().value = coords.x + ', ' + coords.y;
  };

  AdForm.prototype.setOnChangeAdRooms = function (onChangeAdRooms) {
    this.getAdRooms().addEventListener('change', onChangeAdRooms);
  };

  AdForm.prototype.setOnChangeAdType = function (onChangeAdType) {
    this.getAdType().addEventListener('change', onChangeAdType);
  };

  AdForm.prototype.setOnChangeAdCheckIn = function (onChangeAdCheckIn) {
    this.getAdCheckIn().addEventListener('change', onChangeAdCheckIn);
  };

  AdForm.prototype.setOnChangeAdCheckOut = function (onChangeAdCheckOut) {
    this.getAdCheckOut().addEventListener('change', onChangeAdCheckOut);
  };

  AdForm.prototype.setOnSubmitAdForm = function (onSubmitAdForm) {
    this.getElement().addEventListener('submit', onSubmitAdForm);
  };

  window.AdForm = AdForm;
})();
