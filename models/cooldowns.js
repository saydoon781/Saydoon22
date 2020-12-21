const {Schema, model} = require("mongoose");
var cooldowns = Schema({
        userID: String,
        lastCreate: Date
})

module.exports = model("cooldowns", cooldowns)