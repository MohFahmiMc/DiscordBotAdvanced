module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    async execute(interaction){
        await interaction.reply(`Pong! ${Date.now() - interaction.createdTimestamp}ms`);
    }
};
