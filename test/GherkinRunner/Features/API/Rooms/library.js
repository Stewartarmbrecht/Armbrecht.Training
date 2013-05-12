/// <reference path="../../../Scripts/_reference.js" />
/// <reference path="../../testHelper.js" />
define(['features/testHelper'], function (testHelper) {
    var _this = {};
    _this["the client is connected as a user who can manage rooms"] = function (context, promise) {
        testHelper.logIn(context, 'renaissance.admin@leonardomd.com', 'test', 'Password1!').then(function () {
            testHelper.getManager(context, 'Rooms');
            promise.resolve();
        });
    };
    _this["the client adds a new room to the practice"] = function (context, promise) {
        context.manager.fetchMetadata()
            .then(function () {
                context.note = context.manager.createEntity('Room', {
                    name: 'Room A',
                    description: 'This room has all the standard equipment.',
                });
                context.manager.saveChanges()
                    .then(function () {
                        promise.resolve();
                    })
                    .fail(function (error) {
                        context.aborted = true;
                        expect(error.message).toBe(false);
                        promise.resolve();
                    });
            })
            .fail(function (error) {
                context.aborted = true;
                expect(error.message).toBe(false);
                promise.resolve();
            });
    };
    _this["the client updates a room"] = function (context, promise) {
        promise.reject();
    };
    _this["the client should be able to get the new room from the API"] = function (context, promise) {
        promise.reject();
    };
    _this["the client should be able to get the updated room from the API"] = function (context, promise) {
        promise.reject();
    };
    return _this;
});
