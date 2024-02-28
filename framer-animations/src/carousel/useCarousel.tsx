import React, { useCallback, useEffect, useState } from "react";
import { Carousel } from "./Carousel";
import { SwipeDirection } from "../util/swipe";
import { mod } from "../util/mod";

export type Items = {
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
export type Config = {
  swipeThreshold?: number
}

/**
 * Self-managed draggable carousel. Returns the actual component `carousel`, plus the `selected` item and callbacks to programatically move
 */
export function useCarousel(items: Items, config?: Config): Hook {
  const [state, setState] = useState<{page: number, dir?: SwipeDirection, skipAnimation?: boolean}>({ page: 0 })
  useEffect(() => console.log(state), [state])
  const {page, dir, skipAnimation} = state

  const move = useCallback((dir: SwipeDirection) => {
    const delta = dir === 'left' ? 1 : -1
    setState(curr => ({ page: curr.page + delta, dir, skipAnimation: false }))
  }, [setState])
  
  const goto = useCallback((newPage: number) => {
    console.log('Goto', newPage)
    const dir = newPage > page ? 'left' : 'right'
    const skipAnimation = Math.abs(newPage - page) > 1
    setState({ page: newPage, dir, skipAnimation })
  }, [page, setState])

  const numItems = items.mode === 'eager'
    ? items.items.length
    : items.numItems
  const item = items.mode === 'eager'
    ? (idx: number) => items.items[idx]
    : items.item

  const selected = mod(page, numItems);
  const carousel = (
    <Carousel page={page} direction={dir} skipAnimation={skipAnimation}
      move={move} item={item(selected)} {...config}
    />
  )

  return { carousel, selected, move, goto }
}

export default useCarousel