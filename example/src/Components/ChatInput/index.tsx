import { Flex } from '@chakra-ui/react'
import { ChatInputAction } from './ChatInputAction'
import { FunctionalComponent } from 'preact'

export const ChatInput: FunctionalComponent<{ onEmit: (msg: string) => void }> = ({ onEmit }) => {
  return (
    <Flex padding={'1rem'} borderTop={'1px solid var(--chakra-colors-gray-300)'}>
      <ChatInputAction onEmit={onEmit} />
    </Flex>
  )
}
