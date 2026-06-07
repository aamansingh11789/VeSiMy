// TypeScript enabled
'use client'

export default function ReportFooter() {
  return (
    <div style={{
      marginTop: 40,
      paddingTop: 16,
      borderTop: '1px solid #DDE3EA',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 10,
      color: '#73879C',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      letterSpacing: 0.5,
      position: 'relative',
    }}>
      {/* Champagne accent */}
      <div style={{
        position: 'absolute', top: -1, left: 0, width: 60, height: 1,
        background: '#C9A66B',
      }}/>
      <span>
        <span style={{ color: '#0B1D33', fontWeight: 600 }}>VeSiMy</span> · The execution layer for Lean · vesimy.com
      </span>
      <span>Confidential · {new Date().getFullYear()}</span>
    </div>
  )
}
