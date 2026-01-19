import {useRef, useState} from 'react'
import { useTranslation } from 'react-i18next'
import TranslateIcon from '@mui/icons-material/TranslateRounded'
import { useClickOutside } from '@/shared/hooks/useClickOutside'

type LanguageSwitcherProps = {className?: string}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const { className } = props
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => setOpen(false))

  function handleOpen() {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = 140
      setDropUp(spaceBelow < menuHeight)
    }
    setOpen(prev => !prev)
  }

  function changeLanguage(lang: 'ru' | 'en'| 'zh') {
    i18n.changeLanguage(lang).then(() => {
      localStorage.setItem('lang', lang)
      setOpen(false)
    })
      .catch(err => console.error(err))
  }


  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        className="bg-blue-800 h-[40px] rounded-[8px] aspect-square p-[5px] hover:bg-blue-900 transition-colors"
        onClick={handleOpen}
        type="button"
      >
        <TranslateIcon className="text-white" />
      </button>

      {open && (
        <div className={`absolute right-0 bg-white rounded shadow w-32 ${
               dropUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
          <button
            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
            onClick={() => changeLanguage('ru')}
          >
            Русский
          </button>
          <button
            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button
            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
            onClick={() => changeLanguage('zh')}>
            中文
          </button>
        </div>
      )}
    </div>
  )
}
