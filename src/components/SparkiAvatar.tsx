import React from 'react'

export interface SparkiAvatarProps {
  /** Size: 'sm' (header), 'md' (unit page), 'lg' (celebration) */
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Skip bounce animation (e.g. for static placement) */
  static?: boolean
}

const sizeClasses = {
  sm: 'w-12 h-12 min-w-[3rem] min-h-[3rem]',
  md: 'w-20 h-20 min-w-[5rem] min-h-[5rem]',
  lg: 'w-28 h-28 min-w-[7rem] min-h-[7rem]',
}

const SparkiAvatar: React.FC<SparkiAvatarProps> = ({
  size = 'md',
  className = '',
  static: isStatic = false,
}) => {
  return (
    <div
      className={`
        rounded-full overflow-hidden flex-shrink-0
        ring-2 ring-white/50 shadow-sparkle
        ${sizeClasses[size]}
        ${isStatic ? '' : 'animate-float-bounce'}
        ${className}
      `}
      role="img"
      aria-label="Sparki the AI teddy bear"
    >
      <img
        src="/sparkiacademylogo.webp"
        alt=""
        className="w-full h-full object-cover"
        width={size === 'sm' ? 48 : size === 'md' ? 80 : 112}
        height={size === 'sm' ? 48 : size === 'md' ? 80 : 112}
      />
    </div>
  )
}

export default SparkiAvatar
