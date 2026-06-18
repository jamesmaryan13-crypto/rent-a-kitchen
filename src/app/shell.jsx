import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformCheckbox, PerformFieldLabel, PerformSelect, PerformRadio } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { PerformTable } from '../components/PerformTable';
import { RAKIcon } from './icons';

// Rent a kitchen — App shell
// Custom header for the marketplace (NOT the PerformHeader, which is for the rating tool).
// Includes the demo persona switcher + role-specific top nav.

// Format any date the platform stores ("YYYY-MM-DD" or "DD Month YYYY") into the
// AU display standard DD/MM/YYYY. Passes through unrecognised strings unchanged.
export function RAK_formatDate(input) {
  if (input == null || input === '') return '';
  const s = String(input).trim();
  // ISO YYYY-MM-DD or YYYY/MM/DD
  let m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
  if (m) {
    const [, y, mo, d] = m;
    return `${d.padStart(2, '0')}/${mo.padStart(2, '0')}/${y}`;
  }
  // "22 May 2026" or "22 May 26"
  const months = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{2,4})/);
  if (m) {
    const d = m[1];
    const mo = months[m[2].slice(0, 3).toLowerCase()];
    let y = m[3];
    if (y.length === 2) y = '20' + y;
    if (mo) return `${d.padStart(2, '0')}/${String(mo).padStart(2, '0')}/${y}`;
  }
  return s;
}

export const RAK_PERSONAS = {
  chef: {
    label: 'Chef',
    avatar: 'MT',
    name: 'Mia Tanaka',
    nav: [
    { id: 'browse', label: 'Browse kitchens' },
    { id: 'bookings', label: 'My bookings' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile' }]

  },
  owner: {
    label: 'Kitchen owner',
    avatar: 'EK',
    name: 'Eleanor Kwan',
    nav: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'listing-editor', label: 'My listings' },
    { id: 'requests', label: 'Requests' },
    { id: 'messages', label: 'Messages' }]

  },
  admin: {
    label: 'Admin',
    avatar: 'JL',
    name: 'Jordan Lee',
    nav: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Users' },
    { id: 'moderation', label: 'Listings' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'reports', label: 'Reports' },
    { id: 'disputes', label: 'Disputes' }]

  }
};

export function RAKLogoMark({ size = 22 }) {
  // A simple chef-hat + roof mark — drawn in white, sits on teal header.
  // No emoji — pure SVG following NABERS-style filled mark.
  return (
    <svg width={size * 1.1} height={size} viewBox="0 0 26 24" fill="#ffffff" aria-label="Rent a kitchen" style={{ flexShrink: 0 }}>
      {/* Roof / building */}
      <path d="M 13 1 L 1 9 L 3 9 L 3 22 L 23 22 L 23 9 L 25 9 L 13 1 Z M 13 4.2 L 21 9.2 L 21 20 L 5 20 L 5 9.2 L 13 4.2 Z" />
      {/* Chef hat inside */}
      <path d="M 13 7.5 C 10.79 7.5 9 9.29 9 11.5 C 9 12.05 9.11 12.58 9.31 13.06 L 9 13.06 L 9 16.5 L 17 16.5 L 17 13.06 L 16.69 13.06 C 16.89 12.58 17 12.05 17 11.5 C 17 9.29 15.21 7.5 13 7.5 Z M 10 18 L 16 18 L 16 19 L 10 19 L 10 18 Z" />
    </svg>);

}

export function RAKWordmark({ small = false }) {
  return (
    <span style={{
      fontFamily: "'Varela Round', sans-serif",
      fontSize: small ? 16 : 19,
      color: '#fff',
      letterSpacing: 0.2,
      lineHeight: 1,
      whiteSpace: 'nowrap'
    }}>Rent a kitchen</span>);

}

