// Rent a kitchen — KITCHEN OWNER views.
// Owner sign-up / list your kitchen, dashboard, listing editor, requests, messages.

import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformRadio, PerformCheckbox, PerformSelect, PerformFieldLabel } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { PerformTable } from '../components/PerformTable';
import { RAKIcon, RAK_ICON_PATHS } from './icons';
import { RAK_KITCHENS, RAK_USERS, RAK_BOOKINGS, RAK_lookup } from './data';
import { RAK_formatDate, RAKPageFrame, RAKPageHeader, RAKStatusChip, RAKConfirmModal, RAKKpiTile, RAKBlockDatesModal, RAKPauseListingModal } from './shell';

/* ============================================================
   OWNER — LIST YOUR KITCHEN ONBOARDING (4 steps)
   ============================================================ */
export function OwnerSignup({ onComplete }) {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    name: '', email: '', business: '', abn: '',
    listingName: '', address: '', suburb: '', state: 'NSW', sqm: '', capacity: '',
    description: '',
    equipment: [], certs: [],
    hourly: '', daily: ''
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const stepLabel = ['Your business', 'Kitchen basics', 'Equipment & rules', 'Pricing'];

  return (
    <RAKPageFrame>
      <div style={{ maxWidth: 800, margin: '40px auto 80px', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 39, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>List your kitchen</h1>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(95,99,104)' }}>
            It takes about 15 minutes. Your listing is reviewed by our team before going live.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {stepLabel.map((label, i) =>
          <React.Fragment key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i + 1 < step ? 'rgb(0,114,152)' : '#fff',
                border: i + 1 === step ? '2px solid rgb(0,114,152)' : i + 1 < step ? 'none' : '2px solid rgb(190,191,193)',
                color: i + 1 < step ? '#fff' : i + 1 === step ? 'rgb(0,114,152)' : 'rgb(147,149,151)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700
              }}>{i + 1 < step ? <PerformIcon name="check" size={12} color="#fff" /> : i + 1}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: i + 1 === step ? 'rgb(32,33,36)' : 'rgb(95,99,104)', fontWeight: i + 1 === step ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < stepLabel.length - 1 &&
            <div style={{ flex: 1, height: 1, background: 'rgb(221,219,218)', margin: '0 14px' }} />
            }
            </React.Fragment>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {step === 1 &&
          <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0 }}>Tell us about your business</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                <PerformField label="Your name" required width="100%" value={form.name} onChange={(v) => set('name', v)} placeholder="Eleanor Kwan" />
                <PerformField label="Contact email" required width="100%" value={form.email} onChange={(v) => set('email', v)} placeholder="eleanor@carriageworks.org.au" />
                <PerformField label="Business / venue name" required width="100%" value={form.business} onChange={(v) => set('business', v)} placeholder="Carriageworks Foundation" />
                <PerformField label="ABN" required width="100%" value={form.abn} onChange={(v) => set('abn', v)} placeholder="12 345 678 901" />
              </div>
            </>
          }

          {step === 2 &&
          <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0 }}>Kitchen basics</h2>
              <PerformField label="Listing name" required width="100%" value={form.listingName} onChange={(v) => set('listingName', v)} placeholder="The Carriageworks Commercial Kitchen" helper="This is the title chefs see when they search." />
              <PerformField label="Street address" required width="100%" value={form.address} onChange={(v) => set('address', v)} placeholder="245 Wilson St" />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px 28px' }}>
                <PerformField label="Suburb" required width="100%" value={form.suburb} onChange={(v) => set('suburb', v)} placeholder="Eveleigh" />
                <PerformSelect label="State" required value={form.state} onChange={(v) => set('state', v)} width="100%" options={['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT', 'TAS', 'NT']} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                <PerformField label="Floor area" required width="100%" value={form.sqm} onChange={(v) => set('sqm', v)} placeholder="64" unit="m²" />
                <PerformField label="Max chefs at once" required width="100%" value={form.capacity} onChange={(v) => set('capacity', v)} placeholder="4" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <PerformFieldLabel required>Description</PerformFieldLabel>
                <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={5}
                placeholder="A purpose-built commercial kitchen inside a creative precinct…"
                style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />

                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Highlight what's unique. Mention loading access, surrounding amenities, parking.</span>
              </div>
            </>
          }

          {step === 3 &&
          <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0 }}>Equipment & certifications</h2>
              <PerformFieldLabel>Equipment available (select all that apply)</PerformFieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                {RAK_EQUIPMENT_OPTIONS.map((eq) =>
              <PerformCheckbox key={eq} checked={form.equipment.includes(eq)}
              onChange={(v) => set('equipment', v ? [...form.equipment, eq] : form.equipment.filter((e) => e !== eq))}
              label={eq} />
              )}
              </div>
              <div style={{ height: 8 }} />
              <PerformFieldLabel>Certifications held by your venue</PerformFieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                {RAK_CERT_OPTIONS.map((c) =>
              <PerformCheckbox key={c} checked={form.certs.includes(c)}
              onChange={(v) => set('certs', v ? [...form.certs, c] : form.certs.filter((e) => e !== c))}
              label={c} />
              )}
              </div>
            </>
          }

          {step === 4 &&
          <>
              <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0 }}>Pricing</h2>
              <PerformInfoPanel tone="info">
                Most kitchens like yours charge $60–$95 per hour and offer a day rate of about 7× the hourly. You can adjust pricing at any time.
              </PerformInfoPanel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                <PerformField label="Hourly rate" required width="100%" value={form.hourly} onChange={(v) => set('hourly', v)} placeholder="85" unit="AUD/hr" />
                <PerformField label="Daily rate" required width="100%" value={form.daily} onChange={(v) => set('daily', v)} placeholder="580" unit="AUD/day" />
              </div>
              <div style={{ background: 'rgb(248,247,247)', borderRadius: 4, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>Your earnings on a typical booking</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>
                  <span>8-hour booking at ${form.hourly || 85}/hr</span>
                  <span>${(form.hourly || 85) * 8}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>
                  <span>Platform fee (15%)</span>
                  <span>−${Math.round((form.hourly || 85) * 8 * 0.15)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)', borderTop: '1px solid rgb(238,235,234)', paddingTop: 8 }}>
                  <span>You receive</span>
                  <span>${(form.hourly || 85) * 8 - Math.round((form.hourly || 85) * 8 * 0.15)}</span>
                </div>
              </div>
            </>
          }
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {step > 1 ?
          <PerformButton variant="base" onClick={() => setStep(step - 1)}>Back</PerformButton> :
          <span />}
          {step < 4 ?
          <PerformButton variant="brand" onClick={() => setStep(step + 1)}>Continue</PerformButton> :
          <PerformButton variant="brand" onClick={onComplete}>Submit listing for review</PerformButton>}
        </div>
      </div>
    </RAKPageFrame>);

}

