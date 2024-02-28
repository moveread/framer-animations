import React from "react";
import { type MotionProps } from "framer-motion";
import { Modal } from "./Modal";
import { useNotifiedState } from "../util/notified-state";

type Hook = {
  modal: JSX.Element
  animate(show: boolean): Promise<void>
  mounted: boolean
}
type Props = MotionProps & { opacity?: number }
/** Presence-based, controlled modal (simple wrapper around `<Modal>`) , but `animate` already awaits until the state changes */
export function useModal(props: Props): Hook {
  const [show, setShow] = useNotifiedState(false)
  return { modal: <Modal show={show} {...props} />, animate: setShow, mounted: show }
}