/* Header: brand-gradient bar matching NABERS Perform. */
export function RAKHeader({ persona, activeNav, onNav, onSwitchPersona, onSignOut }) {
  const p = RAK_PERSONAS[persona];
  return (
    <div style={{
      width: '100%', height: 55,
      background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', boxSizing: 'border-box',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      onClick={() => onNav(p.nav[0].id)}>
        <RAKLogoMark size={22} />
        <RAKWordmark />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 36, alignItems: 'center' }}>
        {p.nav.map((item) =>
        <span
          key={item.id}
          onClick={() => onNav(item.id)}
          style={{
            fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: '#fff',
            cursor: 'pointer', lineHeight: 1,
            borderBottom: activeNav === item.id ? '2px solid #fff' : '2px solid transparent',
            paddingBottom: 4,
            opacity: activeNav === item.id ? 1 : 0.92,
            transition: 'opacity 120ms'
          }}
          onMouseEnter={(e) => {e.currentTarget.style.opacity = 1;}}
          onMouseLeave={(e) => {e.currentTarget.style.opacity = activeNav === item.id ? 1 : 0.92;}}>
          {item.label}</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <RAKPersonaSwitcher persona={persona} onSwitchPersona={onSwitchPersona} />
        <RAKNotificationBell persona={persona} />
        <RAKUserAvatar persona={persona} onSignOut={onSignOut} />
      </div>
    </div>);

}

/* Notification bell — red dot if unread; click opens a short list. */
export const RAK_NOTIFICATIONS_BY_PERSONA = {
  chef: [
    { id: 'n1', icon: 'calendar', tone: 'success', title: 'Booking confirmed', body: 'Carriageworks Commercial Kitchen accepted your request for 25 May.', time: '12m ago' },
    { id: 'n2', icon: 'message', tone: 'info', title: 'New message from Eleanor', body: '"Loading dock will be open from 5am – feel free to arrive early."', time: '1h ago' },
    { id: 'n3', icon: 'star', tone: 'note', title: 'Leave a review', body: 'How was your booking at Surry Hills Pastry Lab?', time: 'Yesterday' },
    { id: 'n4', icon: 'dollar', tone: 'info', title: 'Receipt available', body: 'Your invoice for bk-1007 ($360) is ready to download.', time: '2 days ago' },
  ],
  owner: [
    { id: 'n1', icon: 'cooking', tone: 'info', title: 'New booking request', body: 'Mia Tanaka wants to book Carriageworks for 8h on 30 May.', time: '8m ago' },
    { id: 'n2', icon: 'dollar', tone: 'success', title: 'Payout sent', body: '$2,414 from period May 1–15 has cleared to your account.', time: '3h ago' },
    { id: 'n3', icon: 'shield', tone: 'warning', title: 'Public liability expires soon', body: 'Your certificate expires in 23 days. Upload the renewal to keep listings live.', time: 'Yesterday' },
    { id: 'n4', icon: 'message', tone: 'info', title: 'Sofia Caruso replied', body: '"Thanks for the quick decline — I’ll send another date."', time: '2 days ago' },
  ],
  admin: [
    { id: 'n1', icon: 'flag', tone: 'warning', title: 'New dispute opened', body: 'Booking bk-1004 has been flagged by the kitchen owner.', time: '20m ago' },
    { id: 'n2', icon: 'shield', tone: 'info', title: 'Verification queue', body: '3 new owner accounts awaiting verification review.', time: '2h ago' },
    { id: 'n3', icon: 'dollar', tone: 'note', title: 'Payouts pending approval', body: '4 owner payouts are queued for May 16.', time: 'Today' },
  ],
};

export function RAKNotificationBell({ persona }) {
  const items = RAK_NOTIFICATIONS_BY_PERSONA[persona] || RAK_NOTIFICATIONS_BY_PERSONA.chef;
  const storageKey = `rak-notifs-read-${persona}`;

  const [readIds, setReadIds] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); }
    catch (_) { return new Set(); }
  });
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  const persist = (set) => {
    try { localStorage.setItem(storageKey, JSON.stringify([...set])); } catch (_) {}
  };

  const markAllRead = () => {
    const next = new Set(items.map((n) => n.id));
    setReadIds(next);
    persist(next);
  };

  const markOne = (id) => {
    const next = new Set(readIds); next.add(id);
    setReadIds(next);
    persist(next);
  };

  const unreadCount = items.filter((n) => !readIds.has(n.id)).length;
  const hasUnread = unreadCount > 0;

  const toneBg = (tone) => ({
    success: 'rgb(220,243,228)',
    info:    'rgb(230,244,247)',
    warning: 'rgb(254,243,199)',
    note:    'rgb(248,247,247)',
  })[tone] || 'rgb(248,247,247)';

  const toneFg = (tone) => ({
    success: 'rgb(31,121,77)',
    info:    'rgb(0,114,152)',
    warning: 'rgb(146,99,0)',
    note:    'rgb(95,99,104)',
  })[tone] || 'rgb(95,99,104)';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label={hasUnread ? `${unreadCount} unread notifications` : 'Notifications'}
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'relative',
          background: 'transparent', border: 'none', cursor: 'pointer',
          width: 32, height: 32, borderRadius: 4,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
        }}>
        <PerformIcon name="notification" size={20} color="#ffffff" alt="Notifications" />
        {hasUnread && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 9, height: 9, borderRadius: '50%',
            background: 'rgb(222,13,13)',
            boxShadow: '0 0 0 2px rgb(0,114,152)',
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          width: 360, maxHeight: 460,
          background: '#fff', borderRadius: 6,
          border: '1px solid rgb(221,219,218)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
          zIndex: 60,
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Open Sans', sans-serif",
        }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid rgb(238,235,234)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 16, color: 'rgb(32,33,36)' }}>Notifications</span>
              {hasUnread && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: 20, height: 18, padding: '0 6px', borderRadius: 9999,
                  background: 'rgb(222,13,13)', color: '#fff',
                  fontSize: 11, fontWeight: 700,
                }}>{unreadCount}</span>
              )}
            </div>
            {hasUnread && (
              <button type="button" onClick={markAllRead}
                style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  color: 'rgb(0,114,152)', fontSize: 12, fontWeight: 700,
                  padding: 0,
                }}>Mark all read</button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {items.length === 0 && (
              <div style={{ padding: 22, textAlign: 'center', color: 'rgb(95,99,104)', fontSize: 13 }}>
                No notifications yet.
              </div>
            )}
            {items.map((n) => {
              const isRead = readIds.has(n.id);
              return (
                <button key={n.id} type="button" onClick={() => markOne(n.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 16px', width: '100%',
                    border: 'none', borderBottom: '1px solid rgb(238,235,234)',
                    background: isRead ? '#fff' : 'rgb(230,244,247)',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                    background: toneBg(n.tone),
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <RAKIcon name={n.icon} size={16} color={toneFg(n.tone)} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)' }}>{n.title}</span>
                      {!isRead && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgb(0,114,152)' }} />}
                    </div>
                    <span style={{ fontSize: 12, color: 'rgb(95,99,104)', lineHeight: 1.4 }}>{n.body}</span>
                    <span style={{ fontSize: 11, color: 'rgb(150,152,156)', marginTop: 2 }}>{n.time}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{
            padding: '10px 16px', borderTop: '1px solid rgb(238,235,234)', textAlign: 'center',
          }}>
            <span style={{ color: 'rgb(0,114,152)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              View all notifications
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* Persona switcher — clearly a "demo only" affordance. */
export function RAKUserAvatar({ persona, onSignOut }) {
  const p = RAK_PERSONAS[persona];
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title={p.name}
        style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgb(0,114,152)', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12,
          border: 'none', cursor: 'pointer', padding: 0
        }}>{p.avatar}</button>
      {open &&
      <div style={{
        position: 'absolute', top: '100%', right: 0, marginTop: 6,
        background: '#fff', border: '1px solid rgb(221,219,218)', borderRadius: 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.16)', zIndex: 31, overflow: 'hidden',
        minWidth: 240
      }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgb(238,235,234)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
            color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700
          }}>{p.avatar}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{p.name}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{p.label}</span>
              </div>
            </div>
            <div
          onClick={() => {setOpen(false);onSignOut && onSignOut();}}
          onMouseEnter={(e) => {e.currentTarget.style.background = 'rgb(248,247,247)';}}
          onMouseLeave={(e) => {e.currentTarget.style.background = '#fff';}}
          style={{
            padding: '10px 14px', cursor: 'pointer',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
              <PerformIcon name="close" size={12} color="rgb(95,99,104)" />
              Sign out
            </div>
        </div>
      }
    </div>);

}

/* Persona switcher — clearly a "demo only" affordance. */
export function RAKPersonaSwitcher({ persona, onSwitchPersona }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 28, padding: '0 10px',
          borderRadius: 4, border: '1px solid rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.12)', color: '#fff',
          fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
          cursor: 'pointer', lineHeight: 1
        }}>

        <span style={{ opacity: 0.85, fontWeight: 400 }}>Viewing as</span>
        {RAK_PERSONAS[persona].label}
        <PerformIcon name="chevron-down" size={10} color="#ffffff" />
      </button>
      {open &&
      <div style={{
        position: 'absolute', top: '100%', right: 0, marginTop: 6,
        background: '#fff', border: '1px solid rgb(221,219,218)', borderRadius: 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.16)', zIndex: 31, overflow: 'hidden',
        minWidth: 220
      }}>
            <div style={{
          padding: '8px 12px', borderBottom: '1px solid rgb(238,235,234)',
          fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)'
        }}>Demo persona — switch view</div>
            {['chef', 'owner', 'admin'].map((p) =>
        <div
          key={p}
          onClick={() => {onSwitchPersona(p);setOpen(false);}}
          onMouseEnter={(e) => {e.currentTarget.style.background = 'rgb(230,244,247)';}}
          onMouseLeave={(e) => {e.currentTarget.style.background = p === persona ? 'rgb(248,247,247)' : '#fff';}}
          style={{
            padding: '10px 12px', cursor: 'pointer',
            background: p === persona ? 'rgb(248,247,247)' : '#fff',
            display: 'flex', flexDirection: 'column', gap: 2
          }}>

                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 600, color: 'rgb(32,33,36)' }}>{RAK_PERSONAS[p].label}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_PERSONAS[p].name}</span>
              </div>
        )}
        </div>
      }
    </div>);

}

