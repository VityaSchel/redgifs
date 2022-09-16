import './.env.js'
import tgbot from 'node-telegram-bot-api'
import { initSettings, settings } from './settings.js'
import { newMessage } from './scraper.js'

export async function initTelegram() {
  const bot = new tgbot(process.env.TELEGRAM_TOKEN, { polling: true })
  global.botapi = bot
  global.api = {}
  await initSettings()

  bot.on('message', async e => {
    if(settings.platform !== 'bot') throw ''

    const text: string = e.text
    if (!text) return
    if (!e.from?.id) return
    if(e.forward_from || e.forward_date || e.forward_sender_name) return
    if (text.endsWith(settings.botUsername)) e.text = text.match(`^(.*)${settings.botUsername}$`)[1]

    try {
      await newMessage(e)
    } catch (e) {
      console.error('Error while sending message!', e)
    }
  })
}