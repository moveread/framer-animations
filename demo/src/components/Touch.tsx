import { VStack } from "@chakra-ui/react"
import { delay } from "@haskellian/async/promises/single"
import { useTouchAnimation } from "framer-animations"
import { useCallback, useEffect } from "react"

export function Touch() {
  const { animate, animation } = useTouchAnimation()

  const loop = useCallback(async () => {
    await animate('show', 'press')
    await delay(0.4)
    await animate('lift', 'hide')
    await delay(1)
    loop()
  }, [animate])

  useEffect(() => { loop() }, [loop])

  return (
    <VStack border='1px solid white' w='10rem' h='10rem' mt='4rem' align='center' justify='center' pos='relative'>
      {animation}
    </VStack>
  )
}

export default Touch