const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const { currencyPrefix } = require("../config.json");
const { User } = require("../utils/schemas")
const wait = require('node:timers/promises').setTimeout;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('withdraw')
		.setDescription('Withdraws money from your bank account, allowing you to buy items')
        .addNumberOption(
            option => option
            .setName("amount")
            .setDescription("Amount to deposit")
            .setRequired(true)
            .setMinValue(100)), 
	async execute(interaction) {
        const user = await interaction.member.user
        var amount = interaction.options.getNumber("amount")
        userData = await User.findOne({ id: user.id }) || new User({ id: user.id });

        if (userData.bank < amount)  amount = userData.bank;
        
        embed = new EmbedBuilder().setColor('Yellow').setDescription(`✅ You have withdrawn \` ${currencyPrefix}  ${amount} \` amount into your bank account`);
        await wait(2000);

        userData.wallet += amount
        userData.bank -= amount
        userData.save()

        return  interaction.reply({
            embeds: [ embed ]
        })
    }
}
