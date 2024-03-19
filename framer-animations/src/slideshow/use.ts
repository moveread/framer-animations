import { Key, useState } from "react"
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
export function useSlideshow<View extends Key>(defaultView: View): Hook<View> {
  const [{ view, back }, setState] = useState<State<View>>({ view: defaultView })

  return {
    slideshowProps: { pageKey: view, direction: back ? 'left' : 'right'},
    goto: x => setState(x),
    go: x => () => setState(x),
    view
  }
}

