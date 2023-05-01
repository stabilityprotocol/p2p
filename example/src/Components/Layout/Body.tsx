import { Flex } from '@chakra-ui/react'
import { FunctionalComponent } from 'preact'

export const Body: FunctionalComponent = ({ children }) => {
  return (
    <Flex minW={'100vw'} maxW={'100vw'} minH={'100vh'} maxH={'100vh'} flexDirection={'column'}>
      {children}
    </Flex>
  )
}
