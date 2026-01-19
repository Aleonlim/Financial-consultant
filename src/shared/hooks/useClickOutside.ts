import { useEffect } from 'react'

// вызывает callback, когда кликнули вне элемента
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>, // ссылка на элемент, который нужно отслеживать
  callback: () => void
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [ref, callback])
}
