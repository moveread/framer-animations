import React, { Key } from 'react'
import { AnimatePresence, LayoutGroup, MotionProps, Variant, motion, useDragControls } from 'framer-motion'
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
  zIndex?: number
}
export const defaultPreview: Required<PreviewConfig> = {
  scale: 0.7, rotateY: '45deg', transformPerspective: 1000, widthProportion: 0.25, zIndex: 0
}
export type CurrentConfig = {
  zIndex?: number
  scale?: number
}
export const defaultCurr: Required<CurrentConfig> = {
  scale: 1.2, zIndex: 1
}
type Props = {
  prev: Item
  curr: Item
  next: Item
  move(direction: SwipeDirection): void
  preview?: PreviewConfig,
  current?: CurrentConfig
  swipeThreshold?: number
}
export function PreviewedCarousel({ prev, curr, next, move, swipeThreshold, ...config }: Props) {

  const { scale, widthProportion, rotateY, transformPerspective, zIndex } = {...defaultPreview, ...config.preview}
  const { scale: currScale, zIndex: currZ } = {...defaultCurr, ...config.current }
  

  const variants: Record<State, Variant> = {
    enter: { opacity: 0, scale: 0 },
    exit: { opacity: 0, scale: 0 },
    left: { opacity: 1, scale, zIndex },
    center: { opacity: 1, scale: currScale, zIndex: currZ },
    right: { opacity: 1, scale, zIndex },
  }

  const common: MotionProps = {
    style: { height: '100%' }, variants,
    layout: 'position', exit: 'exit', initial: 'enter',
  }

  const dragControls = useDragControls()
  const startDrag = e => dragControls.start(e)

  return (
    <LayoutGroup>
      <motion.div layoutRoot style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}
        onPointerDown={startDrag}
      >
        <AnimatePresence initial={false} mode='popLayout'>
          <motion.div key={prev.key} {...common} animate='left' style={{ height: '100%', width: `${100*widthProportion}%`, userSelect: 'none' }}>
            <motion.div key={prev.key} style={common.style} animate={{ rotateY, transformPerspective }}>
              {prev.elem}
            </motion.div>
          </motion.div>
          <motion.div key={curr.key} {...common} animate='center' style={{ height: '100%', width: `${100*(1-2*widthProportion)}%` }}
            drag="x" dragElastic={1} dragConstraints={{ left: 0, right: 0 }} dragControls={dragControls}
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
          <motion.div key={next.key} {...common} animate='right' style={{ height: '100%', width: `${100*widthProportion}%`, userSelect: 'none' }}>
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