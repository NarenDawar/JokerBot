const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {type: String, require: true, unique: true},
    serverId: {type: String, require: true},
    coins: {type: Number, default: 10},
    dailyLastUsed: {type: Number, default: 0},
    workLastUsed: {type: Number, default: 0},
    embedColor: {type: String, default: "#ed4245"},
    customTitle: {type: String, default: "N/A"},
    customPhrase: {type: String, default: "N/A"},
    numOfWins: {type: Number, default: 0},
    jobTitle: {type: String, default: "Construction"},
    bankBalance: {type: Number, default: 0},
    numOfWorkers: {type: Number, default: 0}
});

const model = mongoose.model("jokerdb", profileSchema);

module.exports = model;