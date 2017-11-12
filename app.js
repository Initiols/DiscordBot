const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const config = require('./config.json');

const client = new Discord.Client();



client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  client.channels.find('name', 'bot').send(`${client.user.username} s\'est connecté`);
  client.user.setGame('Ready to fuck you up!');
});

client.on('disconnect', () => {
  console.log(`${client.user.username} has disconnected!`);
});

client.on("message", async message => {
  if (message.tts) {
    if (message.content.length > 30) {
      message.delete()
      message.reply('NO CANCER PLEASE (pas de /tts a plus de 30 charactères)')
      // message.reply('Vous ne pouvez plus envoyer de /tts pendant les 5 prochaines minutes.')
      // message.member.removeRole('281768979033358338'); //changer les ID des rôles
      // setTimeout(function() {
      //   message.member.addRole('281768979033358338'); //changer les ID des rôles
      // }, 300000); //ajouter un await pour envoyer un message @user quand il retrouve le rôle
    }
  }

  if (message.guild.id === '378232019102072833' && message.channel.name === 'screenshots') {
    if (message.attachments.size === 0) {
      message.react('🚫')
      setTimeout(function() {
        message.delete();
        message.guild.channels.get('378232019684950018').send(
          new Discord.RichEmbed()
          .setThumbnail(message.author.avatarURL)
          .addField('Auteur', message.author, true)
          .addField('Channel', message.guild.channels.find('name', 'screenshots'), true)
          .addField('Message', message.content, true)
          .setColor(message.member.displayColor)
          .setFooter('Message déplacé car il ne contenait pas de screenshot', 'https://goo.gl/32dztg')
        );
      }, 1500);
    } else {
      message.react('✅');
    }
  }

  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length).toLowerCase();

  let args = message.content.split(" ").slice(1);

  console.log(command);
  console.log(args);

  let devChannel = message.guild.channels.find("name", "bots"); //utiliser le config.json pour cette ligne ?

  if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! La latence est de ${m.createdTimestamp - message.createdTimestamp}ms. La latence de l'API est ${Math.round(client.ping)}ms`);
  }

  if (command === 'messagetoembed') {
    message.channel.send(message.author,
      new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(message.member.displayColor)
      .setDescription(args.join(" "))
      .setFooter('Brought to you by Pickle', 'https://goo.gl/32dztg')
      .setTimestamp()
    );
    message.delete();
  } else

  if (command === 'purge') {
    if (args.length === 0 || args[0] < config.minPurgeLength || args[0] > config.maxPurgeLength) return message.reply(`Il faut donner un nombre entre \`${config.minPurgeLength}\` et \`${config.maxPurgeLength}\` de messages à supprimer`)

    message.channel.send(`Vous allez supprimer \`${args[0]}\` messages (sans compter la commande et ce message)`, { reply: message.author })
      .then(msg => {
        msg.react('🚫').then(x => {
          msg.react('✅').then(y => {
            const collector = msg.createReactionCollector((reaction, user) => {
              if ((reaction.emoji.name === '🚫' || reaction.emoji.name === '✅') && user.id === message.author.id) {
                return true;
              }
            }, { time: 15000 });
            collector.on('collect', reaction => {
              if (reaction.emoji.name === '🚫' && reaction.count > 1) {
                msg.delete();
                message.delete();
                return;
              }
              if (reaction.emoji.name === '✅' && reaction.count > 1) {
                msg.delete().then(z1 => {
                  message.delete().then(z2 => {
                    message.channel.fetchMessages({
                        limit: args[0]
                      })
                      .then(messages => message.channel.bulkDelete(messages));
                  })
                })

              }
            });
            collector.on('end', collected => {
              if (collected.size < 1) {
                message.channel.send('Pas de réponse détectée')
                  .then(m => {
                    setTimeout(function() {
                      m.delete();
                      msg.delete();
                      message.delete();
                    }, 2000);
                  })
              }
            });
          })
        })
      });
  } else

  if (command === 'playcancer') {
    if (!message.member.voiceChannel) return message.reply(`Please be in a voice channel first!`);
    message.member.voiceChannel.join()
      .then(connection => console.log('Connected!'))
      .catch(console.error);
    setTimeout(function() {
      message.member.voiceChannel.leave();
    }, 100);
  } else

  if (command === 'play') {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.reply(`Please be in a voice channel first!`);
    voiceChannel.join()
      .then(connnection => {
        const stream = ytdl("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
          filter: 'audioonly'
        });
        const dispatcher = connnection.playStream(stream);
        dispatcher.on('end', () => voiceChannel.leave());
      });
  } else

  if (command === 'repeat') { //commande pour spam un mot pendant config.maxTopkekDuration millisecondes  IDEA: del les msg une fois la boucle finie
    let repeat = true;
    if (args.length > 0) {} else {
      return message.reply(`Il faut donner un mot à spam`); //possibilité de faire une phrase, et pas un mot? => message.channel.send(args.join(" ")); ?
    }

    while (repeat) {
      message.channel.send(args[0]); //n'envoie rien du tout
      console.log("Passé par ici");
      message.channel.awaitMessages(message => message.content.startsWith('oui'), { max: 1, time: config.maxTopkekDuration, errors: ['time'] })
        .then(collected => {
          console.log('stop detected, stopping repeating stuff'),
            repeat = false
        })
        .catch(collected => {
          console.log(`repeat spam stopped after \`${config.maxTopkekDuration}\` milliseconds`),
            repeat = false
        })
    }
  } else

  if (command === "add") {
    let numArray = args.map(n => parseInt(n));
    let total = numArray.reduce((p, c) => p + c);
    message.channel.send(total);
  } else

  if (command === "roll") {
    if (args.length > 0) {} else {
      args.push(6);
    }
    var roll = Math.floor(Math.random() * args) + 1;

    message.delete()
      .catch(console.error);
    message.reply(`Tu as eu un \`${roll}\`                     (sur \`${args}\`)`);
  } else

  if (command === "say") {
    message.channel.send(args.join(" "));
  } else

  if (command === "avatar") {
    let oui;
    if (message.mentions.users.size === 0) {
      oui = message.author.avatarURL;
    } else oui = message.mentions.users.first().avatarURL;
    message.channel.send(oui);
  } else

  if (command === "id") {
    let oui;
    if (message.mentions.users.size === 0) {
      oui = message.author.id;
    } else {
      oui = message.mentions.users.first().id;
    }
    message.channel.send(oui);
  } else

  if (command === "username") {
    let oui;
    if (message.mentions.users.size === 0) {
      oui = message.author.username;
    } else oui = message.mentions.users.first().username;
    message.channel.send(oui);
  }

  if (command === 'kick') {
    if (!message.member.roles.has(modRole.id)) return message.reply('vous n\'avez pas la permission d\'utiliser cette commande.') //changer les ID des rôles

    if (message.mentions.users.size === 0) return message.reply('Il faut mentionner le nom d\'un utilisateur !')

    let kickMember = message.guild.member(message.mentions.users.first())
    if (!kickMember) return message.reply('Cet utilisateur n\'a pas l\'air d\'être valide...')

    kickMember.kick()
      .then(member => {
        message.reply(`${kickMember.user.username} a bien été kick`)
        devChannel.send(`@everyone ${kickMember.user.username} a été kick`)
      })
      .catch(e => {
        console.log(e)
      })
  } else

  if (command === 'testtts') {
    message.channel.send('TOPKEK', { tts: true })
  } else

  if (command === 'testdisableeveryone') {
    message.channel.send('TOPKEK', { disableEveryone: true })
  } else

  if (command === 'testsplit') {
    message.channel.send('TOPKEK', { split: true }) //message pas du tout assez long xddddd
  } else

  if (command === 'testreactionsinterract') {
    message.channel.send("", {
      embed: {
        hexColor: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: 'Ceci est un test',
        url: 'http://google.com',
        description: 'Interragissez avec les réactions !',
        fields: [{
          name: 'Ceci est un exemple',
          value: 'Avec des réactions intelligentes'
        }, ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: '© Example'
        }
      }

    });

    // message.react('👍')
    // message.react('👎')
    // message.react('🔢')

    // if (message.reactions.size)
  } else

  if (command === 'teststatus') {
    if (message.mentions.users.size === 0) return message.reply('Il faut mentioner un utilisateur (@ devant)')
    let mentionned = message.mentions.users.first()
    message.reply(`${mentionned} is ${mentionned.presence.status}`)
  } else

  if (command === 'testdefi') {
    if (message.mentions.users.size === 0) return message.reply('Il faut mentioner un utilisateur (@ devant)')
    let defieur = message.author
    let défié = message.mentions.users.first()
    let defieurName = message.author.username
    let defiéName = message.mentions.users.first().username

    if (!defiéName) return message.reply('Cet utilisateur n\'a pas l\'air valide')
    if (defieur === défié) return message.reply('Vous ne pouvez pas vous défier vous-même !')
    if (défié.presence.status !== 'online') return message.reply('Cet utilisateur n\'est pas connecté !')

    message.reply(`Le defi fonctionne ${defieur} vs ${défié}`)
  } else

  if (command === 'testawait') {
    const filter = message => message.content.startsWith('testAwait');
    // errors: ['time'] treats ending because of the time limit as an error
    devChannel.awaitMessages(filter, { //attention à devChannel
        max: 4,
        time: 60000,
        errors: ['time']
      })
      .then(collected => {
        console.log(collected.size)
        devChannel.send(`${collected.size} 'testAwait' obtenus, fin de l'attente`)
      })
      .catch(collected => {
        console.log(`After a minute, only ${collected.size} out of 4 voted.`)
        devChannel.send(`Après une minute, seulement ${collected.size} 'testAwait' sur 4 ont été obtenus.`)
      })
  } else

  if (command === "testembed") {
    message.channel.send({
      embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: 'This is an embed',
        url: 'http://google.com',
        description: 'This is a test embed to showcase what they look like and what they can do.',
        fields: [{
            name: 'Fields',
            value: 'They can have different fields with small headlines.'
          },
          {
            name: 'Masked links',
            value: 'You can put [masked links](http://google.com) inside of rich embeds.'
          },
          {
            name: 'Markdown',
            value: 'You can put all the *usual* **__Markdown__** inside of them.'
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: '© Example'
        }
      }
    });
  } else

  if (command === "testrichembed") {
    const embed = new Discord.RichEmbed()
      .setTitle('Very Nice Title')
      .setAuthor('Author Name', 'https://goo.gl/rHndF5')
      .setColor(0x00AE86)
      .setDescription('The text of the body, essentially')
      .setFooter('Nice text at the bottom', 'https://goo.gl/hkFYh0')
      .setImage('https://goo.gl/D3uKk2')
      .setThumbnail('https://goo.gl/lhc6ke')
      .setTimestamp()
      .setURL('https://discord.js.org/#/docs/main/indev/class/RichEmbed')
      .addField('Field Title', 'Field Value')
      .addBlankField()
      .addField('Inline Field', 'Hmm 🤔', true)
      .addField('\u200b', '\u200b', true)
      .addField('Second (3rd place) Inline Field', 'I\'m in the ZOONE', true)
      .addField('I like those', 'still look awesome', true);

    message.channel.send(
      'let me just write this down',
      embed, {
        disableEveryone: true
      }
    );
  }
});

client.login(config.token);

/*
https://goo.gl/32dztg = lien photo Pickle
https://discordapp.com/oauth2/authorize?client_id=371707709952622592&scope=bot&permissions=1 = lien pour inviter le bot
*/
