require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

// === Semua command digabung di sini ===
const commands = [
    // === Fun / Interaction ===
    {
        name: 'ping',
        description: 'Check latency',
        execute: async (interaction) => {
            await interaction.reply(`Pong! ${Date.now() - interaction.createdTimestamp}ms`);
        }
    },
    {
        name: 'say',
        description: 'Bot repeat message',
        options: [{ name: 'message', type: 3, description: 'Message to repeat', required: true }],
        execute: async (interaction) => {
            const msg = interaction.options.getString('message');
            await interaction.reply(msg);
        }
    },
    {
        name: 'hug',
        description: 'Send hug to someone',
        options: [{ name: 'user', type: 6, description: 'User to hug', required: true }],
        execute: async (interaction) => {
            const user = interaction.options.getUser('user');
            await interaction.reply(`${interaction.user.username} gives a hug to ${user.username} 🤗`);
        }
    },
    {
        name: 'pat',
        description: 'Pat someone',
        options: [{ name: 'user', type: 6, description: 'User to pat', required: true }],
        execute: async (interaction) => {
            const user = interaction.options.getUser('user');
            await interaction.reply(`${interaction.user.username} pats ${user.username} 👋`);
        }
    },
    {
        name: 'joke',
        description: 'Random joke',
        execute: async (interaction) => {
            const jokes = [
                "Kenapa programmer nggak suka hujan? Karena takut bug!",
                "Apa bedanya hardware dan software? Hardware bisa dipukul, software cuma error 😅"
            ];
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            await interaction.reply(joke);
        }
    },
    {
        name: 'meme',
        description: 'Random meme',
        execute: async (interaction) => {
            const memes = [
                "https://i.imgflip.com/1bij.jpg",
                "https://i.imgflip.com/26am.jpg"
            ];
            const meme = memes[Math.floor(Math.random() * memes.length)];
            await interaction.reply(meme);
        }
    },
    {
        name: 'roll',
        description: 'Roll a dice',
        execute: async (interaction) => {
            const number = Math.floor(Math.random() * 6) + 1;
            await interaction.reply(`🎲 You rolled a ${number}`);
        }
    },
    {
        name: 'coinflip',
        description: 'Flip a coin',
        execute: async (interaction) => {
            const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
            await interaction.reply(`🪙 ${result}`);
        }
    },
    {
        name: 'trivia',
        description: 'Random trivia',
        execute: async (interaction) => {
            const trivia = [
                "Honey never spoils.",
                "Bananas are berries, but strawberries are not."
            ];
            await interaction.reply(trivia[Math.floor(Math.random() * trivia.length)]);
        }
    },
    // === Utility / Info ===
    {
        name: 'serverinfo',
        description: 'Info about server',
        execute: async (interaction) => {
            const guild = interaction.guild;
            await interaction.reply(`Server: ${guild.name}\nMembers: ${guild.memberCount}`);
        }
    },
    {
        name: 'userinfo',
        description: 'Info about a user',
        options: [{ name: 'user', type: 6, description: 'Select user', required: false }],
        execute: async (interaction) => {
            const user = interaction.options.getUser('user') || interaction.user;
            await interaction.reply(`User: ${user.tag}\nID: ${user.id}`);
        }
    },
    {
        name: 'avatar',
        description: 'Show user avatar',
        options: [{ name: 'user', type: 6, description: 'Select user', required: false }],
        execute: async (interaction) => {
            const user = interaction.options.getUser('user') || interaction.user;
            await interaction.reply(user.displayAvatarURL({ dynamic: true, size: 1024 }));
        }
    },
    {
        name: 'invite',
        description: 'Invite link for bot',
        execute: async (interaction) => {
            await interaction.reply(`Invite me: https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&scope=bot+applications.commands&permissions=8`);
        }
    },
    {
        name: 'serverstats',
        description: 'Server stats',
        execute: async (interaction) => {
            const guild = interaction.guild;
            await interaction.reply(`Members: ${guild.memberCount}, Channels: ${guild.channels.cache.size}`);
        }
    },
    {
        name: 'remind',
        description: 'Set reminder',
        options: [
            { name: 'time', type: 3, description: 'Time in minutes', required: true },
            { name: 'message', type: 3, description: 'Reminder message', required: true }
        ],
        execute: async (interaction) => {
            const time = parseInt(interaction.options.getString('time'));
            const msg = interaction.options.getString('message');
            await interaction.reply(`Reminder set for ${time} minute(s)!`);
            setTimeout(() => interaction.followUp(`⏰ Reminder: ${msg}`), time * 60000);
        }
    },
    {
        name: 'sayhi',
        description: 'Bot says hi',
        execute: async (interaction) => {
            await interaction.reply(`Hi ${interaction.user.username}! 👋`);
        }
    },
    {
        name: 'weather',
        description: 'Get weather info',
        options: [{ name: 'city', type: 3, description: 'City name', required: true }],
        execute: async (interaction) => {
            const city = interaction.options.getString('city');
            await interaction.reply(`Weather info for ${city} is sunny 🌞 (dummy example)`);
        }
    },
    {
        name: 'translate',
        description: 'Translate text',
        options: [
            { name: 'text', type: 3, description: 'Text to translate', required: true },
            { name: 'lang', type: 3, description: 'Target language', required: true }
        ],
        execute: async (interaction) => {
            const text = interaction.options.getString('text');
            const lang = interaction.options.getString('lang');
            await interaction.reply(`Translating "${text}" to ${lang} (dummy example)`);
        }
    },
    {
        name: 'calc',
        description: 'Simple calculator',
        options: [{ name: 'expression', type: 3, description: 'Expression to calculate', required: true }],
        execute: async (interaction) => {
            const expr = interaction.options.getString('expression');
            try { 
                const result = eval(expr);
                await interaction.reply(`Result: ${result}`);
            } catch { 
                await interaction.reply('Invalid expression!'); 
            }
        }
    },
    // === Moderation ===
    {
        name: 'kick',
        description: 'Kick a member',
        options: [{ name: 'user', type: 6, description: 'User to kick', required: true }],
        execute: async (interaction) => {
            const member = interaction.options.getMember('user');
            if(!member) return interaction.reply('User not found!');
            await member.kick();
            await interaction.reply(`${member.user.tag} was kicked!`);
        }
    },
    {
        name: 'ban',
        description: 'Ban a member',
        options: [{ name: 'user', type: 6, description: 'User to ban', required: true }],
        execute: async (interaction) => {
            const member = interaction.options.getMember('user');
            if(!member) return interaction.reply('User not found!');
            await member.ban();
            await interaction.reply(`${member.user.tag} was banned!`);
        }
    },
    {
        name: 'mute',
        description: 'Mute a member',
        options: [{ name: 'user', type: 6, description: 'User to mute', required: true }],
        execute: async (interaction) => {
            const member = interaction.options.getMember('user');
            if(!member) return interaction.reply('User not found!');
            await interaction.reply(`${member.user.tag} has been muted! (dummy example)`);
        }
    },
    {
        name: 'unmute',
        description: 'Unmute a member',
        options: [{ name: 'user', type: 6, description: 'User to unmute', required: true }],
        execute: async (interaction) => {
            const member = interaction.options.getMember('user');
            if(!member) return interaction.reply('User not found!');
            await interaction.reply(`${member.user.tag} has been unmuted! (dummy example)`);
        }
    },
    {
        name: 'lockdown',
        description: 'Lock a channel',
        execute: async (interaction) => {
            await interaction.reply('Channel locked! (dummy example)');
        }
    },
    {
        name: 'unlock',
        description: 'Unlock a channel',
        execute: async (interaction) => {
            await interaction.reply('Channel unlocked! (dummy example)');
        }
    },
    {
        name: 'greet',
        description: 'Bot greet message',
        execute: async (interaction) => {
            await interaction.reply('Hello! Welcome to the server!');
        }
    },
    {
        name: 'ai',
        description: 'AI response',
        options: [{ name: 'question', type: 3, description: 'Ask me anything', required: true }],
        execute: async (interaction) => {
            const q = interaction.options.getString('question');
            await interaction.reply(`AI says: "${q}" (dummy AI response)`);
        }
    }
];

// Register all commands
for(const cmd of commands) client.commands.set(cmd.name, cmd);

// Ready event
client.once('ready', () => {
    console.log(`Bot online: ${client.user.tag}`);
    client.user.setActivity('Scarily Group', { type: 'PLAYING' });
});

// Interaction create
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    try { await command.execute(interaction); } 
    catch(err) { console.error(err); await interaction.reply({ content: 'Error executing command!', ephemeral: true }); }
});

// Auto-reply
client.on('messageCreate', message => {
    if(message.author.bot) return;
    const msg = message.content.toLowerCase();
    if(msg.includes('halo')) message.reply('Halo juga! 👋');
    if(msg.includes('apa kabar')) message.reply('Baik, kamu sendiri? 😄');
});

client.login(process.env.TOKEN);
