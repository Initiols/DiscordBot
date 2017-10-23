const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require('ytdl-core'); //npm install --save ytdl-core
// const PersistentCollection = require("djs-collection-persistent"); //npm install --save djs-collection-persistent

const config = require('./config.json')
// const typingStartAndStop = require('./typingStartAndStop');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  client.channels.find('name', 'dev_channel').sendMessage('Patrick Bot s\'est connecté');
});

client.on('disconnect', () => {
  console.log(`${client.user.username} has disconnected!`);
});

client.on('guildMemberAdd', member => {
  let guild = member.guild;
  guild.defaultChannel.sendMessage(`Bienvenue, ${member.user} sur ${guild.name} !`)
});

client.on('guildCreate', guild => {
  console.log(`New guild added : ${guild.name}, owned by ${guild.owner.user.username}`)
});

client.on('presenceUpdate', (oldMember, newMember) => {
  let guild = newMember.guild;
  let playRole = guild.roles.find("name", "Playing Brawlhalla");
  if (!playRole) return;

  let IlikeTrutles = 0;
});

// client.on('typingStart', (channel, user) => {
//   channel.sendMessage(`${user} est en train d'écrire`);
// });

client.on('roleUpdate', (oldRole, newRole) => {
  let guild = newRole.guild;
  let devChannel = guild.channels.find("name", "dev_channel");
  // console.log(oldRole.name + newRole.name);
  if (oldRole.name === newRole.name) {
    return;
  }
  devChannel.sendMessage(`Le rôle @${oldRole.name} a été changé en ${newRole}`);
});

client.on('roleCreate', role => {
  let guild = role.guild;
  let devChannel = guild.channels.find("name", "dev_channel");

  devChannel.sendMessage(`Le rôle ${role} a été crée par un Admin !`)
});

client.on('roleDelete', role => {
  let guild = role.guild;
  let devChannel = guild.channels.find("name", "dev_channel");

  devChannel.sendMessage(`Le rôle @${role.name} a été supprimé par un Admin !`)
});

