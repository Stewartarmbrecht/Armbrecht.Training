/// <reference path="../Scripts/breeze.debug.js" />
/// <reference path="../Scripts/breeze.intellisense.js" />
define(function () {
    var _this = {};
    breeze.NamingConvention.camelCase.setAsDefault();
    _this.apiUrl = '/LeonardoMD.API';
    _this.topicsDataManager = new breeze.EntityManager(_this.apiUrl + "/TopicsData");
    _this.logIn = function (login, promise) {
        $.post(_this.apiUrl + '/Logins', login).then(function () {
            promise.resolve();
        }, function (error) {
            promise.reject(error);
        });
    };
    _this.logOff = function (promise) {
        $.ajax({ url: _this.apiUrl + '/Logins', type: 'DELETE' }).then(
        function () {
            promise.resolve();
        }, function (error) {
            promise.reject(error);
        });
    };
    _this.createOrUpdateUser = function (context, promise, name) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/SecurityAdmin");
        var op = breeze.FilterQueryOp;
        var providerQuery = breeze.EntityQuery
            .from("Users")
            .where("email", op.Equals, name + '@leonardoMD.com')
            .take(1);
        manager.executeQuery(providerQuery)
            .then(function (data) {
                if (data.results.length === 0) {
                    context.state[name + "_User"] = manager.createEntity('User', {
                        email: name + '@leonardoMD.com',
                        firstName: name,
                        lastName: name
                    });
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                } else {
                    var user = data.results[0];
                    context.state[name + "_User"] = user;
                    user.email(name + '@leonardoMD.com');
                    user.firstName(name);
                    user.lastName(name);
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                }
            })
            .fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.createOrUpdatePerson = function (context, promise, name, userId) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/PeopleOrg");
        var op = breeze.FilterQueryOp;
        var providerQuery = breeze.EntityQuery
            .from("People")
            .where("lastName", op.Equals, name)
            .take(1);
        manager.executeQuery(providerQuery)
            .then(function (data) {
                if (data.results.length === 0) {
                    context.state[name + "_Person"] = manager.createEntity('Person', {
                        userId: userId,
                        firstName: name,
                        lastName: name
                    });
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                } else {
                    var person = data.results[0];
                    context.state[name + "_Person"] = person;
                    person.userId(userId);
                    person.firstName(name);
                    person.lastName(name);
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                }
            })
            .fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.createOrUpdateStaffMember = function (context, promise, name, personId, provider) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/PeopleOrg");
        var op = breeze.FilterQueryOp;
        var providerQuery = breeze.EntityQuery
            .from("StaffMembers")
            .where("personId", op.Equals, personId)
            .take(1);
        manager.executeQuery(providerQuery)
            .then(function (data) {
                if (data.results.length === 0) {
                    context.state[name + "_StaffMember"] = manager.createEntity('StaffMember', {
                        personId: personId,
                        inactive: false,
                        provider: provider
                    });
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                } else {
                    var staffMember = data.results[0];
                    context.state[name + "_StaffMember"] = staffMember;
                    staffMember.personId(personId);
                    staffMember.inactive(false);
                    staffMember.provider(provider);
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                }
            })
            .fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.createOrUpdateRequestor = function (context, promise, name, userId) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/SecurityOrg");
        var op = breeze.FilterQueryOp;
        var providerQuery = breeze.EntityQuery
            .from("Requestors")
            .where("userId", op.Equals, userId)
            .take(1);
        manager.executeQuery(providerQuery)
            .then(function (data) {
                if (data.results.length === 0) {
                    context.state[name + "_Requestor"] = manager.createEntity('Requestor', {
                        userId: userId
                    });
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                } else {
                    var requestor = data.results[0];
                    context.state[name + "_Requestor"] = requestor;
                    dfd.resolve();
                }
            })
            .fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.createOrUpdateTopicPermissionRequestor = function (context, promise, args) {
        var dfd = $.Deferred();
        _this.getTopicPermissionTypeId(context, promise, args.Permission, args.Level)
            .then(function (topicId, topicPermissionTypeId) {
                var topicPermissionTypeId = topicPermissionTypeId;
                var manager = new breeze.EntityManager(_this.apiUrl + "/SecurityOrg");
                var requestorId = context.state[args.UserName + "_Requestor"].id();
                var op = breeze.FilterQueryOp;
                var p1 = new breeze.Predicate("requestorId", op.Equals, requestorId);
                var p2 = new breeze.Predicate("topicId", op.Equals, topicId);
                var pred = breeze.Predicate.and([p1, p2]);
                var providerQuery = breeze.EntityQuery
                    .from("TopicPermissionRequestors")
                    .where(pred)
                    .take(1);
                manager.executeQuery(providerQuery)
                    .then(function (data) {
                        if (data.results.length === 0) {
                            var permission = manager.createEntity('TopicPermissionRequestor', {
                                requestorId: requestorId,
                                topicId: topicId,
                                topicPermissionTypeId: topicPermissionTypeId
                            });
                            manager.saveChanges()
                                .then(function () {
                                    dfd.resolve();
                                })
                                .fail(function (error) { _this.handleError(context, promise, error); });
                        } else {
                            var permission = data.results[0];
                            permission.topicPermissionTypeId = topicPermissionTypeId
                            manager.saveChanges()
                                .then(function () {
                                    dfd.resolve();
                                })
                                .fail(function (error) { _this.handleError(context, promise, error); });
                        }
                    })
                    .fail(function (error) { _this.handleError(context, promise, error); });
            });
        return dfd.promise();
    };
    _this.gotTopics = false;
    _this.getTopics = function (context, promise) {
        var dfd = $.Deferred();
        if (_this.gotTopics)
            dfd.resolve();
        else {
            var query = breeze.EntityQuery.from("Topics");
            _this.topicsDataManager.executeQuery(query)
                .then(function (data) {
                    _this.gotTopics = true;
                    dfd.resolve();
                })
                .fail(function (error) { _this.handleError(context, promise, error); });
        }
        return dfd.promise();
    };
    _this.getTopicId = function (context, promise, friendlyName) {
        var dfd = $.Deferred();
        var op = breeze.FilterQueryOp;
        _this.getTopics(context, promise).then(function () {
            var providerQuery = breeze.EntityQuery
                .from("Topics")
                .where("friendlyName", op.Equals, friendlyName)
                .take(1);
            var data = _this.topicsDataManager.executeQueryLocally(providerQuery);
            dfd.resolve(data[0].id());
        });
        return dfd.promise();
    }
    _this.getTopicPermissionTypeId = function (context, promise, friendlyName, securityLevel) {
        var dfd = $.Deferred();
        _this.getTopicId(context, promise, friendlyName).then(function (topicId) {
            var manager = new breeze.EntityManager(_this.apiUrl + "/SecurityData");
            var op = breeze.FilterQueryOp;
            var p1 = new breeze.Predicate("topicId", op.Equals, topicId);
            var p2 = new breeze.Predicate("securityLevel", op.Equals, securityLevel);
            var providerQuery = breeze.EntityQuery
                .from("TopicPermissionTypes")
                .where(p1.and(p2))
                .take(1);
            manager.executeQuery(providerQuery)
                .then(function (data) {
                    dfd.resolve(topicId, data.results[0].id());
                })
                .fail(function (error) { _this.handleError(context, promise, error); });
        });
        return dfd.promise();
    }
    _this.createOrUpdateProviderStaffMember = function (context, promise, providerName, staffName) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/SecurityOrg");
        var op = breeze.FilterQueryOp;
        var providerId = context.state[providerName + "_StaffMember"].personId();
        var staffId = context.state[staffName + "_StaffMember"].personId();
        var p1 = new breeze.Predicate("providerPersonId", op.Equals, providerId);
        var p2 = new breeze.Predicate("staffPersonId", op.Equals, staffId);
        var pred = breeze.Predicate.and([p1, p2]);
        var providerQuery = breeze.EntityQuery
            .from("ProviderStaffMembers")
            .where(pred)
            .take(1);
        manager.executeQuery(providerQuery)
            .then(function (data) {
                if (data.results.length === 0) {
                    var permission = manager.createEntity('ProviderStaffMember', {
                        providerPersonId: providerId,
                        staffPersonId: staffId
                    });
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                } else {
                    dfd.resolve();
                }
            })
            .fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.createOrUpdatePatient = function (context, promise, name, personId, providerId) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/Patients");
        var op = breeze.FilterQueryOp;
        var providerQuery = breeze.EntityQuery
            .from("Patients")
            .where("id", op.Equals, personId)
            .take(1);
        manager.executeQuery(providerQuery)
            .then(function (data) {
                if (data.results.length === 0) {
                    context.state[name + "_Patient"] = manager.createEntity('Patient', {
                        id: personId,
                        inactive: false,
                        patientNumber: personId + 9000,
                        providerId: providerId
                    });
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                } else {
                    var patient = data.results[0];
                    context.state[name + "_Patient"] = patient;
                    patient.id(personId);
                    patient.inactive(false);
                    patient.patientNumber(personId + 9000);
                    patient.providerId(providerId);
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                }
            })
            .fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.createOrUpdateOrder = function (context, promise, patientPersonId, orderName) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/Orders");
        var op = breeze.FilterQueryOp;
        var providerQuery = breeze.EntityQuery
            .from("Orders")
            .where("name", op.Equals, orderName)
            .take(1);
        manager.executeQuery(providerQuery)
            .then(function (data) {
                if (data.results.length === 0) {
                    context.state[orderName + "_Order"] = manager.createEntity('Order', {
                        name: orderName,
                        patientPersonId: patientPersonId
                    });
                    manager.saveChanges()
                        .then(function () {
                            dfd.resolve();
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                } else {
                    context.state[orderName + "_Order"] = data.results[0];
                    dfd.resolve();
                }
            })
            .fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.createOrUpdateAppointment = function (context, promise, patientPersonId, apptSubject) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/Appointments");
        var op = breeze.FilterQueryOp;
        var providerQuery = breeze.EntityQuery
            .from("Appointments")
            .where("subject", op.Equals, apptSubject)
            .take(1);
        manager.executeQuery(providerQuery)
            .then(function (data) {
                if (data.results.length === 0) {
                    context.state[apptSubject + "_Appointment"] = manager.createEntity('Appointment', {
                        subject: apptSubject
                    });
                    manager.saveChanges()
                        .then(function () {
                            _this.createOrUpdateAppointmentMember(
                                context, promise, context.state[apptSubject + "_Appointment"].id(), patientPersonId)
                            .then(function() {
                                dfd.resolve();
                            }).fail(function (error) { _this.handleError(context, promise, error); });
                        })
                        .fail(function (error) { _this.handleError(context, promise, error); });
                } else {
                    context.state[apptSubject + "_Appointment"] = data.results[0];
                    _this.createOrUpdateAppointmentMember(context, promise, context.state[apptSubject + "_Appointment"].id(), patientPersonId)
                        .then(function() {
                            dfd.resolve();
                        }).fail(function (error) { _this.handleError(context, promise, error); });
                }
            })
            .fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.createOrUpdateAppointmentMember = function (context, promise, appointmentId, patientPersonId) {
        var dfd = $.Deferred();
        var manager = new breeze.EntityManager(_this.apiUrl + "/Appointments");
        var op = breeze.FilterQueryOp;
        var p1 = new breeze.Predicate("topicRecordId", op.Equals, appointmentId);
        var p2 = new breeze.Predicate("memberTypeId", op.Equals, 1);
        var p3 = new breeze.Predicate("memberRecordId", op.Equals, patientPersonId);
        var pred = breeze.Predicate.and([p1, p2, p3]);
        var query = breeze.EntityQuery
            .from("AppointmentMembers")
            .where(pred)
            .take(1);
        manager.executeQuery(query)
            .then(function (data) {
                context.state[details + "_AppointmentMember"] = manager.createEntity('AppointmentMember', {
                    topicId: 43,
                    topicRecordId: appointmentId,
                    memberTypeId: 1,
                    memberRecordId: patientPersonId
                });
                manager.saveChanges()
                    .then(function () {
                        dfd.resolve();
                    })
                    .fail(function (error) { _this.handleError(context, promise, error); });
            }).fail(function (error) { _this.handleError(context, promise, error); });
        return dfd.promise();
    };
    _this.handleError = function (context, promise, error) {
        context.error = error;
        promise.reject();
    };
    return _this;
});
