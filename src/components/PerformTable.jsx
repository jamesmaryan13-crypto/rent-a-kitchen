import React from 'react';

function Table({ columns, rows, onRowClick = null, hoverable = true }) {
  return (
    <div style={{
      width: '100%', background: '#fff',
      border: '1px solid rgb(238,235,234)', borderRadius: 2,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
        height: 42,
        background: '#fff',
        borderBottom: '1px solid rgb(238,235,234)',
      }}>
        {columns.map((c) => (
          <div key={c.key} style={{
            padding: '10px 12px',
            fontFamily: "'Varela Round', sans-serif", fontSize: 18,
            color: 'rgb(32,33,36)',
            display: 'flex', alignItems: 'center',
          }}>{c.label}</div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={row.id || i}
          onClick={() => onRowClick && onRowClick(row)}
          style={{
            display: 'grid',
            gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
            minHeight: 64,
            borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgb(238,235,234)',
            cursor: onRowClick ? 'pointer' : 'default',
            transition: 'background 120ms',
          }}
          onMouseEnter={(e) => { if (hoverable) e.currentTarget.style.background = 'rgb(248,247,247)'; }}
          onMouseLeave={(e) => { if (hoverable) e.currentTarget.style.background = '#fff'; }}
        >
          {columns.map((c) => (
            <div key={c.key} style={{
              padding: '12px',
              display: 'flex', alignItems: 'center',
              fontFamily: "'Open Sans', sans-serif", fontSize: 16,
              color: 'rgb(32,33,36)',
              whiteSpace: 'pre-line',
            }}>{c.render ? c.render(row) : row[c.key]}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export const PerformTable = Table;
