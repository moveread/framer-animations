import React, { useCallback, useState } from "react";
import { Carousel } from "./Carousel.js";
import { SwipeDirection } from "../types.js";
import { mod } from "@haskellian/mod";

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
  /** Whether to allow navigation between the first and last items (defaults to `true`) */
  wrap?: boolean
}

/**
 * Self-managed draggable carousel. Returns the actual component `carousel`, plus the `selected` item and callbacks to programatically move
 */
export function useCarousel(items: Items, config?: Config): Hook {
  const wrap = config?.wrap ?? true
  
  const numItems = items.mode === 'eager'
    ? items.items.length
    : items.numItems
  const item = items.mode === 'eager'
    ? (idx: number) => items.items[idx]
    : items.item

  const [state, setState] = useState<{page: number, dir?: SwipeDirection, skipAnimation?: boolean}>({ page: 0 })
  const { page, dir, skipAnimation } = state

  const move = useCallback((dir: SwipeDirection) => {
    const delta = dir === 'left' ? 1 : -1
    setState(curr => { 
      const page = wrap
        ? curr.page + delta
        : Math.max(0, Math.min(curr.page + delta, numItems-1))
      return {
        page, dir, skipAnimation: false
      }
    })
  }, [setState, wrap, numItems])
  
  const goto = useCallback((newPage: number) => {
    const dir = newPage > page ? 'left' : 'right'
    const skipAnimation = Math.abs(newPage - page) > 1
    setState({ page: newPage, dir, skipAnimation })
  }, [page, setState])


  const selected = mod(page, numItems);
  const carousel = (
    <Carousel page={page} direction={dir} skipAnimation={skipAnimation}
      move={move} item={item(selected)} {...config}
    />
  )

  return { carousel, selected, move, goto }
}

export default useCarousel