export function RAKFooter() {
  return (
    <div style={{
      width: '100%', borderTop: '1px solid rgb(190,191,193)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', boxSizing: 'border-box', background: '#fff',
      flexShrink: 0, height: 58
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width={24} height={22} viewBox="0 0 26 24" fill="rgb(0,114,152)" aria-hidden="true">
          <path d="M 13 1 L 1 9 L 3 9 L 3 22 L 23 22 L 23 9 L 25 9 L 13 1 Z M 13 4.2 L 21 9.2 L 21 20 L 5 20 L 5 9.2 L 13 4.2 Z" />
          <path d="M 13 7.5 C 10.79 7.5 9 9.29 9 11.5 C 9 12.05 9.11 12.58 9.31 13.06 L 9 13.06 L 9 16.5 L 17 16.5 L 17 13.06 L 16.69 13.06 C 16.89 12.58 17 12.05 17 11.5 C 17 9.29 15.21 7.5 13 7.5 Z M 10 18 L 16 18 L 16 19 L 10 19 L 10 18 Z" />
        </svg>
        <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 17, color: 'rgb(95,99,104)' }}>Rent a kitchen</span>
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        <a href="#" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(0,145,179)', textDecoration: 'none' }}>Help centre</a>
        <a href="#" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(0,145,179)', textDecoration: 'none' }}>List your kitchen</a>
        <a href="#" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(0,145,179)', textDecoration: 'none' }}>Terms</a>
      </div>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)' }}>©2026 Rent a kitchen</span>
    </div>);

}

