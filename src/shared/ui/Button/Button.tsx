import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    disabled = false,
    type = 'button',
    className,
    ...rest
  } = props

  let styles = ''

  switch (variant) {
    case 'primary':
      styles = 'bg-blue-800 text-white hover:bg-blue-900'
      break
    case 'secondary':
      styles = 'bg-gray-200 text-black hover:bg-gray-300'
      break
    case 'danger':
      styles = 'bg-red-600 text-white hover:bg-red-700'
      break
  }

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={`
        p-2 min-w-[200px] rounded-[8px] transition-colors text-[16px] flex gap-x-[10px] justify-center items-center
        ${styles}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}