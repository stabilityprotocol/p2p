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
})
