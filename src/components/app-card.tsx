import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import type { AppColor } from '@/data/apps'
import { cn } from '@/lib/utils'

const colorVariants: Record<AppColor, string> = {
  pink: 'bg-pink-500',
  blue: 'bg-twblue-9',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
}

interface AppIconProps {
  icon: LucideIcon
  color: AppColor
  className?: string
}

export function AppIcon({ icon: Icon, color, className }: AppIconProps) {
  return (
    <div
      className={cn(
        'flex size-16 shrink-0 items-center justify-center rounded-2xl',
        colorVariants[color],
        className,
      )}
    >
      <Icon className="size-8 text-white" />
    </div>
  )
}

interface AppCardProps {
  name: string
  description: string
  icon: LucideIcon
  color: AppColor
  href: string
  className?: string
}

export function AppCard({
  name,
  description,
  icon,
  color,
  href,
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
      <AppIcon icon={icon} color={color} />
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
  icon: LucideIcon
  color: AppColor
  href: string
  className?: string
}

export function FeaturedAppCard({
  name,
  description,
  icon,
  color,
  href,
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
      <AppIcon icon={icon} color={color} />
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
