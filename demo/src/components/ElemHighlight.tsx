import { Box, HStack, Switch, VStack } from "@chakra-ui/react"
import { Highlighted, useHighlight } from "framer-animations"

export function ElemHighlight() {

  const { animate, highlightedProps } = useHighlight()

  return (
    <VStack h='100%' w='100%' align='center' justify='center'>
      <Highlighted {...highlightedProps}>
        <Box bg='gray.400' w='5rem' h='5rem' />
      </Highlighted>
      <HStack pt='3rem' fontSize='1.4rem'>
        <span>Stop</span>
        <Switch size='lg' onChange={e => animate(e.target.checked ? 'start' : 'stop')} />
        <span>Start</span>
      </HStack>
    </VStack>
  )
}

export default ElemHighlight