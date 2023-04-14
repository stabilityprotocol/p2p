import { Libp2p } from 'libp2p'
import { Disposable, IEventEmitter, Listener } from './IEventEmitter'
import { getNode } from './node'
import { fromString as uint8ArrayFromString } from 'uint8arrays'

export class TypedEvent<T extends string, K> implements IEventEmitter<T, K> {
  private p2pnode!: Libp2p

  listeners: { [key in T]?: Listener<K>[] } = {}
  listenersOncer: { [key in T]?: Listener<K>[] } = {}

  constructor() {
    this.initialize()
  }

  private async initialize() {
    this.p2pnode = await getNode().then((node) => {
      node.pubsub.addEventListener('message', this._onMessage)
      return node
    })
  }

  on = (topic: T, listener: Listener<K>): Disposable => {
    if (!this.listeners[topic]) {
      this.listeners[topic] = []
    }
    this._subscribe(topic)
    this.listeners[topic]!.push(listener)
    return {
      dispose: () => this.off(topic, listener)
    }
  }

  once = (topic: T, listener: Listener<K>): void => {
    if (!this.listenersOncer[topic]) {
      this.listenersOncer[topic] = []
    }
    this.listenersOncer[topic]!.push(listener)
  }

  off = (topic: T, listener: Listener<K>): void => {
    if (!this.listeners[topic]) return
    var callbackIndex = this.listeners[topic]!.indexOf(listener)
    if (callbackIndex > -1) this.listeners[topic]!.splice(callbackIndex, 1)
  }

  emit = (topic: T, event: K) => {
    if (!this.p2pnode) {
      throw new Error('P2P node not initialized')
    }
    const data = uint8ArrayFromString(JSON.stringify(event))
    this.p2pnode.pubsub.publish(topic, data)
  }

  pipe = (topic: T, te: IEventEmitter<T, K>): Disposable => {
    return this.on(topic, (e) => te.emit(topic, e))
  }

  _subscribe = (topic: string) => {
    if (!this.p2pnode) {
      throw new Error('P2P node not initialized')
    }
    this.p2pnode.pubsub.subscribe(topic)
  }

  _onMessage = (msg: any) => {
    try {
      const topic = msg.topic as T
      const data = JSON.parse(msg.data) as K
      if (!this.listeners[topic]) {
        this.listeners[topic]!.forEach((listener) => listener(data))
      }

      if (this.listenersOncer[topic] && this.listenersOncer[topic]!.length > 0) {
        const toCall = this.listenersOncer[topic]
        if (!toCall) return
        this.listenersOncer[topic] = []
        toCall.forEach((listener) => listener(data))
      }
    } catch (e) {
      console.log(e)
    }
  }
}
