// Rent a kitchen — CHEF views
// Onboarding, browse, listing detail, booking, profile, bookings, messages.

import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformRadio, PerformCheckbox, PerformSelect, PerformFieldLabel } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { RAKIcon, RAK_ICON_PATHS } from './icons';
import { RAK_KITCHENS, RAK_USERS, RAK_BOOKINGS, RAK_THREADS, RAK_lookup } from './data';
import { RAK_formatDate, RAKPageFrame, RAKPageHeader, RAKStatusChip, RAKConfirmModal, RAKShareModal, RAKKpiTile, rakGetSaved, rakSetSaved, rakToggleSaved, useSavedListings } from './shell';

/* ============================================================
   CHEF — SIGN UP / ONBOARDING (3 steps)
   ============================================================ */
export function ChefSignup({ onComplete }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    name: '', email: '', password: '',
    specialty: '', city: '', businessName: '',
    foodSafety: false, abn: '',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const stepLabel = ['Account', 'About you', 'Verification'];
  return (
    <RAKPageFrame>
      <div style={{
        maxWidth: 720, margin: '40px auto 80px', padding: '0 40px',
        display: 'flex', flexDirection: 'column', gap: 32,
      }}>
        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 39, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>
            Find a kitchen. Cook anywhere.
          </h1>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(95,99,104)', maxWidth: 560 }}>
            Book commercial kitchen space by the hour or day across Sydney and Melbourne. Free to join, no monthly fees.
          </span>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {stepLabel.map((label, i) => (
            <React.Fragment key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i + 1 < step ? 'rgb(0,114,152)' : i + 1 === step ? '#fff' : '#fff',
                  border: i + 1 === step ? '2px solid rgb(0,114,152)' : i + 1 < step ? 'none' : '2px solid rgb(190,191,193)',
                  color: i + 1 < step ? '#fff' : i + 1 === step ? 'rgb(0,114,152)' : 'rgb(147,149,151)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700,
                }}>{i + 1 < step ? <PerformIcon name="check" size={12} color="#fff" /> : i + 1}</span>
                <span style={{
                  fontFamily: "'Open Sans', sans-serif", fontSize: 14,
                  color: i + 1 === step ? 'rgb(32,33,36)' : 'rgb(95,99,104)',
                  fontWeight: i + 1 === step ? 700 : 400,
                }}>{label}</span>
              </div>
              {i < stepLabel.length - 1 && (
                <div style={{ flex: 1, height: 1, background: 'rgb(221,219,218)', margin: '0 16px' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1px solid rgb(190,191,193)',
          borderRadius: 5,
          padding: 32,
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0 }}>Create your chef account</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                <PerformField label="Full name" placeholder="Mia Tanaka" required width="100%" value={form.name} onChange={(v) => set('name', v)} />
                <PerformField label="Email" placeholder="you@cookmail.com.au" required width="100%" value={form.email} onChange={(v) => set('email', v)} />
                <PerformField label="Password" placeholder="At least 12 characters" required width="100%" type="password" value={form.password} onChange={(v) => set('password', v)} helper="Minimum 12 characters with one number." />
                <PerformSelect label="Based in" required value={form.city} onChange={(v) => set('city', v)} width="100%" options={['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0 }}>Tell us about your work</h2>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>This helps kitchen owners get to know you and decide quickly on booking requests.</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                <PerformSelect label="Cuisine or specialty" required value={form.specialty} onChange={(v) => set('specialty', v)} width="100%" options={['Modern Japanese', 'Italian', 'Indian', 'South-East Asian', 'Pâtisserie & viennoiserie', 'BBQ & smoked meats', 'Vegan / plant-based', 'Wholesale baking', 'Catering & events', 'Other']} />
                <PerformField label="Business name (optional)" placeholder="Mia's Omakase" width="100%" value={form.businessName} onChange={(v) => set('businessName', v)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <PerformFieldLabel>Short bio</PerformFieldLabel>
                <textarea
                  placeholder="Pop-up chef running monthly omakase nights across Sydney."
                  rows={4}
                  style={{
                    width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)',
                    padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 16,
                    color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none',
                  }}
                />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0 }}>Verify your credentials</h2>
              <PerformInfoPanel tone="info">
                Verification helps kitchen owners trust you. You can browse listings without verifying — but most owners only accept bookings from verified chefs.
              </PerformInfoPanel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                <PerformField label="ABN (optional)" placeholder="51 824 753 556" width="100%" value={form.abn} onChange={(v) => set('abn', v)} helper="If you have a registered business." />
              </div>
              <PerformCheckbox checked={form.foodSafety} onChange={(v) => set('foodSafety', v)} label="I hold a current Food Safety Supervisor certificate" />
              <div style={{
                padding: '20px', border: '1px dashed rgb(221,219,218)', borderRadius: 4,
                display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center',
                background: 'rgb(248,247,247)',
              }}>
                <RAKIcon name="camera" size={28} color="rgb(95,99,104)" />
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)' }}>Drop your certificate here, or <span style={{ color: 'rgb(0,145,179)', cursor: 'pointer' }}>browse</span></span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>PDF or image up to 10 MB</span>
              </div>
            </>
          )}
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {step > 1
            ? <PerformButton variant="base" onClick={() => setStep(step - 1)}>Back</PerformButton>
            : <span />}
          {step < 3
            ? <PerformButton variant="brand" onClick={() => setStep(step + 1)}>Continue</PerformButton>
            : <PerformButton variant="brand" onClick={onComplete}>Create account</PerformButton>}
        </div>
      </div>
    </RAKPageFrame>
  );
}

