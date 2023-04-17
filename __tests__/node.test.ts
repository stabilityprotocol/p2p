import { getNode } from '../src/node.js'

describe('node', () => {
  it('should be able to return a LibP2P instance', async () => {
    const node = await getNode()
    expect(node).toBeDefined()
  })
})
