export default function YaoDisplay({ type, showMoving = true }: { type: number; showMoving?: boolean }) {
  const isYang = type === 1 || type === 3
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      {isYang ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ height: 10, width: 88, borderRadius: 2, backgroundColor: 'var(--text)' }} />
          {showMoving && type === 3 && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>o</span>}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 10, width: 39, borderRadius: 2, backgroundColor: 'var(--text)' }} />
            <div style={{ height: 10, width: 39, borderRadius: 2, backgroundColor: 'var(--text)' }} />
          </div>
          {showMoving && type === 2 && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>x</span>}
        </div>
      )}
    </div>
  )
}
