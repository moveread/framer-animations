import React, { memo } from "react"
import { useAnimation, motion, MotionProps, useMotionValue } from "framer-motion"

export type Keyframe = { opacity: number, secs: number }
export type Config = {
  keyframes?: Keyframe[]
  hiddenZ?: number,
  shownZ?: number
}

const defaultConfig: Required<Config> = {
  keyframes: [
    { opacity: 0.7, secs: 0.25 },
    { opacity: 0.7, secs: 1.25 },
    { opacity: 0, secs: 1.5 }
  ],
  hiddenZ: -1,
  shownZ: 1
}

/** Opacity-based overlay animation
 * - Pass `style` props to `Overlay` to merge-override default styles
 */
export function useOverlayAnimation(config?: Config): {
  run(): Promise<void>
  Overlay: typeof motion.div
} {
  const { keyframes, hiddenZ, shownZ } = {...defaultConfig, ...config}
  const overlay = useAnimation()
  const zIndex = useMotionValue(hiddenZ)

  async function run() {
    overlay.stop();
    const duration = keyframes[keyframes.length-1].secs
    const times = keyframes.map(x => x.secs / duration)
    const opacity = keyframes.map(x => x.opacity)
    zIndex.set(shownZ)
    await overlay.start({ opacity }, { duration, times })
    zIndex.set(hiddenZ)
  }

  const Overlay = memo(({ style, ...props }: MotionProps) => (
    <motion.div initial={{ opacity: 0 }} animate={overlay} style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style, zIndex
    }} {...props} />
  ))

  return { Overlay, run }
}

export default useOverlayAnimation