import React from 'react';
import { useAnimation, motion, Variant, MotionProps } from "framer-motion"

const variantKeys = ['start', 'loading', 'succeed', 'fail', 'out'] as const
type VariantKey = typeof variantKeys[number]

const defaultSuccess = (
  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12.5L11.5 15L15 9" stroke="#282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const defaultFail = (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="#822" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="#822" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export type Hook = {
  loader: JSX.Element
  animate: {
    (c: 'load'): void
    (c: 'stop' | 'succeed' | 'fail'): Promise<void>
  }
}
export type Config = {
  color?: string
  successIcon?: JSX.Element
  failIcon?: JSX.Element
  strokeWidth?: string | number
  /** Value in [0, 1]. 'Active' proportion of the circumference at the start */
  startArcProportion?: number
  /** Value in [0, 1]. 'Active' proportion of the circumference during loading */
  loadingArcProportion?: number
  /** Time [seconds] of a full lap of the spinner. Default: `1` */
  period?: number
  /** Time [seconds] of arc proportion animation. Default: `period/2` */
  arcDuration?: number
}
const defaultCfg: Required<Config> = {
  color: 'white', successIcon: defaultSuccess, failIcon: defaultFail,
  strokeWidth: 2, startArcProportion: 1, loadingArcProportion: 0.1,
  period: 1, arcDuration: 0.5
}

// Inspired by https://jitter.video/file/?id=dAMdMIMhmM01LvguoXUkc
export function useLoader(config?: Config): Hook {

  const { color, successIcon, failIcon,
    loadingArcProportion, startArcProportion, strokeWidth, period } = { ...defaultCfg, ...config }
  const arcDuration = config?.arcDuration ?? period / 2

  const controls = useAnimation()
  const successControls = useAnimation()
  const failControls = useAnimation()

  const variants: Record<VariantKey, Variant> = {
    start: {
      scale: 1,
      pathLength: startArcProportion,
      pathOffset: 1 - startArcProportion,
      opacity: 0,
      fill: 'none',
      strokeWidth,
    },
    loading: {
      opacity: 1,
      pathLength: loadingArcProportion,
      pathOffset: [0, 1 - loadingArcProportion],
      rotate: [0, 360],
      transition: {
        duration: arcDuration,
        rotate: { duration: period, repeat: Infinity, ease: 'linear' }
      }
    },
    succeed: {
      scale: 1,
      opacity: 1,
      pathLength: 1,
      pathOffset: 0,
      strokeWidth: [strokeWidth, 40],
      fill: ['none', color],
      transition: {
        strokeWidth: { type: 'spring', stiffness: 150, damping: 8, mass: 0.5 },
        pathLength: { duration: 0 },
        pathOffset: { duration: 0 },
      }
    },
    fail: {
      scale: 1,
      opacity: 1,
      pathLength: 1,
      pathOffset: 0,
      strokeWidth: [strokeWidth, 40],
      fill: ['none', color],
      transition: {
        strokeWidth: { type: 'spring', stiffness: 150, damping: 8, mass: 0.5 },
        pathLength: { duration: 0 },
        pathOffset: { duration: 0 },
      }
    },
    out: {
      scale: [1, 0],
      transition: {
        duration: 0.2
      }
    }
  }

  async function start() {
    controls.stop()
    await controls.start('start')
  }
  function load() {
    controls.stop()
    controls.start('loading')
  }
  async function finish(result: 'succeed' | 'fail') {
    const iconControls = result === 'succeed'
      ? successControls : failControls
    controls.stop()
    await Promise.all([
      controls.start(result),
      iconControls.start({ opacity: 1, scale: 1 })
    ])
    await Promise.all([
      controls.start('out'),
      iconControls.start({ opacity: 0, scale: 0 }, { duration: 0.2 })
    ])
    controls.set('start')
  }

  const animate: Hook['animate'] = (action) =>
    action === 'stop' ? start() :
      action === 'load' ? load() :
        finish(action) as any

  const iconStyle: MotionProps['style'] = {
    height: '100%', width: '100%', position: 'absolute', top: 0, left: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem'
  }

  const loader = (
    <div style={{
        height: '100%', width: '100%', position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center', border: '1px solid red'
    }}>
      <svg viewBox="0 0 100 100">
        <motion.circle
          variants={variants} initial='start' animate={controls}
          cx='50' cy='50' r='20' stroke={color}
        >
        </motion.circle>
      </svg>
      <motion.div style={iconStyle} initial={{ opacity: 0, scale: 0 }} animate={successControls}>
        {successIcon}
      </motion.div>
      <motion.div style={iconStyle} initial={{ opacity: 0, scale: 0 }} animate={failControls}>
        {failIcon}
      </motion.div>
    </div>
  )

  return { animate, loader }
}