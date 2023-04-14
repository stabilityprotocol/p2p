import { getNode } from './node.js'

async function main() {
  const node = await getNode()
  console.log(node)
  node.getMultiaddrs().forEach((ma) => console.log(ma.toString()))

  await node.handle('/echo/1.0.0', async ({ stream }) => {
    await pipe(stream, stream)
  }
}

main()
