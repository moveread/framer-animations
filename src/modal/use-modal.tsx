import React, { useState } from "react";
import { type MotionProps } from "framer-motion";
import { Modal } from "./Modal";

type Hook = {
  Modal: JSX.Element
  animate(show: boolean): void
}
type Props = MotionProps & { opacity?: number }
/** Presence-based, controlled modal (simple wrapper around `<Modal>`) */
export function useModal(props: Props): Hook {
  const [show, setShow] = useState(false)
  return { Modal: <Modal show={show} {...props} />, animate: setShow }
}