/* ============================================================
   CHEF — BROWSE (split: filter+list left, map right)
   ============================================================ */
export const RAK_EQUIPMENT_OPTIONS = ['Commercial oven', 'Combi oven', 'Walk-in cool room', 'Char grill', 'Gas range', 'Induction range', 'Blast chiller', 'Deck oven', 'Smoker'];
export const RAK_CERT_OPTIONS = ['NSW Food Authority licensed', 'Victoria Class 2 registered', 'HACCP compliant', 'Halal-friendly fitout', 'Certified plant-only kitchen', 'Kosher certified'];

export function ChefBrowse({ filters, setFilters, onOpenListing }) {
  const [hoveredId, setHoveredId] = React.useState(null);
  const saved = useSavedListings();

  const filtered = RAK_KITCHENS.filter((k) => k.status === 'active').filter((k) => {
    if (filters.savedOnly && !saved.isSaved(k.id)) return false;
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
    <RAKPageFrame padding={0} scroll={false}>
      <ChefBrowseFilterBar filters={filters} setFilters={setFilters} resultCount={filtered.length} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Filter list column */}
        <div style={{
          width: '58%', overflowY: 'auto', borderRight: '1px solid rgb(238,235,234)',
          padding: '20px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20,
          alignContent: 'start',
        }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', color: 'rgb(95,99,104)', fontFamily: "'Open Sans', sans-serif", fontSize: 16 }}>
              {filters.savedOnly
                ? (saved.count === 0
                    ? "You haven't saved any kitchens yet. Tap the heart on a listing to add it here."
                    : 'None of your saved kitchens match the current filters.')
                : 'No kitchens match those filters. Try clearing one.'}
            </div>
          )}
          {filtered.map((k) => (
            <ChefListingCard
              key={k.id}
              kitchen={k}
              hovered={hoveredId === k.id}
              onHover={(h) => setHoveredId(h ? k.id : null)}
              onClick={() => onOpenListing(k.id)}
            />
          ))}
        </div>

        {/* Map column */}
        <div style={{ width: '42%', position: 'relative', overflow: 'hidden' }}>
          <FakeMap
            kitchens={filtered}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onPinClick={onOpenListing}
            city={filters.city}
          />
        </div>
      </div>
    </RAKPageFrame>
  );
}

