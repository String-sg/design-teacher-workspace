import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import type { AppColor } from '@/data/apps'
import { cn } from '@/lib/utils'

const iconColorVariants: Record<AppColor, string> = {
  pink: 'text-pink-500',
  blue: 'text-twblue-9',
  orange: 'text-orange-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
}

const iconPaddingVariants = {
  none: 'p-1',
  sm: 'p-1.5',
  md: 'p-3',
} as const

interface AppIconProps {
  icon: LucideIcon | string
  color: AppColor
  iconPadding?: 'none' | 'sm' | 'md'
  className?: string
}

export function AppIcon({ icon, color, iconPadding = 'sm', className }: AppIconProps) {
  if (typeof icon === 'string') {
    return (
      <div
        className={cn(
          'flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border bg-white',
          iconPaddingVariants[iconPadding],
          className,
        )}
      >
        <img src={icon} alt="" className="h-full w-full object-contain" />
      </div>
    )
  }

  const Icon = icon
  return (
    <div
      className={cn(
        'flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border bg-white',
        className,
      )}
    >
      <Icon className={cn('size-8', iconColorVariants[color])} />
    </div>
  )
}

interface AppCardProps {
  name: string
  description: string
  icon: LucideIcon | string
  color: AppColor
  href: string
  iconPadding?: 'none' | 'sm' | 'md'
  className?: string
}

export function AppCard({
  name,
  description,
  icon,
  color,
  href,
  iconPadding,
  className,
}: AppCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex flex-col gap-4 rounded-3xl border bg-background p-4 transition-colors hover:bg-muted/50',
        className,
      )}
    >
      <AppIcon icon={icon} color={color} iconPadding={iconPadding} />
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  )
}

interface FeaturedAppCardProps {
  name: string
  description: string
  icon: LucideIcon | string
  color: AppColor
  href: string
  iconPadding?: 'none' | 'sm' | 'md'
  className?: string
}

export function FeaturedAppCard({
  name,
  description,
  icon,
  color,
  href,
  iconPadding,
  className,
}: FeaturedAppCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-6 rounded-3xl border bg-muted/30 p-4 transition-colors hover:bg-muted/50',
        className,
      )}
    >
      <AppIcon icon={icon} color={color} iconPadding={iconPadding} />
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
