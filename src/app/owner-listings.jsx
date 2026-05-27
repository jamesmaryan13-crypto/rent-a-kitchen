import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformFieldLabel, PerformCheckbox } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { RAKIcon } from './icons';
import { RAK_KITCHENS, RAK_BOOKINGS, RAK_USERS } from './data';
import { RAK_formatDate, RAKPageFrame, RAKPageHeader, RAKStatusChip, RAKConfirmModal } from './shell';
import { ChefListingDetail } from './chef-views-2';
import { OwnerRequestDetail } from './owner-views';
import { RAK_EQUIPMENT_OPTIONS, RAK_CERT_OPTIONS } from './chef-views-1';

export function OwnerListings({ onOpen, onAdd }) {
  const myListings = RAK_KITCHENS.filter((k) => k.ownerId === 'own-001');
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('All');
  const [sort, setSort] = React.useState('Recently updated');
  const [view, setView] = React.useState('grid');

  const STATUSES = ['All', 'Active', 'Pending', 'Paused'];
  const SORTS = ['Recently updated', 'Highest revenue', 'Highest rated', 'A → Z'];

  const filtered = myListings
    .filter((k) => {
      if (status !== 'All' && k.status.toLowerCase() !== status.toLowerCase()) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return k.name.toLowerCase().includes(q) || k.address.toLowerCase().includes(q) || k.suburb.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === 'Highest rated') return b.rating - a.rating;
      if (sort === 'A → Z') return a.name.localeCompare(b.name);
      if (sort === 'Highest revenue') return b.hourlyRate * b.reviewCount - a.hourlyRate * a.reviewCount;
      return new Date(b.listedAt) - new Date(a.listedAt);
    });

  const activeCount = myListings.filter((k) => k.status === 'active').length;
  const pendingCount = myListings.filter((k) => k.status === 'pending').length;
  const monthBookings = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId)).length;

  return (
    <RAKPageFrame>
      <RAKPageHeader
        title="My listings"
        subtitle={`${activeCount} active${pendingCount ? ` · ${pendingCount} pending review` : ''} · ${monthBookings} bookings this month`}
        right={
          <div style={{ display: 'flex', gap: 12 }}>
            <PerformButton variant="brand" iconLeft={<RAKIcon name="plus" size={14} color="#fff" />} onClick={onAdd}>Add a new listing</PerformButton>
          </div>
        } />

      <div style={{ padding: '20px 32px 60px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 12,
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid rgb(221,219,218)', borderRadius: 4, padding: '0 12px', height: 36, background: '#fff',
          }}>
            <RAKIcon name="search" size={16} color="rgb(95,99,104)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by listing name, suburb or address"
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', background: 'transparent',
              }} />
            {query && (
              <button type="button" onClick={() => setQuery('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <PerformIcon name="close" size={12} color="rgb(95,99,104)" />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {STATUSES.map((s) => {
              const on = status === s;
              return (
                <button key={s} type="button" onClick={() => setStatus(s)} style={{
                  height: 36, padding: '0 14px', borderRadius: 4,
                  border: '1px solid ' + (on ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
                  background: on ? 'rgb(230,244,247)' : '#fff',
                  color: on ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
                  fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>{s}</button>
              );
            })}
          </div>

          <ListingSortMenu value={sort} onChange={setSort} options={SORTS} />

          <div style={{ display: 'flex', gap: 0, border: '1px solid rgb(221,219,218)', borderRadius: 4, overflow: 'hidden', height: 36 }}>
            {[{ id: 'grid', icon: 'filter' }, { id: 'list', icon: 'list' }].map((v, i) => {
              const on = view === v.id;
              return (
                <button key={v.id} type="button" onClick={() => setView(v.id)} style={{
                  width: 38, height: '100%',
                  borderLeft: i === 0 ? 'none' : '1px solid rgb(221,219,218)',
                  border: 'none',
                  background: on ? 'rgb(230,244,247)' : '#fff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }} title={v.id === 'grid' ? 'Grid view' : 'List view'}>
                  {v.id === 'grid'
                    ? <ListingGridGlyph color={on ? 'rgb(0,114,152)' : 'rgb(95,99,104)'} />
                    : <RAKIcon name="list" size={16} color={on ? 'rgb(0,114,152)' : 'rgb(95,99,104)'} />}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>
            Showing {filtered.length} of {myListings.length} listings
          </span>
        </div>

        {filtered.length === 0 && (
          <PerformInfoPanel>
            No listings match your search. Try clearing filters or{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setQuery(''); setStatus('All'); }} style={{ color: 'rgb(0,145,179)' }}>start fresh</a>.
          </PerformInfoPanel>
        )}

        {view === 'grid' && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            <AddListingTile onAdd={onAdd} />
            {filtered.map((k) => <ListingTile key={k.id} k={k} onOpen={() => onOpen(k.id)} />)}
          </div>
        )}

        {view === 'list' && filtered.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
            {filtered.map((k, i) => {
              const bookingsCount = RAK_BOOKINGS.filter((b) => b.listingId === k.id).length;
              return (
                <div key={k.id} onClick={() => onOpen(k.id)} style={{
                  display: 'grid', gridTemplateColumns: '96px 1.5fr 1fr 1fr 1fr auto',
                  gap: 16, alignItems: 'center',
                  padding: '12px 18px', cursor: 'pointer',
                  borderBottom: i === filtered.length - 1 ? 'none' : '1px solid rgb(238,235,234)',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgb(248,247,247)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
                  <img src={k.photo} alt="" style={{ width: 96, height: 64, borderRadius: 4, objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.name}</div>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k.suburb}, {k.state}</div>
                  </div>
                  <ListingStat label="Size" value={`${k.sqm} m²`} sub={`up to ${k.capacity} chefs`} />
                  <ListingStat label="Hourly" value={`$${k.hourlyRate}`} sub={`day $${k.dailyRate}`} />
                  <ListingStat label="Bookings" value={String(bookingsCount)} sub={`${k.rating} ★ · ${k.reviewCount} reviews`} />
                  <RAKStatusChip status={k.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RAKPageFrame>
  );
}

function ListingStat({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{value}</span>
      {sub && <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{sub}</span>}
    </div>
  );
}

function ListingGridGlyph({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={color}>
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function ListingSortMenu({ value, onChange, options }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener('mousedown', click);
    return () => window.removeEventListener('mousedown', click);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(!open)} style={{
        height: 36, padding: '0 12px', borderRadius: 4,
        border: '1px solid rgb(221,219,218)', background: '#fff',
        color: 'rgb(32,33,36)', fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ color: 'rgb(95,99,104)' }}>Sort:</span>
        <span>{value}</span>
        <PerformIcon name="chevron-down" size={10} color="rgb(95,99,104)" />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 20,
          background: '#fff', border: '1px solid rgb(221,219,218)', borderRadius: 4,
          boxShadow: '0 2px 6px rgba(0,0,0,0.16)', minWidth: 180,
        }}>
          {options.map((o) => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }} style={{
              width: '100%', textAlign: 'left', padding: '8px 12px',
              border: 'none', background: o === value ? 'rgb(230,244,247)' : '#fff',
              color: o === value ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
              fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: o === value ? 700 : 400, cursor: 'pointer',
            }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingTile({ k, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const bookingsCount = RAK_BOOKINGS.filter((b) => b.listingId === k.id).length;
  const revenue = RAK_BOOKINGS.filter((b) => b.listingId === k.id && b.status !== 'pending' && b.status !== 'cancelled').reduce((s, b) => s + b.total, 0);

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff', border: '1px solid ' + (hover ? 'rgb(0,114,152)' : 'rgb(190,191,193)'),
        borderRadius: 5, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hover ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
        transition: 'border-color 120ms, box-shadow 120ms',
        display: 'flex', flexDirection: 'column',
      }}>
      <div style={{ position: 'relative', height: 326, background: 'rgb(238,235,234)' }}>
        <img src={k.photo} alt="" style={{ width: '100%', height: '326px', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <RAKStatusChip status={k.status} />
        </div>
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 4,
          background: 'rgba(32,33,36,0.78)', color: '#fff',
          fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600,
        }}>
          <RAKIcon name="camera" size={11} color="#fff" />
          {k.photos.length}
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(95,99,104)', lineHeight: 1.2, marginBottom: 4 }}>{k.name}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>
            <RAKIcon name="map-pin" size={12} color="rgb(95,99,104)" />
            {k.suburb}, {k.state}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid rgb(238,235,234)', borderBottom: '1px solid rgb(238,235,234)' }}>
          <TileSpec label="Size" value={`${k.sqm} m²`} />
          <TileSpec label="Capacity" value={`${k.capacity} chefs`} mid />
          <TileSpec label="Hourly" value={`$${k.hourlyRate}`} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <RAKIcon name="star" size={13} color="rgb(234,186,0)" />
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.rating}</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>({k.reviewCount})</span>
          </div>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>
            {bookingsCount} bookings · ${revenue.toLocaleString()} earned
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <PerformButton variant="brand" onClick={(e) => { e.stopPropagation(); onOpen(); }} style={{ flex: 1 }}>Manage</PerformButton>
          <button type="button" onClick={(e) => { e.stopPropagation(); onOpen(); }} title="Edit" style={{
            width: 36, height: 36, borderRadius: 4,
            border: '1px solid rgb(221,219,218)', background: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RAKIcon name="edit" size={14} color="rgb(0,114,152)" />
          </button>
          <button type="button" onClick={(e) => e.stopPropagation()} title="More" style={{
            width: 36, height: 36, borderRadius: 4,
            border: '1px solid rgb(221,219,218)', background: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RAKIcon name="more-vertical" size={14} color="rgb(95,99,104)" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TileSpec({ label, value, mid }) {
  return (
    <div style={{
      padding: '10px 6px', textAlign: 'center',
      borderLeft: mid ? '1px solid rgb(238,235,234)' : 'none',
      borderRight: mid ? '1px solid rgb(238,235,234)' : 'none',
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{value}</span>
    </div>
  );
}

function AddListingTile({ onAdd }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onAdd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: '2px dashed ' + (hover ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
        background: hover ? 'rgb(230,244,247)' : 'rgb(248,247,247)',
        borderRadius: 5, padding: 24, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 12, minHeight: 280, transition: 'border-color 120ms, background 120ms',
      }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: 'rgb(0,114,152)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <RAKIcon name="plus" size={24} color="#fff" />
      </div>
      <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(95,99,104)' }}>Add a new listing</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', textAlign: 'center', maxWidth: 220, lineHeight: 1.4 }}>
        Set up a new kitchen for chefs to book. Takes about 15 minutes.
      </span>
    </button>
  );
}

export function OwnerListingDetail({ listingId, onBack }) {
  const k = RAK_KITCHENS.find((x) => x.id === listingId) || RAK_KITCHENS[0];
  const [tab, setTab] = React.useState('overview');
  const [confirming, setConfirming] = React.useState(false);
  const [pauseModalOpen, setPauseModalOpen] = React.useState(false);
  const [pauseCancelTarget, setPauseCancelTarget] = React.useState(null);
  const [previewingAsChef, setPreviewingAsChef] = React.useState(false);

  if (previewingAsChef) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          flexShrink: 0,
          background: 'rgb(254,243,199)', borderBottom: '1px solid rgb(245,222,151)',
          padding: '10px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RAKIcon name="eye" size={14} color="rgb(146,99,0)" />
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(146,99,0)' }}>Chef preview</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(146,99,0)' }}>
              You’re viewing this listing exactly how chefs see it. Interactions like booking are disabled.
            </span>
          </div>
          <button type="button" onClick={() => setPreviewingAsChef(false)} style={{
            border: '1px solid rgb(146,99,0)', background: '#fff', cursor: 'pointer',
            padding: '6px 12px', borderRadius: 4,
            fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(146,99,0)',
          }}>Exit preview</button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <ChefListingDetail kitchenId={k.id} onBack={() => setPreviewingAsChef(false)} onBook={() => {}} />
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'photos', label: 'Photo library' },
    { id: 'equipment', label: 'Equipment & features' },
    { id: 'hours', label: 'Hours' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'compliance', label: 'Licence & insurance' },
    { id: 'rules', label: 'House rules' },
  ];

  return (
    <RAKPageFrame padding={0}>
      <div style={{ padding: '24px 32px 0' }}>
        <button type="button" onClick={() => setConfirming(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          border: 'none', background: 'transparent', cursor: 'pointer',
          padding: 0, marginBottom: 14,
          fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(0,145,179)', fontWeight: 600,
        }}>
          <RAKIcon name="arrow-left" size={14} color="rgb(0,145,179)" />
          All listings
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 32, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>{k.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <RAKStatusChip status={k.status} />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>·</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{k.address}</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>·</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Last updated 14 May 2026</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <PerformButton variant="base" iconLeft={<RAKIcon name="eye" size={14} color="rgb(32,33,36)" />} onClick={() => setPreviewingAsChef(true)}>Preview as chef</PerformButton>
            <PerformButton variant="brand-outline" onClick={() => setPauseModalOpen(true)}>Pause listing</PerformButton>
            <PerformButton variant="brand">Save changes</PerformButton>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgb(221,219,218)', marginTop: 22, overflowX: 'auto' }}>
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
                padding: '12px 18px', border: 'none', cursor: 'pointer',
                background: 'transparent',
                color: on ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: on ? 700 : 600,
                borderBottom: '3px solid ' + (on ? 'rgb(0,114,152)' : 'transparent'),
                marginBottom: -1, whiteSpace: 'nowrap',
              }}>{t.label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 60px' }}>
        {tab === 'overview' && <DetailOverview k={k} />}
        {tab === 'calendar' && <DetailCalendar k={k} />}
        {tab === 'photos' && <DetailPhotos k={k} />}
        {tab === 'equipment' && <DetailEquipment k={k} />}
        {tab === 'hours' && <DetailHours k={k} />}
        {tab === 'pricing' && <DetailPricing k={k} />}
        {tab === 'compliance' && <DetailCompliance k={k} />}
        {tab === 'rules' && <DetailRules k={k} />}
      </div>

      {confirming && (
        <RAKConfirmModal
          title="Save changes before leaving?"
          message="You may have unsaved edits to this listing. Save them, discard them, or stay on this page."
          primary={{ label: 'Save & exit', onClick: () => { setConfirming(false); onBack && onBack(); } }}
          secondary={{ label: 'Discard changes', onClick: () => { setConfirming(false); onBack && onBack(); } }}
          tertiary={{ label: 'Stay on page', onClick: () => setConfirming(false) }}
          onClose={() => setConfirming(false)} />
      )}

      {pauseModalOpen && (
        <RAKPauseListingModal
          listing={k}
          onClose={() => setPauseModalOpen(false)}
          onConfirm={(range) => {
            const overlapping = RAK_BOOKINGS.filter((b) =>
              b.listingId === k.id
              && (b.status === 'confirmed' || b.status === 'pending')
              && b.date >= range.from && b.date <= range.to
            );
            setPauseModalOpen(false);
            if (overlapping.length > 0) {
              setPauseCancelTarget({ range, bookings: overlapping });
            }
          }} />
      )}

      {pauseCancelTarget && (
        <RAKConfirmModal
          title={`Cancel ${pauseCancelTarget.bookings.length} booking${pauseCancelTarget.bookings.length === 1 ? '' : 's'}?`}
          message={`Pausing the listing from ${RAK_formatDate(pauseCancelTarget.range.from)} to ${RAK_formatDate(pauseCancelTarget.range.to)} will cancel ${pauseCancelTarget.bookings.length} existing booking${pauseCancelTarget.bookings.length === 1 ? '' : 's'} during that window. Chefs will be refunded and notified.`}
          primary={{ label: 'Cancel bookings & pause', onClick: () => setPauseCancelTarget(null) }}
          secondary={{ label: "Keep bookings, don’t pause", onClick: () => setPauseCancelTarget(null) }}
          onClose={() => setPauseCancelTarget(null)} />
      )}
    </RAKPageFrame>
  );
}

function DetailOverview({ k }) {
  const [hourly, setHourly] = React.useState(String(k.hourlyRate));
  const [daily, setDaily] = React.useState(String(k.dailyRate));
  const [name, setName] = React.useState(k.name);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28, maxWidth: 1200 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <DetailSection title="Basic details">
          <PerformField label="Listing name" required width="100%" value={name} onChange={setName} />
          <PerformField label="Street address" required width="100%" value={k.address} onChange={() => {}} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
            <PerformField label="Floor area" width="100%" value={String(k.sqm)} onChange={() => {}} unit="m²" />
            <PerformField label="Max chefs at once" width="100%" value={String(k.capacity)} onChange={() => {}} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <PerformFieldLabel required>Description</PerformFieldLabel>
            <textarea defaultValue={k.description} rows={5} style={{
              width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)',
              padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 16,
              color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none',
            }} />
          </div>
        </DetailSection>

        <DetailSection title="Pricing" subtitle="Quick edits. For weekend surcharges and cleaning fees, see the Pricing tab.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
            <PerformField label="Hourly rate" width="100%" value={hourly} onChange={setHourly} unit="AUD/hr" />
            <PerformField label="Daily rate (8h+)" width="100%" value={daily} onChange={setDaily} unit="AUD/day" />
          </div>
          <PerformInfoPanel tone="info">
            Pricing changes apply to new bookings only. Existing confirmed bookings keep their original rate.
          </PerformInfoPanel>
        </DetailSection>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(95,99,104)' }}>This listing</span>
          <ListingMetric label="Bookings this month" value={String(RAK_BOOKINGS.filter((b) => b.listingId === k.id).length)} />
          <ListingMetric label="Total earned" value={`$${RAK_BOOKINGS.filter((b) => b.listingId === k.id && b.status !== 'pending' && b.status !== 'cancelled').reduce((s, b) => s + b.total, 0).toLocaleString()}`} />
          <ListingMetric label="Avg. rating" value={`${k.rating} ★`} sub={`${k.reviewCount} reviews`} />
          <ListingMetric label="Listed" value={new Date(k.listedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })} />
        </div>

        <div style={{ background: 'rgb(248,247,247)', border: '1px solid rgb(238,235,234)', borderRadius: 5, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>Listing health</span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', lineHeight: 1.5 }}>
            5 of 7 sections complete. Add house rules and confirm hours to reach 100%.
          </span>
          <div style={{ height: 8, background: '#fff', borderRadius: 99, overflow: 'hidden', border: '1px solid rgb(221,219,218)' }}>
            <div style={{ width: '71%', height: '100%', background: 'rgb(0,114,152)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingMetric({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgb(238,235,234)', paddingTop: 10 }}>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{label}</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{value}</span>
        {sub && <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)' }}>{sub}</span>}
      </div>
    </div>
  );
}

function DetailSection({ title, subtitle, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>{title}</h2>
        {subtitle && <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function DetailCalendar({ k }) {
  const [monthOffset, setMonthOffset] = React.useState(0);
  const baseYear = 2026, baseMonth = 4;
  const m = baseMonth + monthOffset;
  const y = baseYear + Math.floor(m / 12);
  const month = (m % 12 + 12) % 12;
  const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];

  const BLOCKS_KEY = `rak-blocks-${k.id}`;
  const [blocks, setBlocks] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(BLOCKS_KEY) || '[]'); }
    catch (_) { return []; }
  });
  const persistBlocks = (next) => {
    setBlocks(next);
    try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(next)); } catch (_) {}
  };
  const [blockModalOpen, setBlockModalOpen] = React.useState(false);
  const [openBookingId, setOpenBookingId] = React.useState(null);

  if (openBookingId) {
    return <OwnerRequestDetail bookingId={openBookingId} onBack={() => setOpenBookingId(null)} />;
  }

  const firstDay = new Date(y, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(y, month + 1, 0).getDate();

  const bookings = RAK_BOOKINGS.filter((b) => b.listingId === k.id);
  const bookingsByDate = bookings.reduce((acc, b) => {
    const d = new Date(b.date);
    if (d.getFullYear() === y && d.getMonth() === month) {
      const key = d.getDate();
      acc[key] = acc[key] || [];
      acc[key].push(b);
    }
    return acc;
  }, {});

  const blockedByDate = {};
  blocks.forEach((bl) => {
    const start = new Date(bl.from);
    const end = new Date(bl.to || bl.from);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === y && d.getMonth() === month) {
        const k2 = d.getDate();
        blockedByDate[k2] = blockedByDate[k2] || [];
        blockedByDate[k2].push(bl);
      }
    }
  });

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0 || cells.length < 35) cells.push({ blank: true });

  const tone = {
    confirmed: { bg: 'rgb(0,114,152)', fg: '#fff', label: 'Confirmed' },
    'in-progress': { bg: 'rgb(146,99,0)', fg: '#fff', label: 'In progress' },
    pending: { bg: '#fff', fg: 'rgb(32,33,36)', label: 'Pending', dashed: true },
    completed: { bg: 'rgb(238,235,234)', fg: 'rgb(95,99,104)', label: 'Completed' },
    blocked: { bg: 'rgb(95,99,104)', fg: '#fff', label: 'Blocked out' },
  };

  const todayY = 2026, todayM = 4, todayD = 19;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, maxWidth: 1300 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" onClick={() => setMonthOffset(monthOffset - 1)} style={navBtn}>
              <RAKIcon name="arrow-left" size={14} color="rgb(0,114,152)" />
            </button>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0, minWidth: 200 }}>{monthName} {y}</h2>
            <button type="button" onClick={() => setMonthOffset(monthOffset + 1)} style={navBtn}>
              <RAKIcon name="arrow-right" size={14} color="rgb(0,114,152)" />
            </button>
            <button type="button" onClick={() => setMonthOffset(0)} style={{
              height: 36, padding: '0 12px', borderRadius: 4,
              border: '1px solid rgb(221,219,218)', background: '#fff',
              fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
              color: 'rgb(32,33,36)', cursor: 'pointer',
            }}>Today</button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="calendar" size={13} color="rgb(0,114,152)" />} onClick={() => setBlockModalOpen(true)}>Block dates</PerformButton>
            <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="download" size={13} color="rgb(0,114,152)" />}>Export iCal</PerformButton>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {Object.entries(tone).map(([key, v]) => (
            <div key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: v.bg, border: v.dashed ? '1px dashed rgb(190,191,193)' : 'none' }} />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{v.label}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgb(238,235,234)' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} style={{ padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '110px' }}>
            {cells.map((c, i) => {
              const isToday = !c.blank && c.day === todayD && y === todayY && month === todayM;
              const evs = (!c.blank && bookingsByDate[c.day]) || [];
              return (
                <div key={i} style={{
                  borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid rgb(238,235,234)',
                  borderBottom: i < cells.length - 7 ? '1px solid rgb(238,235,234)' : 'none',
                  padding: 6, display: 'flex', flexDirection: 'column', gap: 4,
                  background: c.blank ? 'rgb(248,247,247)' : isToday ? 'rgb(230,244,247)' : '#fff',
                  position: 'relative',
                }}>
                  {!c.blank && (
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: isToday ? 700 : 600, color: isToday ? 'rgb(0,114,152)' : 'rgb(32,33,36)' }}>{c.day}</span>
                  )}
                  {!c.blank && (blockedByDate[c.day] || []).map((bl, bi) => (
                    <div key={`bl-${bi}`} title={bl.reason || 'Blocked out'} style={{
                      padding: '3px 5px', borderRadius: 2,
                      background: tone.blocked.bg, color: tone.blocked.fg,
                      fontFamily: "'Open Sans', sans-serif", fontSize: 10.5, fontWeight: 600, lineHeight: 1.2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <span style={{ fontSize: 9 }}>🚫</span>
                      {bl.allDay ? 'All day' : `${bl.start}–${bl.end}`}
                    </div>
                  ))}
                  {evs.map((b) => {
                    const chef = RAK_USERS.find((u) => u.id === b.chefId);
                    const t = tone[b.status] || tone.confirmed;
                    return (
                      <div key={b.id} title={`${chef?.name} · ${b.start} – ${b.end}`}
                        onClick={(e) => { e.stopPropagation(); setOpenBookingId(b.id); }}
                        style={{
                          padding: '3px 5px', borderRadius: 2,
                          background: t.bg, color: t.fg,
                          border: t.dashed ? '1px dashed rgb(190,191,193)' : 'none',
                          fontFamily: "'Open Sans', sans-serif", fontSize: 10.5, fontWeight: 600, lineHeight: 1.2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer',
                        }}>
                        {b.start} {chef?.avatar}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>
          Bookings in {monthName.slice(0, 3)}
        </h2>
        <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
          {bookings.filter((b) => { const d = new Date(b.date); return d.getFullYear() === y && d.getMonth() === month; }).length === 0 && (
            <div style={{ padding: 18, fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>No bookings this month.</div>
          )}
          {bookings
            .filter((b) => { const d = new Date(b.date); return d.getFullYear() === y && d.getMonth() === month; })
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((b, i, arr) => {
              const chef = RAK_USERS.find((u) => u.id === b.chefId);
              const d = new Date(b.date);
              return (
                <div key={b.id}
                  onClick={() => setOpenBookingId(b.id)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgb(248,247,247)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                  style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 12, alignItems: 'center',
                    padding: '12px 14px',
                    borderBottom: i === arr.length - 1 ? 'none' : '1px solid rgb(238,235,234)',
                    cursor: 'pointer', transition: 'background 120ms',
                  }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', textTransform: 'uppercase' }}>{d.toLocaleDateString('en-AU', { month: 'short' })}</span>
                    <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(0,114,152)', lineHeight: 1 }}>{d.getDate()}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</div>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{b.start} – {b.end} · {b.hours}h · ${b.total}</div>
                  </div>
                  <RAKStatusChip status={b.status} />
                </div>
              );
            })}
        </div>
      </div>

      {blockModalOpen && (
        <RAKBlockDatesModal
          listingName={k.name}
          onClose={() => setBlockModalOpen(false)}
          onSave={(entry) => {
            persistBlocks([...blocks, { id: `bl-${Date.now()}`, listingId: k.id, ...entry }]);
            setBlockModalOpen(false);
          }} />
      )}
    </div>
  );
}

function RAKBlockDatesModal({ listingName, onClose, onSave }) {
  const today = new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  const [from, setFrom] = React.useState(fmt(today));
  const [to, setTo] = React.useState(fmt(today));
  const [allDay, setAllDay] = React.useState(true);
  const [start, setStart] = React.useState('09:00');
  const [end, setEnd] = React.useState('17:00');
  const [reason, setReason] = React.useState('');

  const invalid = !from || !to || from > to || (!allDay && (!start || !end || start >= end));
  const days = Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);

  const save = () => {
    if (invalid) return;
    onSave({ from, to, allDay, start: allDay ? null : start, end: allDay ? null : end, reason: reason.trim() });
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(32,33,36,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 520, maxWidth: '100%', background: '#fff', borderRadius: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: "'Open Sans', sans-serif", overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)' }}>Block out dates</span>
          <span style={{ fontSize: 13, color: 'rgb(95,99,104)' }}>{listingName} will be unavailable for new bookings during the selected window.</span>
        </div>

        <div style={{ padding: '14px 24px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <DateField label="From" value={from} onChange={setFrom} />
            <DateField label="To" value={to} onChange={setTo} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: 'rgb(32,33,36)' }}>
            <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
            Block the entire day(s)
          </label>
          {!allDay && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <TimeField label="Start time" value={start} onChange={setStart} />
              <TimeField label="End time" value={end} onChange={setEnd} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>Reason (optional)</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual maintenance, owner's private event"
              style={{ height: 38, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontSize: 14, color: 'rgb(32,33,36)', outline: 'none', fontFamily: "'Open Sans', sans-serif" }} />
          </div>
          <div style={{ background: 'rgb(248,247,247)', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: 'rgb(95,99,104)' }}>
            Blocks <strong style={{ color: 'rgb(32,33,36)' }}>{days}</strong> day{days === 1 ? '' : 's'}
            {!allDay && <span> · {start} – {end}</span>}.
            Existing confirmed bookings in this window will <strong style={{ color: 'rgb(32,33,36)' }}>not</strong> be cancelled.
          </div>
        </div>

        <div style={{ padding: '14px 24px 18px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 14px', borderRadius: 4, cursor: 'pointer', border: '1px solid rgb(221,219,218)', background: '#fff', fontSize: 14, fontWeight: 600, color: 'rgb(32,33,36)', fontFamily: "'Open Sans', sans-serif" }}>Cancel</button>
          <button type="button" onClick={save} disabled={invalid} style={{ padding: '8px 16px', borderRadius: 4, cursor: invalid ? 'not-allowed' : 'pointer', border: 'none', background: invalid ? 'rgb(190,191,193)' : 'rgb(0,114,152)', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Open Sans', sans-serif" }}>Save block</button>
        </div>
      </div>
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{label}</label>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ height: 38, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontSize: 14, color: 'rgb(32,33,36)', outline: 'none', fontFamily: "'Open Sans', sans-serif" }} />
    </div>
  );
}

function RAKPauseListingModal({ listing, onClose, onConfirm }) {
  const today = new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  const [from, setFrom] = React.useState(fmt(today));
  const [to, setTo] = React.useState(fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)));
  const [reason, setReason] = React.useState('');

  const invalid = !from || !to || from > to;
  const days = invalid ? 0 : Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);

  const affected = RAK_BOOKINGS.filter((b) =>
    b.listingId === listing.id
    && (b.status === 'confirmed' || b.status === 'pending')
    && !invalid && b.date >= from && b.date <= to
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(32,33,36,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 540, maxWidth: '100%', background: '#fff', borderRadius: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: "'Open Sans', sans-serif", overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)' }}>Pause this listing</span>
          <span style={{ fontSize: 13, color: 'rgb(95,99,104)' }}>{listing.name} won’t appear in chef search results during the selected window.</span>
        </div>

        <div style={{ padding: '14px 24px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <DateField label="Pause from" value={from} onChange={setFrom} />
            <DateField label="Pause until" value={to} onChange={setTo} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>Reason (optional)</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual maintenance, owner travelling"
              style={{ height: 38, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontSize: 14, color: 'rgb(32,33,36)', outline: 'none', fontFamily: "'Open Sans', sans-serif" }} />
          </div>
          <div style={{
            background: affected.length > 0 ? 'rgb(254,243,199)' : 'rgb(248,247,247)',
            border: affected.length > 0 ? '1px solid rgb(245,222,151)' : '1px solid transparent',
            borderRadius: 4, padding: '12px 14px',
            fontSize: 13, color: affected.length > 0 ? 'rgb(146,99,0)' : 'rgb(95,99,104)', lineHeight: 1.5,
          }}>
            {invalid
              ? 'Pick a valid date range to continue.'
              : affected.length === 0
                ? <span>Pausing <strong style={{ color: 'rgb(32,33,36)' }}>{days}</strong> day{days === 1 ? '' : 's'}. No existing bookings fall in this window.</span>
                : <span><strong>{affected.length}</strong> booking{affected.length === 1 ? '' : 's'} fall{affected.length === 1 ? 's' : ''} in this window. You’ll be asked to cancel them on the next step.</span>}
          </div>
        </div>

        <div style={{ padding: '14px 24px 18px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 14px', borderRadius: 4, cursor: 'pointer', border: '1px solid rgb(221,219,218)', background: '#fff', fontSize: 14, fontWeight: 600, color: 'rgb(32,33,36)', fontFamily: "'Open Sans', sans-serif" }}>Cancel</button>
          <button type="button" disabled={invalid} onClick={() => onConfirm({ from, to, reason: reason.trim() })}
            style={{ padding: '8px 16px', borderRadius: 4, cursor: invalid ? 'not-allowed' : 'pointer', border: 'none', background: invalid ? 'rgb(190,191,193)' : 'rgb(0,114,152)', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Open Sans', sans-serif" }}>Continue</button>
        </div>
      </div>
    </div>
  );
}

function TimeField({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{label}</label>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ height: 38, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontSize: 14, color: 'rgb(32,33,36)', outline: 'none', fontFamily: "'Open Sans', sans-serif" }} />
    </div>
  );
}

const navBtn = {
  width: 36, height: 36, borderRadius: 4,
  border: '1px solid rgb(221,219,218)', background: '#fff',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

const RAK_PHOTO_TAGS = ['Cooking area', 'Bench space', 'Equipment', 'Storage', 'Exterior', 'Loading dock'];

function DetailPhotos({ k }) {
  const [photos, setPhotos] = React.useState(() => {
    const seeded = k.photos.map((url, i) => ({ id: `seed-${i}`, url, tag: RAK_PHOTO_TAGS[i % RAK_PHOTO_TAGS.length] }));
    while (seeded.length < 6) {
      const i = seeded.length;
      seeded.push({ id: `seed-${i}`, url: k.photos[i % k.photos.length], tag: RAK_PHOTO_TAGS[i % RAK_PHOTO_TAGS.length] });
    }
    return seeded;
  });
  const [hover, setHover] = React.useState(null);
  const [activeTag, setActiveTag] = React.useState('All photos');
  const [uploaderOpen, setUploaderOpen] = React.useState(false);

  const visiblePhotos = activeTag === 'All photos' ? photos : photos.filter((p) => p.tag === activeTag);
  const tagsWithCounts = ['All photos', ...RAK_PHOTO_TAGS].map((t) => ({
    label: t,
    count: t === 'All photos' ? photos.length : photos.filter((p) => p.tag === t).length,
  })).filter((c) => c.label === 'All photos' || c.count > 0);

  const removePhoto = (id) => setPhotos((ps) => ps.filter((p) => p.id !== id));
  const setCover = (id) => {
    setPhotos((ps) => {
      const idx = ps.findIndex((p) => p.id === id);
      if (idx <= 0) return ps;
      const copy = [...ps];
      const [pick] = copy.splice(idx, 1);
      copy.unshift(pick);
      return copy;
    });
  };
  const addPhotos = (newOnes) => {
    setPhotos((ps) => [...ps, ...newOnes]);
    if (newOnes[0]) setActiveTag(newOnes[0].tag);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>Photo library</h2>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>
            {photos.length} photos. Drag to reorder — the first photo is your cover image.
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <PerformButton variant="brand-outline">Reorder</PerformButton>
          <PerformButton variant="brand" iconLeft={<RAKIcon name="plus" size={13} color="#fff" />} onClick={() => setUploaderOpen(true)}>Upload photos</PerformButton>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tagsWithCounts.map(({ label, count }) => {
          const on = activeTag === label;
          return (
            <button key={label} type="button" onClick={() => setActiveTag(label)} style={{
              height: 30, padding: '0 12px',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderRadius: 4, cursor: 'pointer',
              border: '1px solid ' + (on ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
              background: on ? 'rgb(230,244,247)' : '#fff',
              color: on ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
              fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: on ? 700 : 600,
            }}>
              {label}
              <span style={{ fontSize: 11, fontWeight: 700, color: on ? 'rgb(0,114,152)' : 'rgb(95,99,104)', opacity: 0.7 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {visiblePhotos.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: 'rgb(95,99,104)', fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>
            No photos tagged "{activeTag}" yet.
          </div>
        )}
        {visiblePhotos.map((p) => {
          const isCover = photos.indexOf(p) === 0;
          const isHover = hover === p.id;
          return (
            <div key={p.id}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              style={{
                position: 'relative', aspectRatio: '4 / 3', borderRadius: 5, overflow: 'hidden',
                background: 'rgb(238,235,234)',
                border: isCover ? '2px solid rgb(0,114,152)' : '1px solid rgb(221,219,218)', cursor: 'grab',
              }}>
              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                {isCover && (
                  <span style={{ padding: '4px 10px', borderRadius: 9999, background: 'rgb(0,114,152)', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>Cover</span>
                )}
                <span style={{ padding: '4px 10px', borderRadius: 9999, background: 'rgba(32,33,36,0.7)', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>{p.tag}</span>
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6, opacity: isHover ? 1 : 0, transition: 'opacity 120ms' }}>
                <button type="button" title="Set as cover" onClick={() => setCover(p.id)} style={photoActionBtn}>
                  <RAKIcon name="star-outline" size={14} color="rgb(95,99,104)" />
                </button>
                <button type="button" title="Edit" style={photoActionBtn}>
                  <RAKIcon name="edit" size={14} color="rgb(95,99,104)" />
                </button>
                <button type="button" title="Delete" onClick={() => removePhoto(p.id)} style={photoActionBtn}>
                  <PerformIcon name="delete" size={14} color="rgb(222,13,13)" />
                </button>
              </div>
            </div>
          );
        })}

        <button type="button" onClick={() => setUploaderOpen(true)} style={{
          aspectRatio: '4 / 3', borderRadius: 5,
          border: '2px dashed rgb(221,219,218)', background: 'rgb(248,247,247)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
        }}>
          <RAKIcon name="camera" size={28} color="rgb(95,99,104)" />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: 'rgb(32,33,36)' }}>Upload photos</span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>JPG or PNG, up to 10 MB</span>
        </button>
      </div>

      {uploaderOpen && (
        <RAKPhotoUploader tags={RAK_PHOTO_TAGS} onClose={() => setUploaderOpen(false)}
          onSave={(items) => { addPhotos(items); setUploaderOpen(false); }} />
      )}
    </div>
  );
}

function RAKPhotoUploader({ tags, onClose, onSave }) {
  const [items, setItems] = React.useState([]);
  const fileInputRef = React.useRef(null);

  const ingest = (fileList) => {
    if (!fileList || !fileList.length) return;
    const next = [];
    for (const f of fileList) {
      if (!f.type || !f.type.startsWith('image/')) continue;
      next.push({ id: `upl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, url: URL.createObjectURL(f), name: f.name, tag: tags[0] });
    }
    setItems((cur) => [...cur, ...next]);
  };

  const setTag = (id, tag) => setItems((cur) => cur.map((i) => i.id === id ? { ...i, tag } : i));
  const remove = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
  const setAllTag = (tag) => setItems((cur) => cur.map((i) => ({ ...i, tag })));
  const [dragOver, setDragOver] = React.useState(false);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(32,33,36,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 720, maxWidth: '100%', maxHeight: '90vh', background: '#fff', borderRadius: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: "'Open Sans', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)' }}>Upload photos</span>
          <span style={{ fontSize: 13, color: 'rgb(95,99,104)' }}>Add multiple images at once, then tag each with the area it shows. JPG or PNG, up to 10 MB each.</span>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); ingest(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            margin: '12px 22px 0', padding: 22, borderRadius: 6,
            border: `2px dashed ${dragOver ? 'rgb(0,114,152)' : 'rgb(221,219,218)'}`,
            background: dragOver ? 'rgb(230,244,247)' : 'rgb(248,247,247)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer', transition: 'background 120ms, border-color 120ms',
          }}>
          <RAKIcon name="upload" size={26} color="rgb(0,114,152)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>Drop images here or click to browse</span>
          <span style={{ fontSize: 12, color: 'rgb(95,99,104)' }}>You can select multiple files</span>
          <input ref={fileInputRef} type="file" accept="image/*" multiple
            onChange={(e) => { ingest(e.target.files); e.target.value = ''; }}
            style={{ display: 'none' }} />
        </div>

        {items.length > 0 && (
          <div style={{ margin: '12px 22px 0', padding: '10px 14px', background: 'rgb(248,247,247)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'rgb(95,99,104)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Bulk-tag {items.length} {items.length === 1 ? 'photo' : 'photos'}
            </span>
            <select onChange={(e) => { if (e.target.value) { setAllTag(e.target.value); e.target.value = ''; } }} defaultValue=""
              style={{ height: 30, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 8px', fontSize: 13, color: 'rgb(32,33,36)', fontFamily: "'Open Sans', sans-serif", background: '#fff' }}>
              <option value="" disabled>Apply tag…</option>
              {tags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        <div style={{
          flex: 1, overflowY: 'auto', padding: 22,
          display: items.length === 0 ? 'flex' : 'grid',
          gridTemplateColumns: items.length === 0 ? undefined : 'repeat(3, 1fr)',
          gap: 14,
          alignItems: items.length === 0 ? 'center' : 'start',
          justifyContent: items.length === 0 ? 'center' : 'start',
          minHeight: 180,
        }}>
          {items.length === 0 && <span style={{ color: 'rgb(95,99,104)', fontSize: 13 }}>No photos selected yet.</span>}
          {items.map((it) => (
            <div key={it.id} style={{ border: '1px solid rgb(221,219,218)', borderRadius: 5, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
              <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'rgb(238,235,234)' }}>
                <img src={it.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <button type="button" onClick={() => remove(it.id)} title="Remove" style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(32,33,36,0.7)', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'rgb(95,99,104)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</span>
                <select value={it.tag} onChange={(e) => setTag(it.id, e.target.value)}
                  style={{ height: 30, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 8px', fontSize: 13, color: 'rgb(32,33,36)', fontFamily: "'Open Sans', sans-serif", background: '#fff' }}>
                  {tags.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 22px 16px', borderTop: '1px solid rgb(238,235,234)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 14px', borderRadius: 4, cursor: 'pointer', border: '1px solid rgb(221,219,218)', background: '#fff', fontSize: 14, fontWeight: 600, color: 'rgb(32,33,36)', fontFamily: "'Open Sans', sans-serif" }}>Cancel</button>
          <button type="button" onClick={() => onSave(items)} disabled={items.length === 0}
            style={{ padding: '8px 16px', borderRadius: 4, cursor: items.length === 0 ? 'not-allowed' : 'pointer', border: 'none', background: items.length === 0 ? 'rgb(190,191,193)' : 'rgb(0,114,152)', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Open Sans', sans-serif" }}>
            Add {items.length || ''} {items.length === 1 ? 'photo' : 'photos'}
          </button>
        </div>
      </div>
    </div>
  );
}

const photoActionBtn = {
  width: 30, height: 30, borderRadius: 4,
  border: 'none', background: '#fff',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
};

function DetailEquipment({ k }) {
  return (
    <DetailSection title="Equipment & features" subtitle="What chefs get when they book your kitchen.">
      <PerformFieldLabel>Equipment available</PerformFieldLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
        {RAK_EQUIPMENT_OPTIONS.map((eq) => (
          <PerformCheckbox key={eq} checked={k.equipment.some((x) => x.toLowerCase().includes(eq.toLowerCase().split(' ')[0]))} onChange={() => {}} label={eq} />
        ))}
      </div>
      <div style={{ height: 12 }} />
      <PerformFieldLabel>Certifications</PerformFieldLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
        {RAK_CERT_OPTIONS.map((c) => (
          <PerformCheckbox key={c} checked={k.certifications.includes(c)} onChange={() => {}} label={c} />
        ))}
      </div>
    </DetailSection>
  );
}

function DetailHours({ k }) {
  return (
    <DetailSection title="Hours of operation" subtitle="When your kitchen is available to be booked.">
      <PerformInfoPanel tone="info">You can block specific dates from the Calendar tab at any time.</PerformInfoPanel>
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
        <div key={d} style={{ display: 'grid', gridTemplateColumns: '120px 110px 1fr 1fr', gap: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)' }}>{d}</span>
          <PerformCheckbox checked={d !== 'Sunday'} onChange={() => {}} label="Open" />
          <PerformField label="" width="100%" value="05:00" onChange={() => {}} />
          <PerformField label="" width="100%" value="23:00" onChange={() => {}} />
        </div>
      ))}
    </DetailSection>
  );
}

function DetailPricing({ k }) {
  return (
    <DetailSection title="Pricing" subtitle="You can adjust at any time. Existing bookings keep their original rate.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
        <PerformField label="Hourly rate" width="100%" value={String(k.hourlyRate)} unit="AUD/hr" onChange={() => {}} />
        <PerformField label="Daily rate (8h+)" width="100%" value={String(k.dailyRate)} unit="AUD/day" onChange={() => {}} />
        <PerformField label="Weekend surcharge (optional)" width="100%" value="15" unit="%" onChange={() => {}} />
        <PerformField label="Cleaning fee (optional)" width="100%" value="40" unit="AUD" onChange={() => {}} />
      </div>
      <PerformFieldLabel>Minimum booking length</PerformFieldLabel>
      <div style={{ display: 'flex', gap: 10 }}>
        {['2 hours', '4 hours', '6 hours', 'Full day'].map((opt, i) => (
          <button key={opt} type="button" style={{
            height: 36, padding: '0 16px', borderRadius: 4,
            border: '1px solid ' + (i === 1 ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
            background: i === 1 ? 'rgb(230,244,247)' : '#fff',
            color: i === 1 ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{opt}</button>
        ))}
      </div>
    </DetailSection>
  );
}

const RAK_COMPLIANCE_TYPES = [
  { key: 'food-licence', title: 'Food business licence', subtitle: 'NSW Food Authority / Vic Class 2 / equivalent state registration.', required: true, seeded: { name: 'NSW-Food-Authority-Eveleigh.pdf', sizeKb: 412, uploadedAt: '2025-11-18', expiresAt: '2027-03-01', issuer: 'NSW Food Authority' } },
  { key: 'public-liability', title: 'Public liability insurance', subtitle: 'Minimum $20M cover for the kitchen premises.', required: true, seeded: { name: 'PL-Insurance-CertOfCurrency.pdf', sizeKb: 286, uploadedAt: '2026-02-04', expiresAt: '2027-02-04', issuer: 'CGU Insurance' } },
  { key: 'product-liability', title: 'Product liability insurance', subtitle: 'Optional, but lifts your trust score for chefs producing for retail.', required: false, seeded: null },
  { key: 'workers-comp', title: 'Workers compensation', subtitle: 'Required if you have staff on-site during bookings.', required: false, seeded: null },
];

function DetailCompliance({ k }) {
  const [docs, setDocs] = React.useState(() => Object.fromEntries(RAK_COMPLIANCE_TYPES.map((t) => [t.key, t.seeded])));
  const [selectedKey, setSelectedKey] = React.useState(() => {
    const firstUploaded = RAK_COMPLIANCE_TYPES.find((t) => docs[t.key]);
    return firstUploaded ? firstUploaded.key : RAK_COMPLIANCE_TYPES[0].key;
  });

  const onFile = (key, file) => {
    if (!file) return;
    setDocs((d) => ({ ...d, [key]: { name: file.name, sizeKb: Math.round(file.size / 1024) || 1, uploadedAt: new Date().toISOString().slice(0, 10), expiresAt: null, issuer: 'Uploaded just now' } }));
    setSelectedKey(key);
  };
  const remove = (key) => setDocs((d) => ({ ...d, [key]: null }));

  const selected = docs[selectedKey];
  const selectedMeta = RAK_COMPLIANCE_TYPES.find((t) => t.key === selectedKey);
  const uploadedCount = Object.values(docs).filter(Boolean).length;
  const requiredMissing = RAK_COMPLIANCE_TYPES.filter((t) => t.required && !docs[t.key]).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, maxWidth: 1200, alignItems: 'flex-start' }}>
      <DetailSection title="Licence & insurance documents" subtitle="Uploaded documents are verified by our team within 1 business day. Chefs see a verified badge on your listing.">
        {requiredMissing > 0
          ? <PerformInfoPanel tone="warning">{requiredMissing} required document{requiredMissing === 1 ? '' : 's'} missing. Listings can’t go live without a current food licence and public liability cover.</PerformInfoPanel>
          : <PerformInfoPanel tone="info">All required documents on file ({uploadedCount}/{RAK_COMPLIANCE_TYPES.length} categories complete).</PerformInfoPanel>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RAK_COMPLIANCE_TYPES.map((t) => {
            const doc = docs[t.key];
            const isSelected = selectedKey === t.key;
            return (
              <div key={t.key} onClick={() => doc && setSelectedKey(t.key)} style={{
                border: `1px solid ${isSelected && doc ? 'rgb(0,114,152)' : 'rgb(221,219,218)'}`,
                background: isSelected && doc ? 'rgb(230,244,247)' : '#fff',
                borderRadius: 4, padding: 14, cursor: doc ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color 120ms, background 120ms',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 4, flexShrink: 0, background: doc ? 'rgb(220,243,228)' : 'rgb(238,235,234)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RAKIcon name={doc ? 'shield' : 'file'} size={16} color={doc ? 'rgb(31,121,77)' : 'rgb(95,99,104)'} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{t.title}</span>
                      {t.required && <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgb(146,99,0)', background: 'rgb(254,243,199)', padding: '2px 8px', borderRadius: 9999 }}>Required</span>}
                      {doc && <RAKStatusChip status="verified" />}
                    </div>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', lineHeight: 1.4 }}>{t.subtitle}</span>
                    {doc && <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{doc.name} · {doc.sizeKb} KB · uploaded {RAK_formatDate(doc.uploadedAt)}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 4, cursor: 'pointer', border: '1px solid rgb(0,114,152)', background: '#fff', color: 'rgb(0,114,152)', fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700 }}>
                    <RAKIcon name="upload" size={12} color="rgb(0,114,152)" />
                    {doc ? 'Replace' : 'Upload document'}
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" onClick={(e) => e.stopPropagation()} onChange={(e) => onFile(t.key, e.target.files && e.target.files[0])} style={{ display: 'none' }} />
                  </label>
                  {doc && (
                    <React.Fragment>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedKey(t.key); }} style={{ padding: '6px 12px', borderRadius: 4, cursor: 'pointer', border: '1px solid rgb(221,219,218)', background: '#fff', color: 'rgb(32,33,36)', fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>View</button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); remove(t.key); }} style={{ padding: '6px 12px', borderRadius: 4, cursor: 'pointer', border: 'none', background: 'transparent', color: 'rgb(222,13,13)', fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>Remove</button>
                    </React.Fragment>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DetailSection>

      <div style={{ position: 'sticky', top: 16, background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, display: 'flex', flexDirection: 'column', minHeight: 480 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgb(238,235,234)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)' }}>Document preview</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected ? selectedMeta.title : 'Nothing selected'}</span>
          </div>
          {selected && <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="download" size={12} color="rgb(0,114,152)" />}>Download</PerformButton>}
        </div>
        <div style={{ flex: 1, padding: 18, background: 'rgb(248,247,247)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selected ? (
            <div style={{ width: '100%', maxWidth: 360, aspectRatio: '8.5 / 11', background: '#fff', border: '1px solid rgb(221,219,218)', borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "'Open Sans', sans-serif" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 4, background: 'rgb(0,114,152)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>PDF</div>
                <span style={{ fontSize: 11, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{selected.issuer}</span>
              </div>
              <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', lineHeight: 1.2 }}>{selectedMeta.title}</span>
              <div style={{ height: 1, background: 'rgb(238,235,234)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <DocMetaRow label="Issued to" value={k.ownerName} />
                <DocMetaRow label="Premises" value={`${k.suburb}, ${k.city} ${k.state}`} />
                <DocMetaRow label="File" value={selected.name} />
                <DocMetaRow label="Uploaded" value={RAK_formatDate(selected.uploadedAt)} />
                {selected.expiresAt && <DocMetaRow label="Expires" value={RAK_formatDate(selected.expiresAt)} />}
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: 0.55 }}>
                {[null, '88%', '94%', '70%'].map((w, i) => <div key={i} style={{ height: 6, background: 'rgb(238,235,234)', borderRadius: 2, width: w || '100%' }} />)}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'rgb(95,99,104)', textAlign: 'center', maxWidth: 260 }}>
              <RAKIcon name="file" size={28} color="rgb(190,191,193)" />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>Upload a document on the left and it will appear here.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocMetaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
      <span style={{ color: 'rgb(95,99,104)' }}>{label}</span>
      <span style={{ color: 'rgb(32,33,36)', fontWeight: 600, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

function DetailRules({ k }) {
  const [rules, setRules] = React.useState([
    { id: 'r1', title: 'Cleaning at end of booking', body: 'Wipe down all benches and stovetop with the supplied sanitiser. Sweep and mop the floor. Take rubbish out to the loading dock bins. Leave the cool room as you found it.', images: [] },
    { id: 'r2', title: 'Loading dock access', body: 'The loading dock on Wilson St is your way in. Reverse-park only between the painted lines — the bollards close at 11pm sharp. Use the lift to bring equipment up to the kitchen level.', images: [] },
  ]);
  const [editingId, setEditingId] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const saveRule = (rule) => {
    setRules((rs) => {
      const idx = rs.findIndex((r) => r.id === rule.id);
      if (idx === -1) return [...rs, rule];
      const copy = [...rs]; copy[idx] = rule; return copy;
    });
    setEditingId(null);
  };
  const deleteRule = (id) => { setRules((rs) => rs.filter((r) => r.id !== id)); setConfirmDelete(null); };

  return (
    <DetailSection title="House rules" subtitle="What chefs need to know before they book. Add as many rules as you like — supporting photos make them easier to follow.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rules.length === 0 && (
          <div style={{ padding: '20px 14px', borderRadius: 4, background: 'rgb(248,247,247)', color: 'rgb(95,99,104)', fontSize: 14, fontFamily: "'Open Sans', sans-serif", textAlign: 'center' }}>
            No house rules yet. Add one to help chefs book with confidence.
          </div>
        )}
        {rules.map((r) => (
          <DetailRuleCard key={r.id} rule={r} onEdit={() => setEditingId(r.id)} onDelete={() => setConfirmDelete(r)} />
        ))}
        <button type="button" onClick={() => setEditingId('__new__')} style={{
          display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8,
          padding: '10px 16px', borderRadius: 4,
          border: '1px dashed rgb(0,114,152)', background: 'rgb(230,244,247)', color: 'rgb(0,114,152)',
          fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          <RAKIcon name="plus" size={14} color="rgb(0,114,152)" />
          Add a rule
        </button>
      </div>

      {editingId && (
        <RAKRuleEditorModal
          rule={editingId === '__new__' ? { id: `r-${Date.now()}`, title: '', body: '', images: [] } : rules.find((r) => r.id === editingId)}
          isNew={editingId === '__new__'}
          onClose={() => setEditingId(null)}
          onSave={saveRule} />
      )}

      {confirmDelete && (
        <RAKConfirmModal
          title="Delete this rule?"
          message={`"${confirmDelete.title}" will be removed from the listing. Chefs who already booked won’t see the change until their next booking.`}
          primary={{ label: 'Delete rule', onClick: () => deleteRule(confirmDelete.id) }}
          secondary={{ label: 'Cancel', onClick: () => setConfirmDelete(null) }}
          onClose={() => setConfirmDelete(null)} />
      )}
    </DetailSection>
  );
}

function DetailRuleCard({ rule, onEdit, onDelete }) {
  return (
    <div style={{ border: '1px solid rgb(221,219,218)', borderRadius: 5, background: '#fff', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{rule.title || 'Untitled rule'}</span>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button type="button" title="Edit" onClick={onEdit} style={ruleActionBtn}><RAKIcon name="edit" size={14} color="rgb(95,99,104)" /></button>
          <button type="button" title="Delete" onClick={onDelete} style={ruleActionBtn}><PerformIcon name="delete" size={14} color="rgb(222,13,13)" /></button>
        </div>
      </div>
      {rule.body && <p style={{ margin: 0, fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{rule.body}</p>}
      {rule.images && rule.images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
          {rule.images.map((img) => (
            <div key={img.id} style={{ aspectRatio: '4 / 3', borderRadius: 4, overflow: 'hidden', background: 'rgb(238,235,234)' }}>
              <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ruleActionBtn = {
  width: 30, height: 30, borderRadius: 4,
  border: '1px solid rgb(221,219,218)', background: '#fff',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

function RAKRuleEditorModal({ rule, isNew, onClose, onSave }) {
  const [title, setTitle] = React.useState(rule.title);
  const [body, setBody] = React.useState(rule.body);
  const [images, setImages] = React.useState(rule.images || []);
  const fileRef = React.useRef(null);

  const ingest = (fileList) => {
    if (!fileList || !fileList.length) return;
    const next = [];
    for (const f of fileList) {
      if (!f.type || !f.type.startsWith('image/')) continue;
      next.push({ id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, url: URL.createObjectURL(f), name: f.name });
    }
    setImages((cur) => [...cur, ...next]);
  };

  const removeImg = (id) => setImages((cur) => cur.filter((i) => i.id !== id));
  const invalid = !title.trim();
  const save = () => { if (invalid) return; onSave({ ...rule, title: title.trim(), body: body.trim(), images }); };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(32,33,36,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 600, maxWidth: '100%', maxHeight: '90vh', background: '#fff', borderRadius: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', fontFamily: "'Open Sans', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)' }}>{isNew ? 'Add a house rule' : 'Edit house rule'}</span>
          <span style={{ fontSize: 13, color: 'rgb(95,99,104)' }}>Use plain language. Supporting photos help chefs follow along (e.g. the loading dock entry, the bin bay).</span>
        </div>

        <div style={{ padding: '14px 24px 8px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. End-of-booking cleaning"
              style={{ height: 38, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontSize: 14, color: 'rgb(32,33,36)', outline: 'none', fontFamily: "'Open Sans', sans-serif" }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>Details</label>
            <textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What does the chef need to do, know, or avoid?"
              style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontSize: 14, color: 'rgb(32,33,36)', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: "'Open Sans', sans-serif" }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>Supporting images</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {images.map((img) => (
                <div key={img.id} style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 4, overflow: 'hidden', background: 'rgb(238,235,234)' }}>
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <button type="button" onClick={() => removeImg(img.id)} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'rgba(32,33,36,0.7)', color: '#fff', cursor: 'pointer', fontSize: 13, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ))}
              <button type="button" onClick={() => fileRef.current && fileRef.current.click()} style={{ aspectRatio: '4 / 3', borderRadius: 4, cursor: 'pointer', border: '1px dashed rgb(221,219,218)', background: 'rgb(248,247,247)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', fontWeight: 600 }}>
                <RAKIcon name="plus" size={16} color="rgb(95,99,104)" />
                Add image
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => { ingest(e.target.files); e.target.value = ''; }} style={{ display: 'none' }} />
            </div>
            <span style={{ fontSize: 12, color: 'rgb(95,99,104)' }}>{images.length} {images.length === 1 ? 'image' : 'images'} attached</span>
          </div>
        </div>

        <div style={{ padding: '14px 24px 18px', display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid rgb(238,235,234)' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 14px', borderRadius: 4, cursor: 'pointer', border: '1px solid rgb(221,219,218)', background: '#fff', fontSize: 14, fontWeight: 600, color: 'rgb(32,33,36)', fontFamily: "'Open Sans', sans-serif" }}>Cancel</button>
          <button type="button" onClick={save} disabled={invalid} style={{ padding: '8px 16px', borderRadius: 4, cursor: invalid ? 'not-allowed' : 'pointer', border: 'none', background: invalid ? 'rgb(190,191,193)' : 'rgb(0,114,152)', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Open Sans', sans-serif" }}>{isNew ? 'Add rule' : 'Save changes'}</button>
        </div>
      </div>
    </div>
  );
}
