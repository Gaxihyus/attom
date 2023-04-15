const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const { modelNames } = require('mongoose');
const { currencyPrefix, moneyActions } = require("../config.json");
const { User } = require("../utils/schemas")
const prettyMilliseconds = require('pretty-ms');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('rob')
		.setDescription('Attempts to rob someone for 1-100% of their wallet!')
        .addUserOption(option => option
            .setName('target')
            .setDescription("Who you want to rob")
            .setRequired(true)
        ), 
	async execute(interaction) {
        const user = interaction.member.user,
        targetUser = interaction.options.getUser('target');
        userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
        targetData = await User.findOne({id: targetUser.id}) || new User({ id: user.id })
        const cd = moneyActions.rob.cooldown;

        if (userData.cooldowns.rob > Date.now())
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`⌛ You can rob someone again in **\`${prettyMilliseconds(userData.cooldowns.rob - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
                    ],
                    ephemeral: true
                })
        
        if(targetData.wallet <= moneyActions.rob.minTargetWallet) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`This person is too poor to be robbed! Shame!`)
                ],
                ephemeral: true
            }) 
        }

        let robpercent = Math.floor((Math.random() * 99) + 1)
        let roll = Math.floor((Math.random() * 99) + 1)

        backfired = roll < moneyActions.rob.backfireChance;
        

        if(!backfired)
        {
            let amount = Math.floor((targetData.wallet * robpercent)/100)
            targetData.wallet -= amount;
            userData.wallet += amount;
            
            userData.cooldowns.rob = Date.now() + (cd * 60 * 1000)

            targetData.save();
            userData.save();

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`Successfully robbed <@${targetUser.id}> for \` ${currencyPrefix}  ${amount} \` `)
                ],
            }) 
        } else {
            let amount = Math.floor((userData.wallet * robpercent)/100)
            targetData.wallet += amount;
            userData.wallet -= amount;
            
            userData.cooldowns.rob = Date.now() + (cd * 60 * 1000)
            
            targetData.save();
            userData.save();

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`You tried to rob <@${targetUser.id}> but failed! They got \` ${currencyPrefix}  ${amount} from you instead! Bad! \` `)
                ],
            }) 
        }
    }
}
