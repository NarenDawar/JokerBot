const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    serverId: {type: String, required: true},
    coins: {type: Number, default: 10},
    dailyLastUsed: {type: Number, default: 0},
    workLastUsed: {type: Number, default: 0},
    robLastUsed: {type: Number, default: 0},
    embedColor: {type: String, default: "#ed4245"},
    customTitle: {type: String, default: "N/A"},
    customPhrase: {type: String, default: "N/A"},
    numOfWins: {type: Number, default: 0},
    jobTitle: {type: String, default: "Construction Worker"},
    bankBalance: {type: Number, default: 0},
    prestige: {type: String, default: "Beginner I"},
    lastDailyUpdate: {type: Date, default: Date.now}
});

// Avoid redefining the model if it already exists
const model = mongoose.models.jokerdb || mongoose.model("jokerdb", profileSchema);

module.exports = model;
