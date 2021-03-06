﻿define(['Features/testHelper'], function (testHelper) {
    var _this = {};
    _this['the client can access a secure resource'] = function (context, promise) {
		promise.reject();
    };
    _this['the client can not access a secure resource'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is authenticated'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is not authenticated'] = function (context, promise) {
		promise.reject();
    };
    _this['the client logs in with invalid email by saving a new user session'] = function (context, promise) {
		promise.reject();
    };
    _this['the client logs in with invalid password by saving a new user session'] = function (context, promise) {
		promise.reject();
    };
    _this['the client logs in with valid credentials by saving a new user session'] = function (context, promise) {
		promise.reject();
    };
    _this['the client logs off'] = function (context, promise) {
		promise.reject();
    };
    _this['the client should not be authenticated'] = function (context, promise) {
		promise.reject();
    };
    _this['the client user session should have a valid id'] = function (context, promise) {
		promise.reject();
    };
    return _this;
});
