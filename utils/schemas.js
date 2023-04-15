const mongoose = require("mongoose")

const User = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    stats: {
        health: { type: Number, default: 10 },
        attack: { type: Number, default: 10 },
        defense: {type: Number, default: 10},
        luck: { type: Number, default: 10}
    },
    cooldowns: {
        work: { type: Date },
        crime: {type: Date},
        rob: {type: Date},
        train: {type: Date}
    },
    ownedStocks: {
        attom : {type: Number, default: 0}
    }
})

module.exports = { User: mongoose.model("User", User) }