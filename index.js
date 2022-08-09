import './.env.js'
import fetch from 'node-fetch'
import tgbot from 'node-telegram-bot-api'
import fs from 'fs/promises'

const loadingPool = {}

const bot = new tgbot(process.env.TELEGRAM_TOKEN, { polling: true })

async function load(target, source = 'reddit') {
  switch(source) {
    case 'reddit':
    case 'pushshift':
      return await reddit(target, source)

    case 'waifupics':
      return await waifupics(target)
  }
}

async function waifupics(target) {
  const response = await fetch(`https://api.waifu.pics/nsfw/${target}`)
  const result = await response.json()
  const url = result.url
  return [url]
}

async function reddit(subreddit, source = 'reddit') {
  // if(i >= 4) throw 'Couldn\'t find any :('

  const yearAgo = (Date.now() - 1000 * 60 * 60 * 24 * 365)
  const _2013 = 1356984630000
  let before
  if(source === 'pushshift')
    if(subreddit === 'gore')
      before = Math.floor(Math.random() * (Date.now() - _2013) + _2013)
    else
      before = Math.floor(Math.random() * (Date.now() - yearAgo) + yearAgo)

  const query = source === 'reddit' ? `https://api.reddit.com/r/${subreddit}/random?limit=1` : `https://api.pushshift.io/reddit/search/submission/?q=*&before=${Math.floor(before / 1000)}&subreddit=${subreddit}&aggs=&metadata=true&advanced=false&sort=desc&domain=&sort_type=created_utc&size=5`
  console.log(query)

  let controller = new AbortController()
  const timeoutAbort = setTimeout(() => controller.abort(), 10000)

  const response = await fetch(query, { signal: controller.signal })
  let result = await response.json()
  if (Array.isArray(result)) result = result[0]
  // console.log(JSON.stringify(result, null, 2))
  if (source === 'reddit' && !result.data) await fs.writeFile('test.json', JSON.stringify(result, null, 2))
  const mediaData = source === 'reddit' ? result.data.children : result.data
  const mediaURL = []
  for(let m of mediaData) {
    const data = source === 'reddit' ? m.data : m
    if (data.selftext) continue
    // if (m.data.url.startsWith('https://i.redd.it/')) https://i.imgur.com
    const url = data.url
    if (['.png', '.jpg', '.jpeg', '.gif', '.gifv', '.mp4'].some(extension => url.endsWith(extension)))
      if (url.startsWith('https://i.imgur.com/') && (url.endsWith('.gifv') || url.endsWith('.gif')))
        mediaURL.push(`https://i.imgur.com/${url.match(/^https:\/\/i\.imgur\.com\/(\w+)\.gifv?$/)[1]}.mp4`)
      else
        mediaURL.push(url)
    else {
      // if (url.startsWith('https://www.reddit.com/gallery/')) return await load(subreddit, i + 1)
      const redgifsRegex = /^https:\/\/(www\.)?redgifs\.com\/watch\/(\w+)$/
      if (redgifsRegex.test(url)) {
        const [,, redgifid] = url.match(redgifsRegex)
        const redgifresp = await fetch('https://api.redgifs.com/v2/gifs/' + redgifid)
        const redgif = await redgifresp.json()
        mediaURL.push(redgif.gif.urls.sd)
      }/* else {
        const media = data.media
        return media?.oembed?.thumbnail_url
      }*/ else {
        // return null//await load(subreddit, i + 1)
        continue
      }
    }

    if(source !== 'reddit') break
  }

  clearTimeout(timeoutAbort)
  return mediaURL
}

bot.on('message', async e => {
  let medias = [], indicator

  let text = e.text
  if (!text) return
  if (!e.from?.id) return
  if(e.forward_from || e.forward_date || e.forward_sender_name) return
  if (text.endsWith('@citinezpidorasbot')) text = text.match(/^(.*)@citinezpidorasbot$/)[1]

  const commands = [
    '/trap',
    // '/_trap',
    '/govno',
    // '/_govno',
    '/gavno',
    '/penis',
    '/hui',
    '/chlen',
    '/pisun',
    '/gay',
    '/pidor',
    '/pidar',
    '/pidoras',
    '/pidaras',
    '/bdsm',
    // '/_bdsm',
    '/anime',
    '/hentai',
    '/furry',
    '/cp',
    '/zoo',
    '/gore',
    '/lesb',
    '/lesbi',
    '/yaoi',
    '/яой',
    '/jucroq'
  ]
  if(!commands.includes(text)) return
  else {
    if (e.from.id === 1335709879) return await bot.sendMessage(e.chat.id, 'Пошел нахуй, обезьяна', { reply_to_message_id: e.message_id })
    if (loadingPool[e.from.id]) {
      await bot.sendMessage(e.chat.id, 'Подожди пока загрузится предыдущий запрос', { reply_to_message_id: e.message_id })
      return
    } else {
      indicator = await bot.sendMessage(e.chat.id, 'Загрузка...', { reply_to_message_id: e.message_id })
    }
  }

  const error = () => bot.editMessageText('Ошибка :(', { chat_id: e.chat.id, message_id: indicator.message_id })

  loadingPool[e.from.id] = true
  try {
    switch(text) {
      case '/trap':
        medias = await load('tgirls')
        break

      case '/_trap':
      // case '/trap':
        medias = await load('tgirls', 'pushshift')
        break

      case '/govno':
      case '/gavno':
        medias = await load('poop')
        break

      case '/_govno':
      // case '/govno':
      // case '/gavno':
        medias = await load('poop', 'pushshift')
        break

      case '/penis':
      case '/hui':
      case '/chlen':
      case '/pisun':
        medias = await load('sounding', 'pushshift')
        break

      case '/pidor':
      case '/pidar':
      case '/pidoras':
      case '/pidaras':
      case '/gay':
        medias = await load('gaybrosgonewild', 'pushshift')
        break

      case '/bdsm':
        medias = await load('BDSM')
        break

      case '/_bdsm':
      // case '/bdsm':
        medias = await load('BDSM', 'pushshift')
        break

      case '/anime':
      case '/hentai':
        medias = await load('neko', 'waifupics')
        break

      case '/furry':
        medias = await load('yiff', 'pushshift')
        break

      case '/lesb':
      case '/lesbi':
        medias = await load('lesbians', 'pushshift')
        break

      case '/yaoi':
      case '/яой':
        medias = await load('yaoi', 'pushshift')
        break

      case '/jucroq':
        medias = await load('monkeys', 'pushshift')
        break

      case '/gore':
      case '/cp':
      case '/zoo':
        loadingPool[e.from.id] = false
        await bot.sendPhoto(e.chat.id, 'AgACAgIAAxkBAAIBaWLyQThnCfAr1IyAX6pB7eII25QBAAJIvjEbuvGZS1B96ifqkC_1AQADAgADeAADKQQ', { reply_to_message_id: e.message_id })
        return
    }
    for (let media of medias.slice(0, 1)) {
      if (['.png', '.jpg', '.jpeg'].some(extension => media.endsWith(extension))) {
        await bot.sendPhoto(e.chat.id, media, { reply_to_message_id: e.message_id })
      } else if (['.gif', '.gifv', '.mp4'].some(extension => media.endsWith(extension))) {
        await bot.sendVideo(e.chat.id, media, { reply_to_message_id: e.message_id })
      } else {
        console.log('Unknown', media)
        error()
        return
      }
    }
    loadingPool[e.from.id] = false
    await bot.deleteMessage(e.chat.id, indicator.message_id)
  } catch (err) {
    loadingPool[e.from.id] = false
    console.error(err)
    error()
  }
})