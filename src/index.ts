import 'dotenv/config'
import MTProto from '@mtproto/core'
import authorize from './mtproto/auth'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_CHANNEL_ID } from './data/consts'
import { sendMessage } from './mocks'
import { initSettings } from './settings'
import { newMessage } from './scraper'

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/'

const bot = new MTProto({
  api_id: Number(process.env.APP_ID),
  api_hash: process.env.APP_HASH,

  storageOptions: { path: __dirname + '../tempdata.json' }
})
global.api = bot
const user = await authorize()
console.log(`Пользователь ${user.users[0].first_name} авторизирован, бот начинает работу`)

const timeouts: { [key: string]: number } = {
  respondedToUser: 0
}


await initSettings()

global.api.updates.on('updateShortMessage', async updateInfo => {
  if(updateInfo.out === false) {
    checkLatestDialogs(updateInfo)
  }
})
global.api.updates.on('updates', ({ updates }) => /*updates
  .filter(({ _ }) => _ === 'updateNewMessage')
  .filter(({ message }) => !message.out)
  .filter(({ message }) => message.peer_id._ === 'peerUser')
  .length > 0 &&*/ checkLatestDialogs(updates)
)

async function checkLatestDialogs(events) {
  if (!Array.isArray(events)) events = [events]
  for (const event of events) {
    if (!event) continue
    if (event._ === 'updateNewChannelMessage') {
      const message = event.message
      if (!message || message._ !== 'message') continue
      if (message.peer_id?.channel_id !== global.api.TARGET_CHANNEL_ID) continue
      if (message.fwd_from) continue // includes hidden users
      const text = message.message
      if(!text) continue
      
      try {
        await newMessage(message)
      } catch(e) {
        console.error('Error while sending message!', e)
      }
    }
  }
}
// Use https://mtproto-core.js.org/docs/ to write methods here