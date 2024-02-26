import React, { memo } from "react";
import { type MotionProps, motion, Variant, useAnimation } from "framer-motion";

export type Hook = {
  Modal: typeof motion.div
  animate(action: 'show' | 'hide'): Promise<void>
}

export type Config = {
  zIndex?: number
  hiddenZIndex?: number
  opacity?: number
}
const defaultCfg: Required<Config> = { zIndex: 1, hiddenZIndex: -1, opacity: 0.7 }

/** Opacity-based, controlled modal (always mounted) */
export function useModal(config?: Config): Hook {
  const { zIndex, hiddenZIndex, opacity } = {...defaultCfg, ...config}

  const controls = useAnimation()

  const variants: Record<string, Variant> = {
    hide: {
      opacity: 0,
      zIndex: hiddenZIndex
    },
    show: {
      opacity, zIndex
    }
  }

  const animate: Hook['animate'] = async (action) => {
    controls.stop()
    await controls.start(action)
  } 

  const Modal = memo(({ style, ...props }: MotionProps) => (
    <motion.div initial='hide' animate={controls} variants={variants} style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style
    }} {...props} />
  ))

  return { Modal, animate }
}