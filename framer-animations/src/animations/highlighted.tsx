import React, { ReactNode, useCallback, useMemo } from 'react';
import { motion, useAnimation, AnimationProps, Variants, Transition, MotionProps, Target } from 'framer-motion';

type TargetWithKeyframes<T = Target> = {
  [K in keyof T]: T[K] | T[K][] | [null, ...T[K][]];
}

export type Props = {
  animate: AnimationProps['animate']
  variants?: AnimationProps['variants']
  children?: ReactNode
  divProps?: Omit<MotionProps, 'animate'>
}

export function Highlighted({ children, ...props }: Props) {
  return <motion.div {...props}>{children}</motion.div>;
}

export type Hook = {
  highlightedProps: Props;
  animate(action: 'start' | 'stop'): void;
}

type ExplicitConfig = {
  _mode: 'explicit'
  start?: TargetWithKeyframes
  end?: TargetWithKeyframes
}
type SimpleConfig = {
  _mode?: 'simple'
  /** Defaults to 100 (%) */
  brightness0?: number,
  /** Defaults to 120 (%) */
  brightness1?: number,
  /** Defaults to `'0 0 8px rgba(255,255,255,0.5)'` */
  dropShadow0?: string,
  /** Defaults to `'0 0 25px rgba(255,255,255,1)'` */
  dropShadow1?: string
  /** Defaults to 1 */
  scale0?: number,
  /** Defaults to 1 */
  scale1?: number
}
export type Config = {
  transition?: Transition
} & (ExplicitConfig | SimpleConfig)

function startTarget(config?: Config): TargetWithKeyframes {
  if (config?._mode === 'explicit' && config.start)
    return config.start

  const cfg = config as SimpleConfig | undefined

  const b0 = cfg?.brightness0 ?? 100
  const b1 = cfg?.brightness1 ?? 120
  const d0 = cfg?.dropShadow0 ?? '0 0 8px rgba(255,255,255,0.5)'
  const d1 = cfg?.dropShadow1 ?? '0 0 25px rgba(255,255,255,1)'
  const filter0 = `brightness(${b0}%) drop-shadow(${d0})`
  const filter1 = `brightness(${b1}%) drop-shadow(${d1})`
  const scale0 = cfg?.scale0 ?? 1
  const scale1 = cfg?.scale1 ?? 1
  return {
    filter: [filter0, filter1, filter0],
    scale: [scale0, scale1, scale0],
  }
}

export function useHighlight(config?: Config): Hook {
  const controls = useAnimation()
  const start = useMemo(() => startTarget(config), [config])

  const animate = useCallback((action: 'start' | 'stop') => {
    controls.stop()
    controls.start(action)
  }, [controls]);

  const variants: Variants = {
    start: {
      ...start,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        ...config?.transition
      },
    },
    stop: {
      filter: "brightness(100%) drop-shadow(0 0 0 #0000)",
    },
  };

  return {
    highlightedProps: { animate: controls, variants },
    animate,
  };
}
