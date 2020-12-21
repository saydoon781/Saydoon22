const Discord = require("discord.js");
const config  = require("./config");
const client  = new Discord.Client({
        partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
const fs = require("fs");
const moment = require("moment");
client.prefix = "?"
client.config = config;
client.log = (msg) => {
        var channel = client.channels.cache.get(config.log);
        channel.send(`**[${moment().format("HH:mm")}]** ${msg}`);
}
client.logTranscript = () => {
        var channel = client.channels.cache.get(config.log);
        channel.send({files: [
                "transcript.txt"
        ]})
}
fs.readdir("./events/", (err, files) => {
        if(err) throw err;
        files.forEach(file => {
                const event = require(`./events/${file}`);
                const eventName = file.split(".")[0]
                client.on(eventName, event.bind(null, client))
                delete require.cache[require.resolve(`./events/${file}`)];
        })
})
client.login(config.token);