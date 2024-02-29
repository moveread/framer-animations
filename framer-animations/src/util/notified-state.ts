import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { managedPromise } from './promises'

/** Exactly the same as `useState`, except `setState` returns a promise that resolves after the state is actually updated */
export function useNotifiedState<T>(initialState: T | (() => T)): [T, (a: SetStateAction<T>) => Promise<void>] {
  const [state, setState] = useState(initialState)
  const updatedState = useRef(managedPromise<boolean>())

  useEffect(() => { updatedState.current.resolve(true)}, [state])

  const notifiedSetState = useCallback(async (action: SetStateAction<T>) => {
    updatedState.current = managedPromise()
    setState(action)
    await updatedState.current.promise
  }, [])

  return [state, notifiedSetState]
}