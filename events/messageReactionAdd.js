const guildModel = require("../models/guild");
const createTicket = require("../functions/createTicket");
const ticketModel  = require("../models/ticket");
const fetchAll = require("discord-fetch-all");
const fs = require("fs");
const { MessageAttachment } = require("discord.js");
module.exports = async(client, reaction, user) => {
        if(reaction.message.partial) await reaction.message.fetch();
        if(reaction.partial) await reaction.fetch();
        if(user.bot) return;
        const guild = reaction.message.guild;
        var guildDoc = await guildModel.findOne({guildID: guild.id});
        if(!guildDoc){
                guildDoc = new guildModel({
                        guildID: guild.id,
                        ticketCount: 0
                });
                await guildDoc.save();
        }
        var type = client.config.types[reaction.emoji.name];
        if(reaction.message.channel.id === client.config.channelId) {
                reaction.users.remove(user);
                if(!type){
                        user.send({embed: {
                                description: "**❌ || الايموجي غير صحيح**"
                        }})
                        client.log(`__(${user.tag})__ **حاول استخدام ايموجي خاطئ**`)
                } else {
                        var ticketDoc = await ticketModel.findOne({guildID: guild.id, userID: user.id});
                        if(ticketDoc) {
                                var channel = guild.channels.cache.get(ticketDoc.channelID);
                                if(channel) {
                                        user.send({embed: {
                                                description: `**❌ || لديك تذكرة مفتوحة بالفعل**\n<#${ticketDoc.channelID}>`
                                        }})
                                        client.log(`__(${user.tag}) **حاول فتح تذكرة بينما توجد تذكرة مفتوحة بالفعل**`)
                                } else {
                                        createTicket(guild, user, guildDoc, ticketModel, type);
                                        client.log(`__(${user.tag})__ **يحاول انشاء تذكرة**`)
                                }
                        } else {
                                createTicket(guild, user, guildDoc, ticketModel, type)
                                client.log(`__(${user.tag})__ **يحاول انشاء تذكرة**`)
                        }
                }
        } else {
                const ticketDoc = await ticketModel.findOne({guildID: guild.id, userID: user.id});
                if(ticketDoc.msgID === reaction.message.id) {
                        reaction.users.remove(user)
                        if(reaction.emoji.name === "❌") {
                                reaction.message.channel.send({embed: {
                                        description: "** يتم إغلاق التكت خلال 3 ثواني**",
                                        color: "#FF0000"
                                }})
                                client.log(`__(${user.tag})__ **يحاول إغلاق تذكرة**`)
                                setTimeout(async () => {
                                        reaction.message.channel.delete()
                                        await ticketDoc.deleteOne();
                                        client.log(`__(${user.tag})__ **حذف تذكرة: \`${reaction.message.channel.name}\`**`)
                                        user.send({embed: {
                                                description: `**✅ || تم إغلاق التكت الخاصة بك: \`${reaction.message.channel.name}\`\nيمكنك إنشاء تذكرة ثانية بعد 5 دقائق**`
                                        }}).catch(console.log)
                                }, 3000)
                        } else if (reaction.emoji.name === "📰") {
                                client.log(`__(${user.tag})__ **يحاول سحب الترانسكربت**`)
                                const msgs = await fetchAll.messages(reaction.message.channel, {
                                        reverseArray: true
                                });
                                const content = msgs.map(m => `${m.author.tag} - ${m.content}`);
                                fs.writeFileSync("transcript.txt", content.join("\n"), err => {
                                        if(err) throw err;
                                });
                                reaction.message.channel.send(new MessageAttachment("transcript.txt", "transcript.txt"))
                                client.logTranscript();
                                client.log(`__(${user.tag})__ **تم سحب الترانسكربت الخاص بـ \`${reaction.message.channel.name}\`**`)
                        }
                }
        }
}

// function $myFunc(guild, user, guildDoc, type){
//         const ticketDoc = await ticketModel.findOne({guildID: guild.id, userID: user.id});
//         if(ticketDoc) {
//                 const channel = guild.channels.cache.get(ticketDoc.channelID);
//                 if(channel) {
//                         user.send(`**❌ || لديك تذكرة مفتوحة بالفعل.**\n<#${ticketDoc.channelID}>`)
//                 } else {
//                         createTicket(guild, user, guildDoc, ticketModel, type)
//                 }
//         } else {
//                 createTicket(guild, user, guildDoc, ticketModel, type)
//         }
// }