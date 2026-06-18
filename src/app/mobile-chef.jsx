// Rent a kitchen — Mobile CHEF views.
// Browse, listing detail, booking flow, my bookings, messages, profile.

import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformCheckbox, PerformRadio, PerformFieldLabel } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { RAKIcon } from './icons';
import { RAK_KITCHENS, RAK_BOOKINGS, RAK_USERS, RAK_THREADS } from './data';
import { RAKMobileTopBar, RAKMobileTabBar, RAKMobileScreen, RAKMobileSection, RAKMobileBackButton, RAKMobileCard, RAK_MOBILE_TABS } from './mobile-shell';
import { RAKStatusChip, RAK_formatDate, useSavedListings } from './shell';
import { MChefCheckIn, MChefCheckOut, MChefActiveSession, useBookingStates } from './mobile-checkinout';
import { FakeMap, RAK_EQUIPMENT_OPTIONS, RAK_CERT_OPTIONS } from './chef-views-1';
import { SAMPLE_REVIEWS, ListingReview, useChefCredentials, RAKCredentialPreviewModal, RAK_CHEF_CREDENTIALS } from './chef-views-2';

/* ============================================================
   MOBILE CHEF — BROWSE (list <-> map toggle)
   ============================================================ */
export function MChefBrowse({ filters, setFilters, onOpenListing }) {
  const [view, setView] = React.useState('list'); // list | map
  const [filterOpen, setFilterOpen] = React.useState(false);

  const filtered = RAK_KITCHENS.filter((k) => k.status === 'active').filter((k) => {
    if (filters.city !== 'All Australia' && k.city !== filters.city) return false;
    if (k.hourlyRate < filters.priceMin || k.hourlyRate > filters.priceMax) return false;
    if (filters.capacity > 1 && k.capacity < filters.capacity) return false;
    if (filters.equipment.length && !filters.equipment.every((e) => k.equipment.some((kit) => kit.toLowerCase().includes(e.toLowerCase().split(' ')[0])))) return false;
    if (filters.cert && !k.certifications.some((c) => c === filters.cert)) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (!k.name.toLowerCase().includes(q) && !k.suburb.toLowerCase().includes(q) && !k.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <>
      <RAKMobileTopBar
        title="Browse kitchens"
        trailing={
          <PerformIcon name="notification" size={20} color="rgb(32,33,36)" />
        }
      />

      {/* Sticky search/filter row */}
      <div style={{
        position: 'sticky', top: 106, zIndex: 4,
        background: '#fff', borderBottom: '1px solid rgb(238,235,234)',
        padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{
          height: 40, padding: '0 12px', borderRadius: 999,
          background: 'rgb(248,247,247)', border: '1px solid rgb(238,235,234)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <RAKIcon name="search" size={16} color="rgb(95,99,104)" />
          <input value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="Suburb or kitchen name"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Open Sans', sans-serif", fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          <MFilterChip label={filters.city} active onClick={() => setFilterOpen(true)} />
          <MFilterChip label={`$${filters.priceMin}–$${filters.priceMax}`} onClick={() => setFilterOpen(true)} />
          <MFilterChip label={filters.capacity > 1 ? `${filters.capacity}+ chefs` : 'Any size'} onClick={() => setFilterOpen(true)} />
          <MFilterChip label={filters.equipment.length ? `${filters.equipment.length} equipment` : 'Equipment'} onClick={() => setFilterOpen(true)} />
          <MFilterChip label={filters.cert || 'Certs'} onClick={() => setFilterOpen(true)} />
        </div>
      </div>

      {view === 'list' && (
        <RAKMobileScreen>
          <div style={{ padding: '12px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{filtered.length} kitchens in {filters.city}</span>
            {filtered.map((k) => <MChefListingCard key={k.id} kitchen={k} onClick={() => onOpenListing(k.id)} />)}
            {filtered.length === 0 && (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: 'rgb(95,99,104)' }}>No kitchens match those filters.</div>
            )}
          </div>
        </RAKMobileScreen>
      )}

      {view === 'map' && (
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <FakeMap kitchens={filtered} hoveredId={null} onHover={() => {}} onPinClick={onOpenListing} city={filters.city} />
        </div>
      )}

      {/* Floating list/map toggle */}
      <button type="button" onClick={() => setView(view === 'list' ? 'map' : 'list')} style={{
        position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 8,
        height: 44, padding: '0 20px', borderRadius: 9999,
        background: 'rgb(32,33,36)', color: '#fff', border: 'none',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)', cursor: 'pointer',
      }}>
        <RAKIcon name={view === 'list' ? 'map-pin' : 'list'} size={14} color="#fff" />
        {view === 'list' ? 'Map' : 'List'}
      </button>

      {filterOpen && <MFilterSheet filters={filters} setFilters={setFilters} onClose={() => setFilterOpen(false)} resultCount={filtered.length} />}
    </>
  );
}

export function MFilterChip({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      height: 32, padding: '0 12px', borderRadius: 9999, flexShrink: 0,
      border: '1px solid ' + (active ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
      background: active ? 'rgb(230,244,247)' : '#fff',
      color: active ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
      fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}>{label}</button>
  );
}

export function MFilterSheet({ filters, setFilters, onClose, resultCount }) {
  const [local, setLocal] = React.useState(filters);
  const set = (k, v) => setLocal((f) => ({ ...f, [k]: v }));
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ background: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '85%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgb(238,235,234)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ width: 36 }} />
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)' }}>Filters</span>
          <button type="button" onClick={onClose} style={{ width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <PerformIcon name="close" size={14} color="rgb(32,33,36)" />
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PerformFieldLabel>City</PerformFieldLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['All Australia', 'Sydney', 'Melbourne', 'Brisbane'].map((c) => (
                <MFilterChip key={c} label={c} active={local.city === c} onClick={() => set('city', c)} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PerformFieldLabel>Hourly rate (AUD)</PerformFieldLabel>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="number" value={local.priceMin} onChange={(e) => set('priceMin', Number(e.target.value))}
                style={{ flex: 1, height: 40, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 15, outline: 'none' }} />
              <span style={{ color: 'rgb(95,99,104)' }}>–</span>
              <input type="number" value={local.priceMax} onChange={(e) => set('priceMax', Number(e.target.value))}
                style={{ flex: 1, height: 40, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 15, outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PerformFieldLabel>Number of chefs</PerformFieldLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 6, 8].map((n) => (
                <MFilterChip key={n} label={n === 1 ? 'Any' : `${n}+`} active={local.capacity === n} onClick={() => set('capacity', n)} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PerformFieldLabel>Equipment</PerformFieldLabel>
            {RAK_EQUIPMENT_OPTIONS.map((eq) => (
              <PerformCheckbox key={eq} checked={local.equipment.includes(eq)}
                onChange={(v) => set('equipment', v ? [...local.equipment, eq] : local.equipment.filter((e) => e !== eq))}
                label={eq} />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PerformFieldLabel>Certifications</PerformFieldLabel>
            <PerformRadio name="mcert" checked={!local.cert} onChange={() => set('cert', null)} label="Any" />
            {RAK_CERT_OPTIONS.map((c) => (
              <PerformRadio key={c} name="mcert" checked={local.cert === c} onChange={() => set('cert', c)} label={c} />
            ))}
          </div>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid rgb(238,235,234)', display: 'flex', gap: 10 }}>
          <PerformButton variant="base" onClick={() => setLocal({ ...local, equipment: [], cert: null, priceMin: 40, priceMax: 120, capacity: 1 })}>Clear all</PerformButton>
          <PerformButton variant="brand" onClick={() => { setFilters(local); onClose(); }} style={{ flex: 1, justifyContent: 'center' }}>
            Show {resultCount} kitchens
          </PerformButton>
        </div>
      </div>
    </div>
  );
}

export function MChefListingCard({ kitchen, onClick }) {
  const { isSaved, toggle } = useSavedListings();
  const saved = isSaved(kitchen.id);
  return (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
      <div style={{ position: 'relative', aspectRatio: '5 / 3', borderRadius: 8, overflow: 'hidden', background: 'rgb(238,235,234)' }}>
        <img src={kitchen.photo} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <button type="button" onClick={(e) => { e.stopPropagation(); toggle(kitchen.id); }} style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(255,255,255,0.92)', borderRadius: 999, padding: 7,
          border: 'none', cursor: 'pointer', lineHeight: 0,
        }}>
          <RAKIcon name={saved ? 'heart' : 'heart-outline'} size={16} color={saved ? 'rgb(222,13,13)' : 'rgb(32,33,36)'} />
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)', lineHeight: 1.3 }}>{kitchen.name}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          <RAKIcon name="star" size={12} color="rgb(234,186,0)" />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{kitchen.rating}</span>
        </span>
      </div>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{kitchen.suburb}, {kitchen.city} · {kitchen.sqm} m² · {kitchen.capacity} chefs</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>
        <span style={{ fontWeight: 700 }}>${kitchen.hourlyRate}</span> / hour · ${kitchen.dailyRate} / day
      </span>
    </div>
  );
}

/* ============================================================
   MOBILE CHEF — LISTING DETAIL
   ============================================================ */
export function MChefListingDetail({ kitchenId, onBack, onBook }) {
  const k = RAK_KITCHENS.find((x) => x.id === kitchenId);
  const { isSaved, toggle } = useSavedListings();
  const [showAllReviews, setShowAllReviews] = React.useState(false);
  if (!k) return null;
  const saved = isSaved(k.id);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        {/* Hero photo with floating back button */}
        <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'rgb(238,235,234)' }}>
          <img src={k.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 50, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
            <RAKMobileBackButton onClick={onBack} onLight />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => toggle(k.id)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.95)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                <RAKIcon name={saved ? 'heart' : 'heart-outline'} size={16} color={saved ? 'rgb(222,13,13)' : 'rgb(32,33,36)'} />
              </button>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(32,33,36,0.7)', color: '#fff', padding: '3px 10px', borderRadius: 9999, fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>
            1 / {k.photos.length}
          </div>
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 24, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.15 }}>{k.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 6, color: 'rgb(95,99,104)', fontFamily: "'Open Sans', sans-serif", fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <RAKIcon name="star" size={12} color="rgb(234,186,0)" />
                <span style={{ fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.rating}</span> · {k.reviewCount} reviews
              </span>
              <span>{k.suburb}, {k.city}</span>
            </div>
          </div>

          <MDetailDivider />

          <MDetailKV items={[
            { label: 'Size', value: `${k.sqm} m²` },
            { label: 'Capacity', value: `${k.capacity} chefs` },
            { label: 'Hours', value: k.hours },
            { label: 'Cancellation', value: k.cancellation },
          ]} />

          <MDetailDivider />

          <div>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: 0, marginBottom: 8 }}>About</h3>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', lineHeight: 1.55, margin: 0 }}>{k.description}</p>
          </div>

          <MDetailDivider />

          <div>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: 0, marginBottom: 12 }}>Equipment & features</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {k.equipment.map((eq) => (
                <div key={eq} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PerformIcon name="check" size={12} color="rgb(0,114,152)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          <MDetailDivider />

          <div>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: 0, marginBottom: 12 }}>Certifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {k.certifications.map((c) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RAKIcon name="shield" size={16} color="rgb(0,114,152)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <MDetailDivider />

          <div>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: 0, marginBottom: 12 }}>Location</h3>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', margin: '0 0 10px' }}>{k.address}</p>
            <div style={{ position: 'relative', height: 180, borderRadius: 8, overflow: 'hidden', border: '1px solid rgb(238,235,234)' }}>
              <FakeMap kitchens={[k]} hoveredId={k.id} onHover={() => {}} onPinClick={() => {}} city={k.city} />
            </div>
          </div>

          <MDetailDivider />

          <div>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: 0, marginBottom: 12 }}>
              <RAKIcon name="star" size={14} color="rgb(234,186,0)" style={{ marginRight: 6 }} />
              {k.rating} · {k.reviewCount} reviews
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(showAllReviews ? SAMPLE_REVIEWS : SAMPLE_REVIEWS.slice(0, 2)).map((r) => <ListingReview key={r.id} review={r} />)}
            </div>
            <button type="button" onClick={() => setShowAllReviews(!showAllReviews)} style={{
              marginTop: 12, background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600,
            }}>
              {showAllReviews ? 'Show fewer reviews' : `Show all ${k.reviewCount} reviews`}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        paddingBottom: 34,
        background: '#fff',
        borderTop: '1px solid rgb(238,235,234)',
        zIndex: 5,
      }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(32,33,36)' }}>${k.hourlyRate}</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}> / hour</span>
            <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>or ${k.dailyRate} / day</div>
          </div>
          <PerformButton variant="brand" onClick={() => onBook(k.id)} style={{ height: 44, fontSize: 15, padding: '0 22px' }}>Request to book</PerformButton>
        </div>
      </div>
    </div>
  );
}

