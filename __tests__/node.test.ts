import { pEvent } from 'p-event'
import { getNode } from '../src/node.js'

describe('node', () => {
  it('should be able to return a LibP2P instance', async () => {
    const node = await getNode()
    expect(node).toBeDefined()
    expect(node.isStarted()).toBe(true)
  })

  it('should be able to stop the node', async () => {
    const node = await getNode()
    expect(node.isStarted()).toBe(true)
    await node.stop()
    expect(node.isStarted()).toBe(false)
  })

  it('should connect to a peer', async () => {
    const node0 = await getNode()
    const node1 = await getNode()
    expect((await node0.peerStore.all()).length).toBe(0)
    for (const addr of node1.getMultiaddrs()) {
      await node0.dial(addr)
    }
    expect((await node0.peerStore.all()).length).toBe(1)
  })

  describe('with bootstrap list', () => {
    it('should connect to the node0 aka bootstrap node', async () => {
      const node0 = await getNode()
      const nodes = node0.getMultiaddrs().map((addr) => addr.toString())
      const node1 = await getNode({ bootstrapList: nodes })
      await pEvent(node1, 'peer:discovery')
      expect((await node1.peerStore.all()).length).toBe(1)
    })
  })

  describe('with nodekey', () => {
    it('should connect to the node0 aka bootstrap node', async () => {
      // Example nodeKey, not use in production
      const nodeKey = "CAESQC/vXes9O4r83WY85P1rhuBxHkfBt/B8m5C1FgLC9oW/8cVXY3TBXJqqxHohhdDtTca/UmXDtvOWqumRjBTp2FQ=";

      const node0 = await getNode({ nodeKey });

      expect(Buffer.from(node0.peerId.publicKey ?? "").toString('base64')).toBe("CAESIPHFV2N0wVyaqsR6IYXQ7U3Gv1Jlw7bzlqrpkYwU6dhU");
    })
  })
})
