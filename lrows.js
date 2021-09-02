const Discord = require("discord.js")
const lrows = new Discord.Client()
const ayarlar = require("./settings.json")
const chalk = require("chalk")
const fs = require("fs")
const moment = require("moment")
const db = require("quick.db")
const request = require("request")
const express = require("express")
const http = require("http")
const app = express()
const logs = require("discord-logs")
require("moment-duration-format")
logs(lrows)
require("./util/eventLoader")(lrows)
var prefix = ayarlar.prefix
const log = message => {
  console.log(`bot aktifleştirilmiştir.`);
};





lrows.gif = {
  kategoriler: ayarlar.kategoriler,
  log: ayarlar.giflog,
  sunucu: ayarlar.sunucuadı,
  rastgele: {
    PP: ayarlar.lrowsrandompp, 
    GIF: ayarlar.lrowsrandomgif 
  }
  
}





lrows.commands = new Discord.Collection();
lrows.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut ${props.help.name}.`);
    lrows.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      lrows.aliases.set(alias, props.help.name);
    });
  });
});

lrows.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      lrows.commands.delete(command);
      lrows.aliases.forEach((cmd, alias) => {
        if (cmd === command) lrows.aliases.delete(alias);
      });
      lrows.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        lrows.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

lrows.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      lrows.commands.delete(command);
      lrows.aliases.forEach((cmd, alias) => {
        if (cmd === command) lrows.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
lrows.on('message', async msg =>{

  let categories = lrows.gif.kategoriler
  
  if(msg.attachments.size == 0&&categories.includes(msg.channel.parentID)){
  
  if(msg.author.bot) return;
  
  msg.delete({timeout:500})

  msg.reply('Bu kanalda sadece pp/gif paylaşabilirsin!').then(m=>m.delete({timeout:2000}))

}
  if(msg.attachments.size > 0 && categories.includes(msg.channel.parentID)){

  db.add(`sayı.${msg.author.id}`,msg.attachments.size)
  let emojis = ['🎄','💸','🫒','🍹','🌙']
  var random = Math.floor(Math.random()*(emojis.length));
  let pp = 0
  let gif = 0
  msg.attachments.forEach(atch=>{
   if(atch.url.endsWith('.webp')||atch.url.endsWith('.png')||atch.url.endsWith('.jpeg')||atch.url.endsWith('.jpg')){
     db.add(`pp.${msg.author.id}`,1)
     pp = pp + 1
   }
    if(atch.url.endsWith('.gif')){
     db.add(`gif.${msg.author.id}`,1)
      gif = gif +1
    }
  })
  let mesaj = ``
  if(gif > 0 && pp === 0){
    mesaj = `${gif} gif`
  }
if(pp > 0 && gif === 0){
    mesaj = `${pp} pp`
  }
if(gif > 0 && pp > 0){
    mesaj = `${pp} pp, ${gif} gif`
  }
  lrows.channels.cache.get(lrows.gif.log).send(new Discord.MessageEmbed().setColor('RANDOM').setAuthor(lrows.gif.sunucu +' 🔥').setDescription(`${emojis[random]} \`•\` **${msg.author.tag}** (\`${msg.author.id}\`) kişisi,\n<#${msg.channel.id}> kanalına ${mesaj} gönderdi.\nBu kişi şuanda kanallara toplam ${db.fetch(`sayı.${msg.author.id}`)||0} pp/gif göndermiş.`))
}
})

lrows.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;//
  if (message.author.id === ayarlar.sahip) permlvl = 4;//
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;//

lrows.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

lrows.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

lrows.on("ready",()=>{
  let oynuyor = 
      ["Lrows"]
    
    setInterval(function() {

        var random = Math.floor(Math.random()*(oynuyor.length-0+1)+0);

        lrows.user.setActivity(oynuyor[random],{type:'PLAYING'});
        }, 2 * 2000);
  setTimeout(()=>{
    lrows.user.setStatus("idle");

  },2000)
})
lrows.on("userUpdate", async(eski, yeni) => {
  if(eski.avatarURL() === yeni.avatarURL()) return;
  let avatar = (yeni.avatarURL({dynamic:true,size:1024})).split("?")[0];
  if((avatar).endsWith(".gif")) {
    lrows.channels.cache.get(lrows.gif.rastgele.PP).send(new Discord.MessageEmbed().setColor('RANDOM').setFooter(`${yeni.tag}`).setImage(avatar));
  } else {
    lrows.channels.cache.get(lrows.gif.rastgele.GIF).send(new Discord.MessageEmbed().setColor('RANDOM').setFooter(`${yeni.tag}`).setImage(avatar));
  };
});
console.log('Bot Başarıyla Aktif Edildi')
lrows.login(ayarlar.token).catch(err=> console.error('Tokeni Yenileyip Tekrar Girin'));
