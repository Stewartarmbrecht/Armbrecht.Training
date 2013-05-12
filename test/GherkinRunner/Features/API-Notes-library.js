define(['Features/testHelper'], function (testHelper) {
    var _this = {};
    _this['the client attempts a query for the list of notes for the <ObjectType> identified by <ParentObjectName>'] = function (context, promise) {
		promise.reject();
    };
    _this['the client attempts to delete the note'] = function (context, promise) {
		promise.reject();
    };
    _this['the client attempts to queries the API for the new note'] = function (context, promise) {
		promise.reject();
    };
    _this['the client attempts to save <Count> new notes to the <ObjectType> identified by <ParentObjectName>'] = function (context, promise) {
		promise.reject();
    };
    _this['the client deletes the note'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "Administrator"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteAddEditor"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteAddNoEditor"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteAddNoPatient"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteCreator"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteDelCreator"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteDelNoPermission"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteDelPerm"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteDelPermNoPat"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteGetCreator"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteGetNoPerm"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteGetPerm"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NoteGetPermNoPat"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is connected as "NotNoteCreator"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client is logged off'] = function (context, promise) {
		promise.reject();
    };
    _this['the client queries for the list of notes for the <ObjectType> identified by <ParentObjectName>'] = function (context, promise) {
		promise.reject();
    };
    _this['the client queries the API for the new note'] = function (context, promise) {
		promise.reject();
    };
    _this['the client saves <Count> new notes to the <ObjectType> identified by <ParentObjectName>'] = function (context, promise) {
		promise.reject();
    };
    _this['the client saves a new note to the patient'] = function (context, promise) {
		promise.reject();
    };
    _this['the client saves a new note with a missing parent specified'] = function (context, promise) {
		promise.reject();
    };
    _this['the client saves a new note with an invalid parent type specified'] = function (context, promise) {
		promise.reject();
    };
    _this['the client saves a new note with the <PropertyName> field null'] = function (context, promise) {
		promise.reject();
    };
    _this['the client should be able to query the API for the new note'] = function (context, promise) {
		promise.reject();
    };
    _this['the client should be able to query the updated note from the server'] = function (context, promise) {
		promise.reject();
    };
    _this['the client should NOT be able to query the API for the new note'] = function (context, promise) {
		promise.reject();
    };
    _this['the client should receive a response with a status of "400"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client should receive a response with a status of "403"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client should receive validation error with a message of "'<PropertyName>' is required"'] = function (context, promise) {
		promise.reject();
    };
    _this['the client updates the note'] = function (context, promise) {
		promise.reject();
    };
    _this['the created information should be set'] = function (context, promise) {
		promise.reject();
    };
    _this['the following practice users exist and are linked to the provider'] = function (context, promise) {
		promise.reject();
    };
    _this['the following staff members are linked to the provider named "NoteAddProvider"'] = function (context, promise) {
		promise.reject();
    };
    _this['the following staff members are linked to the provider named "NoteDelProvider"'] = function (context, promise) {
		promise.reject();
    };
    _this['the following staff members are linked to the provider named "NoteGetProvider"'] = function (context, promise) {
		promise.reject();
    };
    _this['the modified information should be set'] = function (context, promise) {
		promise.reject();
    };
    _this['the note should have the <ObjectType> identified by <ParentObjectName> as the parent'] = function (context, promise) {
		promise.reject();
    };
    _this['the patient has an appointment'] = function (context, promise) {
		promise.reject();
    };
    _this['the patient has an order'] = function (context, promise) {
		promise.reject();
    };
    _this['the patient named "NoteAddPatient" has an appointment called "NoteAddAppt"'] = function (context, promise) {
		promise.reject();
    };
    _this['the patient named "NoteAddPatient" has an order called "NoteAddOrder"'] = function (context, promise) {
		promise.reject();
    };
    _this['the patient named "NoteDelPatient" has an appointment called "NoteDelAppt"'] = function (context, promise) {
		promise.reject();
    };
    _this['the patient named "NoteDelPatient" has an order called "NoteDelOrder"'] = function (context, promise) {
		promise.reject();
    };
    _this['the patient named "NoteGetPatient" has an appointment called "NoteGetAppt"'] = function (context, promise) {
		promise.reject();
    };
    _this['the patient named "NoteGetPatient" has an order called "NoteGetOrder"'] = function (context, promise) {
		promise.reject();
    };
    _this['the practice has a provider'] = function (context, promise) {
		promise.reject();
    };
    _this['the practice has the following staff members'] = function (context, promise) {
		promise.reject();
    };
    _this['the provider has a patient'] = function (context, promise) {
		promise.reject();
    };
    _this['the provider named "NoteAddProvider" has a patient named "NoteAddPatient"'] = function (context, promise) {
		promise.reject();
    };
    _this['the provider named "NoteDelProvider" has a patient named "NoteDelPatient"'] = function (context, promise) {
		promise.reject();
    };
    _this['the provider named "NoteGetProvider" has a patient named "NoteGetPatient"'] = function (context, promise) {
		promise.reject();
    };
    _this['the queried "Note" properties should match the added "Note" properties for the following properties'] = function (context, promise) {
		promise.reject();
    };
    _this['the response message should be "Attempted to perform an unauthorized operation."'] = function (context, promise) {
		promise.reject();
    };
    _this['the response message should be "No access to the specified patient."'] = function (context, promise) {
		promise.reject();
    };
    _this['the response message should be "The specified parent object does not exist."'] = function (context, promise) {
		promise.reject();
    };
    _this['the response message should be "You do not have permission to peform that action"'] = function (context, promise) {
		promise.reject();
    };
    _this['the response message should be "You do not have the necessary permission."'] = function (context, promise) {
		promise.reject();
    };
    _this['the staff members have the following permissions'] = function (context, promise) {
		promise.reject();
    };
    _this['the system should return a list of "10" notes'] = function (context, promise) {
		promise.reject();
    };
    return _this;
});
