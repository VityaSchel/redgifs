import { settings } from './settings'

const timeouts: { [key: string]: number } = {
  respondedToUser: 0
}

export function isTimeout(): boolean {
  return Date.now() - timeouts.respondedToUser < settings.globalCommandTimeout * 1000
}

export function resetTimeout() {
  timeouts.respondedToUser = Date.now()
}