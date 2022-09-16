import { settings } from './settings'
import { initTelegram } from './tgbot-loader'
import { initMtproto } from './mtproto-loader'

if(settings.platform === 'bot') {
  initTelegram()
} else if(settings.platform === 'mtproto') {
  initMtproto()
}