// Rent a Kitchen — Mobile check-in / check-out flow.
// Chef: check in on arrival, check out on departure.
// Owner: post-stay review — confirm kitchen is in order, or report an issue.

import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformFieldLabel, PerformCheckbox } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { RAKIcon } from './icons';
import { RAK_KITCHENS, RAK_USERS } from './data';
import { RAKMobileTopBar, RAKMobileScreen, RAKMobileSection, RAKMobileBackButton, RAKMobileCard } from './mobile-shell';
import { RAKStatusChip, RAK_formatDate } from './shell';

/* ============================================================
   SHARED STATE — localStorage-backed booking check-in states
   ============================================================ */
const RAK_CI_KEY = 'rak_checkinout_states';

function readStates() {
  try { return JSON.parse(localStorage.getItem(RAK_CI_KEY) || '{}'); } catch (_) { return {}; }
}

export function useBookingStates() {
  const [states, setStates] = React.useState(readStates);

  React.useEffect(() => {
    const sync = () => setStates(readStates());
    window.addEventListener('rak-ci-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rak-ci-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const persist = (next) => {
    setStates(next);
    try { localStorage.setItem(RAK_CI_KEY, JSON.stringify(next)); } catch (_) {}
    window.dispatchEvent(new CustomEvent('rak-ci-changed'));
  };

  const patchBooking = (id, patch) => persist({ ...states, [id]: { ...states[id], ...patch } });

  return {
    states,
    getState: (id) => states[id] || {},
    // Chef actions
    checkIn: (id, note) => patchBooking(id, { checkedInAt: new Date().toISOString(), arrivalNote: note }),
    checkOut: (id, data) => patchBooking(id, { checkedOutAt: new Date().toISOString(), ...data }),
    // Owner actions
    ownerConfirm: (id) => patchBooking(id, { ownerReview: { status: 'ok', at: new Date().toISOString() } }),
    ownerReport: (id, report) => patchBooking(id, { ownerReview: { status: 'issue', ...report, at: new Date().toISOString() } }),
    // Derived status helpers
    effectiveStatus(booking) {
      const s = states[booking.id];
      if (!s) return booking.status;
      if (s.ownerReview?.status === 'issue') return 'issue-reported';
      if (s.ownerReview?.status === 'ok') return 'completed';
      if (s.checkedOutAt) return 'awaiting-review';
      if (s.checkedInAt) return 'in-progress';
      return booking.status;
    },
    isCheckedIn: (id) => !!states[id]?.checkedInAt && !states[id]?.checkedOutAt,
    isCheckedOut: (id) => !!states[id]?.checkedOutAt && !states[id]?.ownerReview,
    isOwnerReviewed: (id) => !!states[id]?.ownerReview,
  };
}

/* ============================================================
   CHEF — CHECK-IN FLOW
   ============================================================ */
export function MChefCheckIn({ booking, onBack, onDone }) {
  const k = RAK_KITCHENS.find((x) => x.id === booking.listingId);
  const { checkIn } = useBookingStates();
  const [note, setNote] = React.useState('');
  const [phase, setPhase] = React.useState('ready'); // ready | confirming | done

  const handleCheckIn = () => {
    setPhase('confirming');
    setTimeout(() => {
      checkIn(booking.id, note);
      setPhase('done');
      setTimeout(onDone, 1400);
    }, 700);
  };

  if (phase === 'done') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32, background: '#fff' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <RAKIcon name="check" size={36} color="#fff" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 24, color: 'rgb(32,33,36)', margin: '0 0 8px' }}>You're checked in!</h2>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', margin: 0 }}>{k?.name}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RAKMobileTopBar leading={<RAKMobileBackButton onClick={onBack} />} title="Check in" />
      <RAKMobileScreen>
        {/* Kitchen hero */}
        <div style={{ position: 'relative', aspectRatio: '16 / 7', background: 'rgb(238,235,234)', overflow: 'hidden' }}>
          <img src={k?.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
            <div style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: '#fff', lineHeight: 1.2 }}>{k?.name}</div>
            <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>{k?.address}</div>
          </div>
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Booking summary */}
          <RAKMobileCard style={{ background: 'rgb(230,244,247)', border: '1px solid rgb(190,220,232)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {[
                { label: 'Date', value: RAK_formatDate(booking.date) },
                { label: 'Time', value: `${booking.start} – ${booking.end}` },
                { label: 'Duration', value: `${booking.hours} hours` },
                { label: 'Booking', value: `#${booking.id.replace('bk-', '')}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(0,114,152)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', marginTop: 2 }}>{value}</div>
                </div>
              ))}
            </div>
          </RAKMobileCard>

          {/* Pre-arrival checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 17, color: 'rgb(32,33,36)', margin: 0 }}>Before you start</h3>
            {[
              "You've read and agreed to the house rules",
              "You've confirmed access with the host",
              "You have all required equipment and ingredients",
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgb(220,243,228)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <RAKIcon name="check" size={10} color="rgb(31,121,77)" />
                </div>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)', lineHeight: 1.45 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Arrival note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <PerformFieldLabel>Arrival note (optional)</PerformFieldLabel>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. I'm at the loading dock, running 10 mins early…"
              style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', boxSizing: 'border-box', outline: 'none', resize: 'none' }}
            />
          </div>

          <PerformInfoPanel tone="info">Check-in records your arrival time. Your host will be notified.</PerformInfoPanel>
        </div>
      </RAKMobileScreen>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 34, background: '#fff', borderTop: '1px solid rgb(238,235,234)', zIndex: 5 }}>
        <div style={{ padding: '12px 16px' }}>
          <PerformButton
            variant="brand"
            onClick={handleCheckIn}
            style={{ width: '100%', height: 52, fontSize: 16, justifyContent: 'center', opacity: phase === 'confirming' ? 0.7 : 1 }}
          >
            {phase === 'confirming' ? 'Checking in…' : 'Check in now'}
          </PerformButton>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   CHEF — ACTIVE SESSION CARD (shown while checked in)
   ============================================================ */
export function MChefActiveSession({ booking, onCheckOut }) {
  const k = RAK_KITCHENS.find((x) => x.id === booking.listingId);
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Compute remaining time from booking end time
  const [endH, endM] = booking.end.split(':').map(Number);
  const endDate = new Date(now);
  endDate.setHours(endH, endM, 0, 0);
  if (endDate < now) endDate.setDate(endDate.getDate() + 1); // next day if past midnight
  const remainMs = Math.max(0, endDate - now);
  const remainH = Math.floor(remainMs / 3600000);
  const remainM = Math.floor((remainMs % 3600000) / 60000);
  const remainS = Math.floor((remainMs % 60000) / 1000);
  const totalMs = booking.hours * 3600000;
  const progress = Math.max(0, Math.min(1, 1 - remainMs / totalMs));

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgb(0,145,179) 0%, rgb(0,80,110) 100%)',
      borderRadius: 12, overflow: 'hidden', margin: '14px 16px',
    }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.2)' }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: 'rgba(255,255,255,0.8)', transition: 'width 1s linear' }} />
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgb(52,211,153)', boxShadow: '0 0 0 3px rgba(52,211,153,0.3)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>Session active</span>
        </div>

        <div>
          <div style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: '#fff', lineHeight: 1.2 }}>{k?.name}</div>
          <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{booking.start} – {booking.end}</div>
        </div>

        {/* Countdown */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { val: String(remainH).padStart(2, '0'), unit: 'hr' },
            { val: String(remainM).padStart(2, '0'), unit: 'min' },
            { val: String(remainS).padStart(2, '0'), unit: 'sec' },
          ].map(({ val, unit }) => (
            <div key={unit} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '8px 12px', textAlign: 'center', minWidth: 52 }}>
              <div style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: '#fff', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>{unit}</div>
            </div>
          ))}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 4 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.35 }}>remaining in<br />your session</span>
          </div>
        </div>

        <button type="button" onClick={onCheckOut} style={{
          width: '100%', height: 44, borderRadius: 8,
          background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)',
          color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <RAKIcon name="log-out" size={15} color="#fff" />
          Check out
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   CHEF — CHECK-OUT FLOW
   ============================================================ */
export function MChefCheckOut({ booking, onBack, onDone }) {
  const k = RAK_KITCHENS.find((x) => x.id === booking.listingId);
  const { checkOut } = useBookingStates();
  const [rating, setRating] = React.useState(0);
  const [checklist, setChecklist] = React.useState({ cleaned: false, equipment: false, noItems: false });
  const [notes, setNotes] = React.useState('');
  const [phase, setPhase] = React.useState('form'); // form | submitting | done
  const toggleCheck = (key) => setChecklist((c) => ({ ...c, [key]: !c[key] }));
  const allChecked = Object.values(checklist).every(Boolean);

  const handleCheckOut = () => {
    setPhase('submitting');
    setTimeout(() => {
      checkOut(booking.id, { rating, notes, checklist });
      setPhase('done');
      setTimeout(onDone, 1400);
    }, 700);
  };

  if (phase === 'done') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32, background: '#fff' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgb(220,243,228)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <RAKIcon name="check" size={36} color="rgb(31,121,77)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 24, color: 'rgb(32,33,36)', margin: '0 0 8px' }}>Checked out!</h2>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.5 }}>The host has been notified to review the kitchen. Thanks for cooking!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RAKMobileTopBar leading={<RAKMobileBackButton onClick={onBack} />} title="Check out" />
      <RAKMobileScreen>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Summary */}
          <RAKMobileCard>
            <div style={{ display: 'flex', gap: 12 }}>
              <img src={k?.photo} alt="" style={{ width: 64, height: 56, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k?.name}</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', marginTop: 3 }}>{booking.start} – {booking.end} · {booking.hours} hours</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)', marginTop: 4 }}>${booking.total}</div>
              </div>
            </div>
          </RAKMobileCard>

          {/* Departure checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 17, color: 'rgb(32,33,36)', margin: 0 }}>Departure checklist</h3>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', margin: 0 }}>Please confirm before checking out.</p>
            {[
              { key: 'cleaned', label: "I've cleaned all surfaces, equipment, and disposed of waste" },
              { key: 'equipment', label: "I've returned all kitchen equipment to where I found it" },
              { key: 'noItems', label: "I haven't left any personal items behind" },
            ].map(({ key, label }) => (
              <div key={key} onClick={() => toggleCheck(key)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14,
                borderRadius: 8, cursor: 'pointer',
                border: '1px solid ' + (checklist[key] ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
                background: checklist[key] ? 'rgb(230,244,247)' : '#fff',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  border: '2px solid ' + (checklist[key] ? 'rgb(0,114,152)' : 'rgb(190,191,193)'),
                  background: checklist[key] ? 'rgb(0,114,152)' : 'transparent',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {checklist[key] && <RAKIcon name="check" size={12} color="#fff" />}
                </div>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', lineHeight: 1.45 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Star rating */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 17, color: 'rgb(32,33,36)', margin: 0 }}>Rate the kitchen</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2, lineHeight: 0,
                }}>
                  <RAKIcon name="star" size={32} color={star <= rating ? 'rgb(234,186,0)' : 'rgb(221,219,218)'} />
                </button>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <PerformFieldLabel>Any notes for the host? (optional)</PerformFieldLabel>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. The extraction fan was a bit noisy, key returned to lockbox."
              style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', boxSizing: 'border-box', outline: 'none', resize: 'none' }}
            />
          </div>

          {!allChecked && (
            <PerformInfoPanel tone="warning">Please tick all boxes in the departure checklist before checking out.</PerformInfoPanel>
          )}
        </div>
      </RAKMobileScreen>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 34, background: '#fff', borderTop: '1px solid rgb(238,235,234)', zIndex: 5 }}>
        <div style={{ padding: '12px 16px' }}>
          <PerformButton
            variant="brand"
            onClick={handleCheckOut}
            disabled={!allChecked || phase === 'submitting'}
            style={{ width: '100%', height: 52, fontSize: 16, justifyContent: 'center', opacity: (!allChecked || phase === 'submitting') ? 0.5 : 1 }}
          >
            {phase === 'submitting' ? 'Checking out…' : 'Confirm check-out'}
          </PerformButton>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   OWNER — POST-STAY REVIEW SCREEN
   ============================================================ */
export function MOwnerPostStayReview({ booking, onBack, onDone }) {
  const k = RAK_KITCHENS.find((x) => x.id === booking.listingId);
  const chef = RAK_USERS.find((u) => u.id === booking.chefId);
  const { ownerConfirm, getState } = useBookingStates();
  const [showReport, setShowReport] = React.useState(false);
  const [phase, setPhase] = React.useState('review'); // review | confirming | done

  const bookingState = getState(booking.id);
  const checkedOutAt = bookingState.checkedOutAt
    ? new Date(bookingState.checkedOutAt)
    : null;
  const checkoutNotes = bookingState.checkoutNotes || null;
  const chefRating = bookingState.rating || null;

  if (showReport) {
    return <MOwnerIssueReport booking={booking} kitchen={k} chef={chef} onBack={() => setShowReport(false)} onDone={onDone} />;
  }

  if (phase === 'done') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32, background: '#fff' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgb(220,243,228)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <RAKIcon name="check" size={36} color="rgb(31,121,77)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 24, color: 'rgb(32,33,36)', margin: '0 0 8px' }}>Booking complete</h2>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.5 }}>
            Payment will be released within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    setPhase('confirming');
    setTimeout(() => {
      ownerConfirm(booking.id);
      setPhase('done');
      setTimeout(onDone, 1400);
    }, 700);
  };

  return (
    <>
      <RAKMobileTopBar leading={<RAKMobileBackButton onClick={onBack} />} title="Post-stay review" />
      <RAKMobileScreen>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header alert */}
          <div style={{ background: 'rgb(254,243,199)', border: '1px solid rgb(217,160,0)', borderRadius: 8, padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <RAKIcon name="clock" size={18} color="rgb(146,99,0)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(97,65,0)' }}>Review needed within 24 hours</div>
              <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(146,99,0)', marginTop: 3, lineHeight: 1.4 }}>
                Confirm the kitchen was left in good condition, or report any issues before payment is released.
              </div>
            </div>
          </div>

          {/* Booking summary */}
          <RAKMobileCard>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{chef?.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{chef?.specialty}</div>
              </div>
              {chefRating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <RAKIcon name="star" size={14} color="rgb(234,186,0)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chefRating}.0</span>
                </div>
              )}
            </div>
            <div style={{ height: 1, background: 'rgb(238,235,234)', margin: '12px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {[
                { label: 'Kitchen', value: k?.name },
                { label: 'Date', value: RAK_formatDate(booking.date) },
                { label: 'Session', value: `${booking.start} – ${booking.end}` },
                { label: 'Duration', value: `${booking.hours} hrs` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)', marginTop: 2 }}>{value}</div>
                </div>
              ))}
            </div>
          </RAKMobileCard>

          {/* Chef's checkout notes */}
          {checkoutNotes && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>Chef's departure note</span>
              <div style={{ background: 'rgb(248,247,247)', borderRadius: 6, padding: 12, fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', lineHeight: 1.5 }}>
                "{checkoutNotes}"
              </div>
            </div>
          )}

          {/* Checkout time */}
          {checkedOutAt && (
            <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RAKIcon name="clock" size={13} color="rgb(95,99,104)" />
              Checked out at {checkedOutAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}

          {/* Chef checklist confirmation */}
          <div style={{ background: 'rgb(248,247,247)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)', marginBottom: 10 }}>Chef confirmed on departure:</div>
            {[
              "Kitchen surfaces and equipment cleaned",
              "All equipment returned to original position",
              "No personal items left behind",
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <RAKIcon name="check" size={12} color="rgb(31,121,77)" />
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Earnings summary */}
          <RAKMobileCard style={{ background: 'rgb(230,244,247)', border: '1px solid rgb(190,220,232)' }}>
            <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgb(0,114,152)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>Payment pending release</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', marginBottom: 4 }}>
              <span>Booking total</span><span>${booking.total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', marginBottom: 8 }}>
              <span>Platform fee (15%)</span><span>−${Math.round(booking.total * 0.15)}</span>
            </div>
            <div style={{ height: 1, background: 'rgb(0,114,152)', opacity: 0.2, marginBottom: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Varela Round', sans-serif", fontSize: 17, color: 'rgb(0,114,152)', fontWeight: 700 }}>
              <span>You receive</span><span>${booking.total - Math.round(booking.total * 0.15)}</span>
            </div>
          </RAKMobileCard>

          <div style={{ height: 8 }} />
        </div>
      </RAKMobileScreen>

      {/* Sticky actions */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 34, background: '#fff', borderTop: '1px solid rgb(238,235,234)', zIndex: 5 }}>
        <div style={{ padding: '12px 16px', display: 'flex', gap: 10 }}>
          <PerformButton variant="base" onClick={() => setShowReport(true)} style={{ flex: 1, justifyContent: 'center' }}>
            Report issue
          </PerformButton>
          <PerformButton
            variant="brand"
            onClick={handleConfirm}
            style={{ flex: 1, justifyContent: 'center', opacity: phase === 'confirming' ? 0.7 : 1 }}
          >
            {phase === 'confirming' ? 'Confirming…' : 'All good'}
          </PerformButton>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   OWNER — ISSUE REPORT FORM
   ============================================================ */
function MOwnerIssueReport({ booking, kitchen: k, chef, onBack, onDone }) {
  const { ownerReport } = useBookingStates();
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [claimAmount, setClaimAmount] = React.useState('');
  const [photos, setPhotos] = React.useState([]);
  const [phase, setPhase] = React.useState('form'); // form | submitting | done

  const CATEGORIES = [
    { id: 'cleaning', label: 'Cleaning not completed', icon: 'star' },
    { id: 'damage', label: 'Equipment or property damage', icon: 'alert' },
    { id: 'overstay', label: 'Late departure / overstay', icon: 'clock' },
    { id: 'missing', label: 'Missing items', icon: 'file' },
    { id: 'access', label: 'Unauthorised access', icon: 'lock' },
    { id: 'other', label: 'Other', icon: 'message' },
  ];

  const handlePhotoUpload = () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
    inp.onchange = (e) => {
      const files = Array.from(e.target.files || []);
      setPhotos((p) => [...p, ...files.slice(0, 6 - p.length).map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      }))]);
    };
    inp.click();
  };

  const canSubmit = category && description.trim().length > 10;

  const handleSubmit = () => {
    setPhase('submitting');
    setTimeout(() => {
      ownerReport(booking.id, {
        category,
        description,
        claimAmount: claimAmount ? Number(claimAmount) : null,
        photoCount: photos.length,
      });
      setPhase('done');
      setTimeout(onDone, 1400);
    }, 900);
  };

  if (phase === 'done') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32, background: '#fff' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgb(254,232,232)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <RAKIcon name="alert" size={36} color="rgb(222,13,13)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: '0 0 8px' }}>Issue reported</h2>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.55 }}>
            Our team will review your report within 24 hours. Payment is held until resolved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RAKMobileTopBar leading={<RAKMobileBackButton onClick={onBack} />} title="Report an issue" />
      <RAKMobileScreen>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <PerformInfoPanel tone="warning">
            Submitting a report puts payment on hold until our team reviews the case. Only use this for genuine issues.
          </PerformInfoPanel>

          {/* Booking ref */}
          <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>
            {k?.name} · {chef?.name} · {RAK_formatDate(booking.date)}
          </div>

          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PerformFieldLabel required>Issue category</PerformFieldLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} style={{
                  padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  border: '1px solid ' + (category === cat.id ? 'rgb(222,13,13)' : 'rgb(221,219,218)'),
                  background: category === cat.id ? 'rgb(254,232,232)' : '#fff',
                  fontFamily: "'Open Sans', sans-serif", fontSize: 13,
                  color: category === cat.id ? 'rgb(222,13,13)' : 'rgb(32,33,36)',
                  fontWeight: category === cat.id ? 700 : 400,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <RAKIcon name={cat.icon} size={14} color={category === cat.id ? 'rgb(222,13,13)' : 'rgb(95,99,104)'} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <PerformFieldLabel required>Describe what happened</PerformFieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Please give as much detail as possible — what you found, when you discovered it, and any impact on the kitchen's availability."
              style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', boxSizing: 'border-box', outline: 'none', resize: 'none' }}
            />
          </div>

          {/* Photo evidence */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PerformFieldLabel>Photo evidence</PerformFieldLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {photos.map((p, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 6, overflow: 'hidden', background: 'rgb(238,235,234)', position: 'relative' }}>
                  <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setPhotos((arr) => arr.filter((_, j) => j !== i))}
                    style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PerformIcon name="close" size={10} color="#fff" />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button type="button" onClick={handlePhotoUpload} style={{
                  aspectRatio: '1', borderRadius: 6, border: '1.5px dashed rgb(221,219,218)',
                  background: 'rgb(248,247,247)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}>
                  <RAKIcon name="plus" size={18} color="rgb(95,99,104)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)' }}>Add photo</span>
                </button>
              )}
            </div>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>Up to 6 photos. Strong evidence helps us resolve your case faster.</span>
          </div>

          {/* Claim amount */}
          <PerformField
            label="Compensation claim (AUD)"
            value={claimAmount}
            onChange={setClaimAmount}
            unit="AUD"
            width="100%"
            placeholder="0"
          />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', marginTop: -10 }}>
            Leave blank if you're not seeking compensation. Our team will assess the fair amount based on evidence.
          </span>

          <div style={{ height: 80 }} />
        </div>
      </RAKMobileScreen>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 34, background: '#fff', borderTop: '1px solid rgb(238,235,234)', zIndex: 5 }}>
        <div style={{ padding: '12px 16px' }}>
          <PerformButton
            variant="destructive"
            onClick={handleSubmit}
            disabled={!canSubmit || phase === 'submitting'}
            style={{ width: '100%', height: 52, fontSize: 16, justifyContent: 'center', opacity: (!canSubmit || phase === 'submitting') ? 0.5 : 1 }}
          >
            {phase === 'submitting' ? 'Submitting report…' : 'Submit issue report'}
          </PerformButton>
        </div>
      </div>
    </>
  );
}
