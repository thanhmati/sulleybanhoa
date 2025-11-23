import { Check, X } from 'lucide-react';

export function PaidIcon({ isPaid }: { isPaid: boolean }) {
  return (
    <div className="ml-6">
      {isPaid ? (
        <Check className="w-5 h-5 text-green-600" />
      ) : (
        <X className="w-5 h-5 text-red-600" />
      )}
    </div>
  );
}
