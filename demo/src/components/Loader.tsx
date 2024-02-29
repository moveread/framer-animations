import { Button, HStack, VStack } from "@chakra-ui/react"
import { useLoader } from "framer-animations"
import { useEffect } from "react"

export function Loader() {
  const { animate, loader } = useLoader()

  useEffect(() => { animate('load') }, [animate])

  return (
    <VStack h='100%' w='100%' justify='start'>
      <VStack border='1px solid white' w='10rem' h='10rem' mt='4rem' align='center' justify='center'>
        {loader}
      </VStack>
      <HStack>
        <Button onClick={() => animate('load')}>Load</Button>
        <Button onClick={() => animate('stop')}>Stop</Button>
        <Button onClick={() => animate('succeed')}>Succeed</Button>
        <Button onClick={() => animate('fail')}>Fail</Button>
      </HStack>
    </VStack>
  )
}

export default Loader