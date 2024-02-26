import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SwipeDirection } from "./direction";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

type Variant = {
  dir: SwipeDirection
  skipAnimation?: boolean
}

const variants = {
  enter: ({ dir, skipAnimation }: Variant) => {
    console.log('Entering from', dir, 'Skip?', skipAnimation)
    return skipAnimation ? {
      x: dir === 'left' ? '100%' : '-100%',
      zIndex: 0,
      scale: 0.5,
    } : {
      x: dir === 'left' ? '100%' : '-100%',
      zIndex: 0
    }
  },
  center: ({ dir, skipAnimation }: Variant) => {
    console.log('Centered', dir, 'Skip?', skipAnimation)
    return skipAnimation ? {
      x: 0,
      scale: 1,
      zIndex: 1,
      transition: {
        scale: { duration: 0.1, delay: 0.7 },
        x: { duration: 0.3, delay: 0.4, ease: [0, 0.9, 0.1, 0.9] }
      }
    } : {
      x: 0,
      zIndex: 1
    }
  },
  exit: ({ dir, skipAnimation }: Variant) => {
    console.log('Exiting to', dir, 'Skip?', skipAnimation)
    return skipAnimation ? {
      x: dir === 'left' ? '-100%' : '100%',
      zIndex: 0,
      scale: 0.5,
      transition: {
        scale: { duration: 0.1 },
        x: { delay: 0.1, duration: 0.3, ease: [0.9, 0.1, 0.9, 0] }
      }
    } : {
      x: dir === 'left' ? '-100%' : '100%',
      zIndex: 0,
    }
  }
};

export type Props = {
  move(dir: SwipeDirection): void
  page: number
  item: JSX.Element
  direction?: SwipeDirection
  skipAnimation?: boolean
}

/** Controlled, unstyled Carousel
 * - `move`: callback called when the carousel is dragged to one side
 * - `item`: currently displayed item
 * - `page`: `key` of the item
 * - `direction`: animation direction when switching pages
 * - `skipAnimation`: whether to perform a 'skipping' animation when switching pages
 */
export function Carousel({ move, direction, page, item, skipAnimation }: Props) {
  return (
    (
      <div style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence initial={false} custom={{ dir: direction, skipAnimation }}>
          <motion.div key={page} custom={{ dir: direction, skipAnimation }}
            variants={variants} initial="enter" animate="center"
            exit='exit'
            style={{ height: '100%', width: '100%', position: 'absolute' }}
            drag="x" dragElastic={1} dragConstraints={{ left: 0, right: 0 }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                move('left')
              }
              else if (swipe > swipeConfidenceThreshold)
                move('right')
            }}
          >
            {item}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  )
}

export default Carousel