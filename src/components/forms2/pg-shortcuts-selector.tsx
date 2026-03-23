import type { Shortcut } from '@/types/forms2-announcement'
import { PG_SHORTCUT_PRESETS } from '@/data/pg-shortcuts'
import { cn } from '@/lib/utils'

interface PGShortcutsSelectorProps {
  value: Array<Shortcut>
  onChange: (shortcuts: Array<Shortcut>) => void
}

export function PGShortcutsSelector({
  value,
  onChange,
}: PGShortcutsSelectorProps) {
  function toggle(id: string) {
    const preset = PG_SHORTCUT_PRESETS.find((p) => p.id === id)
    if (!preset) return

    const isSelected = value.some((s) => s.url === preset.url)
    if (isSelected) {
      onChange(value.filter((s) => s.url !== preset.url))
    } else {
      onChange([...value, { label: preset.label, url: preset.url }])
    }
  }

  return (
    <div className="space-y-2">
      {PG_SHORTCUT_PRESETS.map((preset) => {
        const isSelected = value.some((s) => s.url === preset.url)
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => toggle(preset.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
              isSelected
                ? 'border-blue-200 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300',
            )}
          >
            {/* Checkbox indicator */}
            <span
              className={cn(
                'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-300 bg-white',
              )}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 10 8"
                  fill="none"
                  className="h-2.5 w-2.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 4l3 3 5-6" />
                </svg>
              )}
            </span>

            {/* Label — teacher-facing; parent-facing label shown accurately in the preview */}
            <p
              className={cn(
                'text-sm font-medium',
                isSelected ? 'text-blue-900' : 'text-slate-800',
              )}
            >
              {preset.composerLabel}
            </p>
          </button>
        )
      })}
    </div>
  )
}
