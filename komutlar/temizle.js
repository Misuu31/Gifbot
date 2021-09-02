const Discord = require('discord.js');
exports.run = function(client, message, args) {
if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("");
if(!args[0]) return message.channel.send("Ne kadar mesaj sileceğim").then(msg => msg.delete(2000));
message.channel.bulkDelete(args[0]).then(() => {
  message.channel.send(`${message.member}, ${args[0]} Adet Mesaj Silindi`).then(msg => msg.delete(5000));
})
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['temizle'],
  permLevel: 2
};

exports.help = {
  name: 'sil',
  description: 'Belirlenen miktarda mesajı siler.',
  usage: 'sil'
};