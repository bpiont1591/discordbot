// 2022-20023 !bpiont WERSJA DEMO (DARMOWA)
// Podstawowe zabezpieczenia ukryte w kodzie
// Udostępnione dnia 24.12.2023 Wesołych Świąt!

const { Client, Intents, MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const cleanupEvent = require('./cleanup.js');
const token = config.token;


  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}
// Aby uruchomić komendę wpisz ! ( Zawsze możesz zmienić sobie )
const prefix = '!'; 
client.commands = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log('Bot został uruchomiony poprawnie.');
  client.user.setPresence({
    status: config.status,
  });


  client.user.setActivity(config.activity.name, {
    type: config.activity.type,
  });
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply({ content: 'Wystąpił błąd podczas wykonywania komendy!' });
  }
});

client.login(token);