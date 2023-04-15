const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');

async function Roll(min, max)
{
    min = Math.min(min, max);
    max = Math.max(max, min);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a number between a minimal and maximum value')
        .addIntegerOption(option =>
            option.setName('min')
                .setDescription('Minimal value to be rolled')
                .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('max')
                        .setDescription('Maximum value to be rolled')
                        .setRequired(true)),
        
            
	async execute(interaction) {
        const min = interaction.options.getInteger('min');
        const max = interaction.options.getInteger('max');
		const roll = await Roll(min, max);

        const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`🎲 You rolled a ${roll}! Lucky! 🎲`);
        
        await interaction.reply({ embeds: [embed] })
    }
}