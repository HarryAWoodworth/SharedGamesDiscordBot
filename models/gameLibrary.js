const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
    Model for game library data entries in MongoDB
**/
const GameLibrarySchema = new Schema ({
    userName: {
        name: "userName",
        type: String,
        required: true
    },
    gameList: {
        name: "gameList",
        type: String,
        required: false
    }
});

module.exports = GameLibrary = mongoose.model('gameLibrary', GameLibrarySchema);