/* Page bounding box — the outer 1px border + 5px radius rule from NABERS Perform. */
export function RAKPageFrame({ children, padding = 0, scroll = true }) {
  return (
    <div style={{
      flex: 1,
      margin: 12,
      border: '1px solid rgb(190,191,193)',
      borderRadius: 5,
      background: '#fff',
      overflow: scroll ? 'auto' : 'hidden',
      display: 'flex', flexDirection: 'column',
      padding,
      minHeight: 0
    }}>
      {children}
    </div>);

}

/* Page title + subtitle pattern used at the top of most rating-style pages.
   Pass `onBack` to render a back button; pass `confirmBack` to gate it through
   a confirmation modal (e.g. unsaved-changes guard on edit pages). */
export function RAKPageHeader({ title, subtitle, right = null, style = {}, onBack = null, confirmBack = null }) {
  const [confirming, setConfirming] = React.useState(false);
  const handleBackClick = () => {
    if (confirmBack) setConfirming(true);
    else if (onBack) onBack();
  };
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: onBack ? '18px 32px 20px' : '24px 32px 20px', gap: 24,
      borderBottom: '1px solid rgb(238,235,234)',
      ...style
    }} data-comment-anchor="2db551d625-div-310-5">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {onBack && (
          <button type="button" onClick={handleBackClick}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 0, marginBottom: 4,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
              color: 'rgb(0,145,179)',
            }}>
            <span style={{ fontSize: 16, lineHeight: 1, marginTop: -1 }}>←</span> Back
          </button>
        )}
        <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 32, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1 }}>{title}</h1>
        {subtitle &&
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(95,99,104)' }}>{subtitle}</span>
        }
      </div>
      {right}

      {confirming && confirmBack && (
        <RAKConfirmModal
          title={confirmBack.title || 'Unsaved changes'}
          message={confirmBack.message || 'You have unsaved changes on this page. What would you like to do?'}
          primary={{ label: confirmBack.primaryLabel || 'Save & exit', onClick: () => { setConfirming(false); confirmBack.onSave && confirmBack.onSave(); onBack && onBack(); } }}
          secondary={{ label: confirmBack.secondaryLabel || 'Discard changes', onClick: () => { setConfirming(false); confirmBack.onDiscard && confirmBack.onDiscard(); onBack && onBack(); } }}
          tertiary={{ label: 'Stay on page', onClick: () => setConfirming(false) }}
          onClose={() => setConfirming(false)} />
      )}
    </div>);

}

