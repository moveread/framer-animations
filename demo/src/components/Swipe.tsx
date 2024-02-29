import { VStack } from "@chakra-ui/react"
import { delay, useSwipeAnimation } from "framer-animations"
import { useCallback, useEffect } from "react";

export function Swipe() {

  const { animation, run } = useSwipeAnimation({
    divProps: {style: {scale: 3}}
  })

  const loop = useCallback(async () => {
    await run()
    await delay(1)
    loop()
  }, [run])

  useEffect(() => { loop() }, [loop])

  return (
    <VStack border='1px solid white' w='10rem' h='10rem' mt='4rem' align='center' justify='center'>
      {animation}
    </VStack>
  )
}

export default Swipe
