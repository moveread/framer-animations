import React, { useEffect, useState } from "react";
import { Carousel } from "./Carousel";
import type { SwipeDirection } from "./direction";

/** Always non-negative modulo */
const mod = (n: number, m: number) => ((n % m) + m) % m

export type Config = {
  mode: 'eager'
  items: JSX.Element[]
} | {
  mode?: 'lazy'
  numItems: number
  item(idx: number): JSX.Element
}
export type Hook = {
  carousel: JSX.Element
  selected: number
  move(swipeDir: SwipeDirection): void
  goto(page: number): void
}

/**
 * Self-managed draggable carousel. Returns the actual component `carousel`, plus the `selected` item and callbacks to programatically move
 */
export function useCarousel(config: Config): Hook {
  const [state, setState] = useState<{page: number, dir?: SwipeDirection, skipAnimation?: boolean}>({ page: 0 })
  useEffect(() => console.log(state), [state])
  const {page, dir, skipAnimation} = state

  function move(dir: SwipeDirection) {
    const delta = dir === 'left' ? 1 : -1
    setState(curr => ({ page: curr.page + delta, dir, skipAnimation: false }))
  };
  
  function goto(newPage: number) {
    console.log('Goto', newPage)
    const dir = newPage > page ? 'left' : 'right'
    const skipAnimation = Math.abs(newPage - page) > 1
    setState({ page: newPage, dir, skipAnimation })
  }

  const numItems = config.mode === 'eager'
    ? config.items.length
    : config.numItems
  const item = config.mode === 'eager'
    ? (idx: number) => config.items[idx]
    : config.item

  const selected = mod(page, numItems);
  const carousel = <Carousel page={page} direction={dir} skipAnimation={skipAnimation} move={move} item={item(selected)} />

  return { carousel, selected, move, goto }
};

export default useCarousel