/* Reusable confirmation modal — backdrop + centred card with up to three actions. */
export function RAKConfirmModal({ title, message, primary, secondary, tertiary, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: 'rgba(32,33,36,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: 460, maxWidth: '100%', background: '#fff', borderRadius: 6,
          boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
          overflow: 'hidden',
        }}>
        <div style={{ padding: '20px 24px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)' }}>{title}</span>
          <p style={{ margin: 0, fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
        <div style={{
          padding: '14px 24px 18px', display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap',
        }}>
          {tertiary && (
            <button type="button" onClick={tertiary.onClick}
              style={{
                padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
                border: 'none', background: 'transparent',
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600,
                color: 'rgb(95,99,104)',
              }}>{tertiary.label}</button>
          )}
          {secondary && (
            <button type="button" onClick={secondary.onClick}
              style={{
                padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
                border: '1px solid rgb(221,219,218)', background: '#fff',
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600,
                color: 'rgb(32,33,36)',
              }}>{secondary.label}</button>
          )}
          {primary && (
            <button type="button" onClick={primary.onClick}
              style={{
                padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
                border: 'none',
                background: 'rgb(0,114,152)', color: '#fff',
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
              }}>{primary.label}</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Status chip — small pill, used in tables and detail pages. */
export function RAKStatusChip({ status }) {
  const map = {
    confirmed: { bg: 'rgb(230,244,247)', color: 'rgb(0,114,152)', label: 'Confirmed' },
    'in-progress': { bg: 'rgb(254,243,199)', color: 'rgb(146,99,0)', label: 'In progress' },
    'awaiting-review': { bg: 'rgb(254,243,199)', color: 'rgb(146,99,0)', label: 'Review needed' },
    'issue-reported': { bg: 'rgb(254,232,232)', color: 'rgb(222,13,13)', label: 'Issue reported' },
    pending: { bg: 'rgb(248,247,247)', color: 'rgb(95,99,104)', label: 'Pending' },
    completed: { bg: 'rgb(220,243,228)', color: 'rgb(31,121,77)', label: 'Completed' },
    cancelled: { bg: 'rgb(254,232,232)', color: 'rgb(222,13,13)', label: 'Cancelled' },
    declined: { bg: 'rgb(254,232,232)', color: 'rgb(222,13,13)', label: 'Declined' },
    active: { bg: 'rgb(220,243,228)', color: 'rgb(31,121,77)', label: 'Active' },
    suspended: { bg: 'rgb(254,232,232)', color: 'rgb(222,13,13)', label: 'Suspended' },
    open: { bg: 'rgb(254,232,232)', color: 'rgb(222,13,13)', label: 'Open' },
    resolved: { bg: 'rgb(220,243,228)', color: 'rgb(31,121,77)', label: 'Resolved' },
    paid: { bg: 'rgb(220,243,228)', color: 'rgb(31,121,77)', label: 'Paid' },
    verified: { bg: 'rgb(230,244,247)', color: 'rgb(0,114,152)', label: 'Verified' },
    unverified: { bg: 'rgb(248,247,247)', color: 'rgb(95,99,104)', label: 'Unverified' }
  };
  const s = map[status] || { bg: 'rgb(248,247,247)', color: 'rgb(95,99,104)', label: status };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 9999,
      background: s.bg, color: s.color,
      fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700,
      lineHeight: 1.4, letterSpacing: 0.2,
      whiteSpace: 'nowrap'
    }}>{s.label}</span>);

}

/* KPI tile — large display number + label, in a flat NABERS card. */
export function RAKKpiTile({ label, value, trend = null, trendDir = 'up', sub = null }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: '#fff',
      border: '1px solid rgb(190,191,193)',
      borderRadius: 5,
      padding: '18px 22px',
      display: 'flex', flexDirection: 'column', gap: 6
    }}>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600 }}>{label}</span>
      <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 32, color: 'rgb(95,99,104)', lineHeight: 1.1 }}>{value}</span>
      {trend &&
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RAKIcon name={trendDir === 'up' ? 'trending-up' : 'trending-down'} size={14} color={trendDir === 'up' ? 'rgb(31,121,77)' : 'rgb(222,13,13)'} />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: trendDir === 'up' ? 'rgb(31,121,77)' : 'rgb(222,13,13)', fontWeight: 600 }}>{trend}</span>
          {sub && <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{sub}</span>}
        </div>
      }
    </div>);

}

