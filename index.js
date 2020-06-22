const dotenv = require('dotenv');
dotenv.config();
const { prefix, status } = require("./config.json");
const token = process.env.DISCORD_BOT_TOKEN;
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  client.user.setActivity(status, { type: "LISTENING"})
  .then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
  .catch(console.error);
});
 
client.on('message', msg => {
  if (msg.content === prefix + 'ping') {
    msg.channel.send('pongf');

  }
  if (msg.content === 'rosh') {
    setTimeout(function() {
      msg.channel.send('is great')
    }, 5000);
  }
});
 

client.login(token);
