import * as p2p from '@stabilityprotocol/p2p'
import * as filters from '@libp2p/websockets/filters'
import { webSockets } from '@libp2p/websockets'
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { Config } from './Config'
import { sanitizeMessage } from './Utils'
import { Message } from './Types'

const p2pParams = {
  overridedOptions: {
    transports: [webSockets({ filter: filters.all }), circuitRelayTransport()],
    addresses: {
      listen: []
    }
  },
  bootstrapList: [Config.relayAddr]
}

export const initializeNetwork = (emitMessage: (msg: Message) => void) => {
  return p2p.EventEmitterP2P.build(p2pParams).then((node) => {
    const msg: Message = {
      timestamp: Date.now(),
      text: `Connected to P2P network with PeerId ${node.p2pnode.peerId.toString()}.`,
      type: 'connected',
      from: node.p2pnode.peerId.toString() ?? 'unknown'
    }

    emitMessage(msg)

    node.on(Config.chatTopic, (topic, data, meta) => {
      const msg: Message = {
        timestamp: Date.now(),
        topic,
        text: sanitizeMessage(data),
        type: 'message',
        from: meta.from
      }
      emitMessage(msg)
    })

    node.p2pnode.addEventListener('peer:discovery', (evt) => {
      const from = evt.detail.id.toString()
      const msg: Message = {
        timestamp: Date.now(),
        text: `Found peer ${evt.detail.id}`,
        type: 'discover',
        from
      }
      emitMessage(msg)
      console.log(`Found peer ${from}`)
      // node.p2pnode.dial(multiaddr(evt.detail.multiaddrs[0]))
    })

    node.p2pnode.addEventListener('peer:connect', (evt) => {
      const from = evt.detail.id.toString()
      const msg: Message = {
        timestamp: Date.now(),
        text: `Connected peer ${evt.detail.id}`,
        type: 'connected',
        from
      }
      emitMessage(msg)
      console.log(`Connected peer ${from}`)
    })

    return node
  })
}
