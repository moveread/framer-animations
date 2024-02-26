import React, { Key } from 'react'
import { AnimatePresence, LayoutGroup, MotionProps, Variant, motion } from 'framer-motion'
import { SwipeDirection, swipePower } from '../util/swipe'

const states = ['enter', 'left', 'center', 'right', 'exit'] as const
type State = typeof states[number]

export type Item = {
  key: Key
  elem: JSX.Element
}
export type PreviewConfig = {
  scale?: number
  widthProportion?: number
  rotateY?: string
  transformPerspective?: number
}
type Props = {
  prev: Item
  curr: Item
  next: Item
  move(direction: SwipeDirection): void
  preview?: PreviewConfig,
  swipeThreshold?: number
}
export function PreviewedCarousel({ prev, curr, next, move, preview, swipeThreshold }: Props) {

  const scale = preview?.scale ?? 0.7
  const rotateY = preview?.rotateY ?? '15deg'
  const transformPerspective = preview?.transformPerspective ?? 1000
  const widthProportion = preview?.widthProportion ?? 0.25

  const variants: Record<State, Variant> = {
    enter: { opacity: 0, scale: 0 },
    exit: { opacity: 0, scale: 0 },
    left: { opacity: 1, scale: preview?.scale ?? 0.7 },
    center: { opacity: 1, scale: 1 },
    right: { opacity: 1, scale },
  }

  const common: MotionProps = {
    style: { height: '100%' }, variants,
    layout: 'position', exit: 'exit', initial: 'enter',
  }

  return (
    <LayoutGroup>
      <motion.div layoutRoot style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <AnimatePresence initial={false} mode='popLayout'>
          <motion.div key={prev.key} {...common} animate='left' style={{ height: '100%', width: `${100*widthProportion}%` }}>
            <motion.div key={prev.key} style={common.style} animate={{ rotateY, transformPerspective }}>
              {prev.elem}
            </motion.div>
          </motion.div>
          <motion.div key={curr.key} {...common} animate='center' style={{ height: '100%', width: `${100*(1-2*widthProportion)}%` }}
            drag="x" dragElastic={1} dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -(swipeThreshold ?? 1e4)) {
                move('left')
              }
              else if (swipe > (swipeThreshold ?? 1e4))
                move('right')
            }}
          >
            {curr.elem}
          </motion.div>
          <motion.div key={next.key} {...common} animate='right' style={{ height: '100%', width: `${100*widthProportion}%` }}>
            <motion.div key={next.key} style={common.style} animate={{ rotateY: `-${rotateY}`, transformPerspective }}>
              {next.elem}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}

export default PreviewedCarousel