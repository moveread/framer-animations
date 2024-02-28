import React, { useState } from 'react'
import { useAnimation, motion, MotionProps } from 'framer-motion'
import { delay } from './util/promises'
import { Modal } from './modal'
import { PointerIcon, Props as IconProps } from './util/icons/PointerIcon'

type IconConfig = {
  handIcon?: JSX.Element
}
export type Config = (IconConfig | IconProps) & {
  modalProps?: Omit<MotionProps, 'animate'>
  iconProps?: Omit<MotionProps, 'animate'>
}
export type Action = 'show' | 'press' | 'lift' | 'hide'
export type Hook = {
  animation: JSX.Element
  animate(...actions: Action[]): void
}

export function useTouchAnimation(config?: Config) {
  const cfg = (config ?? {}) as IconConfig & IconProps
  const handIcon = cfg.handIcon
    ?? <PointerIcon svg={{ width: '4rem', height: '4rem', ...cfg.svg }} path={{fill: 'white', ...cfg.path}} />

  const [modal, setModal] = useState(false)
  const iconControls = useAnimation()

  async function run(action: Action): Promise<void> {
    switch (action) {
      case 'show':
      case 'hide':
        return setModal(action === 'show')
      case 'press':
      case 'lift':
        const scale = action === 'press' ? 0.7 : 1
        iconControls.stop()
        return await iconControls.start({ scale })
    }
  }
  async function animate(...actions: Action[]) {
    for (const a of actions) {
      run(a)
      await delay(0)
    }
  }

  const { transition, ...modalProps } = config?.modalProps ?? {}
  const { style, ...iconProps } = config?.iconProps ?? {}
  const initial = typeof iconProps.initial === 'object' ? iconProps.initial : undefined

  const animation = (
    <Modal show={modal} transition={{ duration: 0.2, ...transition }} {...modalProps}>
      <motion.div animate={iconControls} initial={{ scale: 1, ...initial }} style={{ y: '70%', x: '40%', ...style }}>
        {handIcon}
      </motion.div>
    </Modal>
  )

  return { animation, animate }
}