function ChefBrowseFilterBar({ filters, setFilters, resultCount }) {
  const update = (k, v) => setFilters({ ...filters, [k]: v });
  const saved = useSavedListings();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 24px', borderBottom: '1px solid rgb(238,235,234)',
      flexShrink: 0,
    }}>
      {/* Search */}
      <div style={{
        flex: '0 0 320px', height: 38, borderRadius: 4,
        border: '1px solid rgb(221,219,218)', background: '#fff',
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
      }}>
        <RAKIcon name="search" size={16} color="rgb(95,99,104)" />
        <input
          value={filters.query}
          onChange={(e) => update('query', e.target.value)}
          placeholder="Suburb or kitchen name"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)',
          }}
        />
      </div>

      <PerformSelect value={filters.city} onChange={(v) => update('city', v)} options={['All Australia', 'Sydney', 'Melbourne', 'Brisbane', 'Canberra']} width={150} />

      <button
        type="button"
        onClick={() => update('savedOnly', !filters.savedOnly)}
        style={{
          height: 38, padding: '0 14px', borderRadius: 4, cursor: 'pointer',
          border: `1px solid ${filters.savedOnly ? 'rgb(0,114,152)' : 'rgb(221,219,218)'}`,
          background: filters.savedOnly ? 'rgb(230,244,247)' : '#fff',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: "'Open Sans', sans-serif", fontSize: 14,
          color: filters.savedOnly ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
          fontWeight: filters.savedOnly ? 700 : 400,
        }}>
        <RAKIcon
          name={filters.savedOnly ? 'heart' : 'heart-outline'}
          size={14}
          color={filters.savedOnly ? 'rgb(222,13,13)' : 'rgb(95,99,104)'} />
        Saved
        <span style={{
          display: 'inline-flex', minWidth: 20, height: 18, padding: '0 6px',
          alignItems: 'center', justifyContent: 'center',
          background: filters.savedOnly ? '#fff' : 'rgb(238,235,234)',
          color: filters.savedOnly ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
          borderRadius: 9999, fontSize: 11, fontWeight: 700,
        }}>{saved.count}</span>
      </button>

      <RAKDropdownChip label={filters.dates || 'Dates'} icon="calendar">
        <RAKDatePicker
          value={filters.dates}
          selectedDays={filters.dateDays || []}
          onPick={(label, days) => setFilters({ ...filters, dates: label, dateDays: days || [] })}
        />
      </RAKDropdownChip>

      <RAKDropdownChip label={`$${filters.priceMin} – $${filters.priceMax}/hr`} icon="dollar">
        <RAKPriceRange filters={filters} update={update} />
      </RAKDropdownChip>

      <RAKDropdownChip label={filters.capacity > 1 ? `${filters.capacity}+ chefs` : 'Capacity'} icon="cooking">
        <div style={{ padding: 16, width: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PerformFieldLabel>Minimum number of chefs</PerformFieldLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 6, 8].map((n) => (
              <button key={n} type="button" onClick={() => update('capacity', n)}
                style={{
                  flex: 1, height: 36, borderRadius: 4, cursor: 'pointer',
                  border: filters.capacity === n ? '1px solid rgb(0,114,152)' : '1px solid rgb(221,219,218)',
                  background: filters.capacity === n ? 'rgb(230,244,247)' : '#fff',
                  fontFamily: "'Open Sans', sans-serif", fontSize: 14,
                  color: filters.capacity === n ? 'rgb(0,114,152)' : 'rgb(32,33,36)', fontWeight: 600,
                }}>{n}</button>
            ))}
          </div>
        </div>
      </RAKDropdownChip>

      <RAKDropdownChip label={filters.equipment.length ? `${filters.equipment.length} equipment` : 'Equipment'} icon="filter">
        <div style={{ padding: 16, width: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RAK_EQUIPMENT_OPTIONS.map((eq) => (
            <PerformCheckbox key={eq} checked={filters.equipment.includes(eq)}
              onChange={(v) => update('equipment', v ? [...filters.equipment, eq] : filters.equipment.filter((e) => e !== eq))}
              label={eq} />
          ))}
        </div>
      </RAKDropdownChip>

      <RAKDropdownChip label={filters.cert || 'Certifications'} icon="shield">
        <div style={{ padding: 16, width: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PerformRadio name="cert" checked={!filters.cert} onChange={() => update('cert', null)} label="Any" />
          {RAK_CERT_OPTIONS.map((c) => (
            <PerformRadio key={c} name="cert" checked={filters.cert === c} onChange={() => update('cert', c)} label={c} />
          ))}
        </div>
      </RAKDropdownChip>

      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>{resultCount} kitchens</span>
    </div>
  );
}

export function RAKDropdownChip({ label, icon, children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          height: 38, padding: '0 14px', borderRadius: 4,
          border: `1px solid ${open ? 'rgb(0,114,152)' : 'rgb(221,219,218)'}`,
          background: '#fff', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)',
        }}
      >
        <RAKIcon name={icon} size={14} color="rgb(95,99,104)" />
        {label}
        <PerformIcon name="chevron-down" size={10} color="rgb(95,99,104)" />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 6,
            background: '#fff', border: '1px solid rgb(221,219,218)', borderRadius: 4,
            boxShadow: '0 2px 6px rgba(0,0,0,0.16)', zIndex: 31, overflow: 'hidden', minWidth: 200,
          }}>{children}</div>
        </>
      )}
    </div>
  );
}

