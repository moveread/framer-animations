import React, { ReactNode, useCallback } from 'react';
import { motion, useAnimation, AnimationProps, Variants, Transition } from 'framer-motion';

export type Props = {
  animate: AnimationProps['animate']
  variants?: AnimationProps['variants']
  children?: ReactNode
  divProps?: Omit<AnimationProps, 'animate'>
}

export function Highlighted({ children, ...props }: Props) {
  return <motion.div {...props}>{children}</motion.div>;
}

export type Hook = {
  highlightedProps: Props;
  animate(action: 'start' | 'stop'): void;
}

export type Config = {
  transition?: Transition
  filter0?: string
  filter1?: string
}

export function useHighlight(config?: Config): Hook {
  const controls = useAnimation()
  const filter0 = config?.filter0 ?? 'brightness(100%) drop-shadow(0 0 8px rgba(255,255,255,0.5))'
  const filter1 = config?.filter1 ?? 'brightness(150%) drop-shadow(0 0 25px rgba(255,255,255,1))'


  const animate = useCallback((action: 'start' | 'stop') => {
    controls.stop()
    controls.start(action)
  }, [controls]);

  const variants: Variants = {
    start: {
      filter: [filter0, filter1, filter0],
      transition: {
        duration: 1,
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
