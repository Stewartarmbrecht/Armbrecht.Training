/// <reference path="../../../Scripts/_reference.js" />
/// <reference path="../../testHelper.js" />
define(['features/testHelper'], function (testHelper) {
    var _this = {};
    _this["the client adds a new location to the practice"] = function (context, promise) {
        context.locationManager.fetchMetadata()
            .then(function () {
                context.location = context.locationManager.createEntity('Location', {
                    name: 'My Building',
                    city: 'Chicago',
                    state: 'AL',
                    phoneNumber: '555-345-0980'
                });
                context.locationManager.saveChanges()
                    .then(function () {
                        promise.resolve();
                    })
                    .fail(function (error) {
                        context.error = error;
                        promise.reject();
                    });
            })
            .fail(function (error) {
                context.error = error;
                promise.reject();
            });
    };
    _this["the client is connected as a user who can manage locations"] = function (context, promise) {
        testHelper.logIn(context, 'renaissance.admin@leonardomd.com', 'test', 'Password1!').then(function () {
            breeze.NamingConvention.camelCase.setAsDefault();
            context.locationManager = new breeze.EntityManager("/LeonardoMD.Api/Locations");
            promise.resolve();
        });
    };
    _this["the client should be able to get the new location from the API"] = function (context, promise) {
        var op = breeze.FilterQueryOp;
        var query = breeze.EntityQuery.from('Locations').where('id', op.Equals, context.location.id())
        context.locationManager.executeQuery(query).then(function (data) {
            expect(data.results.length).toBe(1);
            expect(data.results[0].name()).toBe('My Building');
            promise.resolve();
        }).fail(function (error) {
            context.error = error;
            promise.reject();
        });
    };
    return _this;
});
