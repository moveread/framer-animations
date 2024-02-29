import React, { Key, ReactNode } from "react"
import { AnimatePresence, type Variant, motion, Variants, Transition, MotionStyle } from "framer-motion"

export const directions = ['up', 'down', 'left', 'right'] as const
export type Direction = typeof directions[number]

const variant = (direction: Direction, back?: boolean): Variant =>
  direction === 'down' ? { y: back ? '-100%' : '100%', x: 0 } :
  direction === 'up' ? { y: back ? '100%' : '-100%', x: 0 } :
  direction === 'right' ? { x: back ? '-100%' : '100%', y: 0 } :
  { x: back ? '100%' : '-100%', y: 0 }

const variants: Variants = {
  exit: (dir: Direction) => ({
    ...variant(dir, true), opacity: 0
  }),
  center: {
    x: 0, y: 0, opacity: 1
  },
  enter: (dir: Direction) => ({
    ...variant(dir), opacity: 0
  })
}

type Props = {
  children: ReactNode
  pageKey: Key
  direction?: Direction
  /** `framer-motion` transition ([docs](https://www.framer.com/motion/transition/)). Default: `{ duration: 0.2 }` */
  transition?: Transition
  style?: MotionStyle
}
export function Slideshow({ children, pageKey, direction, transition, style }: Props) {
  const dir: Direction = direction ?? 'right'
  return (
    <AnimatePresence initial={false} custom={dir}>
      <motion.div key={pageKey} custom={dir} variants={variants}
        initial='enter' animate='center' exit='exit' transition={transition ?? {duration: 0.2}}
        style={{ width: '100%', height: '100%', position: 'absolute', ...style }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default Slideshow