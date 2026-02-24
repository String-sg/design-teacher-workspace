import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import type { AppColor } from '@/data/apps'
import { cn } from '@/lib/utils'

const iconHoverColorVariants: Record<AppColor, string> = {
  pink: 'group-hover:text-pink-500',
  blue: 'group-hover:text-twblue-9',
  orange: 'group-hover:text-orange-500',
  green: 'group-hover:text-green-500',
  purple: 'group-hover:text-purple-500',
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
          'relative isolate flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border bg-white',
          iconPaddingVariants[iconPadding],
          className,
        )}
      >
        <img src={icon} alt="" className="h-full w-full object-contain" />
        <div className="absolute inset-0 bg-[#0064ff] mix-blend-color transition-opacity duration-200 group-hover:opacity-0" />
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
      <Icon className={cn('size-8 text-[#0064ff] transition-colors duration-200', iconHoverColorVariants[color])} />
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
        'group flex flex-col gap-4 rounded-3xl border bg-background p-4 transition-colors hover:bg-muted/50',
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
  badge?: string
  iconPadding?: 'none' | 'sm' | 'md'
  className?: string
}

export function FeaturedAppCard({
  name,
  description,
  icon,
  color,
  href,
  badge,
  iconPadding,
  className,
}: FeaturedAppCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        'group flex h-[132px] items-center gap-4 rounded-3xl border border-[#C8C8C8] bg-white p-4 transition-colors hover:bg-muted/50',
        className,
      )}
    >
      <AppIcon icon={icon} color={color} iconPadding={iconPadding} />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{name}</h3>
          {badge && (
            <span className="rounded-full border-0 bg-twblue-3 px-2 py-0.5 text-xs font-medium text-twblue-9">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
