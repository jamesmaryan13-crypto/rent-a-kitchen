// Rent a kitchen — Mobile KITCHEN OWNER views.
// Dashboard, listing editor, requests, messages (uses MMessagesView from mobile-chef).

import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformFieldLabel, PerformCheckbox } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { RAKIcon } from './icons';
import { RAK_KITCHENS, RAK_BOOKINGS, RAK_USERS } from './data';
import { RAKMobileTopBar, RAKMobileScreen, RAKMobileSection, RAKMobileBackButton, RAKMobileCard, RAKMobileTabBar, RAK_MOBILE_TABS } from './mobile-shell';
import { RAKStatusChip, RAK_formatDate, RAKBlockDatesModal, RAKPauseListingModal } from './shell';
import { RAK_EQUIPMENT_OPTIONS, RAK_CERT_OPTIONS } from './chef-views-1';
import { OwnerRevenueChart } from './owner-views';
import { MChefBookingFlow, MFilterChip, MChefListingDetail } from './mobile-chef';
import { MOwnerPostStayReview, useBookingStates } from './mobile-checkinout';

/* ============================================================
   MOBILE OWNER — DASHBOARD
   ============================================================ */
export function MOwnerDashboard() {
  const myListings = RAK_KITCHENS.filter((k) => k.ownerId === 'own-001');
  const myBookings = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId));
  const upcoming = myBookings.filter((b) => ['confirmed', 'pending'].includes(b.status));
  const pendingCount = myBookings.filter((b) => b.status === 'pending').length;
  const reviewCount = myBookings.filter((b) => b.status === 'awaiting-review').length;
  const monthRevenue = myBookings.filter((b) => !['pending', 'cancelled'].includes(b.status)).reduce((s, b) => s + b.total, 0);

  return (
    <>
      <RAKMobileTopBar
        title="Hi, Eleanor"
        trailing={<PerformIcon name="notification" size={20} color="rgb(32,33,36)" />}
      />
      <RAKMobileScreen bg="rgb(248,247,247)">
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reviewCount > 0 && (
            <div style={{
              background: 'rgb(254,243,199)', border: '1px solid rgb(217,160,0)', borderRadius: 8,
              padding: 14, display: 'flex', alignItems: 'center', gap: 12,
              borderLeft: '4px solid rgb(217,160,0)',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(217,160,0,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(97,65,0)', fontFamily: "'Varela Round', sans-serif", fontSize: 18 }}>{reviewCount}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(97,65,0)' }}>post-stay review{reviewCount > 1 ? 's' : ''} needed</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(146,99,0)' }}>Confirm kitchen condition to release payment.</div>
              </div>
              <PerformIcon name="chevron-right" size={12} color="rgb(146,99,0)" />
            </div>
          )}
          {pendingCount > 0 && (
            <div style={{
              background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 8,
              padding: 14, display: 'flex', alignItems: 'center', gap: 12,
              borderLeft: '4px solid rgb(0,114,152)',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgb(230,244,247)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(0,114,152)', fontFamily: "'Varela Round', sans-serif", fontSize: 18 }}>{pendingCount}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>booking request{pendingCount > 1 ? 's' : ''} waiting</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>You have 24h to respond.</div>
              </div>
              <PerformIcon name="chevron-right" size={12} color="rgb(95,99,104)" />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MOwnerKpi label="Revenue / month" value={`$${monthRevenue.toLocaleString()}`} trend="+24%" />
            <MOwnerKpi label="Bookings / month" value="9" trend="+18%" />
            <MOwnerKpi label="Occupancy" value="62%" trend="−4%" trendDir="down" />
            <MOwnerKpi label="Avg. rating" value="4.9 ★" trend="47 reviews" trendDir="neutral" />
          </div>
        </div>

        <RAKMobileSection title="This week">
          <MOwnerWeekStrip />
        </RAKMobileSection>

        <RAKMobileSection title="Upcoming bookings" action={
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(0,145,179)', fontWeight: 600 }}>See all</span>
        }>
          {upcoming.slice(0, 4).map((b) => {
            const chef = RAK_USERS.find((u) => u.id === b.chefId);
            return (
              <div key={b.id} style={{
                background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8,
                padding: 12, display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{chef?.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</div>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start}–{b.end} · ${b.total}</div>
                </div>
                <RAKStatusChip status={b.status} />
              </div>
            );
          })}
        </RAKMobileSection>

        <RAKMobileSection title="Revenue, last 6 months">
          <div style={{ background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8, padding: 14 }}>
            <OwnerRevenueChart />
          </div>
        </RAKMobileSection>

        <RAKMobileSection title="Your listings">
          {myListings.map((k) => (
            <div key={k.id} style={{
              background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8,
              padding: 12, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <img src={k.photo} alt="" style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.name}</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>${k.hourlyRate}/hr · {k.rating} ★ ({k.reviewCount})</div>
              </div>
              <RAKStatusChip status={k.status} />
            </div>
          ))}
        </RAKMobileSection>

        <div style={{ height: 24 }} />
      </RAKMobileScreen>
    </>
  );
}

function MOwnerKpi({ label, value, trend, trendDir = 'up' }) {
  const trendColor = trendDir === 'up' ? 'rgb(31,121,77)' : trendDir === 'down' ? 'rgb(222,13,13)' : 'rgb(95,99,104)';
  return (
    <div style={{
      background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8,
      padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: trendColor, fontWeight: 600 }}>{trend}</div>
    </div>
  );
}

function MOwnerWeekStrip() {
  const days = [
    { d: 'Mon', n: 18, evs: 0 },
    { d: 'Tue', n: 19, evs: 1 },
    { d: 'Wed', n: 20, evs: 0 },
    { d: 'Thu', n: 21, evs: 1 },
    { d: 'Fri', n: 22, evs: 1, hi: true },
    { d: 'Sat', n: 23, evs: 0 },
    { d: 'Sun', n: 24, evs: 2 },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
      {days.map((day) => (
        <div key={day.n} style={{
          background: day.hi ? 'rgb(0,114,152)' : '#fff',
          color: day.hi ? '#fff' : 'rgb(32,33,36)',
          border: '1px solid ' + (day.hi ? 'rgb(0,114,152)' : 'rgb(238,235,234)'),
          borderRadius: 8, padding: '10px 4px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>{day.d}</span>
          <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18 }}>{day.n}</span>
          <div style={{ display: 'flex', gap: 2, height: 6, alignItems: 'center' }}>
            {Array.from({ length: day.evs }).map((_, i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: day.hi ? '#fff' : 'rgb(0,114,152)' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   MOBILE OWNER — REQUESTS
   ============================================================ */
export function MOwnerRequests() {
  const myListings = RAK_KITCHENS.filter((k) => k.ownerId === 'own-001');
  const allPending = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId) && b.status === 'pending');
  const confirmedBase = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId) && b.status === 'confirmed').slice(0, 3);
  // Bookings awaiting owner post-stay review (from data or localStorage state)
  const awaitingReviewBookings = RAK_BOOKINGS.filter((b) => myListings.some((l) => l.id === b.listingId) && b.status === 'awaiting-review');

  const [localStatuses, setLocalStatuses] = React.useState({});
  const [expanded, setExpanded] = React.useState(allPending[0]?.id);
  const [declineId, setDeclineId] = React.useState(null);
  const [reviewBookingId, setReviewBookingId] = React.useState(null);
  const { effectiveStatus, isCheckedOut, ownerConfirm } = useBookingStates();

  // Also find bookings where chef has checked out via localStorage (dynamic)
  const dynamicAwaitingReview = RAK_BOOKINGS.filter((b) =>
    myListings.some((l) => l.id === b.listingId) &&
    b.status !== 'awaiting-review' &&
    isCheckedOut(b.id)
  );
  const allAwaitingReview = [...awaitingReviewBookings, ...dynamicAwaitingReview];

  const requests = allPending.filter((b) => !localStatuses[b.id]);
  const recentlyHandled = allPending.filter((b) => !!localStatuses[b.id]);

  const accept = (id) => {
    setLocalStatuses((s) => ({ ...s, [id]: 'confirmed' }));
    setExpanded(null);
  };
  const confirmDecline = (id, reason) => {
    setLocalStatuses((s) => ({ ...s, [id]: 'declined' }));
    setDeclineId(null);
  };

  if (reviewBookingId) {
    const booking = allAwaitingReview.find((b) => b.id === reviewBookingId);
    return (
      <MOwnerPostStayReview
        booking={booking}
        onBack={() => setReviewBookingId(null)}
        onDone={() => setReviewBookingId(null)}
      />
    );
  }

  return (
    <>
      <RAKMobileTopBar title="Requests" />
      <RAKMobileScreen bg="rgb(248,247,247)">
        {/* Post-stay reviews needed */}
        {allAwaitingReview.length > 0 && (
          <RAKMobileSection title={`Post-stay review (${allAwaitingReview.length})`}>
            {allAwaitingReview.map((b) => {
              const chef = RAK_USERS.find((u) => u.id === b.chefId);
              const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
              const eff = effectiveStatus(b);
              if (eff === 'completed' || eff === 'issue-reported') {
                return (
                  <div key={b.id} style={{ background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{chef?.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</div>
                      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start}–{b.end}</div>
                    </div>
                    <RAKStatusChip status={eff} />
                  </div>
                );
              }
              return (
                <div key={b.id} style={{ background: '#fff', border: '1.5px solid rgb(217,160,0)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ background: 'rgb(254,243,199)', padding: '6px 14px' }}>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgb(97,65,0)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Review needed</span>
                  </div>
                  <div style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{chef?.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name} has checked out</div>
                      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', marginTop: 2 }}>{k?.name} · {RAK_formatDate(b.date)}</div>
                    </div>
                    <PerformButton variant="brand" onClick={() => setReviewBookingId(b.id)} style={{ height: 36, fontSize: 13, padding: '0 14px', flexShrink: 0 }}>
                      Review
                    </PerformButton>
                  </div>
                </div>
              );
            })}
          </RAKMobileSection>
        )}

        <RAKMobileSection title={`Pending (${requests.length})`}>
          {requests.length === 0 && (
            <PerformInfoPanel>No new requests right now.</PerformInfoPanel>
          )}
          {requests.map((b) => {
            const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
            const chef = RAK_USERS.find((u) => u.id === b.chefId);
            const open = expanded === b.id;
            return (
              <div key={b.id} style={{ background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8, overflow: 'hidden' }}>
                <div onClick={() => setExpanded(open ? null : b.id)} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{chef?.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</div>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{chef?.specialty} · {chef?.bookings} previous bookings{chef?.verified ? ' · verified' : ''}</div>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start} – {b.end} · ${b.total}</div>
                  </div>
                  <PerformIcon name="chevron-down" size={11} color="rgb(95,99,104)" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 120ms' }} />
                </div>
                {open && (
                  <div style={{ padding: '0 14px 14px', borderTop: '1px solid rgb(238,235,234)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ paddingTop: 12 }}>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>Message from chef</span>
                      <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)', lineHeight: 1.5, margin: '6px 0 0' }}>
                        {chef?.id === 'chef-001'
                          ? "I'm running a 60-person omakase event on Sunday evening. Mostly knife work and braising — I'll need the gas range, cool room, and a corner of bench space."
                          : "Doing a catering job for a corporate breakfast — primarily using the combi oven and prep benches."}
                      </p>
                    </div>
                    <div style={{ background: 'rgb(248,247,247)', borderRadius: 6, padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <PricelineMobile label={`${b.hours} hours × $${(b.total / b.hours).toFixed(0)}/hr`} value={`$${b.total}`} />
                      <PricelineMobile label="Platform fee (15%)" value={`−$${Math.round(b.total * 0.15)}`} />
                      <div style={{ height: 1, background: 'rgb(238,235,234)', margin: '2px 0' }} />
                      <PricelineMobile label="You'll receive" value={`$${b.total - Math.round(b.total * 0.15)}`} bold />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <PerformButton variant="base" onClick={() => setDeclineId(b.id)} style={{ flex: 1, justifyContent: 'center' }}>Decline</PerformButton>
                      <PerformButton variant="brand" onClick={() => accept(b.id)} style={{ flex: 1, justifyContent: 'center' }}>Accept</PerformButton>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </RAKMobileSection>

        {recentlyHandled.length > 0 && (
          <RAKMobileSection title="Just handled">
            {recentlyHandled.map((b) => {
              const chef = RAK_USERS.find((u) => u.id === b.chefId);
              const status = localStatuses[b.id];
              return (
                <div key={b.id} style={{ background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{chef?.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</div>
                    <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start}–{b.end}</div>
                  </div>
                  <RAKStatusChip status={status === 'confirmed' ? 'confirmed' : 'cancelled'} />
                </div>
              );
            })}
          </RAKMobileSection>
        )}

        <RAKMobileSection title="Recently confirmed">
          {confirmedBase.map((b) => {
            const chef = RAK_USERS.find((u) => u.id === b.chefId);
            return (
              <div key={b.id} style={{
                background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8,
                padding: 12, display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{chef?.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{chef?.name}</div>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start}–{b.end} · ${b.total}</div>
                </div>
                <RAKStatusChip status={b.status} />
              </div>
            );
          })}
        </RAKMobileSection>

        <div style={{ height: 24 }} />
      </RAKMobileScreen>

      {declineId && (
        <MDeclineModal
          booking={allPending.find((b) => b.id === declineId)}
          onClose={() => setDeclineId(null)}
          onConfirm={(reason) => confirmDecline(declineId, reason)}
        />
      )}
    </>
  );
}

/* ============================================================
   MOBILE OWNER — LISTING EDITOR (section accordion)
   ============================================================ */
export function MOwnerListingEditor() {
  const k = RAK_KITCHENS.find((x) => x.id === 'kit-001');
  const [edits, setEdits] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('rak_listing_edits') || '{}'); } catch (_) { return {}; }
  });
  const [savedToast, setSavedToast] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [showBlockDates, setShowBlockDates] = React.useState(false);
  const [showPause, setShowPause] = React.useState(false);

  const sections = [
    { id: 'basics', label: 'Basic details', state: 'complete' },
    { id: 'photos', label: 'Photos', state: 'complete' },
    { id: 'equipment', label: 'Equipment & features', state: 'complete' },
    { id: 'hours', label: 'Hours of operation', state: 'partial' },
    { id: 'pricing', label: 'Pricing', state: 'complete' },
    { id: 'rules', label: 'House rules', state: 'incomplete' },
  ];
  const [openSec, setOpenSec] = React.useState('basics');

  const handleSave = () => {
    try { localStorage.setItem('rak_listing_edits', JSON.stringify(edits)); } catch (_) {}
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  };

  if (showPreview) {
    return <MChefListingDetail kitchenId="kit-001" onBack={() => setShowPreview(false)} onBook={() => setShowPreview(false)} />;
  }

  return (
    <>
      <RAKMobileTopBar
        title="My listing"
        trailing={
          <button type="button" onClick={handleSave} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
            color: savedToast ? 'rgb(31,121,77)' : 'rgb(0,114,152)',
          }}>
            {savedToast ? 'Saved ✓' : 'Save'}
          </button>
        }
      />
      <RAKMobileScreen bg="rgb(248,247,247)">
        {/* Listing summary header */}
        <div style={{ background: '#fff', padding: 14, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgb(238,235,234)' }}>
          <img src={k.photo} alt="" style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'cover' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)', lineHeight: 1.3 }}>{edits.name ?? k.name}</div>
            <div style={{ marginTop: 4 }}><RAKStatusChip status="active" /></div>
          </div>
          <button type="button" onClick={() => setShowPreview(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(0,145,179)', fontWeight: 600, padding: 0 }}>Preview</button>
        </div>

        {/* Quick actions */}
        <div style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setShowBlockDates(true)} style={{
            flex: 1, height: 36, borderRadius: 6, border: '1px solid rgb(221,219,218)', background: '#fff',
            fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgb(32,33,36)', cursor: 'pointer',
          }}>Block dates</button>
          <button type="button" onClick={() => setShowPause(true)} style={{
            flex: 1, height: 36, borderRadius: 6, border: '1px solid rgb(221,219,218)', background: '#fff',
            fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgb(32,33,36)', cursor: 'pointer',
          }}>Pause listing</button>
        </div>

        {/* Section accordion */}
        <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sections.map((s) => (
            <div key={s.id} style={{
              background: '#fff', border: '1px solid rgb(238,235,234)', borderRadius: 8, overflow: 'hidden',
            }}>
              <div onClick={() => setOpenSec(openSec === s.id ? null : s.id)} style={{
                padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              }}>
                <span aria-hidden="true" style={{
                  width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                  background: s.state === 'complete' ? 'rgb(31,121,77)'
                           : s.state === 'partial' ? 'rgb(146,99,0)'
                           : 'rgb(190,191,193)',
                  border: s.state === 'incomplete' ? '2px dashed rgb(190,191,193)' : 'none',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 10, fontWeight: 700,
                }}>
                  {s.state === 'complete' ? '✓' : ''}
                </span>
                <span style={{ flex: 1, fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 600, color: 'rgb(32,33,36)' }}>{s.label}</span>
                <PerformIcon name="chevron-down" size={11} color="rgb(95,99,104)" style={{ transform: openSec === s.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 120ms' }} />
              </div>
              {openSec === s.id && (
                <div style={{ padding: 16, borderTop: '1px solid rgb(238,235,234)' }}>
                  <MOwnerEditSection sec={s.id} kitchen={k} edits={edits} setEdits={setEdits} />
                </div>
              )}
            </div>
          ))}
        </div>
      </RAKMobileScreen>

      <RAKBlockDatesModal
        open={showBlockDates}
        onClose={() => setShowBlockDates(false)}
        onSave={() => setShowBlockDates(false)}
        listingName={edits.name ?? k.name}
      />
      <RAKPauseListingModal
        open={showPause}
        onClose={() => setShowPause(false)}
        onConfirm={() => setShowPause(false)}
        listingName={edits.name ?? k.name}
      />
    </>
  );
}

function MOwnerEditSection({ sec, kitchen: k, edits, setEdits }) {
  const set = (key, val) => setEdits((e) => ({ ...e, [key]: val }));

  if (sec === 'basics') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <PerformField label="Listing name" required width="100%" value={edits.name ?? k.name} onChange={(v) => set('name', v)} />
        <PerformField label="Street address" required width="100%" value={edits.address ?? k.address} onChange={(v) => set('address', v)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <PerformField label="Floor area" width="100%" value={edits.sqm ?? String(k.sqm)} unit="m²" onChange={(v) => set('sqm', v)} />
          <PerformField label="Max chefs" width="100%" value={edits.capacity ?? String(k.capacity)} onChange={(v) => set('capacity', v)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <PerformFieldLabel required>Description</PerformFieldLabel>
          <textarea
            value={edits.description ?? k.description}
            onChange={(e) => set('description', e.target.value)}
            rows={6}
            style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
        </div>
      </div>
    );
  }

  if (sec === 'photos') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {k.photos.map((p, i) => (
          <div key={i} style={{ aspectRatio: '4 / 3', borderRadius: 6, overflow: 'hidden', position: 'relative', background: 'rgb(238,235,234)' }}>
            <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {i === 0 && <span style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', borderRadius: 9999, background: 'rgba(0,114,152,0.95)', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: 10, fontWeight: 700 }}>Cover</span>}
          </div>
        ))}
        <div style={{ aspectRatio: '4 / 3', borderRadius: 6, border: '1px dashed rgb(221,219,218)', background: 'rgb(248,247,247)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
          <RAKIcon name="plus" size={20} color="rgb(95,99,104)" />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>Add photo</span>
        </div>
      </div>
    );
  }

  if (sec === 'equipment') {
    const eqList = edits.equipment ?? k.equipment;
    const certList = edits.certifications ?? k.certifications;
    const toggleEq = (eq) => {
      const slug = eq.toLowerCase().split(' ')[0];
      const has = eqList.some((x) => x.toLowerCase().includes(slug));
      set('equipment', has ? eqList.filter((x) => !x.toLowerCase().includes(slug)) : [...eqList, eq]);
    };
    const toggleCert = (c) => {
      set('certifications', certList.includes(c) ? certList.filter((x) => x !== c) : [...certList, c]);
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <PerformFieldLabel>Equipment available</PerformFieldLabel>
        {RAK_EQUIPMENT_OPTIONS.map((eq) => (
          <PerformCheckbox key={eq} checked={eqList.some((x) => x.toLowerCase().includes(eq.toLowerCase().split(' ')[0]))} onChange={() => toggleEq(eq)} label={eq} />
        ))}
        <div style={{ height: 4 }} />
        <PerformFieldLabel>Certifications</PerformFieldLabel>
        {RAK_CERT_OPTIONS.map((c) => (
          <PerformCheckbox key={c} checked={certList.includes(c)} onChange={() => toggleCert(c)} label={c} />
        ))}
      </div>
    );
  }

  if (sec === 'hours') {
    const hoursMap = edits.hoursMap ?? {};
    const setHour = (day, part, val) => {
      set('hoursMap', { ...hoursMap, [day]: { ...hoursMap[day], [part]: val } });
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PerformInfoPanel tone="info">You can block specific dates using the button above at any time.</PerformInfoPanel>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 80, fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>{d}</span>
            <PerformField label="" width={100} value={hoursMap[d]?.open ?? '05:00'} onChange={(v) => setHour(d, 'open', v)} />
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>–</span>
            <PerformField label="" width={100} value={hoursMap[d]?.close ?? '23:00'} onChange={(v) => setHour(d, 'close', v)} />
          </div>
        ))}
      </div>
    );
  }

  if (sec === 'pricing') {
    const minBooking = edits.minBooking ?? '4 hours';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <PerformField label="Hourly rate" width="100%" value={edits.hourlyRate ?? String(k.hourlyRate)} unit="AUD/hr" onChange={(v) => set('hourlyRate', v)} />
        <PerformField label="Daily rate (8h+)" width="100%" value={edits.dailyRate ?? String(k.dailyRate)} unit="AUD/day" onChange={(v) => set('dailyRate', v)} />
        <PerformField label="Weekend surcharge" width="100%" value={edits.weekendSurcharge ?? '15'} unit="%" onChange={(v) => set('weekendSurcharge', v)} />
        <PerformField label="Cleaning fee" width="100%" value={edits.cleaningFee ?? '40'} unit="AUD" onChange={(v) => set('cleaningFee', v)} />
        <PerformFieldLabel>Minimum booking length</PerformFieldLabel>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['2 hours', '4 hours', '6 hours', 'Full day'].map((opt) => (
            <MFilterChip key={opt} label={opt} active={minBooking === opt} onClick={() => set('minBooking', opt)} />
          ))}
        </div>
      </div>
    );
  }

  if (sec === 'rules') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <PerformFieldLabel required>Cleaning requirements</PerformFieldLabel>
          <textarea
            value={edits.cleaningRules ?? ''}
            onChange={(e) => set('cleaningRules', e.target.value)}
            rows={3}
            placeholder="What's the chef expected to do at the end of a booking?"
            style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <PerformFieldLabel required>Access & arrival</PerformFieldLabel>
          <textarea
            value={edits.accessRules ?? ''}
            onChange={(e) => set('accessRules', e.target.value)}
            rows={3}
            placeholder="Loading dock hours, key handover, parking…"
            style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
        </div>
        <PerformCheckbox checked={edits.noAlcohol ?? false} onChange={(v) => set('noAlcohol', v)} label="No alcohol service on premises" />
        <PerformCheckbox checked={edits.smokeFree ?? false} onChange={(v) => set('smokeFree', v)} label="Smoke-free venue" />
      </div>
    );
  }

  return null;
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
   MOBILE OWNER — DECLINE MODAL
   ============================================================ */
function MDeclineModal({ booking, onClose, onConfirm }) {
  const chef = RAK_USERS.find((u) => u.id === booking?.chefId);
  const [reason, setReason] = React.useState('');
  const REASONS = [
    'Kitchen unavailable on that date',
    'Booking does not meet our requirements',
    'Insufficient chef credentials',
    'Other',
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ background: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(32,33,36)', margin: '0 0 4px' }}>Decline request?</h3>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', margin: 0 }}>
            {chef?.name} · {RAK_formatDate(booking?.date)} · {booking?.start}–{booking?.end}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PerformFieldLabel>Reason (optional)</PerformFieldLabel>
          {REASONS.map((r) => (
            <button key={r} type="button" onClick={() => setReason(r)} style={{
              padding: '10px 14px', borderRadius: 6, textAlign: 'left', cursor: 'pointer',
              border: '1px solid ' + (reason === r ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
              background: reason === r ? 'rgb(230,244,247)' : '#fff',
              fontFamily: "'Open Sans', sans-serif", fontSize: 14,
              color: reason === r ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
              fontWeight: reason === r ? 700 : 400,
            }}>{r}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <PerformButton variant="base" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</PerformButton>
          <PerformButton variant="destructive" onClick={() => onConfirm(reason)} style={{ flex: 1, justifyContent: 'center' }}>Decline</PerformButton>
        </div>
      </div>
    </div>
  );
}
