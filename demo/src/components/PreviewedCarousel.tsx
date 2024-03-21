import { Button, HStack, Text, VStack } from "@chakra-ui/react"
import { ItemProps, usePreviewedCarousel } from "framer-animations/previewed-carousel"

function Item({ idx, selected }: ItemProps) {
  return (
    <VStack h='100%' w='100%' bg={`gray.${300 + 100 * idx}`} align='center' justify='center'>
      <Text fontSize='2rem'>Page {idx}</Text>
      {selected && <Text>In View!</Text>}
    </VStack>
  )
}

export function PreviewedCarousel() {
  const { carousel, move } = usePreviewedCarousel(Item, 5, {
    swipeThrottleMs: 100
  })
  return (
    <VStack h='100%' w='100%' align='center' justify='center'>
      <Text>Carousel previewing the previous and last pages. Swipable and controllable</Text>
      <HStack h='100%' w='100%' align='center' justify='center'>
        <Button onClick={() => move('right')}>Left</Button>
        <VStack w='40%' h='80%'>
          {carousel}
        </VStack>
        <Button onClick={() => move('left')}>Right</Button>
      </HStack>
    </VStack>
  )
}

export default PreviewedCarousel