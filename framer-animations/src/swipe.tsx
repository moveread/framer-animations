import React, { memo } from 'react';
import { MotionProps, motion, useAnimation } from 'framer-motion'

export type Config = {
  swipeIcon: JSX.Element
  fontSize?: number | string
  durationSecs?: number
}

export function useSwipeAnimation({ swipeIcon, ...config}: Config): {
  run(): Promise<void>
  Animation: typeof motion.div
} {
  const durationSecs = config.durationSecs ?? 1
  const fontSize = config.fontSize ?? '4rem'
  
  const controls = useAnimation()
  const a = 10

  function run() {
    controls.stop();
    return controls.start({
      rotate: [null, a, -a, 0],
      x: [null, '50%', '-50%', '0%'],
      opacity: [0, 1, 1, 1, 0]
    }, {
      duration: durationSecs
    })
  }

  const Animation = memo((props: Omit<MotionProps, 'children'>) => (
    <motion.div animate={controls} initial={{opacity: 0}} {...props}>
      <span style={{fontSize}}>{swipeIcon}</span>
    </motion.div>
  ))

  return { Animation, run }
}

export default useSwipeAnimation