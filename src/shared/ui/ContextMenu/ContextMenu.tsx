import {useEffect, useRef, useState} from 'react'
import MoreIcon from '@mui/icons-material/MoreVertRounded'
import { useClickOutside } from '@/shared/hooks/useClickOutside'

type Props = {
  actions: { label: string; onClick: () => void }[]
}

export const ContextMenu = ({ actions }: Props) => {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(ref, () => setOpen(false))

  // function handleOpen() {
  //   if (ref.current) {
  //     const rect = ref.current.getBoundingClientRect()
  //     const spaceBelow = window.innerHeight - rect.bottom
  //     const menuHeight = 160
  //     setDropUp(spaceBelow < menuHeight)
  //   }
  //   setOpen(prev => !prev)
  // }

  function handleOpen() {
    setOpen(prev => !prev)
  }

  useEffect(() => {
    if (open && ref.current && menuRef.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = menuRef.current.offsetHeight
      setDropUp(spaceBelow < menuHeight)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button onClick={handleOpen}>
        <MoreIcon />
      </button>

      {open && (
        <div ref={menuRef} className={`absolute right-0 bg-white shadow rounded z-10 ${
          dropUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
          {actions.map((a, i) => (
            <button key={i}
                    onClick={() => {
                      setOpen(false)
                      a.onClick()
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left whitespace-nowrap">
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

