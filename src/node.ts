import * as LibP2P from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { mplex } from '@libp2p/mplex'
import { noise } from '@chainsafe/libp2p-noise'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'

export const defaultOptions = {
  transports: [tcp()],
  streamMuxers: [mplex()],
  connectionEncryption: [noise()],
  peerDiscovery: [pubsubPeerDiscovery()],
  dht: kadDHT(),
  pubsub: gossipsub({ allowPublishToZeroPeers: true }),
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/0']
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
