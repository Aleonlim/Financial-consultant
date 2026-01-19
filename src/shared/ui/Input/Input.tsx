import { useState, InputHTMLAttributes } from 'react'
import VisibilityIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffRounded'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  containerClassName?: string
}

export function Input(props: InputProps) {
  const {
    type,
    label,
    error,
    className,
    containerClassName,
    ...rest
  } = props

  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={`flex flex-col gap-1 ${containerClassName ?? ''}`}>
      {label && (
        <label className="text-sm text-gray-700">
          {label}
        </label>
      )}

      <div className="relative border rounded-[8px] bg-white">
        <input
          {...rest}
          type={inputType}
          className={`w-full px-[10px] py-[6px] rounded-[8px] outline-none ${
            isPassword ? 'pr-[32px]' : ''
          } ${className ?? ''}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-[6px] top-1/2 -translate-y-1/2"
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  )
}
