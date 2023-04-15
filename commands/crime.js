const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const { User } = require("../utils/schemas");
const { currencyPrefix, moneyActions } = require("../config.json");
const prettyMilliseconds = require('pretty-ms');

const crimes = ["robbed an old lady", "started a company called Microsoft", "started a company called Nestle", "stole a TV", "mugged a vulnerable hobo", "robbed a homeless shelter", "killed Jeff Bezos", "stole the Krabby Patty Secret Formula",
"seduced a cop", "burned down a house as a distraction to rob their neighbor", "hijacked a bus with your best friend", "stole your mom's credit card", "stole your son's credit card"];
const arrests = ["attempted to rob an old lady", 'tried to pick up a fallen penny', 'tried to start a heist but got cancelled on twitter', 'tried to steal the Krabby Patty Secret formula but Mr Krabs', "robbed a library but forgot you couldn't read",
"tried to rob a bar but got KO'd by an old lady"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("crime")
        .setDescription("Risk getting caught in exchange for a higher payout!"),
        async execute(interaction) {
            
            const minPay = moneyActions.crime.minPay;
            const maxPay = moneyActions.crime.maxPay;
            const cd = moneyActions.crime.cooldown;

            const backfireChance = moneyActions.crime.backfireChance;

            const roll = Math.floor((Math.random() * 99) + 1); //Roll from 1 to 100

            const backfired = roll < backfireChance;

            const user = interaction.member.user
            const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
    
            if (userData.cooldowns.crime > Date.now())
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`⌛ You can commit a crime again in **\`${prettyMilliseconds(userData.cooldowns.crime - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
                    ],
                    ephemeral: true
                })
            
            
                if(!backfired) {

                    const amount = Math.floor(Math.random() * (maxPay - minPay + 1)) + minPay
                    const crime = crimes[Math.floor(Math.random() * crimes.length)]
            
                    userData.wallet += amount               //num of minutes * 60 seconds * 1000ms
                    userData.cooldowns.crime = Date.now() + (cd * 60 *1000)
                    userData.save()
            
                    const crimeEmbed = new EmbedBuilder()
                        .setDescription(`You ${crime} and earned \`${currencyPrefix} ${amount}\``)
                        .setColor("Green")
            
                    return interaction.reply({ embeds: [crimeEmbed] })

                } else {

                    const amount = Math.floor(Math.random() * (maxPay - minPay + 1)) + minPay
                    const arrest = arrests[Math.floor(Math.random() * arrests.length)]
            
                    userData.wallet -= amount               //num of minutes * 60 seconds * 1000ms
                    userData.cooldowns.crime = Date.now() + (cd * 60 * 1000)
                    userData.save()
            
                    const crimeEmbed = new EmbedBuilder()
                        .setDescription(`You ${arrest} and lost \`${currencyPrefix} ${amount}\``)
                        .setColor("Red")
            
                    return interaction.reply({ embeds: [crimeEmbed] })

                }

        }
    }
