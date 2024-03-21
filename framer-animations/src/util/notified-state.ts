import { managedPromise } from '@haskellian/async/promises/single/managed.js'
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

/** Exactly the same as `useState`, except `setState` returns a promise that resolves after the state is actually updated */
export function useNotifiedState<T>(initialState: T | (() => T)): [T, (a: SetStateAction<T>) => Promise<void>] {
  const [state, setState] = useState(initialState)
  const updatedState = useRef(managedPromise<void>())

  useEffect(() => { updatedState.current.resolve() }, [state])

  const notifiedSetState = useCallback(async (action: SetStateAction<T>) => {
    updatedState.current = managedPromise()
    setState(state => {
      const next = typeof action === 'function' ? (action as (x: T) => T)(state) : action
      if (state === next)
        updatedState.current.resolve()
      return next
    })
    await updatedState.current
  }, [])

  return [state, notifiedSetState]
}