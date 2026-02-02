import type { Term } from '@/types/report'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TERMS } from '@/data/mock-reports'

interface TermSelectorProps {
  value: Term | ''
  onValueChange: (value: Term | '') => void
}

export function TermSelector({ value, onValueChange }: TermSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as Term | '')}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="All terms" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All terms</SelectItem>
        {TERMS.map((term) => (
          <SelectItem key={term} value={term}>
            {term}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
