import * as LibP2P from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { mplex } from '@libp2p/mplex'
import { noise } from '@chainsafe/libp2p-noise'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { P2POptions } from "./EventEmitterP2P"
import { unmarshalPrivateKey } from "@libp2p/crypto/keys";
import { createFromPrivKey } from "@libp2p/peer-id-factory";

const topics = ['__stability__._peer-discovery._p2p._pubsub']

export const defaultOptions: LibP2P.Libp2pOptions = {
  transports: [webSockets()],
  streamMuxers: [mplex()],
  connectionEncryption: [noise()],
  peerDiscovery: [pubsubPeerDiscovery({ topics })],
  dht: kadDHT(),
  pubsub: gossipsub({ allowPublishToZeroPeers: true }),
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/0/ws']
  }
}

export const generatePeerIdFromNodeKey = async (nodeKey: string) => {
  const nodeKeyBuffer = Buffer.from(nodeKey, 'base64')
  
  return createFromPrivKey(await unmarshalPrivateKey(nodeKeyBuffer))
}


export const getNode = async (options?: P2POptions) => {
  return LibP2P.createLibp2p({
    start: true,
    ...defaultOptions,
    peerId: options?.nodeKey ? await generatePeerIdFromNodeKey(options.nodeKey!) : undefined,
    ...(options?.bootstrapList
      ? { peerDiscovery: [bootstrap({ list: options.bootstrapList }), pubsubPeerDiscovery()] }
      : {}),
    ...options?.overridedOptions
  })
}

export default {
  getNode
}
