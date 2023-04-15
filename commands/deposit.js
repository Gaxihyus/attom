const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const { currencyPrefix } = require("../config.json");
const { User } = require("../utils/schemas")


module.exports = {
	data: new SlashCommandBuilder()
		.setName('deposit')
		.setDescription('Deposits money on your bank account, preventing any robberies')
        .addNumberOption(
            option => option
            .setName("amount")
            .setDescription("Amount to deposit")
            .setRequired(true)
            .setMinValue(100)), 
	async execute(interaction) {
        const user = interaction.member.user
        var amount = interaction.options.getNumber("amount")
        userData = await User.findOne({ id: user.id }) || new User({ id: user.id }),
        embed = new EmbedBuilder().setColor('Yellow');

        if (userData.wallet < amount)  amount = userData.wallet;

        userData.wallet -= amount
        userData.bank += amount
        userData.save()

        return interaction.reply({
            embeds: [ embed.setDescription(`✅ You have deposited \` ${currencyPrefix}  ${amount} \` into your bank account`) ]
        })
    }
}
