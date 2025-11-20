require('dotenv').config();
const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Ready event
client.once('ready', () => {
    console.log(`Bot online: ${client.user.tag}`);
});

// Interaction create (slash commands)
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    try {
        await command.execute(interaction);
    } catch(err) {
        console.error(err);
        await interaction.reply({ content: 'Error executing command!', ephemeral: true });
    }
});

// Message auto-reply
client.on('messageCreate', message => {
    if(message.author.bot) return;
    const content = message.content.toLowerCase();
    if(content.includes('halo')){
        message.reply('Halo juga! 👋');
    }
    if(content.includes('cara')){
        message.reply('butuh bantuan? chat helper!');
    }
    // Tambahkan kata kunci lain di sini
});

client.login(process.env.TOKEN);
