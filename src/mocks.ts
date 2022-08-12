// THIS FILE is intended to be a bridge between mtproto wrapper and code

const peer = () => ({
  _: 'inputPeerChannel',
  channel_id: global.api.TARGET_CHANNEL_ID,
  access_hash: global.api.TARGET_CHANNEL_ACCESS_HASH
})

export async function sendMessage(text: string, replyMessageID?: number) {
  return await global.api.call('messages.sendMessage', {
    peer: peer(),
    ...(replyMessageID && { reply_to_msg_id: replyMessageID }),
    message: text,
    random_id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  })
}

export async function editMessageText(messageID: number, text: string) {
  return await global.api.call('messages.editMessage', {
    peer: peer(),
    id: messageID,
    message: text
  })
}

export async function sendPhoto(photoURL: string, replyMessageID?: number) {
  return await global.api.call('messages.sendMedia', {
    peer: peer(),
    ...(replyMessageID && { reply_to_msg_id: replyMessageID }),
    media: {
      _: 'inputMediaPhotoExternal',
      url: photoURL
    },
    random_id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  })
}

export async function sendVideo(videoURL: string, replyMessageID?: number) {
  return await global.api.call('messages.sendMedia', {
    peer: peer(),
    ...(replyMessageID && { reply_to_msg_id: replyMessageID }),
    media: {
      _: 'inputMediaDocumentExternal',
      url: videoURL
    },
    random_id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  })
}

export async function deleteMessage(messageID: number) {
  return await global.api.call('channels.deleteMessages', {
    channel: peer(),
    id: [messageID]
  })
}