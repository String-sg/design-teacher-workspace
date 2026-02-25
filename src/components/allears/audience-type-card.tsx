import type { AudienceType } from '@/data/audience-types'
import { cn } from '@/lib/utils'

interface AudienceTypeCardProps {
  audience: AudienceType
  selected: boolean
  onSelect: (id: string) => void
}

export function AudienceTypeCard({
  audience,
  selected,
  onSelect,
}: AudienceTypeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(audience.id)}
      className={cn(
        'group relative flex h-[280px] w-full flex-col overflow-hidden rounded-xl border-2 text-center transition-all',
        selected
          ? 'border-blue-600 shadow-lg'
          : 'border-transparent hover:border-slate-300',
      )}
      style={{ backgroundColor: audience.bgColor }}
    >
      {/* Text content at top */}
      <div className="flex flex-col items-center px-4 pt-5">
        <h3 className="text-base font-bold text-blue-900">{audience.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          {audience.description}
        </p>
      </div>

      {/* Illustration area at bottom */}
      <div className="mt-auto flex items-end justify-center px-2 pb-2">
        <BunnyIllustration type={audience.id} />
      </div>

      {selected && (
        <div className="absolute left-3 top-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          </div>
        </div>
      )}
    </button>
  )
}

function BunnyIllustration({ type }: { type: string }) {
  const bunnyPink = '#f4a7b0'
  const bunnyLight = '#f8c4ca'
  const cheek = '#f9b8bf'

  if (type === 'all') {
    return (
      <svg width="140" height="110" viewBox="0 0 140 110" fill="none">
        <text x="15" y="50" fontSize="24" fontWeight="bold" fill="#c94050">
          ?
        </text>
        <text x="110" y="40" fontSize="28" fontWeight="bold" fill="#c94050">
          ?
        </text>
        <text x="55" y="25" fontSize="14" fontWeight="bold" fill="#e8a840">
          ?
        </text>
        <ellipse cx="70" cy="95" rx="35" ry="20" fill={bunnyPink} />
        <circle cx="70" cy="70" r="22" fill={bunnyPink} />
        <ellipse cx="55" cy="35" rx="8" ry="22" fill={bunnyPink} />
        <ellipse cx="55" cy="35" rx="5" ry="16" fill={bunnyLight} />
        <ellipse cx="85" cy="35" rx="8" ry="22" fill={bunnyPink} />
        <ellipse cx="85" cy="35" rx="5" ry="16" fill={bunnyLight} />
        <circle cx="62" cy="68" r="8" fill="white" />
        <circle cx="78" cy="68" r="8" fill="white" />
        <circle cx="62" cy="68" r="3" fill="#333" />
        <circle cx="78" cy="68" r="3" fill="#333" />
        <ellipse cx="52" cy="76" rx="5" ry="3" fill={cheek} opacity="0.6" />
        <ellipse cx="88" cy="76" rx="5" ry="3" fill={cheek} opacity="0.6" />
        <ellipse
          cx="38"
          cy="82"
          rx="7"
          ry="4"
          fill={bunnyPink}
          transform="rotate(-30 38 82)"
        />
        <ellipse
          cx="102"
          cy="82"
          rx="7"
          ry="4"
          fill={bunnyPink}
          transform="rotate(30 102 82)"
        />
      </svg>
    )
  }

  if (type === 'students') {
    return (
      <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
        <ellipse cx="60" cy="95" rx="30" ry="18" fill={bunnyPink} />
        <circle cx="60" cy="68" r="22" fill={bunnyPink} />
        <ellipse cx="45" cy="32" rx="8" ry="22" fill={bunnyPink} />
        <ellipse cx="45" cy="32" rx="5" ry="16" fill={bunnyLight} />
        <ellipse cx="75" cy="32" rx="8" ry="22" fill={bunnyPink} />
        <ellipse cx="75" cy="32" rx="5" ry="16" fill={bunnyLight} />
        <rect x="40" y="42" width="40" height="4" rx="1" fill="#2952cc" />
        <polygon points="60,28 42,42 78,42" fill="#2952cc" />
        <line
          x1="78"
          y1="42"
          x2="82"
          y2="56"
          stroke="#e8a840"
          strokeWidth="1.5"
        />
        <circle cx="82" cy="58" r="2" fill="#e8a840" />
        <path
          d="M52 66 Q55 70 58 66"
          stroke="#333"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M62 66 Q65 70 68 66"
          stroke="#333"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="48" cy="74" rx="5" ry="3" fill={cheek} opacity="0.6" />
        <ellipse cx="72" cy="74" rx="5" ry="3" fill={cheek} opacity="0.6" />
        <path
          d="M56 76 Q60 80 64 76"
          stroke="#333"
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse
          cx="32"
          cy="78"
          rx="7"
          ry="4"
          fill={bunnyPink}
          transform="rotate(-40 32 78)"
        />
        <ellipse
          cx="88"
          cy="78"
          rx="7"
          ry="4"
          fill={bunnyPink}
          transform="rotate(40 88 78)"
        />
      </svg>
    )
  }

  if (type === 'custodians') {
    return (
      <svg width="130" height="110" viewBox="0 0 130 110" fill="none">
        <ellipse cx="55" cy="95" rx="28" ry="18" fill={bunnyLight} />
        <circle cx="55" cy="68" r="20" fill={bunnyLight} />
        <ellipse cx="42" cy="35" rx="7" ry="20" fill={bunnyLight} />
        <ellipse cx="42" cy="35" rx="4" ry="14" fill="#fde0e3" />
        <ellipse cx="68" cy="35" rx="7" ry="20" fill={bunnyLight} />
        <ellipse cx="68" cy="35" rx="4" ry="14" fill="#fde0e3" />
        <path
          d="M47 66 L53 66"
          stroke="#333"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M57 66 L63 66"
          stroke="#333"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M50 74 Q55 72 60 74"
          stroke="#333"
          strokeWidth="1"
          fill="none"
        />
        <ellipse cx="90" cy="98" rx="18" ry="12" fill={bunnyPink} />
        <circle cx="90" cy="82" r="14" fill={bunnyPink} />
        <ellipse cx="82" cy="60" rx="5" ry="14" fill={bunnyPink} />
        <ellipse cx="82" cy="60" rx="3" ry="10" fill={bunnyLight} />
        <ellipse cx="98" cy="60" rx="5" ry="14" fill={bunnyPink} />
        <ellipse cx="98" cy="60" rx="3" ry="10" fill={bunnyLight} />
        <circle cx="85" cy="80" r="2" fill="#333" />
        <circle cx="95" cy="80" r="2" fill="#333" />
        <ellipse cx="80" cy="85" rx="3" ry="2" fill={cheek} opacity="0.6" />
        <ellipse cx="100" cy="85" rx="3" ry="2" fill={cheek} opacity="0.6" />
      </svg>
    )
  }

  // Staff
  return (
    <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
      <text x="20" y="30" fontSize="12" fill="#40b8e0">
        +
      </text>
      <text x="90" y="25" fontSize="10" fill="#e8a840">
        +
      </text>
      <text x="80" y="45" fontSize="14" fill="#40b8e0">
        *
      </text>
      <line
        x1="30"
        y1="50"
        x2="42"
        y2="75"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="28" cy="48" r="3" fill="#e8a840" />
      <ellipse cx="65" cy="95" rx="28" ry="18" fill={bunnyPink} />
      <circle cx="65" cy="68" r="22" fill={bunnyPink} />
      <ellipse cx="50" cy="32" rx="8" ry="22" fill={bunnyPink} />
      <ellipse cx="50" cy="32" rx="5" ry="16" fill={bunnyLight} />
      <ellipse cx="80" cy="32" rx="8" ry="22" fill={bunnyPink} />
      <ellipse cx="80" cy="32" rx="5" ry="16" fill={bunnyLight} />
      <circle
        cx="57"
        cy="66"
        r="9"
        fill="white"
        stroke="#ccc"
        strokeWidth="1"
      />
      <circle
        cx="73"
        cy="66"
        r="9"
        fill="white"
        stroke="#ccc"
        strokeWidth="1"
      />
      <line x1="66" y1="66" x2="64" y2="66" stroke="#ccc" strokeWidth="1" />
      <circle cx="57" cy="66" r="2.5" fill="#333" />
      <circle cx="73" cy="66" r="2.5" fill="#333" />
      <polygon points="57,88 65,84 65,92" fill="#2dbd8f" />
      <polygon points="73,88 65,84 65,92" fill="#2dbd8f" />
      <circle cx="65" cy="88" r="2" fill="#25a07a" />
      <ellipse cx="48" cy="74" rx="5" ry="3" fill={cheek} opacity="0.6" />
      <ellipse cx="82" cy="74" rx="5" ry="3" fill={cheek} opacity="0.6" />
      <ellipse
        cx="38"
        cy="80"
        rx="7"
        ry="4"
        fill={bunnyPink}
        transform="rotate(-40 38 80)"
      />
    </svg>
  )
}
