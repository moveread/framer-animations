import React from 'react';
import { motion, AnimatePresence, MotionProps } from "framer-motion"

export type Props = MotionProps & {
  show: boolean
  opacity?: number
}
export function Modal({ show, children, opacity, style, ...motionProps }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: opacity ?? 0.7 }}
          exit={{ opacity: 0 }}
          transition={{duration: 1}}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...style
          }}
          children={children}
          {...motionProps}
        />
      )}
    </AnimatePresence>
  )
}