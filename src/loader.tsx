import React from 'react';
import { motion, useAnimation, Variant } from 'framer-motion';


type Hook = {
  Loader: JSX.Element
  open(repeats?: number): Promise<void>
  close(): Promise<void>
  run(): Promise<void>
}
type Config = {
  checkIcon: JSX.Element
  color?: string
}

type State = 'start' | 'scaled' | 'loading' | 'filled' | 'out';
export function useAnimatedLoader({ checkIcon, ...config }: Config): Hook {

  const color = config.color ?? '#666'
  const controls = useAnimation();

  const variants: Record<State, Variant> = {
    start: {
      scale: 0,
      opacity: 0,
      rotate: 0,
      strokeWidth: 2,
      stroke: color,
      strokeDasharray: "100 10",
      strokeDashoffset: 0,
      fill: 'none'
    },
    scaled: {
      rotate: 360,
      scale: 1,
      opacity: 1,
      strokeWidth: 2,
      stroke: color,
      strokeDasharray: "25 150",
      strokeDashoffset: 0,
      fill: 'none',
      transition: {
        rotate: { duration: 0.6, ease: 'linear' },
        strokeDasharray: { duration: 0.25 }
      }
    },
    loading: (repeats: number) => ({
      rotate: [360, 720],
      scale: 1,
      strokeWidth: 2,
      fill: 'none',
      stroke: color,
      strokeDasharray: "25 150",
      strokeDashoffset: 0,
      transition: { duration: 0.6, repeat: repeats ?? Infinity, ease: 'linear' }
    }),
    filled: {
      scale: 1,
      rotate: 1080,
      strokeWidth: 50,
      fill: color,
      stroke: color,
      strokeDasharray: "unset",
      strokeDashoffset: 0,
      transition: { type: 'spring', stiffness: 150, damping: 8, mass: 0.5 },
    },
    out: {
      scale: '0',
      transition: {
        duration: 0.2
      }
    }
  }

  const iconControls = useAnimation()


  async function open(repeats?: number) {
    controls.stop()
    await controls.start('start')
    await controls.start('scaled')
    await controls.start((variants.loading as any)(repeats ?? Infinity))
  }

  async function close() {
    controls.stop()
    await Promise.all([
      controls.start('filled'),
      iconControls.start({ opacity: 1 }, { duration: 0.2 })
    ])
    await Promise.all([
      controls.start('out'),
      iconControls.start({ opacity: 0 }, { duration: 0.2 })
    ])
  }

  async function run() {
    controls.stop()
    await open(0)
    await close()
  }

  const Loader = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.circle
          cx='50' cy='50' r='25' fill='none'
          initial='start' animate={controls}
          variants={variants}
        />
      </svg>
      <motion.div style={{
        height: '100%', width: '100%', position: 'absolute', top: 0, left: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem'
      }}
        animate={iconControls} initial={{ opacity: 0 }}
      >
        {checkIcon}
      </motion.div>
    </div>
  );

  return { Loader, open, close, run };
}
