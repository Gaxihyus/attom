const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');

async function Roll(min, max)
{
    min = Math.min(min, max);
    max = Math.max(max, min);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('Ask a yes or no question to Attom!')
        .addStringOption(option =>
            option.setName('question')
            .setDescription("What yes or no question are you gonna ask the all mighty Attom?")
            .setRequired(true)    
        ),
        
            
	async execute(interaction) {

        
	const responses = [
/*Negatives*/	"No god please no", "Hell no", "Don't think so chief", "Denied", "F@#! no!", "**Abso-gosh-darn-diddily-darn no**", "Are you ok? Like seriously? I'm not even gonna answer that", 
/*Neutrals*/   "Meh", "Maybe", "Perhaps", "I'm gonna be honest.. I have no god damn clue", "Whatever floats your boat", "Can't care less", "Meh", "Big ol' 50/50 on this one", 
/*Positives*/   "Hell yeah", "Yep", "Absolutely yassss queeen", "FULL BEANS", "Just yolo it my g", "Mhm Mhm", "I like dat idea, yes", "Are you ok? Like Seriously, its obviously a **yes!!!**", "YES PLEASE RIGHT NOW THIS INSTANT"
	]

		const roll = await Roll(0, responses.length);

        const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Question: ${interaction.options.getString('question')}`)
        .setDescription(`${responses[roll]}`);
        
        const message = await interaction.reply({ embeds: [embed] })
    }
}