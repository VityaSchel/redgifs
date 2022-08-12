// THIS FILE is intended to be a bridge between mtproto wrapper and code

export async function sendMessage(text: string, replyMessageID?: number) {
  return await global.api.call('messages.sendMessage', {
    peer: {
      _: 'inputPeerChannel',
      channel_id: global.api.TARGET_CHANNEL_ID,
      access_hash: global.api.TARGET_CHANNEL_ACCESS_HASH
    },
    ...(replyMessageID && { reply_to_msg_id: replyMessageID }),
    message: text,
    random_id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  })
}

export async function editMessageText(messageID: number, text: string) {
  return await global.api.call('messages.editMessage', {
    peer: {
      _: 'inputPeerChannel',
      channel_id: global.api.TARGET_CHANNEL_ID,
      access_hash: global.api.TARGET_CHANNEL_ACCESS_HASH
    },
    id: messageID,
    message: text
  })
}

export async function sendPhoto() {

}