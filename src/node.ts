import * as LibP2P from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { mplex } from '@libp2p/mplex'
import { noise } from '@chainsafe/libp2p-noise'
import { bootstrap } from '@libp2p/bootstrap'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'

export const defaultOptions = {
  transports: [tcp()],
  streamMuxers: [mplex()],
  connectionEncryption: [noise()],
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/10333']
  }
}

export const getNode = (overridedOptions: LibP2P.Libp2pOptions = {}, bootstrapList?: string[]) => {
  return LibP2P.createLibp2p({
    start: true,
    pubsub: gossipsub({ allowPublishToZeroPeers: true }),
    ...defaultOptions,
    ...(bootstrapList ? { peerDiscovery: [bootstrap({ list: bootstrapList })] } : {}),
    ...overridedOptions
  })
}
