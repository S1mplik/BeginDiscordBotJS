const Discord = require("discord.js");
const { Client, MessageEmbed, MessageAttachment, RichEmbed } = require("discord.js");
const { prefix } = require("./config.json");
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const queue = new Map();



const fs = require('fs');



client.on("ready", () => {
  client.user.setActivity("Dejnix");
  console.log(`Logged as in ${client.user}`);
});











  

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`!play`)) {
    execute(message, serverQueue);
    return message.channel
    .send('Načítám ...')
    .then((sent) => {
      setTimeout(() => {
        sent.delete();
      }, 2500);
    });
  } else if (message.content.startsWith(`!skip`)) {
    skip(message, serverQueue);
    return message.channel
    .send('Načítám ...')
    .then((sent) => {
      setTimeout(() => {
        sent.delete();
      }, 2500);
    });
  } else if (message.content.startsWith(`!stop`)) {
    stop(message, serverQueue);
    return message.channel
    .send('Načítám ...')
    .then((sent) => {
      setTimeout(() => {
        sent.delete();
      }, 2500);
    });
  }  else if (message.content.startsWith("!clear")) {
    return message.channel
    .send('Načítám ...')
    .then((sent) => {
      setTimeout(() => {
        sent.delete();
      }, 2500);
    });
  }  else if (message.content.startsWith("!c")) {
    return message.channel
    .send('Načítám ...')
    .then((sent) => {
      setTimeout(() => {
        sent.delete();
      }, 2500);
    });
  }  else if (message.content.startsWith("!c help")) {
    return message.channel
    .send('Načítám ...')
    .then((sent) => {
      setTimeout(() => {
        sent.delete();
      }, 2500);
    });
  }  else if (message.content.startsWith("!clear help")) {
    return message.channel
    .send('Načítám ...')
    .then((sent) => {
      setTimeout(() => {
        sent.delete();
      }, 2500);
    });

  } else {
    message.channel
    .send('**Neznámý příkaz**')
    .then((sent) => {
      setTimeout(() => {
        sent.delete();
      }, 2500);
    });
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "**Musíš být připojen v hracím kanálu**"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Nemáš právo k připojení do hlasového kanálu"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} byl přidán do listu`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Musíš být připojen v hlasovém kanále pro přeskočení písně"
    );
  if (!serverQueue)
    return message.channel.send("Tuto skladbu nemůžete přeskočit");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Musíte být připojen v hlasovém kanále pro zastavení skladby"
    );
    
  if (!serverQueue)
    return message.channel.send("Tuto skladbu nelze zastavit");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Začíná hrát: **${song.title}**`);
}

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content
    .toLowerCase()
    .slice(prefix.length)
    .trim()
    .split(/\s+/);
  const [command, input] = args;

  if (command === 'clear' || command === 'c') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel
        .send(
          "Nemáš permise",
        );
    }

    if (isNaN(input)) {
      return message.channel
        .send('**Vlož počet zpráv, které mám smazat**')
        .then((sent) => {
          setTimeout(() => {
            sent.delete();
          }, 2500);
        });
    }

    if (Number(input) < 0) {
      return message.channel
        .send('Musí to být kladné číslo')
        .then((sent) => {
          setTimeout(() => {
            sent.delete();
          }, 2500);
        });
    }


    const amount = Number(input) > 100
      ? 101
      : Number(input) + 1;

    message.channel.bulkDelete(amount, true)
    .then((_message) => {
      message.channel

        .send(`Bot vymazal \`${_message.size}\` zpráv :broom: by ${member.mention}`)
        .then((sent) => {
          setTimeout(() => {
            sent.delete();
          }, 2500);
        });
    });
  }

  if (command === 'help' && input === 'clear') {
    const newEmbed = new MessageEmbed()
      .setColor('#00B2B2')
      .setTitle('**Clear Help**')
      .setDescription(
        `Příklad \`${prefix}clear 5\` or \`${prefix}c 5\`.`,
      )
      .setFooter(
        `Žádáno od: ${message.author.tag}`,
        message.author.displayAvatarURL(),
      )
      .setTimestamp();

    message.channel.send(newEmbed);
  }
});


   

client.login("ODE1OTcwODUxNjg5OTg4MTI3.YD0KEw.XUO_wad9nG3ckBXzCX6Az34czag");
