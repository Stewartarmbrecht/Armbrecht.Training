/// <reference path="../../../Scripts/breeze.debug.js" />
/// <reference path="../../../Scripts/breeze.intellisense.js" />
define(['features/testHelper', 'moment'], function (testHelper, moment) {
    var _this = {};
    _this.moment = moment;
    _this['the appointment has 15 notes'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        promise.reject();
    };
    _this['the client attempts to save <Count> new notes to the <ObjectType> identified by <ParentObjectName>'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.createOrModifyDate = _this.moment.utc();
        state.noteAddCount = exampleArg.Count;
        state.objectType = exampleArg.ObjectType;
        state.parentObjectName = exampleArg.ParentObjectName;
        state.topicRecordId = state[state.parentObjectName + "_" + state.objectType].id();
        state.topicId = 59; //PAT_RegistrationNotes
        if (state.objectType == 'Order')
            state.topicId = 265;
        else if (state.objectType == 'Appointment')
            state.topicId = 266;
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        manager.fetchMetadata()
            .then(function (data) {
                for (var i = 0; i < state.noteAddCount; i++) {
                    state.added = manager.createEntity('Note', {
                        topicId: state.topicId,
                        topicRecordId: state.topicRecordId,
                        urgent: false,
                        subject: 'Note Add Test ' + new Date().getTime().toString(),
                        body: 'This is the body of the note.  This is the body of the note.  This is the body of the note.  This is the body of the note.  This is the body of the note.  This is the body of the note.  '
                    });
                }
                manager.saveChanges()
                    .then(function () {
                        var error = new Error("Saving the new note should have failed.")
                        testHelper.handleError(context, promise, error);
                    })
                    .fail(function (error) {
                        state.error = error;
                        promise.resolve();
                    });
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client attempts a query for the list of notes for the <ObjectType> identified by <ParentObjectName>'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        state.objectType = exampleArg.ObjectType;
        state.parentObjectName = exampleArg.ParentObjectName;
        state.topicRecordId = state[state.parentObjectName + "_" + state.objectType].id();
        state.topicId = 59; //PAT_RegistrationNotes
        if (state.objectType == 'Order')
            state.topicId = 265;
        else if (state.objectType == 'Appointment')
            state.topicId = 266;
        var op = breeze.FilterQueryOp;
        var query = breeze.EntityQuery
            .from("Notes")
            .withParameters({ topicId: state.topicId, topicRecordId: state.topicRecordId });
        manager.executeQuery(query)
            .then(function () {
                var error = new Error("Saving the new note should have failed.")
                testHelper.handleError(context, promise, error);
            })
            .fail(function (error) {
                state.error = error;
                promise.resolve();
            });
    };
    _this['the client deletes the note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        manager.fetchMetadata()
            .then(function (data) {
                var toDelete = manager.createEntity('Note', {
                    id: state.queried.id(),
                    modifyDate: state.queried.modifyDate()
                }, breeze.EntityState.Deleted);
                manager.saveChanges()
                    .then(function () {
                        promise.resolve();
                    })
                    .fail(function (error) { testHelper.handleError(context, promise, error); });
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client attempts to delete the note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        manager.fetchMetadata()
            .then(function (data) {
                var toDelete = manager.createEntity('Note', {
                    id: state.queried.id(),
                    modifyDate: state.queried.modifyDate()
                }, breeze.EntityState.Deleted);
                manager.saveChanges()
                    .then(function () {
                        var error = new Error("Saving the new note should have failed.")
                        testHelper.handleError(context, promise, error);
                    })
                    .fail(function (error) {
                        state.error = error;
                        promise.resolve();
                    });
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client queries the API for the new note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        state.manager = manager;
        var op = breeze.FilterQueryOp;
        var query = breeze.EntityQuery
            .from("Note")
            .withParameters({ id: state.added.id() });
        manager.executeQuery(query)
            .then(function (data) {
                expect(data.results.length).toEqual(1);
                state.queried = data.results[0];
                promise.resolve();
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client attempts to query the API for the new note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        var op = breeze.FilterQueryOp;
        var query = breeze.EntityQuery
            .from("Note")
            .withParameters({ id: state.added.id() });
        manager.executeQuery(query)
            .then(function () {
                var error = new Error("Saving the new note should have failed.")
                testHelper.handleError(context, promise, error);
            })
            .fail(function (error) {
                state.error = error;
                promise.resolve();
            });
    };
    _this['the client queries for the list of notes for the <ObjectType> identified by <ParentObjectName>'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        state.objectType = exampleArg.ObjectType;
        state.parentObjectName = exampleArg.ParentObjectName;
        state.topicRecordId = state[state.parentObjectName + "_" + state.objectType].id();
        state.topicId = 59; //PAT_RegistrationNotes
        if (state.objectType == 'Order')
            state.topicId = 265;
        else if (state.objectType == 'Appointment')
            state.topicId = 266;
        var op = breeze.FilterQueryOp;
        var query = breeze.EntityQuery
            .from("Notes")
            .withParameters({ topicId: state.topicId, topicRecordId: state.topicRecordId });
        manager.executeQuery(query)
            .then(function (data) {
                state.queried = data.results;
                promise.resolve();
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client saves <Count> new notes to the <ObjectType> identified by <ParentObjectName>'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.createOrModifyDate = _this.moment.utc();
        state.noteAddCount = exampleArg.Count;
        state.objectType = exampleArg.ObjectType;
        state.parentObjectName = exampleArg.ParentObjectName;
        state.topicRecordId = state[state.parentObjectName + "_" + state.objectType].id();
        state.topicId = 59; //PAT_RegistrationNotes
        if (state.objectType == 'Order')
            state.topicId = 265;
        else if (state.objectType == 'Appointment')
            state.topicId = 266;
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        manager.fetchMetadata()
            .then(function (data) {
                for (var i = 0; i < state.noteAddCount; i++)
                {
                    state.added = manager.createEntity('Note', {
                        topicId: state.topicId,
                        topicRecordId: state.topicRecordId,
                        urgent: false,
                        subject: 'Note Add Test ' + new Date().getTime().toString(),
                        body: 'This is the body of the note.  This is the body of the note.  This is the body of the note.  This is the body of the note.  This is the body of the note.  This is the body of the note.  '
                    });
                }
                manager.saveChanges()
                    .then(function () {
                        promise.resolve();
                    })
                    .fail(function (error) { testHelper.handleError(context, promise, error); });
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client attempts to save a new note to the <ObjectType> identified by <ParentObjectName>'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.createOrModifyDate = _this.moment.utc();
        state.objectType = exampleArg.ObjectType;
        state.parentObjectName = exampleArg.ParentObjectName;
        state.topicRecordId = state[state.parentObjectName + "_" + state.objectType].id();
        state.topicId = 59; //PAT_RegistrationNotes
        if (state.objectType == 'Order')
            state.topicId = 265;
        else if (state.objectType == 'Appointment')
            state.topicId = 266;
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        manager.fetchMetadata()
            .then(function (data) {
                state.added = manager.createEntity('Note', {
                    topicId: state.topicId,
                    topicRecordId: state.topicRecordId,
                    urgent: false,
                    subject: 'Note Add Test ' + new Date().getTime().toString(),
                    body: 'This is the body of the note'
                });
                manager.saveChanges()
                    .then(function () {
                        var error = new Error("Saving the new note should have failed.")
                        testHelper.handleError(context, promise, error);
                    })
                    .fail(function (error) {
                        state.error = error;
                        promise.resolve();
                    });
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client saves a new note with a missing parent specified'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.createOrModifyDate = _this.moment.utc();
        state.topicRecordId = 99999;
        state.topicId = 59; //PAT_RegistrationNotes
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        manager.fetchMetadata()
            .then(function (data) {
                state.added = manager.createEntity('Note', {
                    topicId: state.topicId,
                    topicRecordId: state.topicRecordId,
                    urgent: false,
                    subject: 'Note Add Test ' + new Date().getTime().toString(),
                    body: 'This is the body of the note'
                });
                manager.saveChanges()
                    .then(function () {
                        var error = new Error("Saving the new note should have failed.")
                        testHelper.handleError(context, promise, error);
                    })
                    .fail(function (error) {
                        state.error = error;
                        promise.resolve();
                    });
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client saves a new note with an invalid parent type specified'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.createOrModifyDate = _this.moment.utc();
        state.topicRecordId = 1;
        state.topicId = 999999; //PAT_RegistrationNotes
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        manager.fetchMetadata()
            .then(function (data) {
                state.added = manager.createEntity('Note', {
                    topicId: state.topicId,
                    topicRecordId: state.topicRecordId,
                    urgent: false,
                    subject: 'Note Add Test ' + new Date().getTime().toString(),
                    body: 'This is the body of the note'
                });
                manager.saveChanges()
                    .then(function () {
                        var error = new Error("Saving the new note should have failed.")
                        testHelper.handleError(context, promise, error);
                    })
                    .fail(function (error) {
                        state.error = error;
                        promise.resolve();
                    });
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client saves a new note with the <PropertyName> field null'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.createOrModifyDate = _this.moment.utc();
        state.topicRecordId = state["NoteAddPatient_Patient"].id();
        state.topicId = 59; //PAT_RegistrationNotes
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        manager.fetchMetadata()
            .then(function (data) {
                var initialProps = {
                    topicId: state.topicId,
                    topicRecordId: state.topicRecordId,
                    urgent: false,
                    subject: 'Note Add Test ' + new Date().getTime().toString(),
                    body: 'This is the body of the note'
                };
                initialProps[exampleArg.PropertyName] = null;
                state.added = manager.createEntity('Note', initialProps);
                manager.saveChanges()
                    .then(function () {
                        var error = new Error("Saving the new note should have failed.")
                        testHelper.handleError(context, promise, error);
                    })
                    .fail(function (error) {
                        state.error = error;
                        promise.resolve();
                    });
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client saves the note with the <PropertyName> field null'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.queried[exampleArg.PropertyName](null);
        state.manager.saveChanges()
            .then(function () {
                var error = new Error("Saving the new note should have failed.")
                testHelper.handleError(context, promise, error);
            })
            .fail(function (error) {
                state.error = error;
                promise.resolve();
            });
    };
    _this['the client saves the note with the <PropertyName> field with a string <CharacterCount> long'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var charArray = [];
        for (var i = 0; i < exampleArg.CharacterCount; i++)
        {
            charArray[i] = 'X';
        }
        state.queried[exampleArg.PropertyName](charArray.join());
        state.manager.saveChanges()
            .then(function () {
                var error = new Error("Saving the new note should have failed.")
                testHelper.handleError(context, promise, error);
            })
            .fail(function (error) {
                state.error = error;
                promise.resolve();
            });
    };
    _this['the client should be able to query the API for the new note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        var op = breeze.FilterQueryOp;
        var query = breeze.EntityQuery
            .from("Notes")
            .withParameters({ topicId: state.added.topicId(), topicRecordId: state.added.topicRecordId() })
            .where("id", op.Equals, state.added.id())
            .take(1);
        manager.executeQuery(query)
            .then(function (data) {
                expect(data.results.length).toEqual(1);
                state.queried = data.results[0];
                promise.resolve();
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client should be able to query the updated note from the server'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        promise.reject();
    };
    _this['the client should NOT be able to query the API for the new note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        var manager = new breeze.EntityManager(testHelper.apiUrl + "/Notes");
        var op = breeze.FilterQueryOp;
        var query = breeze.EntityQuery
            .from("Notes")
            .withParameters({ topicId: state.added.topicId(), topicRecordId: state.added.topicRecordId() })
            .where("id", op.Equals, state.added.id())
            .take(1);
        manager.executeQuery(query)
            .then(function (data) {
                expect(data.results.length).toEqual(0);
                promise.resolve();
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client attempts to update the new note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.queried.subject('My new subject.');
        state.queried.body('My new body.');
        state.manager.saveChanges()
            .then(function () {
                var error = new Error("Saving the new note should have failed.")
                testHelper.handleError(context, promise, error);
            })
            .fail(function (error) {
                state.error = error;
                promise.resolve();
            });
    };
    _this['the client updates the new note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.queried.subject('My new subject.');
        state.queried.body('My new body.');
        state.manager.saveChanges()
            .then(function (data) {
                promise.resolve();
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client updates the new note to have an invalid parent'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.queried.topicId(99999);
        state.manager.saveChanges()
            .then(function (data) {
                promise.resolve();
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the client updates the new note to have a missing parent'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        state.queried.topicRecordId(99999123);
        state.manager.saveChanges()
            .then(function (data) {
                promise.resolve();
            })
            .fail(function (error) { testHelper.handleError(context, promise, error); });
    };
    _this['the following practice users exist and are linked to the provider'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        promise.reject();
    };
    _this['the note should have more than 150 characters'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        promise.reject();
    };
    _this['the note should have the <ObjectType> identified by <ParentObjectName> as the parent'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        expect(state.queried.topicId()).toBeGreaterThan(0);
        expect(state.queried.topicRecordId()).toBeGreaterThan(0);
        expect(state.queried.topicRecordId()).toEqual(state.topicRecordId);
        promise.resolve();
    };
    _this['the order has 15 notes'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        promise.reject();
    };
    _this['the patient has 15 notes'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        promise.reject();
    };
    _this['the patient has a note with more than 150 characters'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        promise.reject();
    };
    _this[/the system should return a list of ".*" notes/] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        expect(state.queried.length).toEqual(parseInt(inlineArgs[0]));
        promise.resolve();
    };
    _this['the system should return the note'] = function (context, promise, state, inlineArgs, tableArg, exampleArg) {
        promise.reject();
    };
    return _this;
});
