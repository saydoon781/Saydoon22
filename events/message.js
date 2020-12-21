const {MessageEmbed} = require("discord.js")
module.exports = async(client, message) => {
        if(message.content === "!ticketmsg") {
                if(client.config.owner !== message.author.id) return;
                message.delete()
                const embed = new MessageEmbed({title: "-"});
                var str = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
                for(var key in client.config.types){
                        if(client.config.types.hasOwnProperty(key)) str+=`\n**•「${key}」${client.config.types[key].name}**`
                }
                str +="\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
                embed.setDescription(str);
                message.channel.send(embed).then((msg) => {
                        for(var key in client.config.types){
                                msg.react(key);       
                        }
                });
        }
}