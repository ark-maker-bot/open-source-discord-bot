const discord = require('discord.js');
const client = new discord.Client();
const {
    token,
    prefix
} = require('./config.json');
const fs = require('fs');
var channelids = [];
var messageid = [];
client.on('ready', () => {
    channelids = [];
    messageid = [];
    fs.readFile('settings.json', (err, data) => {
        if (err) throw err;
        let settings_ids = JSON.parse(data);
        console.log(settings_ids);
        channelids = settings_ids;
    });
    fs.readFile('greetmessage.json', (err, data) => {
        if (err) throw err;
        let message_info = JSON.parse(data);
        console.log(message_info);
        messageid = message_info;
    });
    console.log('bot is ready');
});
client.on('message', message => {
    if(message.author.bot)return;
    if(!message.guild.available)return;
    console.log(message.author.username + ' ' + message.content);
    if(message.content.startsWith(prefix)){
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        switch(command){
        case "greetchannel":{
            console.log(args[0]);
            channelids[message.guild.id] = args[0];
            console.log(channelids);
            var data = JSON.stringify(channelids);
            fs.writeFileSync('settings.json', data, 'utf8', function (err) {
                if(err)console.log(err);
                console.log('file saved');
            });

            message.channel.send('`SET CHANNEL ID TO ' + args[0] + '`');
        }break;
        case "greetmessage":{
            let msg = args.slice(0).join(" ");
            if(!msg)msg = "enter a message here using the command greetmessage <text>";
            messageid[message.guild.id] = msg;
            var data = JSON.stringify(messageid);
            fs.writeFileSync('greetmessage.json', data);
            message.channel.send('`SET MESSAGE TO ' + msg + '`');
        }break;
        default:{
            message.channel.send('`NOT A VALID COMMAND`');
        }break;
        }
    }
});
client.on('guildMemberAdd', member => {
    console.log(member.displayName);
    const channel = member.guild.channels.cache.find(ch => ch.id === channelids[member.guild.id]);
    if(!channel)return;
    const welcomemessage = messageid[member.guild.id];
    if(!welcomemessage)return;
    channel.send(`${welcomemessage}, ${member}`);
});
client.login(token);