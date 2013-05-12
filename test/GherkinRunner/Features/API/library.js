/// <reference path="../../Scripts/jquery-2.0.0.js" />
/// <reference path="../../Scripts/jquery-2.0.0.intellisense.js" />
/// <reference path="../../Scripts/breeze.debug.js" />
/// <reference path="../../Scripts/breeze.intellisense.js" />
define(['features/testHelper', 'moment'], function (testHelper, moment) {
    var _this = {};
    _this.moment = moment;
    _this[/the client is connected as ".*"/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var login = {};
        if (inlineArgs[0] === "Administrator")
            login = {
                "Email": "renaissance.admin@leonardomd.com",
                "OrgLoginName": "test",
                "OrgPassword": "Password1!",
                "Password": "Password1!",
            };
        else {
            login = {
                "Email": inlineArgs[0] + "@leonardomd.com",
                "OrgLoginName": "test",
                "OrgPassword": "Password1!",
                "Password": "Password1!",
            };
        }
        testHelper.logIn(login, promise);
    };
    _this["the client is logged off"] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        testHelper.logOff(promise);
    };
    _this[/the practice has the following staff members/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        $.each(tableArg, function (index, args) {
            var name = args.UserName;
            testHelper.createOrUpdateUser(context, promise, name)
                .then(function () {
                    var userId = state[name + "_User"].id();
                    testHelper.createOrUpdatePerson(context, promise, name, userId)
                        .then(function () {
                            var personId = state[name + "_Person"].id();
                            state.providerId = personId;
                            var provider = true;
                            testHelper.createOrUpdateStaffMember(context, promise, name, personId, args.Provider == 1)
                                .then(function () {
                                    testHelper.createOrUpdateRequestor(context, promise, name, userId)
                                        .then(function () {
                                            promise.resolve();
                                        });
                                });
                        });
                });
        });

    };
    _this[/the staff members have the following permissions/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        $.each(tableArg, function (index, args) {
            testHelper.createOrUpdateTopicPermissionRequestor(context, promise, args)
                .then(function () {
                    promise.resolve();
                });
        });
    };
    _this[/the following staff members are linked to the provider named ".*"/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        $.each(tableArg, function (index, args) {
            testHelper.createOrUpdateProviderStaffMember(context, promise, inlineArgs[0], args.UserName)
                .then(function () {
                    promise.resolve();
                });
        });
    };
    _this[/the provider named ".*" has a patient named ".*"/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var patientName = inlineArgs[1];
        var providerName = inlineArgs[0];
        testHelper.createOrUpdatePerson(context, promise, patientName, null)
            .then(function () {
                var personId = state[patientName + "_Person"].id();
                var providerId = state[providerName + "_Person"].id();
                testHelper.createOrUpdatePatient(context, promise, patientName, personId, providerId)
                    .then(function () {
                        promise.resolve();
                    });
            });
    };
    _this[/the patient named ".*" has an order called ".*"/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var patientName = inlineArgs[0];
        var patientPersonId = state[patientName + "_Person"].id();
        var orderName = inlineArgs[1];
        testHelper.createOrUpdateOrder(context, promise, patientPersonId, orderName)
            .then(function () {
                promise.resolve();
            });
    };
    _this[/the patient named ".*" has an appointment called ".*"/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var patientName = inlineArgs[0];
        var patientPersonId = state[patientName + "_Person"].id();
        var apptSubject = inlineArgs[1];
        testHelper.createOrUpdateAppointment(context, promise, patientPersonId, apptSubject)
            .then(function () {
                promise.resolve();
            });
    };
    _this[/the queried ".*" properties should match the added ".*" properties for the following properties/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var props = tableArg[0].Properties.split(',');
        for (var property in property) {
            expect(state.added[addedProperty.trim()]()).toEqual(state.queried[addedProperty.trim()]());
        }
        promise.resolve();
    };
    _this[/the queried ".*" properties should match the updated ".*" properties for the following properties/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var props = tableArg[0].Properties.split(',');
        for (var property in property) {
            expect(state.updated[addedProperty.trim()]()).toEqual(state.queried[addedProperty.trim()]());
        }
        promise.resolve();
    };
    _this['the created information should be set'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        expect(state.queried.createDate()).toBeDefined();
        expect(state.queried.createUserId()).toBeDefined();
        expect(state.queried.createDate()).not.toBeNull();
        expect(state.queried.createUserId()).not.toBeNull();
        if(state.createOrModifyDate)
            expect(_this.moment(state.queried.createDate())).toBeGreaterThan(_this.moment(state.createOrModifyDate));
        promise.resolve();
    };
    _this['the modified information should be set'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        expect(state.queried.modifyDate()).toBeDefined();
        expect(state.queried.modifyUserId()).toBeDefined();
        expect(state.queried.modifyDate()).not.toBeNull();
        expect(state.queried.modifyUserId()).not.toBeNull();
        if (state.createOrModifyDate)
            expect(_this.moment(state.queried.modifyDate())).toBeGreaterThan(_this.moment(state.createOrModifyDate));
        promise.resolve();
    };
    _this[/the client should receive a response with a status of "*"/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        expect(state.error.status.toString()).toBe(inlineArgs[0]);
        promise.resolve();
    };
    _this[/the response message should be ".*"/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        expect(state.error.responseText).toBe(inlineArgs[0]);
        promise.resolve();
    };
    _this[/the client should receive validation error with a message of ".*"/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var actual = state.error.entitiesWithErrors[0].entityAspect._validationErrors[exampleArg.PropertyName + ":" + exampleArg.ErrorKey].errorMessage;
        var expected = inlineArgs[0].replace('<PropertyName>', exampleArg.PropertyName);
        if (exampleArg.CharacterCount)
            var expected = expected.replace('<CharacterCount>', (exampleArg.CharacterCount-1).toString());
        expect(expected).toBe(actual);
        promise.resolve();
    };
    return _this;
});
