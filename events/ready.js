const {connect} = require("mongoose");
const {mongodb: url} = require("../config");
module.exports = client => {
        console.log(`Logged in as: ${client.user.username}`);
        console.log("Script by: ٍSad Saydoon");
        connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
        }).then(() => {
                console.log("Mongo DB is connected.");
        })
}