import { jest } from '@jest/globals'
import EventEmitterP2P from '../src/EventEmitterP2P.js'
import { pEvent } from 'p-event'
import type { Message, SubscriptionChangeData } from '@libp2p/interface-pubsub'

enum TestTopic {
  TEST = 'TEST',
  TEST2 = 'TEST2'
}

describe('EventEmitterP2P', () => {
  it('should be able to return EventEmmitterP2P instance', async () => {
    const emitter = new EventEmitterP2P()
    expect(emitter).toBeDefined()
  })

  it('should initialize the p2pnode', async () => {
    const emitter = new EventEmitterP2P()
    await wait()
    expect(emitter.p2pnode).toBeDefined()
  })

  describe('subscribe', () => {
    let ev: EventEmitterP2P<TestTopic>
    beforeEach(async () => {
      ev = new EventEmitterP2P()
      await wait(100)
    })

    it('should be able to subscribe to a topic', async () => {
      ev.on(TestTopic.TEST, () => {})
      expect(ev.listeners[TestTopic.TEST]).toBeDefined()
    })

    it('should be able to subscribe to a topic once', async () => {
      ev.once(TestTopic.TEST2, () => {})
      expect(ev.listenersOncer[TestTopic.TEST2]).toBeDefined()
    })

    it('should be able to unsubscribe from a topic', async () => {
      const listener = () => {}
      ev.on(TestTopic.TEST, listener)
      expect(ev.listeners[TestTopic.TEST]).toBeDefined()
      ev.off(TestTopic.TEST, listener)
      expect(ev.listeners[TestTopic.TEST]).toHaveLength(0)
    })
  })

  describe('emit', () => {
    let ev0: EventEmitterP2P<TestTopic>
    let ev1: EventEmitterP2P<TestTopic>

    beforeEach(async () => {
      ev0 = new EventEmitterP2P()
      ev1 = new EventEmitterP2P()
      await wait(50)
      for (const addr of ev1.p2pnode.getMultiaddrs()) {
        await ev0.p2pnode.dial(addr)
      }
    })

    it('should be able to subscribe to a topic and receive a message #0', async () => {
      const listener = jest.fn()
      ev1.on(TestTopic.TEST, listener)

      // await subscription change
      await Promise.all([
        pEvent<'subscription-change', CustomEvent<SubscriptionChangeData>>(
          ev0.p2pnode.pubsub,
          'subscription-change'
        ),
        pEvent<'subscription-change', CustomEvent<SubscriptionChangeData>>(
          ev1.p2pnode.pubsub,
          'subscription-change'
        )
      ])

      expect(ev1.listeners[TestTopic.TEST]).toBeDefined()

      // we have to wait for this event to be emitted
      const promise = pEvent<'message', CustomEvent<Message>>(ev1.p2pnode.pubsub, 'message')
      await ev0.emit(TestTopic.TEST, 'test')
      await promise

      expect(listener).toBeCalled()
    })

    it('should be able to subscribe to a topic and receive a message #1', async () => {
      const listener = jest.fn()
      ev1.once(TestTopic.TEST, listener)

      // await subscription change
      await Promise.all([
        pEvent<'subscription-change', CustomEvent<SubscriptionChangeData>>(
          ev0.p2pnode.pubsub,
          'subscription-change'
        ),
        pEvent<'subscription-change', CustomEvent<SubscriptionChangeData>>(
          ev1.p2pnode.pubsub,
          'subscription-change'
        )
      ])

      expect(ev1.listenersOncer[TestTopic.TEST]).toBeDefined()

      // we have to wait for this event to be emitted
      const promise = pEvent<'message', CustomEvent<Message>>(ev1.p2pnode.pubsub, 'message')
      await ev0.emit(TestTopic.TEST, 'test')
      await promise

      expect(listener).toBeCalled()
      expect(ev1.listenersOncer[TestTopic.TEST]).toHaveLength(0)
    })

    it('should be able to subscribe to a topic and receive a message #2', async () => {
      const listener = jest.fn()
      ev0.once(TestTopic.TEST, listener)

      // await subscription change
      await Promise.all([
        pEvent<'subscription-change', CustomEvent<SubscriptionChangeData>>(
          ev0.p2pnode.pubsub,
          'subscription-change'
        ),
        pEvent<'subscription-change', CustomEvent<SubscriptionChangeData>>(
          ev1.p2pnode.pubsub,
          'subscription-change'
        )
      ])

      expect(ev0.listenersOncer[TestTopic.TEST]).toBeDefined()

      // we have to wait for this event to be emitted
      const promise = pEvent<'message', CustomEvent<Message>>(ev0.p2pnode.pubsub, 'message')
      await ev1.emit(TestTopic.TEST, 'test')
      await promise

      expect(listener).toBeCalled()
      expect(ev0.listenersOncer[TestTopic.TEST]).toHaveLength(0)
    })
  })
})

function wait(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
