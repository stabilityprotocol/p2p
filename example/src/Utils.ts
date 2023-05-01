import { MessageFrom } from './Types'

export const leadingZero = (num: number) => {
  return num < 10 ? `0${num}` : num
}

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = leadingZero(date.getHours())
  const minutes = leadingZero(date.getMinutes())
  const seconds = leadingZero(date.getSeconds())
  return `${hours}:${minutes}:${seconds}`
}

export const truncatePeerId = (peerId: MessageFrom) => {
  if (peerId === 'unknown') return peerId
  return `${peerId.slice(0, 6)}...${peerId.slice(-6)}`
}

export const sanitizeMessage = (message: string) => {
  return message.replace(/^['"]|['"]$/g, '')
}
