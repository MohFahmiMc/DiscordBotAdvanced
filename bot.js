require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const prefix = "!";

// Status
client.on("ready", () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
  client.user.setActivity("with Scarily ID Group", { type: 0 }); // PLAYING
});

// Anti-crash
process.on("unhandledRejection", (err) => console.log("Unhandled:", err));
process.on("uncaughtException", (err) => console.log("Uncaught:", err));

// -----------------------------
//        COMMAND HANDLER
// -----------------------------
client.on("messageCreate", async (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  // ---------------------------------
  // 🛠 Moderation Commands
  // ---------------------------------

  // Kick
  if (cmd === "kick") {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return msg.reply("❌ Kamu tidak punya izin Kick!");

    const target = msg.mentions.members.first();
    if (!target) return msg.reply("Tag anggota yang ingin di-kick.");

    await target.kick();
    msg.channel.send(`👢 Berhasil Kick: **${target.user.tag}**`);
  }

  // Ban
  if (cmd === "ban") {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return msg.reply("❌ Kamu tidak punya izin Ban!");

    const target = msg.mentions.members.first();
    if (!target) return msg.reply("Tag anggota yang ingin di-ban.");

    await target.ban();
    msg.channel.send(`🔨 Berhasil Ban: **${target.user.tag}**`);
  }

  // Unban
  if (cmd === "unban") {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return msg.reply("❌ Kamu tidak punya izin Unban!");

    const userId = args[0];
    if (!userId) return msg.reply("Masukkan User ID untuk unban.");

    msg.guild.members.unban(userId)
      .then(() => msg.channel.send(`♻️ Berhasil Unban ID: ${userId}`))
      .catch(() => msg.reply("ID tidak valid / user tidak di-ban."));
  }

  // Clear
  if (cmd === "clear" || cmd === "purge") {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return msg.reply("❌ Kamu tidak punya izin Manage Messages.");

    const jumlah = parseInt(args[0]);
    if (!jumlah) return msg.reply("Masukkan jumlah pesan!");

    await msg.channel.bulkDelete(jumlah, true);
    msg.channel.send(`🧹 Terhapus **${jumlah}** pesan.`);
  }

  // Slowmode
  if (cmd === "slowmode") {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return msg.reply("❌ Kamu tidak punya izin.");

    const detik = parseInt(args[0]);
    if (isNaN(detik)) return msg.reply("Masukkan angka detik!");

    msg.channel.setRateLimitPerUser(detik);
    msg.channel.send(`🐌 Slowmode di-set: **${detik} detik**`);
  }

  // Lock
  if (cmd === "lock") {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return msg.reply("❌ Kamu tidak punya izin.");

    msg.channel.permissionOverwrites.edit(msg.guild.roles.everyone, { SendMessages: false });
    msg.channel.send("🔒 Channel dikunci!");
  }

  // Unlock
  if (cmd === "unlock") {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return msg.reply("❌ Kamu tidak punya izin.");

    msg.channel.permissionOverwrites.edit(msg.guild.roles.everyone, { SendMessages: true });
    msg.channel.send("🔓 Channel dibuka!");
  }

  // Warn
  if (cmd === "warn") {
    const member = msg.mentions.members.first();
    if (!member) return msg.reply("Tag user!");

    const reason = args.slice(1).join(" ") || "Tidak ada alasan";

    msg.channel.send(`⚠️ **${member.user.tag}** diberi peringatan!\nAlasan: ${reason}`);
  }

  // Mute (Role-based)
  if (cmd === "mute") {
    const member = msg.mentions.members.first();
    if (!member) return msg.reply("Tag user!");

    let role = msg.guild.roles.cache.find(r => r.name === "Muted");

    if (!role) {
      role = await msg.guild.roles.create({
        name: "Muted",
        permissions: []
      });

      msg.guild.channels.cache.forEach(ch => {
        ch.permissionOverwrites.edit(role, { SendMessages: false });
      });
    }

    await member.roles.add(role);
    msg.channel.send(`🔇 Berhasil mute: **${member.user.tag}**`);
  }

  // Unmute
  if (cmd === "unmute") {
    const member = msg.mentions.members.first();
    if (!member) return msg.reply("Tag user!");

    const role = msg.guild.roles.cache.find(r => r.name === "Muted");
    if (!role) return msg.reply("Role Muted tidak ditemukan.");

    await member.roles.remove(role);
    msg.channel.send(`🔊 Berhasil unmute: **${member.user.tag}**`);
  }

  // -----------------------------
  // ❗ Informasi Commands
  // -----------------------------

  if (cmd === "help") {
    const embed = new EmbedBuilder()
      .setTitle("⚙️ Moderation Bot Commands")
      .setColor("Aqua")
      .setDescription(`
**Moderation**
> !kick @user  
> !ban @user  
> !unban <id>  
> !clear <jumlah>  
> !slowmode <detik>  
> !lock  
> !unlock  
> !warn @user  
> !mute @user  
> !unmute @user  

**Info**
> !ping  
> !avatar  
> !server
      `)
      .setFooter({ text: "Scarily ID Group Moderation Bot" });

    msg.channel.send({ embeds: [embed] });
  }

  // Ping
  if (cmd === "ping") {
    msg.reply(`Pong! Latency: **${client.ws.ping}ms**`);
  }

  // Avatar
  if (cmd === "avatar") {
    const user = msg.mentions.users.first() || msg.author;
    msg.reply(user.displayAvatarURL({ dynamic: true, size: 2048 }));
  }

  // Server Info
  if (cmd === "server") {
    msg.reply(`📌 Nama Server: **${msg.guild.name}**\n👥 Member: **${msg.guild.memberCount}**`);
  }
});

// Login bot
client.login(process.env.TOKEN);
