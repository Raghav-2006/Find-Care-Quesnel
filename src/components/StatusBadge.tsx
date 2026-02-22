interface StatusBadgeProps {
  label: string
  color: 'green' | 'orange' | 'red'
}

const colorMap = {
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
}

export default function StatusBadge({ label, color }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ring-1 ring-inset whitespace-nowrap ${colorMap[color]}`}
    >
      {label}
    </span>
  )
}