/* ============================================================
   OWNER — DASHBOARD
   ============================================================ */
const RAK_KPI_PERIODS = [
  { key: 'week',    label: 'Previous week',    bookings: '4',  revenue: 1240, occupancy: '58%', cmp: 'vs prev. week' },
  { key: 'month',   label: 'Previous month',   bookings: '17', revenue: 6420, occupancy: '64%', cmp: 'vs prev. month' },
  { key: 'quarter', label: 'Previous quarter', bookings: '48', revenue: 18340, occupancy: '61%', cmp: 'vs prev. quarter' },
  { key: 'fy',      label: 'Previous FY',      bookings: '187', revenue: 71820, occupancy: '59%', cmp: 'vs prev. FY' },
];

export function OwnerDashboard() {
  const myListings = RAK_KITCHENS.filter((k) => k.ownerId === 'own-001');
  const myBookings = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId));
  const upcoming = myBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const monthRevenue = myBookings.filter((b) => b.status !== 'pending' && b.status !== 'cancelled').reduce((sum, b) => sum + b.total, 0);

  const [periodKey, setPeriodKey] = React.useState('month');
  const period = RAK_KPI_PERIODS.find((p) => p.key === periodKey) || RAK_KPI_PERIODS[1];

  return (
    <RAKPageFrame>
      <RAKPageHeader
        title="Hi Eleanor, here's your kitchen this week"
        subtitle="Monday 18 May – Sunday 24 May"
        right={<div style={{ display: 'flex', gap: 12 }}>
          <PerformButton variant="brand-outline">Block dates</PerformButton>
          <PerformButton variant="brand" iconLeft={<RAKIcon name="plus" size={14} color="#fff" />}>Add a listing</PerformButton>
        </div>} />


      <div style={{ padding: '24px 32px 60px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Reporting period selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)' }}>Reports</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Showing <strong>{period.label.toLowerCase()}</strong></span>
          </div>
          <div style={{
            display: 'inline-flex', padding: 4, background: 'rgb(248,247,247)',
            borderRadius: 6, gap: 2,
          }}>
            {RAK_KPI_PERIODS.map((p) => {
              const on = periodKey === p.key;
              return (
                <button key={p.key} type="button" onClick={() => setPeriodKey(p.key)}
                  style={{
                    border: 'none', cursor: 'pointer',
                    padding: '8px 14px', borderRadius: 4,
                    background: on ? '#fff' : 'transparent',
                    boxShadow: on ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    color: on ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
                    fontFamily: "'Open Sans', sans-serif", fontSize: 13,
                    fontWeight: on ? 700 : 600,
                  }}>{p.label}</button>
              );
            })}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'flex', gap: 16 }}>
          <RAKKpiTile label="Bookings" value={period.bookings} trend="+18%" trendDir="up" sub={period.cmp} />
          <RAKKpiTile label="Revenue" value={`$${period.revenue.toLocaleString()}`} trend="+24%" trendDir="up" sub={period.cmp} />
          <RAKKpiTile label="Occupancy" value={period.occupancy} trend="−4%" trendDir="down" sub={period.cmp} />
          <RAKKpiTile label="Avg. rating" value="4.9" sub="from 47 reviews" />
        </div>

        {/* Full-width calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} data-comment-anchor="152f2603b7-div-216-13">
          <OwnerCalendar />
        </div>

        {/* Two-column: requests + your listings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Upcoming bookings</h2>
            <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
              {upcoming.slice(0, 5).map((b, i) => {
                const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
                const chef = RAK_USERS.find((u) => u.id === b.chefId);
                return (
                  <div key={b.id} style={{
                    display: 'grid', gridTemplateColumns: '44px 1fr auto auto',
                    gap: 14, alignItems: 'center',
                    padding: '14px 18px',
                    borderBottom: i === upcoming.slice(0, 5).length - 1 ? 'none' : '1px solid rgb(238,235,234)'
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>{chef?.avatar}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name} · {chef?.specialty}</span>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start} – {b.end} · {b.hours}h</span>
                    </div>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>${b.total}</span>
                    <RAKStatusChip status={b.status} />
                  </div>);

              })}
            </div>
          </div>

          {/* Your listings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Your listings</h2>
            <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
              {myListings.map((k, i) =>
              <div key={k.id} style={{
                display: 'grid', gridTemplateColumns: '64px 1fr auto',
                gap: 14, alignItems: 'center', padding: '14px 18px',
                borderBottom: i === myListings.length - 1 ? 'none' : '1px solid rgb(238,235,234)'
              }}>
                  <img src={k.photo} alt="" style={{ width: 64, height: 48, borderRadius: 4, objectFit: 'cover' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.name}</span>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>${k.hourlyRate}/hr · {k.reviewCount} reviews · {k.rating} ★</span>
                  </div>
                  <RAKStatusChip status={k.status} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Revenue chart full width */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Revenue, last 6 months</h2>
          <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 20 }}>
            <OwnerRevenueChart />
          </div>
        </div>
      </div>
    </RAKPageFrame>);

}

