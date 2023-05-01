import { Flex, Heading } from '@chakra-ui/react'

export const TopBar = () => {
  return (
    <Flex padding={'1rem'} borderBottom={'1px solid var(--chakra-colors-gray-300)'}>
      <Heading>Stability P2P Chat demo</Heading>
    </Flex>
  )
}
