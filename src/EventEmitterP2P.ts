import LibP2P, { Libp2p } from 'libp2p'
import { Disposable, IEventEmitter, Listener } from './IEventEmitter.js'
import { getNode } from './node.js'
import { fromString as uint8ArrayFromString, toString as uint8ArrayToString } from 'uint8arrays'
import { error, info } from './logger.js'

type P2POptions = { overridedOptions: LibP2P.Libp2pOptions; bootstrapList?: string[] }

export class EventEmitterP2P<T extends string> implements IEventEmitter<T> {
  p2pnode!: Libp2p

  listeners: { [key in T]?: Listener<T>[] } = {}
  listenersOncer: { [key in T]?: Listener<T>[] } = {}

  public static async build<T extends string>(p2pOpt?: P2POptions): Promise<EventEmitterP2P<T>> {
    const emitter = new EventEmitterP2P<T>()
    await emitter.initialize(p2pOpt)
    return emitter
  }

  async initialize(p2pOpt?: P2POptions) {
    this.p2pnode = await getNode(p2pOpt?.overridedOptions, p2pOpt?.bootstrapList).then((node) => {
      node.pubsub.addEventListener('message', this._onMessage.bind(this))
      info('P2P node initialized')
      return node
    })
  }

  on = (topic: T, listener: Listener<T>): Disposable => {
    if (!this.listeners[topic]) {
      this.listeners[topic] = []
    }
    this._subscribe(topic)
    this.listeners[topic]!.push(listener)
    return {
      dispose: () => this.off(topic, listener)
    }
  }

  once = (topic: T, listener: Listener<T>): void => {
    if (!this.listenersOncer[topic]) {
      this.listenersOncer[topic] = []
    }
    this._subscribe(topic)
    this.listenersOncer[topic]!.push(listener)
  }

  off = (topic: T, listener: Listener<T>): void => {
    if (!this.listeners[topic]) return
    var callbackIndex = this.listeners[topic]!.indexOf(listener)
    if (callbackIndex > -1) this.listeners[topic]!.splice(callbackIndex, 1)
  }

  emit = async (topic: T, event: any) => {
    if (!this.p2pnode) {
      error('P2P node not initialized')
      throw new Error('P2P node not initialized')
    }
    const data = uint8ArrayFromString(JSON.stringify(event))
    info('Publishing message on topic %s: %s', topic, JSON.stringify(event))
    return this.p2pnode.pubsub.publish(topic, data)
  }

  pipe = (topic: T, te: IEventEmitter<T>): Disposable => {
    return this.on(topic, (e) => te.emit(topic, e))
  }

  _subscribe = (topic: string) => {
    if (!this.p2pnode) {
      error('P2P node not initialized')
      throw new Error('P2P node not initialized')
    }
    const currentTopics = this.p2pnode.pubsub.getTopics()
    if (!currentTopics.includes(topic)) {
      this.p2pnode.pubsub.subscribe(topic)
    }
  }

  _onMessage = (msg: any) => {
    try {
      const topic = msg.detail.topic as T
      const data = uint8ArrayToString(msg.detail.data)
      info('Received message on topic %s: %s', topic, data)
      if (this.listeners[topic]) {
        ;(this.listeners[topic] ?? []).forEach((listener) => listener(topic, data))
      }

      if (this.listenersOncer[topic]) {
        const toCall = this.listenersOncer[topic] ?? []
        this.listenersOncer[topic] = []
        toCall.forEach((listener) => listener(topic, data))
      }
    } catch (e) {
      error('%O', e)
    }
  }
}
