const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const webAppUrl = 'https://meek-licorice-06af47.netlify.app/';

const token = '6368991423:AAG5krDvWV765bp49speW2p5Oa0oixgIADQ';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const app = express();
app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text

    if (text === '/start') {
        await bot.sendMessage(chatId, "pastdagi formani to'ldiring", {
            reply_markup: {
                keyboard: [
                    [{text: "Formani to'ldiring", web_app: {url: webAppUrl + 'form'}}]
                ]
            }
        })
        await bot.sendMessage(chatId, "Web saytimiz manzili pastda", {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Web saytimizga kirish", web_app: {url: webAppUrl}}]
                ]
            }
        })
    }
    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            bot.sendMessage(chatId, "Etiboringiz uchun rahmat")
            bot.sendMessage(chatId, "Sizning davlatingiz " + data?.country)
            bot.sendMessage(chatId, "Sizning shahringiz " + data?.city)

            setTimeout(async () => {
                await bot.sendMessage(chatId, "Hamma ma'lumotni shu yerda olasz")
            }, 3000)
        } catch (e) {
            console.log(e)
        }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;

    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Omadli xarid',
            input_message_content: {message_text: 'Tabriklaymiz ajoyib xarid , Summa ' + totalPrice}
        })
        return res.status(200).json({})
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Xarid amalga oshmadi',
            input_message_content: {message_text: 'Xarid amalga oshmadi'}
        })
        return res.status(500).json({})
    }

})

const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT ' + PORT))
