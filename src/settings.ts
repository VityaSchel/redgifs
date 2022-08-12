import { ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_CHANNEL_ID, ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_ACCESS_HASH, TEST_CHANNEL_ID, TEST_ACCESS_HASH } from './data/consts'
import fs from 'fs/promises'

export const settings = {

  /**
   * Resolve access hash from latest dialogs instead of using cached access_hash
   */
  resolveAccessHash: false,

  /**
   * Global timeout for commands (in seconds)
   */
  globalCommandTimeout: 5
}

export async function initSettings() {
  global.api.TARGET_CHANNEL_ID = process.env.NODE_ENV === 'development' ? TEST_CHANNEL_ID : ЗАПРЕЩЕННЫЙ_ПЯТОЧЕК_CHANNEL_ID 
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