/* ============================================================
   SAVED LISTINGS — localStorage-backed set with a React hook
   ============================================================ */
const RAK_SAVED_KEY = 'rak-saved-listings';
const RAK_SAVED_EVENT = 'rak-saved-changed';

export function rakGetSaved() {
  try {return JSON.parse(localStorage.getItem(RAK_SAVED_KEY) || '[]');}
  catch (_) {return [];}
}

export function rakSetSaved(ids) {
  localStorage.setItem(RAK_SAVED_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(RAK_SAVED_EVENT));
}

export function rakToggleSaved(id) {
  const cur = rakGetSaved();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  rakSetSaved(next);
  return next.includes(id);
}

export function useSavedListings() {
  const [ids, setIds] = React.useState(rakGetSaved);
  React.useEffect(() => {
    const onChange = () => setIds(rakGetSaved());
    window.addEventListener(RAK_SAVED_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(RAK_SAVED_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);
  return {
    ids,
    isSaved: (id) => ids.includes(id),
    toggle: rakToggleSaved,
    count: ids.length
  };
}

/* ============================================================
   SHARE MODAL — overlay with a copyable URL
   ============================================================ */
export function RAKShareModal({ open, onClose, title, url }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {if (!open) setCopied(false);}, [open]);
  if (!open) return null;

  const copy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for iframes without clipboard API
        const ta = document.createElement('textarea');
        ta.value = url;document.body.appendChild(ta);ta.select();
        document.execCommand('copy');document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {
      // Best-effort; still show "copied" state
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'rgba(32,33,36,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460, maxWidth: '100%', background: '#fff', borderRadius: 6,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          fontFamily: "'Open Sans', sans-serif",
          overflow: 'hidden'
        }}>
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid rgb(238,235,234)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(32,33,36)' }}>Share this kitchen</span>
            {title && <span style={{ fontSize: 13, color: 'rgb(95,99,104)' }}>{title}</span>}
          </div>
          <button type="button" onClick={onClose}
          style={{
            width: 30, height: 30, borderRadius: 4, border: 'none',
            background: 'transparent', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="rgb(95,99,104)">
              <path d="M 19 6.41 L 17.59 5 L 12 10.59 L 6.41 5 L 5 6.41 L 10.59 12 L 5 17.59 L 6.41 19 L 12 13.41 L 17.59 19 L 19 17.59 L 13.41 12 Z" />
            </svg>
          </button>
        </div>
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>Listing link</span>
          <div style={{
            display: 'flex', alignItems: 'stretch',
            border: '1px solid rgb(221,219,218)', borderRadius: 4, overflow: 'hidden'
          }}>
            <input
              readOnly value={url}
              onFocus={(e) => e.target.select()}
              style={{
                flex: 1, border: 'none', outline: 'none', padding: '0 12px',
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)',
                background: 'rgb(248,247,247)'
              }} />
            <button type="button" onClick={copy}
            style={{
              border: 'none', cursor: 'pointer',
              background: copied ? 'rgb(31,121,77)' : 'rgb(0,114,152)',
              color: '#fff', padding: '0 18px',
              fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'background 120ms'
            }}>
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
          <span style={{ fontSize: 12, color: 'rgb(95,99,104)' }}>
            Anyone with the link can view this listing. Chefs need a free account to send a booking request.
          </span>
        </div>
      </div>
    </div>);

}

/* ============================================================
   BREADCRUMB
   ============================================================ */
export function RAKBreadcrumb({ items, onNav }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)',
      padding: '10px 32px 0',
    }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'rgb(190,191,193)' }}>/</span>}
          {item.id
            ? <span onClick={() => onNav && onNav(item.id)}
                style={{ color: 'rgb(0,145,179)', cursor: 'pointer', fontWeight: 600 }}>{item.label}</span>
            : <span>{item.label}</span>
          }
        </React.Fragment>
      ))}
    </div>
  );
}

