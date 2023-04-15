const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const { User } = require("../utils/schemas");
const { config, moneyActions, currencyPrefix, baseStockPrices } = require("../config.json");
const prettyMilliseconds = require('pretty-ms');

const jobs = ["sold your body parts to a hobo", "sold your soul to the devil", "helped treat patients at a hospital", "worked at a daycare", "gave private math lessons", "cured cancer", "found the meaning of life",
"created a time machine", "worked as a bus driver in New York City", "sold fruits at the nearby market", "started a multi-billion dollar business, sold it to Elon Musk", "created Minecraft 2", "helped old ladies cross the street",
"cleaned public toilets", "did some... not safe for work things for a hobo"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sellstock")
        .setDescription("Sell your invested stocks!")
        .addStringOption(option =>
			option.setName('stock')
				.setDescription('The stock you are selling')
				.setRequired(true)
				.addChoices(
					{ name: 'Attom', value: 'attom' }
				))
        .addNumberOption(option => option
            .setName('amount')
            .setDescription('The amount of this stock you want to sell')
            .setRequired(true)
            ),
        async execute(interaction) {
            
        const pi = 3.1415

            function currentValue(stock)
            {
                var t =  Math.floor(Date.now() / 3600000);
                //var x =  Math.abs((0.3 * Math.sin((2*pi*t) / 604800000) - 0.1*Math.sin((2.3*t) / 34000000) + 0.9*Math.cos((3 * 0.12*t) / 86400000) + 0.00045 * Math.tan(t / 360000)) + 0.14 ) 
                var x =  Math.abs((0.3 * Math.sin((2*pi*t) / 168) - 0.1*Math.sin((2.3*t) / 9.4) + 0.9*Math.cos((3 * 0.12*t) / 24) + 0.00045 * Math.tan(t )) + 0.14 )
                var y =  Math.floor(x * stock + (stock/2 - x))
    
                console.log(`${t}, ${x}, ${y}`)
    
    
                return y;
            }


            const user = interaction.member.user
            const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
            
            const chosenStock = interaction.options.getString('stock');
            var amount = interaction.options.getNumber('amount');

            var ownedStock;
            var price;
            if(chosenStock === 'attom') {ownedStock = userData.ownedStocks.attom; price = currentValue(baseStockPrices.attom)}

            
            embed = new EmbedBuilder()
            if (ownedStock === 0) return interaction.reply({
                embeds: [ embed.setDescription(`💰 You don't have any of these stocks!`).setColor('Red') ],
                ephemeral: true
            })

            if(amount > ownedStock && ownedStock > 0) { amount = ownedStock }

            var totalProfit = price * amount;

            userData.ownedStocks.attom -= amount;
            userData.wallet += totalProfit;
            userData.save()
    
            const workEmbed = new EmbedBuilder()
                .setDescription(`You sold \`${amount}x ${chosenStock}\` for \`${currencyPrefix} ${totalProfit}\``)
                .setColor("Green")
    
            return interaction.reply({ embeds: [workEmbed] })
        }
    }
