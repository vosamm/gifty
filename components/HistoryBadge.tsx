interface HistoryBadgeProps {
  gifts: string[];
}

export default function HistoryBadge({ gifts }: HistoryBadgeProps) {
  if (gifts.length === 0) return null;
  return (
    <div className="mt-2">
      <p className="text-xs text-gray-500 mb-1">이전에 준 선물</p>
      <div className="flex flex-wrap gap-1">
        {gifts.map((gift) => (
          <span key={gift} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {gift}
          </span>
        ))}
      </div>
    </div>
  );
}
