define(['features/testHelper'], function (testHelper) {
    var _this = {};
    _this["the client can access a secure resource"] = function (context, promise) {
        var query = breeze.EntityQuery.from("CurrentUser")
        context.manager.executeQuery(query)
            .then(function (data) {
                expect(data.results.length).toBeGreaterThan(0);
                promise.resolve();
            })
            .fail(function (data) {
                expect(data.status).toBe(401);
                promise.resolve();
            });
    };
    _this["the client can not access a secure resource"] = function (context, promise) {
        var query = breeze.EntityQuery.from("CurrentUser")
        context.manager.executeQuery(query)
            .then(function (data) {
                promise.reject();
            })
            .fail(function (data) {
                expect(data.status).toBe(401);
                promise.resolve();
            });
    };
    _this["the client is authenticated"] = function (context, promise) {
        promise.reject();
    };
    _this["the client is not authenticated"] = function (context, promise) {
        testHelper.getManager(context, "Users");
        var query = breeze.EntityQuery.from("CurrentUserSession")
        context.manager.executeQuery(query)
            .then(function (data) {
                data.results[0].entityAspect.setDeleted();
                context.manager.saveChanges()
                    .then(function () {
                        promise.resolve();
                    })
                    .fail(function () {
                        promise.reject();
                    });
            })
            .fail(function (data) {
                expect(data.status).toBe(401);
                promise.resolve();
            });
    };
    _this["the client logs in with invalid email by saving a new user session"] = function (context, promise) {
        context.userSession = context.manager.createEntity('UserSession', {
            email: 'allWrong@leonardomd.com',
            orgLoginName: 'test',
            password: 'Password1!'
        });
        context.manager.saveChanges()
            .then(function () {
                promise.resolve();
            })
            .fail(function (data) {
                context.response = data;
                promise.resolve();
            });
    };
    _this["the client logs in with invalid password by saving a new user session"] = function (context, promise) {
        context.userSession = context.manager.createEntity('UserSession', {
            email: 'renaissance.admin@leonardomd.com',
            orgLoginName: 'test',
            password: 'Password1!Wrong'
        });
        context.manager.saveChanges()
            .then(function () {
                promise.resolve();
            })
            .fail(function (data) {
                context.response = data;
                promise.resolve();
            });
    };
    _this["the client logs in with valid credentials by saving a new user session"] = function (context, promise) {
        context.userSession = context.manager.createEntity('UserSession', {
            email: 'renaissance.admin@leonardomd.com',
            orgLoginName: 'test',
            password: 'Password1!'
        });
        context.manager.saveChanges()
            .then(function () {
                promise.resolve();
            })
            .fail(function () {
                expect(false).toBe(true);
                promise.resolve();
            });
    };
    _this["the client logs off"] = function (context) {
        promise.reject();
    };
    _this["the client should not be authenticated"] = function (context, promise) {
        expect(context.response.status).toBe(401);
        promise.resolve();
    };
    _this["the client user session should have a valid id"] = function (context, promise) {
        expect(context.userSession.id()).toBeGreaterThan(0);
        promise.resolve();
    };
    return _this;
});
