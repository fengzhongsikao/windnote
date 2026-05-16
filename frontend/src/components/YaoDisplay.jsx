export default function YaoDisplay({ type, showMoving = true }) {
  const isYang = type === 1 || type === 3
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      {isYang ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ height: 10, width: 88, borderRadius: 2, backgroundColor: '#2e2e33' }} />
          {showMoving && type === 3 && <span style={{ fontSize: 12, fontWeight: 700, color: '#2e2e33' }}>o</span>}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 10, width: 39, borderRadius: 2, backgroundColor: '#2e2e33' }} />
            <div style={{ height: 10, width: 39, borderRadius: 2, backgroundColor: '#2e2e33' }} />
          </div>
          {showMoving && type === 2 && <span style={{ fontSize: 12, fontWeight: 700, color: '#2e2e33' }}>x</span>}
        </div>
      )}
    </div>
  )
}