function MDetailDivider() {
  return <div style={{ borderTop: '1px solid rgb(238,235,234)' }} />;
}
function MDetailKV({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
      {items.map(({ label, value }) => (
        <div key={label}>
          <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{label}</div>
          <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   MOBILE CHEF — BOOKING FLOW (full-screen single step at a time)
   ============================================================ */
export function MChefBookingFlow({ kitchenId, onBack, onConfirm }) {
  const k = RAK_KITCHENS.find((x) => x.id === kitchenId);
  const [step, setStep] = React.useState(1);
  const [details, setDetails] = React.useState({
    date: '22 May 2026', startTime: '6:00 am', endTime: '2:00 pm',
    note: '', cardName: 'Mia Tanaka', cardNumber: '4242 4242 4242 4242', cardExpiry: '08 / 27', cardCvc: '123',
  });
  const set = (key, v) => setDetails((d) => ({ ...d, [key]: v }));
  const hours = 8;
  const subtotal = k.hourlyRate * hours;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  return (
    <>
      <RAKMobileTopBar
        leading={<RAKMobileBackButton onClick={() => step > 1 ? setStep(step - 1) : onBack()} />}
        title={`Step ${step} of 3`}
      />
      <RAKMobileScreen padBottom={false}>
        <div style={{ padding: '20px 16px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Kitchen summary card */}
          <RAKMobileCard>
            <div style={{ display: 'flex', gap: 12 }}>
              <img src={k.photo} alt="" style={{ width: 64, height: 56, borderRadius: 4, objectFit: 'cover' }} />
              <div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.name}</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k.suburb}, {k.city}</div>
              </div>
            </div>
          </RAKMobileCard>

          {step === 1 && (
            <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>When do you need the kitchen?</h2>
              <PerformField label="Date" required value={details.date} onChange={(v) => set('date', v)} width="100%" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <PerformField label="Start" required value={details.startTime} onChange={(v) => set('startTime', v)} width="100%" />
                <PerformField label="End" required value={details.endTime} onChange={(v) => set('endTime', v)} width="100%" />
              </div>
              <PerformInfoPanel tone="info">Available {k.hours.toLowerCase()}.</PerformInfoPanel>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>A message to the host</h2>
              <textarea value={details.note} onChange={(e) => set('note', e.target.value)} rows={6}
                placeholder="Tell the host what you'll be cooking and what equipment you'll use."
                style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '12px', fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>The host has 24 hours to accept or decline.</span>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Payment details</h2>
              <PerformInfoPanel tone="info">Your card is authorised now but only charged once the host accepts.</PerformInfoPanel>
              <PerformField label="Name on card" required value={details.cardName} onChange={(v) => set('cardName', v)} width="100%" />
              <PerformField label="Card number" required value={details.cardNumber} onChange={(v) => set('cardNumber', v)} width="100%" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <PerformField label="Expiry" required value={details.cardExpiry} onChange={(v) => set('cardExpiry', v)} width="100%" />
                <PerformField label="CVC" required value={details.cardCvc} onChange={(v) => set('cardCvc', v)} width="100%" />
              </div>

              <RAKMobileCard style={{ background: 'rgb(248,247,247)', border: 'none' }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)', marginBottom: 8 }}>Price details</div>
                <PricelineMobile label={`$${k.hourlyRate} × ${hours} hours`} value={`$${subtotal}`} />
                <PricelineMobile label="Service fee" value={`$${serviceFee}`} />
                <div style={{ height: 1, background: 'rgb(238,235,234)', margin: '8px 0' }} />
                <PricelineMobile label="Total (AUD)" value={`$${total}`} bold />
              </RAKMobileCard>
            </>
          )}
        </div>
      </RAKMobileScreen>

      {/* Sticky bottom CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 34, background: '#fff', borderTop: '1px solid rgb(238,235,234)', zIndex: 5 }}>
        <div style={{ padding: '12px 16px' }}>
          <PerformButton variant="brand"
            onClick={() => (step < 3 ? setStep(step + 1) : onConfirm())}
            style={{ width: '100%', height: 48, fontSize: 16, justifyContent: 'center' }}>
            {step < 3 ? 'Continue' : `Confirm booking · $${total}`}
          </PerformButton>
        </div>
      </div>
    </>
  );
}

function PricelineMobile({ label, value, bold }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      fontFamily: "'Open Sans', sans-serif", fontSize: bold ? 15 : 14,
      color: 'rgb(32,33,36)', fontWeight: bold ? 700 : 400, padding: '3px 0',
    }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

/* ============================================================
   MOBILE CHEF — MY BOOKINGS
   ============================================================ */
const TODAY = new Date().toISOString().slice(0, 10);

export function MChefBookings({ onOpenListing }) {
  const myBookings = RAK_BOOKINGS.filter((b) => b.chefId === 'chef-001');
  const [cancelledIds, setCancelledIds] = React.useState([]);
  const [cancelId, setCancelId] = React.useState(null);
  const [activeScreen, setActiveScreen] = React.useState(null); // null | { type: 'checkin'|'checkout', bookingId }
  const { effectiveStatus, isCheckedIn } = useBookingStates();

  if (activeScreen?.type === 'checkin') {
    const booking = myBookings.find((b) => b.id === activeScreen.bookingId);
    return <MChefCheckIn booking={booking} onBack={() => setActiveScreen(null)} onDone={() => setActiveScreen(null)} />;
  }
  if (activeScreen?.type === 'checkout') {
    const booking = myBookings.find((b) => b.id === activeScreen.bookingId);
    return <MChefCheckOut booking={booking} onBack={() => setActiveScreen(null)} onDone={() => setActiveScreen(null)} />;
  }

  const bookingsWithStatus = myBookings.map((b) => ({ ...b, _eff: effectiveStatus(b) }));
  const upcoming = bookingsWithStatus.filter((b) => ['confirmed', 'pending', 'in-progress'].includes(b._eff) && !cancelledIds.includes(b.id));
  const past = [
    ...bookingsWithStatus.filter((b) => ['completed', 'cancelled', 'awaiting-review', 'issue-reported'].includes(b._eff)),
    ...bookingsWithStatus.filter((b) => cancelledIds.includes(b.id)),
  ];

  // Any booking currently checked in
  const activeBooking = bookingsWithStatus.find((b) => b._eff === 'in-progress' && isCheckedIn(b.id));
  // Today's confirmed bookings eligible for check-in
  const todayConfirmed = bookingsWithStatus.filter((b) => b._eff === 'confirmed' && b.date === TODAY);

  return (
    <>
      <RAKMobileTopBar title="My bookings" />
      <RAKMobileScreen bg="rgb(248,247,247)">
        {/* Active session (checked in) */}
        {activeBooking && (
          <MChefActiveSession
            booking={activeBooking}
            onCheckOut={() => setActiveScreen({ type: 'checkout', bookingId: activeBooking.id })}
          />
        )}

        {/* Today — ready to check in */}
        {todayConfirmed.length > 0 && !activeBooking && (
          <div style={{ padding: '14px 16px 0' }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(95,99,104)', margin: '0 0 10px' }}>Today</h2>
            {todayConfirmed.map((b) => {
              const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
              return (
                <div key={b.id} style={{ background: '#fff', border: '1.5px solid rgb(0,114,152)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ background: 'linear-gradient(90deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)', padding: '6px 14px' }}>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.6 }}>Ready to check in</span>
                  </div>
                  <div style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={k?.photo} alt="" style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k?.name}</div>
                      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', marginTop: 2 }}>{b.start} – {b.end} · {b.hours} hours</div>
                    </div>
                    <PerformButton variant="brand" onClick={() => setActiveScreen({ type: 'checkin', bookingId: b.id })} style={{ height: 36, fontSize: 13, padding: '0 14px', flexShrink: 0 }}>
                      Check in
                    </PerformButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <RAKMobileSection title={`Upcoming (${upcoming.length})`}>
          {upcoming.length === 0 && (
            <div style={{ padding: '16px 0', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>No upcoming bookings.</div>
          )}
          {upcoming.map((b) => (
            <MBookingCard key={b.id} booking={b}
              effectiveStatus={b._eff}
              onClick={() => onOpenListing(b.listingId)}
              onCancel={b._eff !== 'in-progress' ? () => setCancelId(b.id) : null}
              onCheckIn={b._eff === 'confirmed' && b.date !== TODAY ? () => setActiveScreen({ type: 'checkin', bookingId: b.id }) : null}
              onCheckOut={isCheckedIn(b.id) ? () => setActiveScreen({ type: 'checkout', bookingId: b.id }) : null}
            />
          ))}
        </RAKMobileSection>

        {past.length > 0 && (
          <RAKMobileSection title={`Past (${past.length})`}>
            {past.map((b) => (
              <MBookingCard key={b.id} booking={b}
                effectiveStatus={cancelledIds.includes(b.id) ? 'cancelled' : b._eff}
                onClick={() => onOpenListing(b.listingId)}
              />
            ))}
          </RAKMobileSection>
        )}
        <div style={{ height: 24 }} />
      </RAKMobileScreen>

      {cancelId && (
        <MBookingCancelModal
          booking={myBookings.find((b) => b.id === cancelId)}
          onClose={() => setCancelId(null)}
          onConfirm={() => { setCancelledIds((c) => [...c, cancelId]); setCancelId(null); }}
        />
      )}
    </>
  );
}

function MBookingCard({ booking, effectiveStatus: effStatus, onClick, onCancel, onCheckIn, onCheckOut }) {
  const k = RAK_KITCHENS.find((x) => x.id === booking.listingId);
  const status = effStatus ?? booking.status;
  const hasActions = onCancel || onCheckIn || onCheckOut;
  return (
    <div style={{ background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8, overflow: 'hidden' }}>
      <div onClick={onClick} style={{ padding: 12, display: 'flex', gap: 12, cursor: 'pointer' }}>
        <img src={k.photo} alt="" style={{ width: 64, height: 64, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.name}</span>
            <RAKStatusChip status={status} />
          </div>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k.suburb}, {k.city}</span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)' }}>{RAK_formatDate(booking.date)} · {booking.start} – {booking.end}</span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)' }}><span style={{ fontWeight: 700 }}>${booking.total}</span> · {booking.hours} hours</span>
        </div>
      </div>
      {hasActions && (
        <div style={{ borderTop: '1px solid rgb(238,235,234)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(222,13,13)', fontWeight: 600 }}>Cancel</button>
          )}
          {onCheckIn && (
            <PerformButton variant="brand-outline" onClick={onCheckIn} style={{ height: 32, fontSize: 13, padding: '0 12px', marginLeft: 'auto' }}>Check in</PerformButton>
          )}
          {onCheckOut && (
            <PerformButton variant="brand" onClick={onCheckOut} style={{ height: 32, fontSize: 13, padding: '0 12px', marginLeft: 'auto' }}>Check out</PerformButton>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MOBILE CHEF — MESSAGES (thread list <-> thread)
   ============================================================ */
export function MMessagesView({ persona }) {
  const myId = persona === 'chef' ? 'chef-001' : 'own-001';
  const otherKey = persona === 'chef' ? 'ownerId' : 'chefId';
  const myThreads = RAK_THREADS.filter((t) => persona === 'chef' ? t.chefId === myId : t.ownerId === myId);
  const [activeId, setActiveId] = React.useState(null);
  const active = myThreads.find((t) => t.id === activeId);

  if (active) {
    return <MThread thread={active} myId={myId} onBack={() => setActiveId(null)} />;
  }

  return (
    <>
      <RAKMobileTopBar title="Messages" />
      <RAKMobileScreen>
        {myThreads.map((t) => {
          const k = RAK_KITCHENS.find((x) => x.id === t.listingId);
          const otherUser = RAK_USERS.find((u) => u.id === t[otherKey]);
          const last = t.messages[t.messages.length - 1];
          return (
            <div key={t.id} onClick={() => setActiveId(t.id)} style={{
              padding: '14px 16px', borderBottom: '1px solid rgb(238,235,234)',
              display: 'flex', gap: 12, cursor: 'pointer', background: '#fff',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {otherUser?.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherUser?.name}</span>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', flexShrink: 0 }}>{t.updatedAt.split(' ')[0].slice(5)}</span>
                </div>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k?.name}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last?.text}</span>
              </div>
            </div>
          );
        })}
      </RAKMobileScreen>
    </>
  );
}

function MThread({ thread, myId, onBack }) {
  const k = RAK_KITCHENS.find((x) => x.id === thread.listingId);
  const [messages, setMessages] = React.useState(thread.messages);
  const [draft, setDraft] = React.useState('');
  const send = () => {
    if (!draft.trim()) return;
    setMessages([...messages, { from: myId, text: draft, at: 'Just now' }]);
    setDraft('');
  };
  return (
    <>
      <RAKMobileTopBar
        leading={<RAKMobileBackButton onClick={onBack} />}
        title={<div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k?.name}</span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k?.suburb}, {k?.city}</span>
        </div>}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: 'rgb(248,247,247)' }}>
        {messages.map((m, i) => {
          const me = m.from === myId;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '78%', background: me ? 'rgb(0,114,152)' : '#fff', color: me ? '#fff' : 'rgb(32,33,36)', padding: '10px 14px', borderRadius: me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, lineHeight: 1.45 }}>{m.text}</div>
            </div>
          );
        })}
      </div>
      <div style={{ paddingBottom: 34, background: '#fff', borderTop: '1px solid rgb(238,235,234)' }}>
        <div style={{ padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Message"
            style={{ flex: 1, height: 40, borderRadius: 9999, border: '1px solid rgb(221,219,218)', padding: '0 14px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, outline: 'none' }} />
          <button type="button" onClick={send} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgb(0,114,152)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <RAKIcon name="send" size={16} color="#fff" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   MOBILE CHEF — PROFILE
   ============================================================ */
export function MChefProfile() {
  const me = RAK_USERS.find((u) => u.id === 'chef-001');
  const { docs, setDoc } = useChefCredentials();
  const [previewKey, setPreviewKey] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  const handleCredentialClick = (key) => {
    if (docs[key]) { setPreviewKey(key); return; }
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.pdf,.jpg,.jpeg,.png';
    inp.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setDoc(key, { name: file.name, sizeKb: Math.round(file.size / 1024), uploadedAt: new Date().toISOString().slice(0, 10) });
    };
    inp.click();
  };

  if (editing) return <MChefProfileEdit me={me} onBack={() => setEditing(false)} />;
  if (showSettings) return <MChefSettings onBack={() => setShowSettings(false)} />;

  return (
    <>
      <RAKMobileTopBar title="Profile" trailing={
        <button type="button" onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 0 }}>
          <RAKIcon name="edit" size={18} color="rgb(0,114,152)" />
        </button>
      } />
      <RAKMobileScreen>
        <div style={{ padding: '20px 16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: "'Varela Round', sans-serif", fontSize: 40,
          }}>{me.avatar}</div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>{me.name}</h2>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Chef · {me.specialty}</span>
          </div>
          {me.verified && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 9999, background: 'rgb(230,244,247)' }}>
              <RAKIcon name="shield" size={12} color="rgb(0,114,152)" />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(0,114,152)', fontWeight: 700 }}>Verified chef</span>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, background: 'rgb(248,247,247)', borderRadius: 8, padding: 14 }}>
            {[
              { label: 'Bookings', value: me.bookings },
              { label: 'Joined', value: 'Jun 24' },
              { label: 'Reply rate', value: '100%' },
              { label: 'Avg reply', value: '<1h' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)' }}>{s.value}</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <RAKMobileSection title="About">
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.55 }}>{me.bio}</p>
        </RAKMobileSection>

        <RAKMobileSection title="Credentials">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RAK_CHEF_CREDENTIALS.map((t) => {
              const doc = docs[t.key];
              const onFile = !!doc;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => handleCredentialClick(t.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: 12, width: '100%',
                    borderRadius: 6,
                    border: onFile ? '1px solid rgb(238,235,234)' : '1px dashed rgb(221,219,218)',
                    background: onFile ? '#fff' : 'rgb(248,247,247)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Open Sans', sans-serif",
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                    background: onFile ? 'rgb(220,243,228)' : 'rgb(238,235,234)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <RAKIcon
                      name={onFile ? 'shield' : 'upload'}
                      size={14}
                      color={onFile ? 'rgb(31,121,77)' : 'rgb(95,99,104)'} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)' }}>{t.title}</span>
                    {onFile ? (
                      <span style={{ fontSize: 11, color: 'rgb(95,99,104)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.name}{doc.expiresAt && <> · to {RAK_formatDate(doc.expiresAt)}</>}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: 'rgb(0,114,152)' }}>Tap to upload</span>
                    )}
                  </div>
                  {onFile && <PerformIcon name="chevron-right" size={10} color="rgb(95,99,104)" />}
                </button>
              );
            })}
          </div>
        </RAKMobileSection>

        <RAKMobileSection title="Portfolio">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {['photo-1546069901-ba9599a7e63c', 'photo-1565299624946-b28f40a0ae38', 'photo-1565958011703-44f9829ba187', 'photo-1543353071-873f17a7a088', 'photo-1556910103-1c02745aae4d', 'photo-1556909114-f6e7ad7d3136'].map((id) => (
              <div key={id} style={{ aspectRatio: '1 / 1', borderRadius: 4, overflow: 'hidden', background: 'rgb(238,235,234)' }}>
                <img src={`https://images.unsplash.com/${id}?w=300&q=80`} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </RAKMobileSection>

        <div style={{ padding: '8px 16px 24px' }}>
          <PerformButton variant="base" onClick={() => setShowSettings(true)} style={{ width: '100%', justifyContent: 'center' }}>Settings</PerformButton>
        </div>
      </RAKMobileScreen>

      {previewKey && (
        <RAKCredentialPreviewModal
          credential={RAK_CHEF_CREDENTIALS.find((t) => t.key === previewKey)}
          doc={docs[previewKey]}
          owner={me?.name}
          onClose={() => setPreviewKey(null)} />
      )}
    </>
  );
}

/* ============================================================
   MOBILE CHEF — PROFILE EDIT
   ============================================================ */
function MChefProfileEdit({ me, onBack }) {
  const [name, setName] = React.useState(me.name);
  const [specialty, setSpecialty] = React.useState(me.specialty);
  const [bio, setBio] = React.useState(me.bio);
  const [savedMsg, setSavedMsg] = React.useState(false);

  const handleSave = () => {
    try { localStorage.setItem('rak_chef_profile', JSON.stringify({ name, specialty, bio })); } catch (_) {}
    setSavedMsg(true);
    setTimeout(() => { setSavedMsg(false); onBack(); }, 900);
  };

  return (
    <>
      <RAKMobileTopBar
        leading={<RAKMobileBackButton onClick={onBack} />}
        title="Edit profile"
        trailing={
          <button type="button" onClick={handleSave} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
            color: savedMsg ? 'rgb(31,121,77)' : 'rgb(0,114,152)',
          }}>
            {savedMsg ? 'Saved ✓' : 'Save'}
          </button>
        }
      />
      <RAKMobileScreen>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: "'Varela Round', sans-serif", fontSize: 32,
            }}>{me.avatar}</div>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(0,114,152)', fontWeight: 600 }}>
              Change photo
            </button>
          </div>
          <PerformField label="Full name" required width="100%" value={name} onChange={setName} />
          <PerformField label="Specialty" width="100%" value={specialty} onChange={setSpecialty} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <PerformFieldLabel>About you</PerformFieldLabel>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5}
              style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, boxSizing: 'border-box', outline: 'none', resize: 'vertical', color: 'rgb(32,33,36)' }} />
          </div>
        </div>
      </RAKMobileScreen>
    </>
  );
}

/* ============================================================
   MOBILE CHEF — SETTINGS
   ============================================================ */
function MChefSettings({ onBack }) {
  const [notifs, setNotifs] = React.useState({ bookingUpdates: true, messages: true, marketing: false });
  const toggle = (k) => setNotifs((n) => ({ ...n, [k]: !n[k] }));

  return (
    <>
      <RAKMobileTopBar leading={<RAKMobileBackButton onClick={onBack} />} title="Settings" />
      <RAKMobileScreen bg="rgb(248,247,247)">
        <RAKMobileSection title="Notifications">
          {[
            { key: 'bookingUpdates', label: 'Booking updates', sub: 'Confirmations, cancellations, reminders' },
            { key: 'messages', label: 'New messages', sub: 'When a kitchen owner replies' },
            { key: 'marketing', label: 'Tips & promotions', sub: 'News about new kitchens near you' },
          ].map((item) => (
            <div key={item.key} style={{ background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, color: 'rgb(32,33,36)' }}>{item.label}</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{item.sub}</div>
              </div>
              <button type="button" onClick={() => toggle(item.key)} style={{
                width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', flexShrink: 0,
                padding: 0, position: 'relative', transition: 'background 150ms',
                background: notifs[item.key] ? 'rgb(0,114,152)' : 'rgb(221,219,218)',
              }}>
                <span style={{
                  position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%',
                  background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 150ms',
                  left: notifs[item.key] ? 21 : 3,
                }} />
              </button>
            </div>
          ))}
        </RAKMobileSection>

        <RAKMobileSection title="Account">
          {[
            { label: 'Change password', icon: 'lock' },
            { label: 'Payment methods', icon: 'credit-card' },
            { label: 'Privacy settings', icon: 'shield' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <RAKIcon name={item.icon} size={16} color="rgb(95,99,104)" />
              <span style={{ flex: 1, fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', fontWeight: 600 }}>{item.label}</span>
              <PerformIcon name="chevron-right" size={10} color="rgb(95,99,104)" />
            </div>
          ))}
        </RAKMobileSection>

        <div style={{ padding: '8px 16px 24px' }}>
          <PerformButton variant="base" style={{ width: '100%', justifyContent: 'center', color: 'rgb(222,13,13)' }}>Delete account</PerformButton>
        </div>
      </RAKMobileScreen>
    </>
  );
}

/* ============================================================
   MOBILE CHEF — CANCEL BOOKING MODAL
   ============================================================ */
function MBookingCancelModal({ booking, onClose, onConfirm }) {
  const k = RAK_KITCHENS.find((x) => x.id === booking.listingId);
  const isFree = booking.status === 'pending';
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ background: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(32,33,36)', margin: '0 0 6px' }}>Cancel booking?</h3>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.5 }}>
            {k?.name} · {RAK_formatDate(booking.date)} · {booking.start}–{booking.end}
          </p>
        </div>
        {isFree
          ? <PerformInfoPanel tone="info">This booking hasn't been accepted yet — cancellation is free.</PerformInfoPanel>
          : <PerformInfoPanel tone="warning">Cancellations after host approval may incur a fee per the {k?.cancellation} policy.</PerformInfoPanel>
        }
        <div style={{ display: 'flex', gap: 10 }}>
          <PerformButton variant="base" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Keep booking</PerformButton>
          <PerformButton variant="destructive" onClick={onConfirm} style={{ flex: 1, justifyContent: 'center' }}>Yes, cancel</PerformButton>
        </div>
      </div>
    </div>
  );
}
