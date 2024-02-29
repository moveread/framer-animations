import React, { useCallback } from 'react';
import { MotionProps, motion, useAnimation } from 'framer-motion'
import SwipeIcon, { Props as IconProps } from './util/icons/SwipeIcon';

type IconConfig = {
  swipeIcon?: JSX.Element
}
const isExplicit = (config?: IconConfig | IconProps): config is IconConfig => (config as IconConfig)?.swipeIcon !== undefined
export type Config = (IconConfig | IconProps) & {
  durationSecs?: number
  divProps?: Omit<MotionProps, 'animate' | 'initial'>
}

export function useSwipeAnimation(config?: Config): {
  run(): Promise<void>
  animation: JSX.Element
} {
  const durationSecs = config?.durationSecs ?? 1
  
  const controls = useAnimation()
  const a = 10

  const run = useCallback(() => {
    controls.stop();
    return controls.start({
      rotate: [null, a, -a, 0],
      x: [null, '50%', '-50%', '0%'],
      opacity: [0, 1, 1, 1, 0]
    }, {
      duration: durationSecs
    })
  }, [controls, durationSecs])

  const swipeIcon = isExplicit(config)
    ? config.swipeIcon
    : <SwipeIcon svg={{ width: '4rem', height: '4rem', ...config?.svg }} path={{fill: 'white', ...config?.path}}/>

  const { style, ...divProps } = config?.divProps ?? {}
  const animation = (
    <motion.div animate={controls} initial={{opacity: 0}} style={{width: 'max-content', ...style}} {...divProps}>
      {swipeIcon}
    </motion.div>
  )

  return { animation, run }
}

export default useSwipeAnimation