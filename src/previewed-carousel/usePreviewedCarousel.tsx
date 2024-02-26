import React, { useState } from "react"
import PreviewedCarousel, { PreviewConfig } from "./PreviewedCarousel"
import { SwipeDirection } from "../util/swipe"
import { mod } from "../util/mod"

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
}
export type Config = {
  preview?: PreviewConfig
  swipeThreshold?: number
}

export function usePreviewedCarousel(items: Items, config?: Config): Hook {

  const numItems = items.mode === 'eager'
    ? items.items.length
    : items.numItems
  const item = items.mode === 'eager'
    ? (idx: number) => items.items[idx]
    : items.item

  const [idx, setIdx] = useState(1)
  const next = (i: number) => mod(i + 1, numItems)
  const prev = (i: number) => mod(i - 1, numItems)

  function move(dir: SwipeDirection) {
    setIdx(dir === 'left' ? next : prev)
  }

  const carousel = (
    <PreviewedCarousel
      prev={{ elem: item(prev(idx)), key: prev(idx) }}
      curr={{ elem: item(idx), key: idx }}
      next={{ elem: item(next(idx)), key: next(idx) }}
      move={move} {...config}
    />
  )

  return { move, selected: idx, carousel }
}