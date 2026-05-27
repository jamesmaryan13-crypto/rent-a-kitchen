// Rent a kitchen — Mobile shell (top bar, bottom tab nav, helpers).
// Used inside an IOSDevice frame. Renders custom NABERS-styled chrome (not iOS chrome).

import { PerformIcon } from '../components/PerformIcons';
import { RAKIcon } from './icons';

/* ----- TOP BAR ----- */
export function RAKMobileTopBar({ title, leading = null, trailing = null, gradient = false }) {
  // Sits BELOW the iOS status bar (50px top). 56px tall.
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      paddingTop: 50, // clear the iOS status bar
      background: gradient ? 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)' : '#fff',
      borderBottom: gradient ? 'none' : '1px solid rgb(238,235,234)',
      color: gradient ? '#fff' : 'rgb(32,33,36)',
    }}>
      <div style={{
        height: 56, padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          {leading}
          {typeof title === 'string'
            ? <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'inherit', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
            : title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {trailing}
        </div>
      </div>
    </div>
  );
}

/* ----- BOTTOM TAB NAV ----- */
export function RAKMobileTabBar({ tabs, activeId, onTap }) {
  // Sits ABOVE the home indicator (34px bottom). 56px tall.
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 34, // clear the home indicator
      background: '#fff',
      borderTop: '1px solid rgb(238,235,234)',
      zIndex: 6,
    }}>
      <div style={{
        height: 56, display: 'grid',
        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
      }}>
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <div
              key={tab.id}
              onClick={() => onTap(tab.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 4, cursor: 'pointer', userSelect: 'none',
                color: active ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
              }}
            >
              {tab.icon === 'user'
                ? <PerformIcon name="user" size={20} color={active ? 'rgb(0,114,152)' : 'rgb(95,99,104)'} />
                : <RAKIcon name={tab.icon} size={20} color={active ? 'rgb(0,114,152)' : 'rgb(95,99,104)'} />}
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: active ? 700 : 400, lineHeight: 1 }}>{tab.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----- SCREEN CONTAINER (handles scroll w/ bottom padding for the tab bar) ----- */
export function RAKMobileScreen({ children, padBottom = true, scroll = true, bg = '#fff' }) {
  return (
    <div style={{
      flex: 1,
      background: bg,
      overflow: scroll ? 'auto' : 'hidden',
      paddingBottom: padBottom ? 90 : 0, // 56 tab bar + 34 home indicator
      WebkitOverflowScrolling: 'touch',
      minHeight: 0,
    }}>
      {children}
    </div>
  );
}

/* ----- SECTION HEADING ----- */
export function RAKMobileSection({ title, action = null, children, gap = 12, padding = '14px 16px' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, padding }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ----- ROUND BACK BUTTON (used on detail pages over imagery) ----- */
export function RAKMobileBackButton({ onClick, onLight = false }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        border: 'none',
        background: onLight ? 'rgba(255,255,255,0.95)' : 'rgb(248,247,247)',
        boxShadow: onLight ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
      }}>
      <RAKIcon name="arrow-left" size={16} color="rgb(32,33,36)" />
    </button>
  );
}

/* ----- CARD ----- */
export function RAKMobileCard({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgb(238,235,234)',
      borderRadius: 5,
      padding: 14,
      ...style,
    }}>{children}</div>
  );
}

/* Tab definitions */
export const RAK_MOBILE_TABS = {
  chef: [
    { id: 'browse',   label: 'Browse',   icon: 'search' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar' },
    { id: 'messages', label: 'Messages', icon: 'message' },
    { id: 'profile',  label: 'Profile',  icon: 'user' },
  ],
  owner: [
    { id: 'dashboard',      label: 'Home',     icon: 'building' },
    { id: 'requests',       label: 'Requests', icon: 'calendar' },
    { id: 'listing-editor', label: 'Listing',  icon: 'edit' },
    { id: 'messages',       label: 'Messages', icon: 'message' },
  ],
};
