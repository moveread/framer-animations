import { Key, SetStateAction, useCallback, useRef, useState } from "react"
export type State<View> = { view: View, back?: boolean }

export type Hook<View> = {
  slideshowProps: {
    pageKey: Key
    direction: 'left' | 'right'
  },
  goto(to: State<View>): void,
  go(to: State<View>): () => void,
  view: View
}
export type Config = {
  /** Min. time delta (in milliseconds) before any state update. Defaults to 200; set to 0 to disable */
  throttleMs?: number
}
export function useSlideshow<View extends Key>(defaultView: View, config?: Config): Hook<View> {
  const [{ view, back }, setState_] = useState<State<View>>({ view: defaultView })
  const throttle = useRef(false)
  const throttleMs = config?.throttleMs ?? 200

  const setState = useCallback((x: SetStateAction<State<View>>) => {
    if (throttle.current)
      return
    setState_(x)
    if (throttleMs > 0)
      throttle.current = true
      setTimeout(() => throttle.current = false, throttleMs)
  }, [throttleMs])

  return {
    slideshowProps: { pageKey: view, direction: back ? 'left' : 'right'},
    goto: x => setState(x),
    go: x => () => setState(x),
    view
  }
}

