import {ReactNode, useEffect} from 'react'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

const modalRoot = document.getElementById('modal-root')!

export const Modal = ({ isOpen, onClose, title, children }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(

  <div className="fixed inset-0 z-[1000] flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/50"
    />

    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
      {title && (
        <div className="px-4 py-3 mb-[20px]">
          <h2 className="text-lg font-semibold text-center">{title}</h2>
          <button className={'absolute top-4 right-3'} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="p-4">{children}</div>
    </div>
  </div>,
    modalRoot
  )
}