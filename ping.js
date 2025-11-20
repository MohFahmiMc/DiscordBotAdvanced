module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    execute(message, args) {
        message.channel.send(`Pong! Latency: ${Date.now() - message.createdTimestamp}ms`);
    }
}
