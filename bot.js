require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

// =================== COMMANDS ===================
const commands = [
  { name: 'ping', description: 'Check latency', execute: async (interaction)=>{ await interaction.reply(`Pong! ${Date.now()-interaction.createdTimestamp}ms`); } },
  { name: 'say', description: 'Repeat message', options:[{name:'message', type:3, description:'Message', required:true}], execute: async (interaction)=>{ await interaction.reply(interaction.options.getString('message')); } },
  { name: 'hug', description: 'Send hug', options:[{name:'user', type:6, description:'User', required:true}], execute: async (interaction)=>{ const user = interaction.options.getUser('user'); await interaction.reply(`${interaction.user.username} hugs ${user.username} 🤗`); } },
  { name: 'pat', description: 'Pat user', options:[{name:'user', type:6, description:'User', required:true}], execute: async (interaction)=>{ const user = interaction.options.getUser('user'); await interaction.reply(`${interaction.user.username} pats ${user.username} 👋`); } },
  { name: 'joke', description: 'Random joke', execute: async (interaction)=>{ const jokes=["Kenapa programmer nggak suka hujan? Karena takut bug!","Apa bedanya hardware dan software? Hardware bisa dipukul, software cuma error 😅"]; await interaction.reply(jokes[Math.floor(Math.random()*jokes.length)]); } },
  { name: 'meme', description: 'Random meme', execute: async (interaction)=>{ const memes=["https://i.imgflip.com/1bij.jpg","https://i.imgflip.com/26am.jpg"]; await interaction.reply(memes[Math.floor(Math.random()*memes.length)]); } },
  { name: 'roll', description: 'Roll a dice', execute: async (interaction)=>{ const n=Math.floor(Math.random()*6)+1; await interaction.reply(`🎲 You rolled a ${n}`); } },
  { name: 'coinflip', description: 'Flip a coin', execute: async (interaction)=>{ const result=Math.random()<0.5?'Heads':'Tails'; await interaction.reply(`🪙 ${result}`); } },
  { name: 'trivia', description: 'Random trivia', execute: async (interaction)=>{ const trivia=["Honey never spoils.","Bananas are berries, but strawberries are not."]; await interaction.reply(trivia[Math.floor(Math.random()*trivia.length)]); } },
  { name: 'serverinfo', description: 'Info server', execute: async (interaction)=>{ const g=interaction.guild; await interaction.reply(`Server: ${g.name}\nMembers: ${g.memberCount}`); } },
  { name: 'userinfo', description: 'Info user', options:[{name:'user', type:6, description:'User', required:false}], execute: async (interaction)=>{ const u=interaction.options.getUser('user')||interaction.user; await interaction.reply(`User: ${u.tag}\nID: ${u.id}`); } },
  { name: 'avatar', description: 'Show avatar', options:[{name:'user', type:6, description:'User', required:false}], execute: async (interaction)=>{ const u=interaction.options.getUser('user')||interaction.user; await interaction.reply(u.displayAvatarURL({dynamic:true,size:1024})); } },
  { name: 'invite', description: 'Invite bot', execute: async (interaction)=>{ await interaction.reply(`Invite: https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&scope=bot+applications.commands&permissions=8`); } },
  { name: 'serverstats', description: 'Server stats', execute: async (interaction)=>{ const g=interaction.guild; await interaction.reply(`Members: ${g.memberCount}, Channels: ${g.channels.cache.size}`); } },
  { name: 'remind', description: 'Set reminder', options:[{name:'time', type:3, description:'Minutes', required:true},{name:'message', type:3, description:'Message', required:true}], execute: async (interaction)=>{ const t=parseInt(interaction.options.getString('time')); const m=interaction.options.getString('message'); await interaction.reply(`Reminder set for ${t} minute(s)`); setTimeout(()=>interaction.followUp(`⏰ Reminder: ${m}`),t*60000); } },
  { name: 'sayhi', description: 'Bot says hi', execute: async (interaction)=>{ await interaction.reply(`Hi ${interaction.user.username}! 👋`); } },
  { name: 'weather', description: 'Weather info', options:[{name:'city',type:3,description:'City',required:true}], execute: async (interaction)=>{ await interaction.reply(`Weather for ${interaction.options.getString('city')} is sunny 🌞 (dummy)`); } },
  { name: 'translate', description: 'Translate text', options:[{name:'text',type:3,description:'Text',required:true},{name:'lang',type:3,description:'Target language',required:true}], execute: async (interaction)=>{ await interaction.reply(`Translating "${interaction.options.getString('text')}" to ${interaction.options.getString('lang')} (dummy)`); } },
  { name: 'calc', description: 'Calculator', options:[{name:'expression',type:3,description:'Expression',required:true}], execute: async (interaction)=>{ try{ await interaction.reply(`Result: ${eval(interaction.options.getString('expression'))}`);}catch{await interaction.reply('Invalid expression!');} } },
  { name: 'kick', description: 'Kick member', options:[{name:'user',type:6,description:'User',required:true}], execute: async (interaction)=>{ const m=interaction.options.getMember('user'); if(!m) return interaction.reply('User not found!'); await m.kick(); await interaction.reply(`${m.user.tag} kicked!`); } },
  { name: 'ban', description: 'Ban member', options:[{name:'user',type:6,description:'User',required:true}], execute: async (interaction)=>{ const m=interaction.options.getMember('user'); if(!m) return interaction.reply('User not found!'); await m.ban(); await interaction.reply(`${m.user.tag} banned!`); } },
  { name: 'mute', description: 'Mute member', options:[{name:'user',type:6,description:'User',required:true}], execute: async (interaction)=>{ await interaction.reply('Mute command placeholder'); } },
  { name: 'unmute', description: 'Unmute member', options:[{name:'user',type:6,description:'User',required:true}], execute: async (interaction)=>{ await interaction.reply('Unmute command placeholder'); } },
  { name: 'lockdown', description: 'Lock channel', execute: async (interaction)=>{ await interaction.reply('Lockdown placeholder'); } },
  { name: 'unlock', description: 'Unlock channel', execute: async (interaction)=>{ await interaction.reply('Unlock placeholder'); } },
  { name: 'greet', description: 'Greet', execute: async (interaction)=>{ await interaction.reply('Hello! Welcome to the server!'); } },
  { name: 'ai', description: 'AI response', options:[{name:'question',type:3,description:'Question',required:true}], execute: async (interaction)=>{ await interaction.reply(`AI says: "${interaction.options.getString('question')}" (dummy)`); } }
];

// Register commands in Collection
commands.forEach(c=>client.commands.set(c.name,c));

// =================== READY ===================
client.once('ready', async ()=>{
    console.log(`Bot online: ${client.user.tag}`);
    client.user.setActivity('Scarily Group', { type:'PLAYING' });

    // Optional: register commands to guild for testing
    const rest = new REST({ version:'10' }).setToken(process.env.TOKEN);
    try{
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands.map(c=>{
                return {name:c.name, description:c.description, options:c.options||[]};
            }) }
        );
        console.log('Slash commands registered!');
    }catch(e){ console.error(e); }
});

// =================== INTERACTION ===================
client.on('interactionCreate', async interaction=>{
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    try{ await command.execute(interaction); }
    catch(err){ console.error(err); await interaction.reply({ content:'Error executing command!', ephemeral:true }); }
});

// =================== AUTO-REPLY ===================
client.on('messageCreate', message=>{
    if(message.author.bot) return;
    const m=message.content.toLowerCase();
    if(m.includes('halo')) message.reply('Halo juga! 👋');
    if(m.includes('cara')) message.reply('butuh bantuan? tag helper');
});

// LOGIN
client.login(process.env.TOKEN);
