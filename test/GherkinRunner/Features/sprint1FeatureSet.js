define(function () {
    return {
        name: "All",
        features: [
            "features/api/users/logIn",
            "features/api/users/logOff",
            "features/api/notes/noteAdd",
            "features/api/notes/noteGetList",
            "features/api/notes/noteGetSingle",
            "features/api/notes/noteUpdate",
            "features/api/notes/noteDelete",
            "features/api/rooms/roomAdd",
            "features/api/rooms/roomUpdate",
        ]
    };
});