module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}, whose in ${client.guilds.cache.size} servers, serving a total of ${client.users.cache.size} users!`);
	},
};