const express = require('express');
const app = express();
const path = require('path');

app.listen(process.env.PORT || 3000, function(){
	console.log('listening to port 3000');
});

app.use(express.static('static'));

app.get('/',function(req, res){
 	res.sendFile('index.html');
 });

// Load up the discord.js library
const Discord = require('discord.js');
const client = new Discord.Client();


//load bot token on json
const config = require("./config.json");

let bot_status; //will change when music plays
client.on('ready', () => {
  // This event will run if the bot starts, and logs in, successfully.
  bot_status = `Serving ${client.guilds.size} servers`;
  console.log('Discordify is running')
  client.user.setActivity(bot_status);
});

const commands = {
  'join': (msg) => {
  		return new Promise((resolve, reject) => {
  			const voiceChannel = msg.member.voiceChannel;
  			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
  			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
        //connect to spotify uri
        console.log('Spotify joined!');
  		});
   },
   'disconnect': (msg)=>{
     return new Promise((resolve, reject) => {
      const voiceChannel = msg.member.voiceChannel;
      voiceChannel.leave();
       console.log('Spotify disconnected!');
    });
  },
  'ping': (msg)=>{
		console.log(`ping command used.`);
    let ping = Date.now();
    msg.channel.send('Ping').then((msg)=>{
    msg.edit(`Pong! \nLatency is ${Date.now() - ping}ms. API Latency is ${Math.round(client.ping)}ms`);
  });
 }
};//end of const command bracket


client.on('message', msg => {
  //ignore message not using prefix
	if (!msg.content.startsWith(config.prefix)) return;
  //ignore other message from bots
   if(msg.author.bot) return;
  //converts command
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0]](msg);
});

//login client
client.login(config.d_token);