/* ============================================================
   OWNER — FULL CALENDAR (Day / Week / Month)
   Pulls from RAK_BOOKINGS for the current owner's listings.
   ============================================================ */
export function OwnerCalendar() {
  const myListings = RAK_KITCHENS.filter((k) => k.ownerId === 'own-001');
  const myBookings = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId));

  const byDate = React.useMemo(() => {
    const m = {};
    myBookings.forEach((b) => { (m[b.date] = m[b.date] || []).push(b); });
    return m;
  }, [myBookings]);

  const [focus, setFocus] = React.useState(new Date(2026, 4, 22));
  const [view, setView] = React.useState('month');

  const monthLabel = focus.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });

  const step = (delta) => {
    const d = new Date(focus);
    if (view === 'month') d.setMonth(d.getMonth() + delta);
    else if (view === 'week') d.setDate(d.getDate() + delta * 7);
    else d.setDate(d.getDate() + delta);
    setFocus(d);
  };

  return (
    <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: '1px solid rgb(238,235,234)',
        flexWrap: 'wrap', gap: 12
      }}>
        <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1, minWidth: 180 }}>
          {view === 'day' ? focus.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            : view === 'week' ? weekRangeLabel(focus)
            : monthLabel}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" onClick={() => step(-1)} title="Previous" style={calBtn()}><RAKIcon name="arrow-left" size={14} color="rgb(32,33,36)" /></button>
          <button type="button" onClick={() => setFocus(new Date(2026, 4, 22))} style={{ ...calBtn(), padding: '0 14px', width: 'auto', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>Today</button>
          <button type="button" onClick={() => step(1)} title="Next" style={calBtn()}><RAKIcon name="arrow-right" size={14} color="rgb(32,33,36)" /></button>

          <div style={{
            display: 'inline-flex',
            background: 'rgb(248,247,247)',
            borderRadius: 4, padding: 3,
            border: '1px solid rgb(221,219,218)',
            marginLeft: 8
          }}>
            {['day', 'week', 'month'].map((v) =>
              <button key={v} type="button" onClick={() => setView(v)} style={{
                padding: '6px 14px', borderRadius: 3,
                border: 'none',
                background: view === v ? '#fff' : 'transparent',
                boxShadow: view === v ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700,
                color: view === v ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
                cursor: 'pointer', textTransform: 'capitalize'
              }}>{v}</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {view === 'month' && <CalMonth focus={focus} byDate={byDate} onSelectDay={(d) => { setFocus(d); setView('day'); }} />}
        {view === 'week' && <CalWeek focus={focus} byDate={byDate} />}
        {view === 'day' && <CalDay focus={focus} byDate={byDate} />}
      </div>
    </div>);

}

function calBtn() {
  return {
    width: 32, height: 32, borderRadius: 4,
    border: '1px solid rgb(221,219,218)',
    background: '#fff', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
  };
}

function weekRangeLabel(focus) {
  const start = startOfWeek(focus);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  return `${fmt(start)} – ${fmt(end)} ${end.toLocaleDateString('en-AU', { year: 'numeric' })}`;
}
function startOfWeek(d) {
  const x = new Date(d);
  const dow = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - dow);
  x.setHours(0, 0, 0, 0);
  return x;
}
function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const CAL_TONE = { confirmed: 'rgb(0,114,152)', 'in-progress': 'rgb(146,99,0)', pending: 'rgb(95,99,104)', completed: 'rgb(31,121,77)', cancelled: 'rgb(193,49,49)' };

function CalMonth({ focus, byDate, onSelectDay }) {
  const year = focus.getFullYear();
  const month = focus.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    const d = new Date(year, month, -startOffset + i + 1);
    cells.push({ date: d, current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i), current: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last); d.setDate(d.getDate() + 1);
    cells.push({ date: d, current: false });
    if (cells.length >= 42) break;
  }
  const today = iso(new Date(2026, 4, 21));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, paddingBottom: 8 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) =>
          <div key={d} style={{
            fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700,
            color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4,
            padding: '4px 8px'
          }}>{d}</div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {cells.map((c, i) => {
          const key = iso(c.date);
          const events = byDate[key] || [];
          const isToday = key === today;
          return (
            <div
              key={i}
              onClick={() => onSelectDay && onSelectDay(c.date)}
              style={{
                minHeight: 110,
                background: c.current ? '#fff' : 'rgb(248,247,247)',
                border: '1px solid ' + (isToday ? 'rgb(0,114,152)' : 'rgb(238,235,234)'),
                borderRadius: 4,
                padding: 8,
                display: 'flex', flexDirection: 'column', gap: 6,
                cursor: events.length > 0 || c.current ? 'pointer' : 'default',
                opacity: c.current ? 1 : 0.55
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: "'Open Sans', sans-serif", fontSize: 13,
                  fontWeight: isToday ? 700 : 600,
                  color: isToday ? 'rgb(0,114,152)' : c.current ? 'rgb(32,33,36)' : 'rgb(147,149,151)'
                }}>{c.date.getDate()}</span>
                {events.length > 0 &&
                  <span style={{
                    fontFamily: "'Open Sans', sans-serif", fontSize: 10, fontWeight: 700,
                    color: 'rgb(95,99,104)', background: 'rgb(238,235,234)',
                    padding: '1px 6px', borderRadius: 9999
                  }}>{events.length}</span>
                }
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {events.slice(0, 3).map((e) => {
                  const chef = RAK_USERS.find((u) => u.id === e.chefId);
                  const tone = CAL_TONE[e.status] || 'rgb(95,99,104)';
                  return (
                    <div key={e.id} title={`${chef?.name || ''} · ${e.start}–${e.end}`} style={{
                      padding: '3px 6px', borderRadius: 2,
                      background: e.status === 'pending' ? '#fff' : tone,
                      color: e.status === 'pending' ? 'rgb(32,33,36)' : '#fff',
                      border: e.status === 'pending' ? '1px dashed ' + tone : 'none',
                      fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 600,
                      lineHeight: 1.2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      <span style={{ opacity: 0.8, fontWeight: 400 }}>{e.start}</span> {chef?.avatar || ''}
                    </div>
                  );
                })}
                {events.length > 3 &&
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)' }}>+{events.length - 3} more</span>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>);

}

function CalWeek({ focus, byDate }) {
  const start = startOfWeek(focus);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
      {days.map((d) => {
        const key = iso(d);
        const events = byDate[key] || [];
        return (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{
              padding: '4px 8px', textAlign: 'left',
              fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700,
              color: 'rgb(32,33,36)'
            }}>
              {d.toLocaleDateString('en-AU', { weekday: 'short' })}
              <span style={{ marginLeft: 6, color: 'rgb(95,99,104)', fontWeight: 400 }}>{d.getDate()}</span>
            </div>
            <div style={{
              flex: 1, minHeight: 220, background: 'rgb(248,247,247)', borderRadius: 4,
              padding: 6, display: 'flex', flexDirection: 'column', gap: 4
            }}>
              {events.length === 0 &&
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(147,149,151)' }}>—</span>
              }
              {events.map((e) => {
                const chef = RAK_USERS.find((u) => u.id === e.chefId);
                const tone = CAL_TONE[e.status] || 'rgb(95,99,104)';
                return (
                  <div key={e.id} style={{
                    padding: '6px 8px', borderRadius: 3,
                    background: e.status === 'pending' ? '#fff' : tone,
                    color: e.status === 'pending' ? 'rgb(32,33,36)' : '#fff',
                    border: e.status === 'pending' ? '1px dashed ' + tone : 'none',
                    fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600,
                    lineHeight: 1.3, display: 'flex', flexDirection: 'column', gap: 2
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chef?.name || ''}</span>
                    <span style={{ opacity: 0.85, fontWeight: 400 }}>{e.start}–{e.end}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>);

}

function CalDay({ focus, byDate }) {
  const key = iso(focus);
  const events = byDate[key] || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {events.length === 0 &&
        <PerformInfoPanel>No bookings on this day. Click a different day in the month or week view to jump there.</PerformInfoPanel>
      }
      {events.map((e) => {
        const chef = RAK_USERS.find((u) => u.id === e.chefId);
        const k = RAK_KITCHENS.find((x) => x.id === e.listingId);
        return (
          <div key={e.id} style={{
            display: 'grid', gridTemplateColumns: '90px 1fr auto auto',
            gap: 18, alignItems: 'center',
            padding: '14px 18px',
            border: '1px solid rgb(190,191,193)', borderRadius: 5
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)' }}>{e.start}</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>to {e.end}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name || ''}</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{k?.name} · {e.hours} hours</span>
            </div>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>${e.total}</span>
            <RAKStatusChip status={e.status} />
          </div>);
      })}
    </div>);

}

function OwnerWeekView() {
  const days = ['Mon 18', 'Tue 19', 'Wed 20', 'Thu 21', 'Fri 22', 'Sat 23', 'Sun 24'];
  const events = {
    'Mon 18': [],
    'Tue 19': [{ chef: 'DO', label: 'David Okafor', hours: '6a–2p', tone: 'confirmed' }],
    'Wed 20': [],
    'Thu 21': [{ chef: 'TW', label: 'Tom Walsh', hours: '10p–6a', tone: 'in-progress' }],
    'Fri 22': [{ chef: 'MT', label: 'Mia Tanaka', hours: '6a–2p', tone: 'confirmed' }],
    'Sat 23': [],
    'Sun 24': [{ chef: 'SC', label: 'Sofia Caruso', hours: '7a–11a', tone: 'confirmed' }, { chef: 'PK', label: 'Priya K', hours: '4p–8p', tone: 'pending' }]
  };
  const toneColor = { confirmed: 'rgb(0,114,152)', 'in-progress': 'rgb(146,99,0)', pending: 'rgb(95,99,104)' };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
      {days.map((d) =>
      <div key={d} style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 110 }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{d}</span>
          <div style={{ flex: 1, background: 'rgb(248,247,247)', borderRadius: 4, padding: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {events[d].map((e, i) =>
          <div key={i} title={`${e.label} (${e.hours})`} style={{
            padding: '4px 6px', borderRadius: 2,
            background: e.tone === 'pending' ? '#fff' : toneColor[e.tone],
            color: e.tone === 'pending' ? 'rgb(32,33,36)' : '#fff',
            border: e.tone === 'pending' ? '1px dashed rgb(190,191,193)' : 'none',
            fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 600,
            lineHeight: 1.2,
            display: 'flex', flexDirection: 'column', gap: 1
          }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.chef}</span>
                <span style={{ opacity: 0.8, fontWeight: 400 }}>{e.hours}</span>
              </div>
          )}
          </div>
        </div>
      )}
    </div>);

}

export function OwnerRevenueChart() {
  const months = [
  { m: 'Dec', v: 1840 }, { m: 'Jan', v: 2520 }, { m: 'Feb', v: 2180 },
  { m: 'Mar', v: 3100 }, { m: 'Apr', v: 3340 }, { m: 'May', v: 4180 }];

  const max = Math.max(...months.map((x) => x.v));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, alignItems: 'flex-end', height: 170 }}>
        {months.map((mo) =>
        <div key={mo.m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'rgb(32,33,36)' }}>${(mo.v / 1000).toFixed(1)}k</span>
            <div style={{
            width: '70%', height: `${mo.v / max * 130}px`,
            background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
            borderRadius: '4px 4px 0 0'
          }} />
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {months.map((mo) =>
        <span key={mo.m} style={{ textAlign: 'center', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{mo.m}</span>
        )}
      </div>
    </div>);

}

/* OWNER — LISTING EDITOR moved to app/owner-listings.jsx (OwnerListings + OwnerListingDetail). */
function OwnerListingEditor_DEPRECATED() {
  const k = RAK_KITCHENS.find((x) => x.id === 'kit-001');
  const [sec, setSec] = React.useState('basics');
  const sections = [
  { id: 'basics', label: 'Basic details', state: 'complete' },
  { id: 'photos', label: 'Photos', state: 'complete' },
  { id: 'equipment', label: 'Equipment & features', state: 'complete' },
  { id: 'hours', label: 'Hours of operation', state: 'partial' },
  { id: 'pricing', label: 'Pricing', state: 'complete' },
  { id: 'rules', label: 'House rules', state: 'incomplete' }];


  return (
    <RAKPageFrame padding={0}>
      <RAKPageHeader
        title="The Carriageworks Commercial Kitchen"
        subtitle={<><RAKStatusChip status="active" /> &nbsp; Last updated 14 May 2026</>}
        right={<div style={{ display: 'flex', gap: 12 }}>
          <PerformButton variant="base">Preview as chef</PerformButton>
          <PerformButton variant="brand">Save changes</PerformButton>
        </div>} />


      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <PerformSideNav items={sections} activeId={sec} onSelect={setSec} />

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px' }}>
          {sec === 'basics' &&
          <OwnerSectionShell title="Basic details" desc="The headline information chefs see in search results.">
              <PerformField label="Listing name" required width="100%" value={k.name} onChange={() => {}} />
              <PerformField label="Street address" required width="100%" value={k.address} onChange={() => {}} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
                <PerformField label="Floor area" width="100%" value={String(k.sqm)} onChange={() => {}} unit="m²" />
                <PerformField label="Max chefs at once" width="100%" value={String(k.capacity)} onChange={() => {}} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <PerformFieldLabel required>Description</PerformFieldLabel>
                <textarea defaultValue={k.description} rows={6} style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            </OwnerSectionShell>
          }

          {sec === 'photos' &&
          <OwnerSectionShell title="Photos" desc="Drag to reorder. The first photo is your cover image.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {k.photos.map((p, i) =>
              <div key={i} style={{ aspectRatio: '4 / 3', borderRadius: 4, overflow: 'hidden', position: 'relative', background: 'rgb(238,235,234)' }}>
                    <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {i === 0 &&
                <span style={{ position: 'absolute', top: 10, left: 10, padding: '3px 10px', borderRadius: 9999, background: 'rgba(0,114,152,0.95)', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>Cover</span>
                }
                    <div style={{ position: 'absolute', top: 10, right: 10, background: '#fff', borderRadius: 4, padding: 4, cursor: 'pointer' }}>
                      <PerformIcon name="delete" size={14} color="rgb(95,99,104)" />
                    </div>
                  </div>
              )}
                <div style={{
                aspectRatio: '4 / 3', borderRadius: 4, border: '1px dashed rgb(221,219,218)',
                background: 'rgb(248,247,247)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: 'pointer'
              }}>
                  <RAKIcon name="plus" size={24} color="rgb(95,99,104)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', fontWeight: 600 }}>Add a photo</span>
                </div>
              </div>
            </OwnerSectionShell>
          }

          {sec === 'equipment' &&
          <OwnerSectionShell title="Equipment & features" desc="What chefs get when they book your kitchen.">
              <PerformFieldLabel>Equipment available</PerformFieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                {RAK_EQUIPMENT_OPTIONS.map((eq) =>
              <PerformCheckbox key={eq} checked={k.equipment.some((x) => x.toLowerCase().includes(eq.toLowerCase().split(' ')[0]))} onChange={() => {}} label={eq} />
              )}
              </div>
              <div style={{ height: 12 }} />
              <PerformFieldLabel>Certifications</PerformFieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                {RAK_CERT_OPTIONS.map((c) =>
              <PerformCheckbox key={c} checked={k.certifications.includes(c)} onChange={() => {}} label={c} />
              )}
              </div>
            </OwnerSectionShell>
          }

          {sec === 'hours' &&
          <OwnerSectionShell title="Hours of operation" desc="When your kitchen is available to be booked.">
              <PerformInfoPanel tone="info">
                You can block specific dates from the dashboard at any time.
              </PerformInfoPanel>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) =>
            <div key={d} style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr 1fr', gap: 16, alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)' }}>{d}</span>
                  <PerformCheckbox checked={d !== 'Sunday'} onChange={() => {}} label="Open" />
                  <PerformField label="" width="100%" value="05:00" onChange={() => {}} />
                  <PerformField label="" width="100%" value="23:00" onChange={() => {}} />
                </div>
            )}
            </OwnerSectionShell>
          }

          {sec === 'pricing' &&
          <OwnerSectionShell title="Pricing" desc="You can adjust at any time. Existing bookings keep their original rate.">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                <PerformField label="Hourly rate" width="100%" value="85" unit="AUD/hr" onChange={() => {}} />
                <PerformField label="Daily rate (8h+)" width="100%" value="580" unit="AUD/day" onChange={() => {}} />
                <PerformField label="Weekend surcharge (optional)" width="100%" value="15" unit="%" onChange={() => {}} />
                <PerformField label="Cleaning fee (optional)" width="100%" value="40" unit="AUD" onChange={() => {}} />
              </div>
              <PerformFieldLabel>Minimum booking length</PerformFieldLabel>
              <div style={{ display: 'flex', gap: 10 }}>
                {['2 hours', '4 hours', '6 hours', 'Full day'].map((opt, i) =>
              <button key={opt} type="button" style={{
                height: 36, padding: '0 16px', borderRadius: 4,
                border: '1px solid ' + (i === 1 ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
                background: i === 1 ? 'rgb(230,244,247)' : '#fff',
                color: i === 1 ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}>{opt}</button>
              )}
              </div>
            </OwnerSectionShell>
          }

          {sec === 'rules' &&
          <OwnerSectionShell title="House rules" desc="Things chefs need to know before they book. Required for a complete listing.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <PerformFieldLabel required>Cleaning requirements</PerformFieldLabel>
                <textarea rows={3} placeholder="What's the chef expected to do at the end of a booking?" style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <PerformFieldLabel required>Access & arrival</PerformFieldLabel>
                <textarea rows={3} placeholder="Loading dock hours, key handover, parking…" style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <PerformCheckbox checked={false} onChange={() => {}} label="No alcohol service on premises" />
              <PerformCheckbox checked={false} onChange={() => {}} label="Smoke-free venue" />
            </OwnerSectionShell>
          }
        </div>
      </div>
    </RAKPageFrame>);

}

function OwnerSectionShell({ title, desc, children }) {
  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 28, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>{title}</h2>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>{desc}</span>
      </div>
      {children}
    </div>);

}

/* ============================================================
   OWNER — BOOKING REQUESTS
   ============================================================ */
export function OwnerRequests() {
  const myListings = RAK_KITCHENS.filter((k) => k.ownerId === 'own-001');
  const requests = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId) && b.status === 'pending');
  // For demo, also include some "confirmed" recents
  const confirmed = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId) && b.status === 'confirmed').slice(0, 3);
  const declined = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId) && b.status === 'declined');

  const [openId, setOpenId] = React.useState(null);
  const [tab, setTab] = React.useState('pending'); // 'pending' | 'declined'

  if (openId) {
    return <OwnerRequestDetail bookingId={openId} onBack={() => setOpenId(null)} />;
  }

  return (
    <RAKPageFrame>
      <RAKPageHeader title="Booking requests" subtitle={tab === 'declined'
        ? 'Requests you have declined in the last 90 days. Open one to review the reason you sent.'
        : 'Pending requests for your kitchens. You have 24 hours to respond.'} />

      <div style={{ padding: '24px 32px 60px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgb(221,219,218)' }}>
          {[
            { k: 'pending',  label: 'Pending',  count: requests.length },
            { k: 'declined', label: 'Declined', count: declined.length },
          ].map((t) => {
            const active = tab === t.k;
            return (
              <button key={t.k} type="button" onClick={() => setTab(t.k)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '10px 4px', marginRight: 28,
                  borderBottom: active ? '2px solid rgb(0,114,152)' : '2px solid transparent',
                  marginBottom: -1,
                  fontFamily: "'Open Sans', sans-serif", fontSize: 15,
                  color: active ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
                  fontWeight: active ? 700 : 600,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                {t.label}
                <span style={{
                  display: 'inline-flex', minWidth: 22, height: 22, padding: '0 7px',
                  borderRadius: 9999, alignItems: 'center', justifyContent: 'center',
                  background: active ? 'rgb(230,244,247)' : 'rgb(238,235,234)',
                  color: active ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
                  fontSize: 12, fontWeight: 700,
                }}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {tab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Pending ({requests.length})</h2>
          {requests.length === 0 &&
          <PerformInfoPanel>No new booking requests. We'll email you when one comes in.</PerformInfoPanel>
          }
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {requests.map((b) => {
              const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
              const chef = RAK_USERS.find((u) => u.id === b.chefId);
              return (
                <div
                  key={b.id}
                  onClick={() => setOpenId(b.id)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(0,114,152)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(190,191,193)'; e.currentTarget.style.boxShadow = 'none'; }}
                  style={{
                    background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
                    overflow: 'hidden', cursor: 'pointer',
                    transition: 'border-color 120ms, box-shadow 120ms'
                  }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '52px 1fr auto auto auto',
                    gap: 16, alignItems: 'center', padding: '14px 18px'
                  }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>{chef?.avatar}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</span>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{chef?.specialty} · {chef?.bookings} previous bookings {chef?.verified ? '· verified' : ''}</span>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{k.name} · {RAK_formatDate(b.date)} · {b.start} – {b.end} ({b.hours}h)</span>
                    </div>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 700, color: 'rgb(32,33,36)' }}>${b.total}</span>
                    <PerformButton variant="brand-outline" onClick={(e) => { e.stopPropagation(); setOpenId(b.id); }}>View details</PerformButton>
                    <PerformIcon name="chevron-right" size={12} color="rgb(95,99,104)" />
                  </div>
                </div>);

            })}
          </div>
        </div>
        )}

        {tab === 'declined' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Declined ({declined.length})</h2>
          {declined.length === 0 &&
            <PerformInfoPanel>You haven't declined any requests in the last 90 days.</PerformInfoPanel>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {declined.map((b) => {
              const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
              const chef = RAK_USERS.find((u) => u.id === b.chefId);
              return (
                <div
                  key={b.id}
                  onClick={() => setOpenId(b.id)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(0,114,152)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(190,191,193)'; e.currentTarget.style.boxShadow = 'none'; }}
                  style={{
                    background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
                    overflow: 'hidden', cursor: 'pointer',
                    transition: 'border-color 120ms, box-shadow 120ms'
                  }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '52px 1fr auto auto auto',
                    gap: 16, alignItems: 'center', padding: '14px 18px'
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: 'rgb(238,235,234)', color: 'rgb(95,99,104)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 18
                    }}>{chef?.avatar}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</span>
                        <RAKStatusChip status="declined" />
                      </div>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{k.name} · {RAK_formatDate(b.date)} · {b.start} – {b.end} ({b.hours}h)</span>
                      <span style={{
                        fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)',
                        fontStyle: 'italic',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: 560,
                      }}>"{b.declinedReason}"</span>
                    </div>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 18, fontWeight: 700, color: 'rgb(95,99,104)', textDecoration: 'line-through' }}>${b.total}</span>
                    <PerformButton variant="brand-outline" onClick={(e) => { e.stopPropagation(); setOpenId(b.id); }}>View reason</PerformButton>
                    <PerformIcon name="chevron-right" size={12} color="rgb(95,99,104)" />
                  </div>
                </div>);
            })}
          </div>
        </div>
        )}

        {tab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Recently confirmed</h2>
          <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
            {confirmed.map((b, i) => {
              const chef = RAK_USERS.find((u) => u.id === b.chefId);
              return (
                <div key={b.id} style={{
                  display: 'grid', gridTemplateColumns: '44px 1fr auto auto',
                  gap: 14, alignItems: 'center', padding: '12px 18px',
                  borderBottom: i === confirmed.length - 1 ? 'none' : '1px solid rgb(238,235,234)'
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>{chef?.avatar}</div>
                  <div>
                    <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name} · {RAK_formatDate(b.date)}</span>
                    <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{b.start} – {b.end} · {b.hours}h</span>
                  </div>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>${b.total}</span>
                  <RAKStatusChip status={b.status} />
                </div>);

            })}
          </div>
        </div>
        )}
      </div>
    </RAKPageFrame>);

}

