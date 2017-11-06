const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  client.channels.find('name', 'bots').send('Patrick Bot s\'est connecté');
});

client.on('disconnect', () => {
  console.log(`${client.user.username} has disconnected!`);
});

client.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix) && !message.tts) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);
  console.log(command);

  let args = message.content.split(" ").slice(1);
  console.log(args);

  let devChannel = message.guild.channels.find("name", "bots"); //utiliser le config.json pour cette ligne

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

  if (command === 'purge') {
    if (args.length > 0) {} else {
      return message.reply(`Il faut donner le nombre de messages à supprimer (min: \`${config.minPurgeLength}\` | max: \`${config.maxPurgeLength}\`)`);
    }

    if (args[0] < config.minPurgeLength) {
      return message.reply(`Le nombre minimum de messages à supprimer est de \`${config.minPurgeLength}\``);
    } else if (args[0] > config.maxPurgeLength) {
      return message.reply(`Le nombre maximum de messages à supprimer est de \`${config.maxPurgeLength}\``);
    }

    message.channel.fetchMessages({
        limit: args[0]
      })
      .then(messages => message.channel.bulkDelete(messages)); //message.reply(`\`${messages.length}\` messages supprimés`));
  } else

  if (command === 'playCancer') {
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

  if (command === 'repeat') {   //commande pour spam un mot pendant config.maxTopkekDuration millisecondes  IDEA: del les msg un fois la bouche finie
    let repeat = true;
    if (args.length > 0) {} else {
      return message.reply(`Il faut donner un mot à spam`); //possibilité de faire une phrase, et pas un mot? => message.channel.send(args.join(" ")); ?
    }

    while (repeat) {
      message.channel.send(args[0]); //n'envoie rien du tout
      console.log("Passé par ici");
      message.channel.awaitMessages(message => message.content.startsWith('oui'), { max: 1, time: config.maxTopkekDuration, errors: ['time']})
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

  if (command === 'kick') {
    if (!message.member.roles.has(modRole.id)) return message.reply('vous n\'avez pas la permission d\'utiliser cette commande.')

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
    message.reply("tu as eu un " + roll + "                    (sur " + args + ")");
  } else

  if (command === "say") {
    message.channel.send(args.join(" "));
  } else

  if (command === "myAvatar") {
    message.channel.send(message.author.avatarURL);
  } else

  if (command === "myID") {
    message.channel.send(message.author.id);
  } else

  if (command === "myUsername") {
    message.channel.send(message.author.username);
  }

  if (command === 'testReactionsInterract') {
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

  if (command === 'testAwait') {
    const filter = message => message.content.startsWith('testAwait');
    // errors: ['time'] treats ending because of the time limit as an error
    devChannel.awaitMessages(filter, {
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

  if (command === 'testTTS') {
    message.channel.send('TOPKEK', {tts: true})
  } else

  if (command === 'testMESSAGEDisableEveryone') {

  } else

  if (command === 'testMESSAGESplit') {

  } else

  if (command === "testEmbed") {
    message.channel.send("", {
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

    message.channel.send(
      embed,
      'this is some content but nobody cares', {
        disableEveryone: true
      }
    );
  }
});

client.login(config.token);
