import React, { useCallback } from 'react'
import { useAnimation, motion, MotionProps } from 'framer-motion'
import { delay } from './util/promises.js'
import { Modal } from './modal/index.js'
import { PointerIcon, Props as IconProps } from './util/icons/PointerIcon.js'
import { useNotifiedState } from './util/notified-state.js'

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

  const [modal, setModal] = useNotifiedState(false)
  const iconControls = useAnimation()

  const run = useCallback(async (action: Action): Promise<void> => {
    switch (action) {
      case 'show':
          return await setModal(true) // make sure the modal is mounted before continuing
        case 'hide':
          setModal(false) // we already assume the modal will be unmounted, so who cares
          return
      case 'press':
      case 'lift': {
        const scale = action === 'press' ? 0.7 : 1
        iconControls.stop()
        return await iconControls.start({ scale })
      }
    }
  }, [iconControls, setModal])

  const animate = useCallback(async (...actions: Action[]) => {
    for (const a of actions) {
      await run(a)
      await delay(0)
    }
  }, [run])

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