// THIS FILE is intended to be a bridge between mtproto/bot wrapers and code

import { settings } from './settings'

const mtProtoTargetPeer = () => ({
  _: 'inputPeerChannel',
  channel_id: global.api.TARGET_CHANNEL_ID,
  access_hash: global.api.TARGET_CHANNEL_ACCESS_HASH
})

export async function sendMessage(text: string, replyMessageID?: number, chatID?: number) {
  if(settings.platform === 'bot') {
    return await global.botapi.sendMessage(chatID ?? global.api.TARGET_CHANNEL_ID, text, replyMessageID && { reply_to_message_id: replyMessageID })
  } else {
    return await global.api.call('messages.sendMessage', {
      peer: mtProtoTargetPeer(),
      ...(replyMessageID && { reply_to_msg_id: replyMessageID }),
      message: text,
      random_id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    })
  }
}

export async function editMessageText(messageID: number, text: string, chatID?: number) {
  if(settings.platform === 'bot') {
    return await global.botapi.editMessageText(text, { chat_id: chatID ?? global.api.TARGET_CHANNEL_ID, message_id: messageID })
  } else {
    return await global.api.call('messages.editMessage', {
      peer: mtProtoTargetPeer(),
      id: messageID,
      message: text
    })
  }
}

export async function sendPhoto(photoURL: string, replyMessageID?: number, chatID?: number) {
  if(settings.platform === 'bot') {
    return await global.botapi.sendPhoto(chatID ?? global.api.TARGET_CHANNEL_ID, photoURL, replyMessageID && { reply_to_message_id: replyMessageID })
  } else {
    return await global.api.call('messages.sendMedia', {
      peer: mtProtoTargetPeer(),
      ...(replyMessageID && { reply_to_msg_id: replyMessageID }),
      media: {
        _: 'inputMediaPhotoExternal',
        url: photoURL
      },
      random_id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    })
  }
}

export async function sendVideo(videoURL: string, replyMessageID?: number, chatID?: number) {
  if(settings.platform === 'bot') {
    return await global.botapi.sendVideo(global.api.TARGET_CHANNEL_ID, videoURL, replyMessageID && { reply_to_message_id: replyMessageID })
  } else {
    return await global.api.call('messages.sendMedia', {
      peer: mtProtoTargetPeer(),
      ...(replyMessageID && { reply_to_msg_id: replyMessageID }),
      media: {
        _: 'inputMediaDocumentExternal',
        url: videoURL
      },
      random_id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    })
  }
}

export async function deleteMessage(messageID: number, chatID?: number) {
  if(settings.platform === 'bot') {
    return await global.botapi.deleteMessage(chatID ?? global.api.TARGET_CHANNEL_ID, messageID)
  } else {
    return await global.api.call('channels.deleteMessages', {
      channel: mtProtoTargetPeer(),
      id: [messageID]
    })
  }
}