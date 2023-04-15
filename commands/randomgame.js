const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');

async function Roll(min, max)
{
    min = Math.min(min, max);
    max = Math.max(max, min);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomgame')
		.setDescription('Selects a random known game to play alone/with friends!.'),
        
            
	async execute(interaction) {

        
	const gamelist = [
		"Terraria", "Minecraft", "Astroneer", "Diep.io", "Stick Fight", "ROUNDS", "Roblox", "Raft", "Cards Against Humanity", "The Settlers of Catan", "Uno"
	]

		const roll = await Roll(0, gamelist.length);

        const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`You'll be playing ${gamelist[roll]} next!`);
        
        await interaction.reply({ embeds: [embed] })
    }
}