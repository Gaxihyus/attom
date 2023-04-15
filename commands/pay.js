const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const { currencyPrefix } = require("../config.json");
const { User } = require("../utils/schemas")


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription('Pays someone a certain amount of moneey')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The person you want to pay money')
            .setRequired(true)
        )
        .addNumberOption(
            option => option
            .setName("amount")
            .setDescription("Amount to pay")
            .setRequired(true)
            .setMinValue(100)), 
	async execute(interaction) {
        var amount = interaction.options.getNumber('amount')
        const user = interaction.member.user,
        targetUser = interaction.options.getUser('target');
        userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
        targetData = await User.findOne({id: targetUser.id}) || new User({ id: user.id })
        embed = new EmbedBuilder().setColor('Yellow');

        if (userData.wallet < amount)  amount = userData.wallet;

        userData.wallet -= amount
        targetData.wallet += amount
        userData.save()
        targetData.save();

        return interaction.reply({
            embeds: [ embed.setDescription(`✅ You have paid \`${currencyPrefix} ${amount}\` to <@${targetUser.id}>`) ]
        })
    }
}
