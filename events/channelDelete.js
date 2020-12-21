const ticketModel = require("../models/ticket");
module.exports=async(client, channel) => {
        await ticketModel.findOneAndDelete({channelID: channel.id, guildID: channel.guild.id});
}