/* ============================================================
   OWNER — REQUEST DETAIL (full page)
   ============================================================ */
export function OwnerRequestDetail({ bookingId, onBack }) {
  const b = RAK_BOOKINGS.find((x) => x.id === bookingId);
  if (!b) return null;
  const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
  const chef = RAK_USERS.find((u) => u.id === b.chefId);
  const platformFee = Math.round(b.total * 0.15);
  const payout = b.total - platformFee;

  const note = chef?.id === 'chef-001'
    ? "I'm running a 60-person omakase event on Sunday evening. Mostly knife work and braising — I'll need the gas range, cool room, and a corner of bench space."
    : "Doing a catering job for a corporate breakfast — primarily using the combi oven and prep benches. I'll bring my own consumables.";

  return (
    <RAKPageFrame padding={0}>
      {/* Header strip */}
      <div style={{ padding: '20px 32px 18px', borderBottom: '1px solid rgb(238,235,234)' }}>
        <span onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 14, cursor: 'pointer'
        }}>
          <RAKIcon name="arrow-left" size={14} color="rgb(0,145,179)" />
          Back to requests
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700 }}>Booking request {b.id.toUpperCase()}</span>
            <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 36, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>{chef?.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <RAKStatusChip status={b.status} />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start} – {b.end}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <PerformButton variant="base" iconLeft={<RAKIcon name="message" size={14} color="rgb(32,33,36)" />}>Message chef</PerformButton>
            {b.status !== 'declined' && (
              <React.Fragment>
                <PerformButton variant="base">Decline</PerformButton>
                <PerformButton variant="brand" iconLeft={<RAKIcon name="shield" size={14} color="#fff" />}>Accept request</PerformButton>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 32px 60px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Declined banner */}
          {b.status === 'declined' && (
            <div style={{
              background: 'rgb(254,243,243)', border: '1px solid rgb(244,210,210)',
              borderLeft: '4px solid rgb(222,13,13)', borderRadius: 5,
              padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgb(254,232,232)', flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <RAKIcon name="x" size={16} color="rgb(222,13,13)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>
                  You declined this request
                  {b.declinedAt && <span style={{ color: 'rgb(95,99,104)', fontWeight: 400 }}> · {RAK_formatDate(b.declinedAt.slice(0, 10))}</span>}
                </span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>Reason sent to {chef?.name?.split(' ')[0]}</span>
                <p style={{
                  margin: 0, padding: 14,
                  background: '#fff', border: '1px solid rgb(244,210,210)', borderRadius: 4,
                  fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', lineHeight: 1.55,
                }}>
                  "{b.declinedReason}"
                </p>
              </div>
            </div>
          )}

          {/* Chef profile card */}
          <div style={{
            background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
            padding: 18, display: 'flex', alignItems: 'center', gap: 18
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: "'Varela Round', sans-serif", fontSize: 28, flexShrink: 0
            }}>{chef?.avatar}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 17, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</span>
                {chef?.verified &&
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 9999, background: 'rgb(230,244,247)' }}>
                    <RAKIcon name="shield" size={10} color="rgb(0,114,152)" />
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(0,114,152)', fontWeight: 700 }}>Verified</span>
                  </span>
                }
              </div>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>{chef?.specialty || 'Chef'} · {chef?.city || ''}</span>
              <div style={{ display: 'flex', gap: 18, marginTop: 6 }}>
                <ProfileMiniStat label="Previous bookings" value={chef?.bookings ?? 0} />
                <ProfileMiniStat label="Member since" value={chef?.joinedAt ? chef.joinedAt.slice(0, 7) : '—'} />
                <ProfileMiniStat label="Response rate" value="100%" />
              </div>
            </div>
          </div>

          {/* Booking details */}
          <ListingSection title="Booking">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              <RequestDetailField icon="calendar" label="Date" value={RAK_formatDate(b.date)} />
              <RequestDetailField icon="clock" label="Hours" value={`${b.start} – ${b.end}`} sub={`${b.hours} hours total`} />
              <RequestDetailField icon="dollar" label="Rate" value={`$${(b.total / b.hours).toFixed(0)}/hr`} sub={`$${b.total} total`} />
            </div>
          </ListingSection>

          {/* Kitchen card */}
          <ListingSection title="Kitchen">
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'center' }}>
              <img src={k.photo} alt="" style={{ width: 120, height: 90, borderRadius: 4, objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.name}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{k.address}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{k.sqm} m² · capacity {k.capacity} chefs</span>
              </div>
            </div>
          </ListingSection>

          {/* Message from chef */}
          <ListingSection title="Note from chef">
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>
              "{note}"
            </p>
          </ListingSection>

          {/* Chef credentials */}
          <ListingSection title="Credentials & evidence">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CredentialRow icon="shield" label="Food Safety Supervisor (NSW)" sub="Current to Mar 2027" verified />
              <CredentialRow icon="shield" label="ABN registered" sub="ABN 51 824 753 556" verified />
              <CredentialRow icon="shield" label="Public liability insurance" sub="$20M cover, renewed Feb 2026" verified />
            </div>
          </ListingSection>
        </div>

        {/* RIGHT — payout summary */}
        <div style={{
          background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
          padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
          position: 'sticky', top: 16
        }}>
          {b.status === 'declined' ? (
            <React.Fragment>
              <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(32,33,36)', margin: 0 }}>Request closed</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <PayoutRow label="Requested total" value={`$${b.total}`} muted />
                <PayoutRow label="Status" value="Declined" muted />
                <div style={{ borderTop: '1px solid rgb(238,235,234)', paddingTop: 10 }}>
                  <PayoutRow label="Payout" value="$0" bold />
                </div>
              </div>
              <PerformInfoPanel tone="note">
                The chef was notified with your reason. No charges have been made.
              </PerformInfoPanel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="message" size={14} color="rgb(0,114,152)" />} style={{ width: '100%', justifyContent: 'center' }}>Message chef</PerformButton>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(32,33,36)', margin: 0 }}>Your payout</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <PayoutRow label={`${b.hours} hours × $${(b.total / b.hours).toFixed(0)}/hr`} value={`$${b.total}`} />
                <PayoutRow label="Platform fee (15%)" value={`−$${platformFee}`} muted />
                <div style={{ borderTop: '1px solid rgb(238,235,234)', paddingTop: 10 }}>
                  <PayoutRow label="You'll receive" value={`$${payout}`} bold />
                </div>
              </div>

              <PerformInfoPanel tone="info">
                Funds are released 24 hours after the booking completes. You have until {RAK_formatDate(b.date)} to respond.
              </PerformInfoPanel>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <PerformButton variant="brand" iconLeft={<RAKIcon name="shield" size={14} color="#fff" />} style={{ width: '100%', justifyContent: 'center', height: 42 }}>Accept request</PerformButton>
                <PerformButton variant="base" style={{ width: '100%', justifyContent: 'center' }}>Decline</PerformButton>
                <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="message" size={14} color="rgb(0,114,152)" />} style={{ width: '100%', justifyContent: 'center' }}>Message chef</PerformButton>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </RAKPageFrame>);

}

function ProfileMiniStat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{value}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</span>
    </div>);

}

function RequestDetailField({ icon, label, value, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 4,
        background: 'rgb(230,244,247)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <RAKIcon name={icon} size={16} color="rgb(0,114,152)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{label}</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{value}</span>
        {sub && <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{sub}</span>}
      </div>
    </div>);

}

function CredentialRow({ icon, label, sub, verified }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: verified ? 'rgb(220,243,228)' : 'rgb(238,235,234)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <RAKIcon name={icon} size={14} color={verified ? 'rgb(31,121,77)' : 'rgb(95,99,104)'} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{label}</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{sub}</span>
      </div>
    </div>);

}

function PayoutRow({ label, value, bold, muted }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: bold ? 16 : 14,
      fontWeight: bold ? 700 : 400,
      color: muted ? 'rgb(95,99,104)' : 'rgb(32,33,36)'
    }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>);

}

function ListingSection({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(95,99,104)', margin: 0 }}>{title}</h3>
      {children}
    </div>);
}
