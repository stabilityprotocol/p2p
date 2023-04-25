import * as LibP2P from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { webRTCStar } from '@libp2p/webrtc-star'
import { mplex } from '@libp2p/mplex'
import { noise } from '@chainsafe/libp2p-noise'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'

const topics = ['__stability__._peer-discovery._p2p._pubsub']

export const defaultOptions: LibP2P.Libp2pOptions = {
  transports: [webSockets(), webRTCStar().transport],
  streamMuxers: [mplex()],
  connectionEncryption: [noise()],
  peerDiscovery: [pubsubPeerDiscovery({ topics })],
  dht: kadDHT(),
  pubsub: gossipsub({ allowPublishToZeroPeers: true }),
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/0/ws']
  }
}

export const getNode = (overridedOptions: LibP2P.Libp2pOptions = {}, bootstrapList?: string[]) => {
  return LibP2P.createLibp2p({
    start: true,
    ...defaultOptions,
    ...(bootstrapList
      ? { peerDiscovery: [bootstrap({ list: bootstrapList }), pubsubPeerDiscovery()] }
      : {}),
    ...overridedOptions
  })
}

export default {
  getNode
}
