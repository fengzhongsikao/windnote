export default function YaoDisplay({ type, className = '' }) {
  const isYang = type === 1
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {isYang ? (
        <div className="h-[10px] w-[88px] rounded-sm bg-hei-400" />
      ) : (
        <div className="flex items-center gap-[10px]">
          <div className="h-[10px] w-[39px] rounded-sm bg-hei-400" />
          <div className="h-[10px] w-[39px] rounded-sm bg-hei-400" />
        </div>
      )}
    </div>
  )
}
