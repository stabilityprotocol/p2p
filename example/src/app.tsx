import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import * as p2p from '@stabilityprotocol/p2p'
import { Body } from './Components/Layout/Body'
import { TopBar } from './Components/Layout/TopBar'
import { ChakraProvider } from '@chakra-ui/react'
import { ChatInput } from './Components/ChatInput'
import { ChatBox } from './Components/ChatBox'
import { Config } from './Config'
import { Message } from './Types'
import { initializeNetwork } from './Network'

const initialMsg: Message = {
  timestamp: Date.now(),
  text: 'Connecting to P2P network...',
  type: 'connecting',
  from: 'unknown'
}

export function App() {
  const [chatMsgs, setChatMsgs] = useState<Message[]>([initialMsg])
  const [_p2p, setP2P] = useState<p2p.EventEmitterP2P<string> | undefined>()

  const peerId = useMemo(() => {
    return _p2p?.p2pnode.peerId.toString()
  }, [_p2p])

  useEffect(() => {
    initializeNetwork((msg: Message) => setChatMsgs((prev) => [...prev, msg])).then((p2p) => {
      setP2P(p2p)
    })
  }, [])

  const onEmit = useCallback(
    (chatMsg: string) => {
      const msg: Message = {
        timestamp: Date.now(),
        text: chatMsg,
        type: 'message',
        from: _p2p?.p2pnode.peerId.toString() ?? 'unknown'
      }

      setChatMsgs((prev) => [...prev, msg])

      if (_p2p) {
        _p2p.emit(Config.chatTopic, chatMsg).then(console.log)
      }
    },
    [_p2p]
  )

  return (
    <>
      <ChakraProvider>
        <Body>
          <TopBar />
          <ChatBox messages={chatMsgs} peerId={peerId} />
          <ChatInput onEmit={onEmit} />
        </Body>
      </ChakraProvider>
    </>
  )
}
