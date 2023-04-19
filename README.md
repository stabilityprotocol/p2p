# p2p

Introducing Stability P2P lib, a versatile TypeScript library designed to effortlessly integrate peer-to-peer (P2P) networking capabilities into your applications using an EventEmitter-based approach. This library simplifies P2P communication by abstracting away the complexities of network management, allowing developers to seamlessly establish, maintain, and broadcast messages across decentralized networks.

## Quick start

```typescript
import * as p2p from '@stabilityprotocol/p2p'

const ev = await p2p.EventEmitterP2P.build()

const fn = (topic: string, payload: string) => {
  console.log(topic, payload)
}

ev.on('test', fn)
ev.once('test', fn)
ev.off('test', fn)

ev.emit('test', 'test-1')
```

For further information, check it's [EventEmitter interface](src/IEventEmitter.ts)

For printing the debugging logs, the `DEBUG=p2p:*` env flag is required.

```sh
$ DEBUG=p2p:* node index.js
$ DEBUG=p2p:* yarn test # to see an example of the outputs
```

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
