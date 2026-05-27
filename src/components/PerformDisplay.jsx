import React from 'react';
import { PerformIcon } from './PerformIcons';

function RatingCapsule({ ratingId = 'AA1234', period = '01/07/2024 – 30/06/2025', autosaveIn = 12, onJumpToMessages = () => {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', width: 220 }}>
      <span
        onClick={onJumpToMessages}
        style={{
          display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center',
          color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 16,
          cursor: 'pointer',
        }}
      >
        <PerformIcon name="chat" size={16} color="rgb(0,145,179)" />
        Jump to rating messages
      </span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)' }}>Rating: {ratingId}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)' }}>{period}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(95,99,104)' }}>Auto saving in {autosaveIn} seconds</span>
    </div>
  );
}

function SupervisionBadge({ children = 'Supervised rating' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 9999,
      background: 'rgb(0,114,152)', color: '#fff',
      fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
      lineHeight: 1.4,
    }}>
      <PerformIcon name="check" size={11} color="#ffffff" />
      {children}
    </span>
  );
}

function InfoPanel({ children, tone = 'note' }) {
  const bg = tone === 'note' ? 'rgb(248,247,247)'
           : tone === 'info' ? 'rgb(230,244,247)'
           : 'rgb(254,243,199)';
  return (
    <div style={{
      background: bg, padding: '14px 18px',
      borderRadius: 4,
      fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(95,99,104)',
      lineHeight: 1.45,
    }}>
      {children}
    </div>
  );
}

function Card({ children, padding = 24, style = {} }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgb(190,191,193)',
      borderRadius: 5,
      padding,
      ...style,
    }}>
      {children}
    </div>
  );
}

function ExpandableSection({ title = 'Rating messages (General)', defaultOpen = false, children = null }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{
      width: '100%',
      background: '#fff',
      border: '1px solid rgb(190,191,193)',
      borderRadius: 4,
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 20px', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PerformIcon name="chat" size={16} color="rgb(0,145,179)" />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 600, color: 'rgb(32,33,36)' }}>{title}</span>
        </div>
        <PerformIcon
          name="chevron-down"
          size={12}
          color="rgb(95,99,104)"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 120ms' }}
        />
      </div>
      {open && (
        <div style={{ padding: '0 20px 18px 20px', borderTop: '1px solid rgb(238,235,234)' }}>
          {children || <span style={{ color: 'rgb(95,99,104)', fontSize: 14 }}>No messages yet.</span>}
        </div>
      )}
    </div>
  );
}

export const PerformRatingCapsule = RatingCapsule;
export const PerformSupervisionBadge = SupervisionBadge;
export const PerformInfoPanel = InfoPanel;
export const PerformCard = Card;
export const PerformExpandableSection = ExpandableSection;
