const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const { User } = require("../utils/schemas");
const { config, moneyActions, currencyPrefix } = require("../config.json");
const prettyMilliseconds = require('pretty-ms');

const jobs = ["sold your body parts to a hobo", "sold your soul to the devil", "helped treat patients at a hospital", "worked at a daycare", "gave private math lessons", "cured cancer", "found the meaning of life",
"created a time machine", "worked as a bus driver in New York City", "sold fruits at the nearby market", "started a multi-billion dollar business, sold it to Elon Musk", "created Minecraft 2", "helped old ladies cross the street",
"cleaned public toilets", "did some... not safe for work things for a hobo"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Become a capitalist and work for money"),
        async execute(interaction) {
            const minPay = moneyActions.work.minPay;
            const maxPay = moneyActions.work.maxPay;
            const cd = moneyActions.work.cooldown;

            const user = interaction.member.user
            const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
    
            if (userData.cooldowns.work > Date.now())
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`⌛ You can work again in **\`${prettyMilliseconds(userData.cooldowns.work - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}\`**`)
                    ],
                    ephemeral: true
                })
    
            const amount = Math.floor(Math.random() * (maxPay - minPay + 1)) + minPay
            const job = jobs[Math.floor(Math.random() * jobs.length)]
    
            userData.wallet += amount               //num of minutes * 60 seconds * 1000ms
            userData.cooldowns.work = Date.now() + (cd * 60 *1000)
            userData.save()
    
            const workEmbed = new EmbedBuilder()
                .setDescription(`You ${job} and earned \`${currencyPrefix} ${amount}\``)
                .setColor("Yellow")
    
            return interaction.reply({ embeds: [workEmbed] })
        }
    }
