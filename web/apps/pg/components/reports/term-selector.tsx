import { TERMS } from '~/apps/pg/data/mock-reports';
import type { Term } from '~/apps/pg/types/report';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/components/ui/select';

interface TermSelectorProps {
  value: Term | '';
  onValueChange: (value: Term | '') => void;
}

export function TermSelector({ value, onValueChange }: TermSelectorProps) {
  const displayValue = value || 'All terms';

  return (
    <Select
      value={value || 'all'}
      onValueChange={(val) => onValueChange(val === 'all' ? '' : (val as Term))}
    >
      <SelectTrigger className="w-[140px]">{displayValue}</SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All terms</SelectItem>
        {TERMS.map((term) => (
          <SelectItem key={term} value={term}>
            {term}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
