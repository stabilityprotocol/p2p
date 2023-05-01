import { Box, Flex } from '@chakra-ui/react'
import { Message } from '../../Types'
import { FunctionalComponent } from 'preact'
import { formatTime, truncatePeerId } from '../../Utils'
import { useEffect, useMemo, useRef } from 'preact/hooks'

export const ChatBox: FunctionalComponent<{ messages: Message[]; peerId: string | undefined }> = ({
  messages,
  peerId
}) => {
  const chatBoxRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Flex flexDirection={'column'} flex={1} overflowY="auto">
      {messages.map((msg, idx) => (
        <MessageRow key={idx} {...{ peerId, message: msg }} />
      ))}
      <div ref={chatBoxRef}></div>
    </Flex>
  )
}

export const MessageRow = ({
  message,
  peerId
}: {
  message: Message
  peerId: string | undefined
}) => {
  const calcBackground = useMemo(() => {
    switch (message.type) {
      case 'message':
        if (message.from === peerId) {
          return { background: 'var(--chakra-colors-green-300)' }
        }
        return { background: 'var(--chakra-colors-green-200)' }

      case 'connecting':
        return { background: 'var(--chakra-colors-orange-200)' }

      case 'connected':
        return { background: 'var(--chakra-colors-teal-100)' }

      case 'discover':
        return { background: 'var(--chakra-colors-teal-100)' }
    }
  }, [message, peerId])

  return (
    <Flex
      padding={'0.25rem 1rem'}
      minW={'100%'}
      flexDir={{ base: 'column', md: 'row' }}
      style={{ ...calcBackground }}
    >
      <Box paddingRight={'0.5rem'} flexWrap={'wrap'} wordBreak={'break-all'}>
        [{formatTime(message.timestamp)}]
      </Box>
      <Box paddingRight={'0.5rem'} flexWrap={'wrap'} wordBreak={'break-all'} fontWeight={'bold'}>
        {truncatePeerId(message.from)}
      </Box>
      <Box paddingRight={'0.5rem'} flexWrap={'wrap'} wordBreak={'break-all'}>
        {message.type}
      </Box>
      <Box paddingRight={'0.5rem'} flexWrap={'wrap'} wordBreak={'break-all'}>
        {message.text}
      </Box>
    </Flex>
  )
}
