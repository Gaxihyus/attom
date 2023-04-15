const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionResponse } = require('discord.js');
const { User } = require("../utils/schemas")
const { currencyPrefix } = require("../config.json")

const prettyMilliseconds = require('pretty-ms');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("card")
    .setDescription("Check your or another user's card")
    .addUserOption(
        option => option
        .setName("user")
        .setDescription("Person whose stats you want to check")
    ),
    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.member.user
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })

        var wcd = (userData.cooldowns.work > Date.now()) ? (prettyMilliseconds(userData.cooldowns.work - Date.now(), { verbose: false, secondsDecimalDigits: 0 })) : "Ready!";
        var ccd = (userData.cooldowns.crime > Date.now()) ? (prettyMilliseconds(userData.cooldowns.crime - Date.now(), { verbose: false, secondsDecimalDigits: 0 })) : "Ready!";
        var rcd = (userData.cooldowns.rob > Date.now()) ? (prettyMilliseconds(userData.cooldowns.rob - Date.now(), { verbose: false, secondsDecimalDigits: 0 })) : "Ready!";

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('main')
                .setLabel('Main')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('combat')
                .setLabel('Combat')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('economy')
                .setLabel('Economy')
                .setStyle(ButtonStyle.Success)
            )

        const cardEmbed = new EmbedBuilder()
        .setTitle(`${user.username}'s card`)
        .setDescription("Note: If you wish to see more details, select one of the buttons below.")
        .setThumbnail(user.displayAvatarURL())
        .setColor('Blue')
        .addFields(
            { name: `• Wallet`, value: `${currencyPrefix} ${userData.wallet}`, inline: true},
            { name: `• Bank`, value: `${currencyPrefix} ${userData.bank}`, inline: true},
        )

        const combatEmbed = new EmbedBuilder()
        .setTitle(`${user.username}'s card`)
        .setDescription("Note: Stat card of the requested user")
        .setColor('Red')
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            { name: `• Health`, value: ` <:life:1041488510726705235> ${userData.stats.health} `, inline: true},
            { name: `• Attack`, value: `<:attack:1041489098378059856> ${userData.stats.attack} `, inline: true},
            { name: `• Defense`, value: `<:defense:1041488797768101888> ${userData.stats.defense} `, inline: true},
            { name: `• Luck`, value: `<:luck:1041488796090384455> ${userData.stats.luck} `, inline: true},
        )

        const economyEmbed = new EmbedBuilder()
        .setTitle(`${user.username}'s card`)
        .setDescription("Note: Stat card of the requested user")
        .setThumbnail(user.displayAvatarURL())
        .setColor('Green')
        .addFields(
        { name: '\u200B', value: '\u200B' },
            { name: `• Wallet`, value: `${currencyPrefix} ${userData.wallet}`, inline: true},
            { name: `• Bank`, value: `${currencyPrefix} ${userData.bank}`, inline: true},
            {name: `• Owned Stocks:`, value: `• Attom: ${userData.ownedStocks.attom}`},
            { name: `• Cooldowns:`, value: `Work: \`${wcd}\`
                                            Crime: \`${ccd}\`
                                            Rob: \`${rcd}\` `})

        
        await interaction.reply({
            embeds: [ cardEmbed ], components: [row]
        })

        const filter = i => i.customId === 'main' || i.customId === 'combat' || i.customId === 'economy' ;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

        collector.on('collect', async i => {
            if (i.customId === 'main') {
                
                await i.update({ embeds: [cardEmbed], components: [row] });
            }
            if (i.customId === 'combat') {
                await i.update({ embeds: [combatEmbed], components: [row] });
            }
            if (i.customId === 'economy') {
                await i.update({ embeds: [economyEmbed], components: [row] });
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    }
}