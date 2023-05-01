export type MessageFrom = 'unknown' | string

export type Message = {
  from: MessageFrom
  text: string
  timestamp: number
  topic?: string
  type: 'message' | 'connected' | 'discover' | 'connecting'
}