client.on('message', message => {
  // if (message.channel.id === '295491111969882133') {
  //   message.react('👍')
  //   message.react('👎')
  // }

  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix) && !message.tts) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(" ").slice(1);

  let guild = message.guild;
  let devChannel = guild.channels.find("name", "dev_channel");
  // let adminRole = guild.roles.find('name', 'Admin')
  // let modRole = guild.roles.find('name', 'Moderator') // IDEA: il faut que admin = mod + vip + admis (etc)
  // let vipRole = guild.roles.find('name', 'VIP')
  // let admisRole = guild.roles.find('name', 'Admis')

  if (message.tts) {
    if (message.content.length > 30) {
      message.delete()
      message.reply('NO CANCER PLEASE (pas de /tts a plus de 30 charactères)')
      message.reply('Vous ne pouvez plus envoyer de /tts pendant les 5 prochaines minutes.')
      message.member.removeRole('281768979033358338');
      setTimeout(function() {
        message.member.addRole('281768979033358338');
      }, 300000); //ajouter un await pour envoyer un message @user quand il retrouve le rôle
    }
  }

  if (command === 'playCancer') { //marche pas, il faut installer FFMPEG
    if (!message.member.voiceChannel) return message.reply(`please be in a voice channel first!`);
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
        const stream = ytdl("https://www.youtube.com/watch?v=dQw4w9WgXcQ", { filter: 'audioonly' });
        const dispatcher = connnection.playStream(stream);
        dispatcher.on('end', () => voiceChannel.leave());
      });
  } else

  if (command === 'topkek') {
    let repeat = true
    while (repeat) {
      message.channel.sendMessage('topkek')
      message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          console.log('stop detected, stopping topkek')
          repeat = false
        })
        .catch(collected => {
          console.log(`topkek spam stopped after 1 min`)
          repeat = false
        })
    }
  } else

  if (command === 'testReactionsInterract') {
    message.channel.sendMessage("", {
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

  if (command === 'testStatus') {
    if (message.mentions.users.size === 0) return message.reply('Il faut mentioner un utilisateur (@ devant)')
    let mentionned = message.mentions.users.first()
    message.reply(`${mentionned} is ${mentionned.presence.status}`)
  } else

  if (command === 'testDefi') {
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

    // if (command === "TicTacToe") { // IDEA: Créer une channel 'games / jeux' quand tout est valide, que l'on supprime à la fin, on ne peut pas écrire dedans, quand c'est à notre tour de jouer / quand on nous invite a jouer, on donne le rôle 'games', ce que donne la permission de parler dedans (une fois qu'on a joué, on envèle le rôle)
    //   if (args === message.guildMember.presence.equals('online')) {
    //     guild.channels.find('name', 'games').sendMessage(`@${args}, vous avez été défié au Morpion par ${message.author} ! Ecrivez ci dessous O (= Oui) / N (= Non) pour accepter / refuser le défi.`);
    //   } else {
    //     message.channel.sendMessage('Spécifiez le nom du joueur à défier !'); // IDEA: 'Qui voulez-vous défier ?' (→ How to 'wait' for the message / How to get the message without the 'client.on('message')' ?
    //   }
    //
    //   // IDEA: Wait for the guy challeged to anwser back in the next 30 seconds, if not, come back to normal (→ How to 'wait' for the message / How to get the message without the 'client.on('message')' ?
    //
    // } else

    if (command === 'testAwait') {
      const filter = message => message.content.startsWith('testAwait');
      // errors: ['time'] treats ending because of the time limit as an error
      devChannel.awaitMessages(filter, { max: 4, time: 60000, errors: ['time'] })
        .then(collected => {
          console.log(collected.size)
          devChannel.sendMessage(`${collected.size} 'testAwait' obtenus, fin de l'attente`)
        })
        .catch(collected => {
          console.log(`After a minute, only ${collected.size} out of 4 voted.`)
          devChannel.sendMessage(`Après une minute, seulement ${collected.size} 'testAwait' sur 4 ont été obtenus.`)
        })
    } else

  if (command === 'deafenEveryone') {
    if (!message.member.roles.has(adminRole.id)) return ('Vous n\'avez pas la permission d\'utiliser cette commande.')
    message.guild.members.forEach(member => member.setDeaf(true));
  } else

  if (command === 'kick') {
    if (!message.member.roles.has(modRole.id)) return message.reply('vous n\'avez pas la permission d\'utiliser cette commande.')

    if (message.mentions.users.size === 0) return message.reply('Il faut mentionner le nom d\'un utilisateur !')

    let kickMember = guild.member(message.mentions.users.first())
    if (!kickMember) return message.reply('Cet utilisateur n\'a pas l\'air d\'être valide...')

    kickMember.kick()
      .then(member => {
        message.reply(`${kickMember.user.username} a bien été kick`)
        devChannel.sendMessage(`@everyone ${kickMember.user.username} a été kick`)
      })
      .catch(e => {
        console.log(e)
      })
  } else

  if (command === "testEmbed") {
    message.channel.sendMessage("", {
      embed: {
        hexColor: 3447003,
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

  if (command === "testRichEmbed") {
    const embed = new Discord.RichEmbed()
      .setTitle('Very Nice Title')
      .setAuthor('Author Name', 'https://goo.gl/rHndF5')
      /*
       * Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
       */
      .setColor(0x00AE86)
      .setDescription('The text of the body, essentially')
      .setFooter('Nice text at the bottom', 'https://goo.gl/hkFYh0')
      .setImage('https://goo.gl/D3uKk2')
      .setThumbnail('https://goo.gl/lhc6ke')
      /*
       * Takes a Date object, defaults to current date.
       */
      .setTimestamp()
      .setURL('https://discord.js.org/#/docs/main/indev/class/RichEmbed')
      .addField('Field Title', 'Field Value')
      /*
       * Inline fields may not display as inline if the thumbnail and/or image is too big.
       */
      .addField('Inline Field', 'Hmm 🤔', true)
      /*
       * Blank field, useful to create some space.
       */
      .addField('\u200b', '\u200b', true)
      .addField('Second (3rd place) Inline Field', 'I\'m in the ZOONE', true);

    message.channel.sendEmbed(
      embed,
      'this is some content but nobody cares', {
        disableEveryone: true
      }
    );
  } else

  if (command === "add") {
    let numArray = args.map(n => parseInt(n));
    let total = numArray.reduce((p, c) => p + c);
    message.channel.sendMessage(total);
  } else

  if (command === "roll") {
    if (args.length > 0) {} else {
      args.push(6);
    }
    var roll = Math.floor(Math.random() * args) + 1;

    message.delete()
      .catch(console.error);
    message.reply("tu as eu un " + roll + "                    (sur " + args + ")");
  } else

  if (command === "say") {
    message.channel.sendMessage(args.join(" "));
  } else

  if (command === "ping") {
    message.channel.sendMessage('Pong!');
  } else

  if (command === "foo") {
    message.channel.sendMessage("bar!");
  } else

  if (command === "myAvatar") {
    message.channel.sendMessage(message.author.avatarURL);
  } else

  if (command === "myID") {
    message.channel.sendMessage(message.author.id);
  } else

  if (command === "myUsername") {
    message.channel.sendMessage(message.author.username);
  }
});

client.login(config.token)
