const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require("../config");
const cooldownModel = require("../models/cooldowns");
const ms = require("parse-ms");
module.exports = async (guild, user, guildDoc, ticketModel, type) => {
        var cooldownDoc = await cooldownModel.findOne({userID: user.id});
        if(cooldownDoc){
                var time = cooldownDoc.get("lastCreate");
                if(time !== null && config.cooldown - (Date.now() - time) > 0) {
                        var timeObj = ms(config.cooldown - (Date.now() - time));
                        user.send({embed: {
                                description: `**يمكنك إنشاء تذكرة أخرى بعد: ${timeObj.days ? `${timeObj.days} ايام، ` : ``}${timeObj.hours ? `${timeObj.hours} ساعات، ` : ``}${timeObj.minutes ? `${timeObj.minutes} دقائق، ` : ``}${timeObj.seconds ? `${timeObj.seconds} ثواني، ` : ``}**`
                        }})
                        guild.client.log(`__(${user.tag})__ **حاول انشاء تذكرة جديدة بينما لا يستطع بسبب السبام**`)
                        return;
                }
        }
        guildDoc.ticketCount += 1;
        await guildDoc.save();
        const ticketChannel = await guild.channels.create(`ticket-${guildDoc.ticketCount}`, {
                type: "text",
                permissionOverwrites: [
                        {
                                allow: ["VIEW_CHANNEL","READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
                                id: user.id
                        },
                        {
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                id: type.roleId
                        },
                        {
                                deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                id: guild.id
                        }
                ],
                parent: config.categoryId
        })
        guild.client.log(`__(${user.tag})__ **انشئ تذكرة جديدة ب رقم \`${guildDoc.ticketCount}\`**`)
        var embed = new MessageEmbed();
        embed.setAuthor(user.tag, user.displayAvatarURL({dynamic: true}));
        embed.addField("Ticket Creator", `<@${user.id}>`, true)
        embed.addField("Ticket Number", `#${guildDoc.ticketCount}`, true);
        embed.addField("Support Message", type.supportMessage, true);
        embed.setThumbnail("attachment://ticket.png")
        const msg = await ticketChannel.send({embed, files: [{attachment: "ticket.png", name: "ticket.png"}]});
        msg.react("❌");
        msg.react("📰");
        
        
        
        const ticketDoc = new ticketModel({
                guildID: guild.id,
                userID: user.id,
                channelID: ticketChannel.id,
                msgID: msg.id,
                type: type.name
        })
        
        await ticketDoc.save();
        cooldownDoc = await cooldownModel.findOneAndUpdate({userID: user.id}, {$set: {lastCreate: new Date()}});
        if(!cooldownDoc) {
                await new cooldownModel({
                        userID: user.id,
                        lastCreate: new Date()
                }).save();
        }
}