function RAKPriceRange({ filters, update }) {
  return (
    <div style={{ padding: 16, width: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <PerformFieldLabel>Hourly rate (AUD)</PerformFieldLabel>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="number" value={filters.priceMin} onChange={(e) => update('priceMin', Number(e.target.value))}
          style={{ width: 90, height: 36, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 15, outline: 'none' }} />
        <span style={{ color: 'rgb(95,99,104)' }}>–</span>
        <input type="number" value={filters.priceMax} onChange={(e) => update('priceMax', Number(e.target.value))}
          style={{ width: 90, height: 36, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 15, outline: 'none' }} />
      </div>
      <input type="range" min={0} max={200} value={filters.priceMax} onChange={(e) => update('priceMax', Number(e.target.value))}
        style={{ width: '100%', accentColor: 'rgb(0,114,152)' }} />
    </div>
  );
}

function RAKDatePicker({ value, selectedDays, onPick }) {
  // Mode is inferred from current state: if a flexible label is set, start in flexible; otherwise specific.
  const FLEXIBLE_LABELS = ['This week', 'Next week', 'Next 2 weeks', 'This month', 'Flexible'];
  const initialMode = value && FLEXIBLE_LABELS.includes(value) ? 'flexible' : 'specific';
  const [mode, setMode] = React.useState(initialMode);
  const [viewMonth, setViewMonth] = React.useState(() => {
    const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const toggleBtn = (m, label) => (
    <button type="button" onClick={() => setMode(m)}
      style={{
        flex: 1, height: 32, borderRadius: 4, cursor: 'pointer',
        border: 'none',
        background: mode === m ? '#fff' : 'transparent',
        boxShadow: mode === m ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
        fontFamily: "'Open Sans', sans-serif", fontSize: 13,
        color: mode === m ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
        fontWeight: mode === m ? 700 : 600,
      }}>{label}</button>
  );

  const header = (
    <div style={{
      display: 'flex', padding: 4, background: 'rgb(245,243,242)',
      borderRadius: 4, gap: 4,
    }}>
      {toggleBtn('specific', 'Specific dates')}
      {toggleBtn('flexible', 'Flexible')}
    </div>
  );

  return (
    <div style={{ padding: 16, width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {header}
      {mode === 'specific'
        ? <RAKSpecificDates viewMonth={viewMonth} setViewMonth={setViewMonth} selectedDays={selectedDays} onPick={onPick} />
        : <RAKFlexibleDates selected={value} flexLabels={FLEXIBLE_LABELS} onPick={onPick} />}
    </div>
  );
}

function RAKFlexibleDates({ selected, flexLabels, onPick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <PerformFieldLabel>Pick a suggestion</PerformFieldLabel>
      {flexLabels.map((label) => {
        const isSel = selected === label;
        return (
          <div key={label} onClick={() => onPick(label, [])}
            onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = 'rgb(230,244,247)'; }}
            onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
            style={{
              padding: '10px 12px', cursor: 'pointer', borderRadius: 4,
              fontFamily: "'Open Sans', sans-serif", fontSize: 14,
              color: isSel ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
              background: isSel ? 'rgb(230,244,247)' : 'transparent',
              fontWeight: isSel ? 600 : 400,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
            <span>{label}</span>
            {isSel && <PerformIcon name="check" size={12} color="rgb(0,114,152)" />}
          </div>
        );
      })}
    </div>
  );
}

function RAKSpecificDates({ viewMonth, setViewMonth, selectedDays, onPick }) {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEK = ['M','T','W','T','F','S','S'];
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Make Monday the first column
  const startOffset = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();
  const key = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isSelected = (d) => selectedDays.includes(key(d));

  const labelFor = (days) => {
    if (!days.length) return null;
    if (days.length === 1) {
      const [y, m, d] = days[0].split('-').map(Number);
      return `${MONTHS[m - 1].slice(0, 3)} ${d}`;
    }
    return `${days.length} dates`;
  };

  const toggleDay = (d) => {
    const k = key(d);
    const next = selectedDays.includes(k)
      ? selectedDays.filter((x) => x !== k)
      : [...selectedDays, k].sort();
    onPick(labelFor(next), next);
  };

  const clear = () => onPick(null, []);

  const goMonth = (delta) => setViewMonth(new Date(year, month + delta, 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button type="button" onClick={() => goMonth(-1)} style={navBtn}>
          <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
            <PerformIcon name="chevron-right" size={10} color="rgb(32,33,36)" />
          </span>
        </button>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>{MONTHS[month]} {year}</span>
        <button type="button" onClick={() => goMonth(1)} style={navBtn}>
          <PerformIcon name="chevron-right" size={10} color="rgb(32,33,36)" />
        </button>
      </div>

      {/* Weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {WEEK.map((w, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', fontWeight: 600, padding: '4px 0' }}>{w}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const sel = isSelected(d);
          const isToday = key(d) === todayStr;
          return (
            <button key={i} type="button" onClick={() => toggleDay(d)}
              style={{
                height: 36, borderRadius: 4, cursor: 'pointer',
                border: isToday && !sel ? '1px solid rgb(0,114,152)' : '1px solid transparent',
                background: sel ? 'rgb(0,114,152)' : 'transparent',
                color: sel ? '#fff' : 'rgb(32,33,36)',
                fontFamily: "'Open Sans', sans-serif", fontSize: 13,
                fontWeight: sel ? 700 : 400,
                padding: 0,
              }}
              onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = 'rgb(245,243,242)'; }}
              onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = 'transparent'; }}>
              {d}
            </button>
          );
        })}
      </div>

      {/* Footer hint + clear */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 6, borderTop: '1px solid rgb(238,235,234)',
      }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>
          {selectedDays.length ? `${selectedDays.length} selected — tap to toggle` : 'Tap any day. Pick multiple.'}
        </span>
        {selectedDays.length > 0 && (
          <button type="button" onClick={clear}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(0,114,152)', fontWeight: 600,
              padding: 0,
            }}>Clear</button>
        )}
      </div>
    </div>
  );
}

const navBtn = {
  width: 28, height: 28, borderRadius: 4, cursor: 'pointer',
  border: '1px solid rgb(221,219,218)', background: '#fff',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};

export function ChefListingCard({ kitchen, hovered, onHover, onClick }) {
  const saved = useSavedListings();
  const isSaved = saved.isSaved(kitchen.id);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        cursor: 'pointer',
        border: '1px solid ' + (hovered ? 'rgb(0,114,152)' : 'transparent'),
        borderRadius: 5, padding: 8, margin: -8,
        transition: 'border-color 120ms',
      }}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '4 / 3',
        background: 'rgb(238,235,234)', borderRadius: 4, overflow: 'hidden',
      }}>
        <img src={kitchen.photo} alt={kitchen.name} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); saved.toggle(kitchen.id); }}
          aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(255,255,255,0.92)', borderRadius: 999,
            padding: 6, display: 'inline-flex',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          }}>
          <RAKIcon
            name={isSaved ? 'heart' : 'heart-outline'}
            size={16}
            color={isSaved ? 'rgb(222,13,13)' : 'rgb(32,33,36)'} />
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)', lineHeight: 1.3 }}>{kitchen.name}</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          <RAKIcon name="star" size={12} color="rgb(234,186,0)" />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{kitchen.rating}</span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>({kitchen.reviewCount})</span>
        </div>
      </div>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{kitchen.suburb}, {kitchen.city}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{kitchen.sqm} m² · {kitchen.capacity} chefs</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)' }}>
        <span style={{ fontWeight: 700 }}>${kitchen.hourlyRate}</span> / hour <span style={{ color: 'rgb(95,99,104)' }}>· ${kitchen.dailyRate} / day</span>
      </span>
    </div>
  );
}

