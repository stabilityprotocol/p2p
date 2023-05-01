import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { FunctionalComponent } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { BsSendFill } from 'react-icons/bs'

export const ChatInputAction: FunctionalComponent<{ onEmit: (msg: string) => void }> = ({
  onEmit
}) => {
  const [message, setMessage] = useState('')

  const onEmitHook = useCallback(() => {
    if (message.length === 0) return
    onEmit(message)
    setMessage('')
  }, [onEmit, message])

  return (
    <InputGroup>
      <Input
        variant="filled"
        placeholder="Type here your message..."
        value={message}
        onChange={(evt: any) => setMessage(evt.currentTarget.value)}
        onKeyPress={(evt: any) => {
          if (evt.key === 'Enter') {
            onEmitHook()
          }
        }}
      />
      <InputRightElement>
        <IconButton
          type="submit"
          aria-label={'send'}
          icon={<BsSendFill />}
          colorScheme="teal"
          onClick={onEmitHook}
        />
      </InputRightElement>
    </InputGroup>
  )
}
