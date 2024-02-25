import React from 'react';
import { AnimatePresence, type Variant, motion, Variants } from "framer-motion"
import { Key, ReactNode } from "react"

export type Direction = 'up' | 'down' | 'left' | 'right'

type Custom = {
  direction: Direction
  back?: boolean
}

const variant = ({ direction, back }: Custom): Variant =>
  direction === 'down' ? { y: back ? '-100%' : '100%', x: 0 } :
  direction === 'up' ? { y: back ? '100%' : '-100%', x: 0 } :
  direction === 'right' ? { x: back ? '-100%' : '100%', y: 0 } :
  { x: back ? '100%' : '-100%', y: 0 }

const variants: Variants = {
  exit: ({direction, back}: Custom) => ({
    ...variant({direction, back: !back}), opacity: 0
  }),
  center: {
    x: 0, y: 0, opacity: 1
  },
  enter: (custom: Custom) => ({
    ...variant(custom), opacity: 0
  })
}

export type Props = {
  children: ReactNode
  pageKey: Key
  direction?: Direction
  back?: boolean
  duration?: number
}
export function Slideshow({ children, pageKey, direction, back, duration }: Props) {
  const custom: Custom = { direction: direction ?? 'right', back}
  return (
    <AnimatePresence initial={false} custom={custom}>
      <motion.div key={pageKey} custom={custom} variants={variants}
        initial='enter' animate='center' exit='exit' transition={{ duration: duration ?? 0.2 }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}