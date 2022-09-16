import { ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_CHANNEL_ID, ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_ACCESS_HASH, TEST_CHANNEL_ID, TEST_ACCESS_HASH } from './data/consts'
import fs from 'fs/promises'

type Settings = {
  /**
   * Bot can work as user or as bot. Be aware that mtproto is buggy, but does not
   * require admin to add bot to chat. Use either 'mtproto' or 'bot'
   */
  platform: 'bot'
  /**
   * Bot's username with leading @
   */
  botUsername: string
  /**
   * Global timeout for commands (in seconds)
   */
  globalCommandTimeout: number
} | {
  /**
   * Bot can work as user or as bot. Be aware that mtproto is buggy, but does not
   * require admin to add bot to chat. Use either 'mtproto' or 'bot'
   */
  platform: 'mtproto'
  /**
   * Resolve access hash from latest dialogs instead of using cached access_hash
   */
  resolveAccessHash: boolean
  /**
   * Global timeout for commands (in seconds)
   */
  globalCommandTimeout: number
}

export const settings: Settings = {  
  platform: 'bot',
  botUsername: '@citinezpidorasbot',

  // resolveAccessHash: false,  
  globalCommandTimeout: 1
}

export async function initSettings() {
  const targetMtprotoID = process.env.NODE_ENV === 'development' ? TEST_CHANNEL_ID : ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_CHANNEL_ID 
  global.api.TARGET_CHANNEL_ID = settings.platform === 'bot' ? null : targetMtprotoID
  if (settings.platform === 'mtproto') {
    if (settings.resolveAccessHash) {
      const latestDialogs = await global.api.call('messages.getDialogs', {
        exclude_pinned: true,
        limit: 100,
        offset_peer: { _: 'inputPeerEmpty' }
      })
      const chat = latestDialogs.chats.find(chat => chat.id === (process.env.NODE_ENV === 'development' ? TEST_CHANNEL_ID : ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_CHANNEL_ID))
      global.api.TARGET_CHANNEL_ACCESS_HASH = chat.access_hash
      console.log('Resolved access_hash', chat.access_hash)
    } else {
      global.api.TARGET_CHANNEL_ACCESS_HASH = process.env.NODE_ENV === 'development' ? TEST_ACCESS_HASH : ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_ACCESS_HASH
    }
  }
}