/* ---- Fake map: stylised street grid with pins ---- */
export function FakeMap({ kitchens, hoveredId, onHover, onPinClick, city }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #E9F0F2 0%, #DDEAEE 100%)',
      overflow: 'hidden',
    }}>
      {/* roads */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="map-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        {/* big diagonal roads */}
        <path d="M -50 200 L 700 -50" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M -50 350 L 700 100" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M 100 -50 L 400 600" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M 250 -50 L 550 600" stroke="#FFFFFF" strokeWidth="3" />
        {/* park */}
        <rect x="60" y="240" width="120" height="90" fill="#C9E0CC" rx="4" />
        <rect x="350" y="380" width="100" height="70" fill="#C9E0CC" rx="4" />
        {/* water */}
        <path d="M 400 0 Q 460 80 420 160 Q 380 220 460 280 L 700 280 L 700 0 Z" fill="#BFD9E6" />
      </svg>

      {/* labels */}
      {(() => {
        const LABELS = {
          Sydney: ['Hyde Park', 'Sydney Harbour'],
          Melbourne: ['Carlton', 'Yarra River'],
          Brisbane: ['South Bank', 'Brisbane River'],
          Canberra: ['Commonwealth Park', 'Lake Burley Griffin'],
        };
        const [a, b] = LABELS[city] || ['City Centre', 'Waterfront'];
        return (
          <React.Fragment>
            <span style={{ position: 'absolute', left: '14%', top: '38%', fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 1 }}>{a}</span>
            <span style={{ position: 'absolute', left: '70%', top: '8%', fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 1 }}>{b}</span>
          </React.Fragment>
        );
      })()}

      {/* pins */}
      {kitchens.map((k) => (
        <FakeMapPin
          key={k.id}
          kitchen={k}
          hovered={hoveredId === k.id}
          onHover={onHover}
          onClick={() => onPinClick(k.id)}
        />
      ))}

      {/* map controls */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        display: 'flex', flexDirection: 'column',
        background: '#fff', border: '1px solid rgb(221,219,218)', borderRadius: 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}>
        <button type="button" style={{ width: 36, height: 36, border: 'none', background: '#fff', cursor: 'pointer', borderBottom: '1px solid rgb(238,235,234)' }}>
          <RAKIcon name="plus" size={16} color="rgb(32,33,36)" />
        </button>
        <button type="button" style={{ width: 36, height: 36, border: 'none', background: '#fff', cursor: 'pointer' }}>
          <RAKIcon name="minus" size={16} color="rgb(32,33,36)" />
        </button>
      </div>
    </div>
  );
}

function FakeMapPin({ kitchen, hovered, onHover, onClick }) {
  return (
    <div
      onMouseEnter={() => onHover(kitchen.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${kitchen.lng}%`, top: `${kitchen.lat}%`,
        transform: 'translate(-50%, -100%)',
        cursor: 'pointer', zIndex: hovered ? 5 : 1,
      }}
    >
      <div style={{
        background: hovered ? 'rgb(0,114,152)' : '#fff',
        color: hovered ? '#fff' : 'rgb(0,114,152)',
        border: '2px solid rgb(0,114,152)',
        borderRadius: 9999,
        padding: '4px 10px',
        fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700,
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        whiteSpace: 'nowrap',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 120ms',
      }}>
        ${kitchen.hourlyRate}
      </div>
    </div>
  );
}
