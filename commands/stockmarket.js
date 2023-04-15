const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions, AttachmentBuilder } = require('discord.js');
const { User } = require("../utils/schemas")
const { currencyPrefix, baseStockPrices } = require("../config.json")

const prettyMilliseconds = require('pretty-ms');

const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

        const chartCallback = (ChartJS) => {
        }

        
const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#99ffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };


module.exports = {
    data: new SlashCommandBuilder()
    .setName("stockmarket")
    .setDescription("Opens the stock market."),
    async execute(interaction) {
        var time = Math.floor(Date.now() / 10000);
        
        const pi = 3.1415;
        const width = 800;
        const height = 600;

        const prevAttomPrices = []
        const times = []
        const attom = baseStockPrices.attom; 

        //how far the history for graph goes
        for(i = 120; i > -1; i--)
        {
            prevAttomPrices.push(predict(attom, -i));
            times.push(`${i}h ago`);
        }



        function currentValue(stock)
        {
            var t =  Math.floor(Date.now() / 3600000);
            //var x =  Math.abs((0.3 * Math.sin((2*pi*t) / 604800000) - 0.1*Math.sin((2.3*t) / 34000000) + 0.9*Math.cos((3 * 0.12*t) / 86400000) + 0.00045 * Math.tan(t / 360000)) + 0.14 ) 
            var x =  Math.floor(Math.abs((0.3 * Math.sin((2*pi*t) / 168) - 0.1*Math.sin((2.3*t) / 9.4) + 0.9*Math.cos((3 * 0.12*t) / 24) + 0.00045 * Math.tan(t )) + 0.14 + 0.04 * Math.sin(pi *t/2))   * 100000)/100000;
            var y =  Math.floor(x * stock + (stock/2 - x))

            console.log(`${t}, ${x}, ${y}`)


            return y;
        }


        function predict(stock, t)
        {
            var t =  Math.floor(Date.now() / 3600000) + t;
            //var x =  Math.abs((0.3 * Math.sin((2*pi*t) / 604800000) - 0.1*Math.sin((2.3*t) / 34000000) + 0.9*Math.cos((3 * 0.12*t) / 86400000) + 0.00045 * Math.tan(t / 360000)) + 0.14 ) 
            var x =  Math.floor(Math.abs((0.3 * Math.sin((2*pi*t) / 168) - 0.1*Math.sin((2.3*t) / 9.4) + 0.9*Math.cos((3 * 0.12*t) / 24) + 0.00045 * Math.tan(t )) + 0.14 + 0.04 * Math.sin(pi *t/2))   * 100000)/100000;
            var y =  Math.floor(x * stock + (stock/2 - x))

            return y;
        }

        const canvas = new ChartJSNodeCanvas({width, height, chartCallback})

        const configuration = {
            type: 'line',
            data: {
                labels: times,
                datasets: [
                    {
                        label: 'Attom',
                        data: prevAttomPrices,
                        backgroundColor: '#05F29B',
                        borderColor: '#05F2AF'
                    }
                ]
            },
            options: {
              plugins: {
                customCanvasBackgroundColor: {
                  color: '#262626',
                }
              }
            },
            plugins: [plugin],
          }
        

        const image = await canvas.renderToBuffer(configuration)

        const attachment = new AttachmentBuilder(image).setName("graph.png")

        const embed = new EmbedBuilder()
            .setTitle(`💰 Stock Market 💰`)
            .setDescription(`Shows current values of stocks\n Next price refresh in \` ${prettyMilliseconds((Math.floor(Date.now() / 3600000) * 3600000) + 3600000 - Date.now(), { verbose: false, secondsDecimalDigits: 0 })}\` `)
            .setColor('Green')
            .addFields(
                { name: "Attom [ATT]:", value: `${currencyPrefix} ${currentValue(attom)}`}
            )
            .setImage('attachment://graph.png')       
            

        await interaction.reply({ embeds: [embed], files: [attachment]})

    }
}