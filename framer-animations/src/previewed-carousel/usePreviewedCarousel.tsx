import React, { useCallback, useState } from "react"
import PreviewedCarousel, { Config } from "./PreviewedCarousel.js"
import { SwipeDirection } from "../util/swipe.js"
import { mod } from "../util/mod.js"

export type ItemProps = {
  idx: number
  selected?: boolean
}
export type Hook = {
  carousel: JSX.Element
  selected: number
  move(swipeDir: SwipeDirection): void
}
export function usePreviewedCarousel(
  item: (props: ItemProps) => JSX.Element,
  numItems: number, config?: Config
): Hook {

  const [page, setPage] = useState(1)
  const idx = mod(page, numItems)
  const next = (i: number, m = numItems) => mod(i + 1, m)
  const prev = (i: number, m = numItems) => mod(i - 1, m)

  const m = numItems < 2 ? 4*numItems // minimum multiple of numItems >3
          : numItems < 3 ? 2*numItems // (so that three items are always shown, even if repeated)
          : numItems

  const move = useCallback((dir: SwipeDirection) => {
    setPage(i => dir === 'left' ? i+1 : i-1)
  }, [])

  const carousel = (
    <PreviewedCarousel
      prev={{ elem: item({ idx: prev(idx) }), key: mod(page-1, m) }}
      curr={{ elem: item({ idx, selected: true }), key: mod(page, m) }}
      next={{ elem: item({ idx: next(idx)} ), key: mod(page+1, m) }}
      move={move} config={config}
    />
  )

  return { move, selected: idx, carousel }
}