/* ============================================================
   BLOCK DATES MODAL
   ============================================================ */
export function RAKBlockDatesModal({ open, onClose, onSave, listingName }) {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [reason, setReason] = React.useState('');

  if (!open) return null;

  const handleSave = () => {
    if (!from || !to) return;
    onSave && onSave({ from, to, reason });
    onClose && onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: 'rgba(32,33,36,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 480, maxWidth: '100%', background: '#fff', borderRadius: 6,
        boxShadow: '0 12px 32px rgba(0,0,0,0.28)', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgb(238,235,234)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)' }}>Block dates</span>
          {listingName && <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{listingName}</span>}
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <PerformField label="From" type="date" value={from} onChange={setFrom} width="100%" />
            <PerformField label="To" type="date" value={to} onChange={setTo} width="100%" />
          </div>
          <PerformField label="Reason (optional)" value={reason} onChange={setReason} placeholder="e.g. Deep clean, private event…" width="100%" />
        </div>
        <div style={{ padding: '14px 24px 18px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{
            padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
            border: '1px solid rgb(221,219,218)', background: '#fff',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600,
            color: 'rgb(32,33,36)',
          }}>Cancel</button>
          <button type="button" onClick={handleSave} style={{
            padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
            border: 'none', background: 'rgb(0,114,152)', color: '#fff',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
          }}>Block dates</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAUSE LISTING MODAL
   ============================================================ */
export function RAKPauseListingModal({ open, onClose, onConfirm, listingName }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: 'rgba(32,33,36,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 460, maxWidth: '100%', background: '#fff', borderRadius: 6,
        boxShadow: '0 12px 32px rgba(0,0,0,0.28)', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)' }}>Pause listing?</span>
          <p style={{ margin: 0, fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', lineHeight: 1.5 }}>
            {listingName ? `"${listingName}" ` : 'This listing '}will be hidden from search and no new booking requests will be accepted. Existing confirmed bookings are not affected.
          </p>
        </div>
        <div style={{ padding: '14px 24px 18px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{
            padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
            border: 'none', background: 'transparent',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600,
            color: 'rgb(95,99,104)',
          }}>Cancel</button>
          <button type="button" onClick={() => { onConfirm && onConfirm(); onClose && onClose(); }} style={{
            padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
            border: 'none', background: 'rgb(146,99,0)', color: '#fff',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
          }}>Pause listing</button>
        </div>
      </div>
    </div>
  );
}
