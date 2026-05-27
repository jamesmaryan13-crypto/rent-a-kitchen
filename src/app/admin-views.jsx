// Rent a kitchen — ADMIN views
// Dashboard, users, listings moderation, payouts, reports, disputes.

import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformRadio, PerformCheckbox, PerformSelect, PerformFieldLabel } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { PerformTable } from '../components/PerformTable';
import { RAKIcon } from './icons';
import { RAK_KITCHENS, RAK_USERS, RAK_BOOKINGS, RAK_DISPUTES, RAK_PAYOUTS, RAK_ACTIVITY, RAK_lookup } from './data';
import { RAK_formatDate, RAKPageFrame, RAKPageHeader, RAKStatusChip, RAKConfirmModal, RAKKpiTile } from './shell';
import { ChefListingDetail } from './chef-views-2';

/* ============================================================
   ADMIN — DASHBOARD
   ============================================================ */
export function AdminDashboard({ onNav }) {
  return (
    <RAKPageFrame>
      <RAKPageHeader
        title="Admin overview"
        subtitle="Platform snapshot · Last 30 days"
        right={
        <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="download" size={14} color="rgb(0,114,152)" />}>
            Export report
          </PerformButton>
        } />


      <div style={{ padding: '24px 32px 60px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPIs */}
        <div style={{ display: 'flex', gap: 16 }}>
          <RAKKpiTile label="Active listings" value="142" trend="+12" trendDir="up" sub="this month" />
          <RAKKpiTile label="Verified chefs" value="386" trend="+38" trendDir="up" sub="this month" />
          <RAKKpiTile label="Bookings (30d)" value="421" trend="+23%" trendDir="up" sub="vs prev. 30d" />
          <RAKKpiTile label="GMV (30d)" value="$284,510" trend="+19%" trendDir="up" sub="vs prev. 30d" />
          <RAKKpiTile label="Open disputes" value="3" trend="−2" trendDir="up" sub="vs last week" />
        </div>

        {/* Two-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          {/* Recent activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Recent activity</h2>
            <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
              {RAK_ACTIVITY.map((a, i) =>
              <div key={a.id} style={{
                display: 'grid', gridTemplateColumns: '36px 1fr auto',
                gap: 14, alignItems: 'center', padding: '12px 18px',
                borderBottom: i === RAK_ACTIVITY.length - 1 ? 'none' : '1px solid rgb(238,235,234)'
              }}>
                  <AdminActivityIcon type={a.type} />
                  <div>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>
                      <span style={{ fontWeight: 700 }}>{a.who}</span>
                      {a.type === 'signup' && ` signed up as a ${a.role}`}
                      {a.type === 'listing' && ` was submitted — ${a.detail}`}
                      {a.type === 'booking' && ` ${a.detail}`}
                      {a.type === 'dispute' && ` ${a.detail}`}
                      {a.type === 'payout' && ` — ${a.detail}`}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{a.when}</span>
                </div>
              )}
            </div>
          </div>

          {/* Things needing attention */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Needs your attention</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AdminAttentionCard
                count={1} label="Listing awaiting moderation"
                detail="Brunswick BBQ House — submitted 4h ago"
                onClick={() => onNav('moderation')} />

              <AdminAttentionCard
                count={3} label="Disputes open"
                detail="2 over equipment, 1 over cleaning"
                onClick={() => onNav('disputes')} />

              <AdminAttentionCard
                count={2} label="Payouts pending review"
                detail="Total $4,556 across 2 owners"
                onClick={() => onNav('payouts')} />

              <AdminAttentionCard
                count={5} label="Unverified chefs with bookings"
                detail="May need follow-up on credentials"
                onClick={() => onNav('users')} />

            </div>
          </div>
        </div>

        {/* Chart row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Bookings, last 6 months</h2>
            <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 20 }}>
              <AdminBookingsChart />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Top performing kitchens</h2>
            <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, overflow: 'hidden' }}>
              {[...RAK_KITCHENS].filter((k) => k.status === 'active').sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5).map((k, i) =>
              <div key={k.id} style={{
                display: 'grid', gridTemplateColumns: '20px 48px 1fr auto', gap: 14, alignItems: 'center', padding: '12px 18px',
                borderBottom: i === 4 ? 'none' : '1px solid rgb(238,235,234)'
              }}>
                  <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 16, color: 'rgb(95,99,104)' }}>{i + 1}</span>
                  <img src={k.photo} alt="" style={{ width: 48, height: 36, borderRadius: 4, objectFit: 'cover' }} />
                  <div>
                    <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.name}</span>
                    <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k.suburb}, {k.city} · {k.reviewCount} bookings · {k.rating} ★</span>
                  </div>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>${(k.reviewCount * k.hourlyRate * 6 / 1000).toFixed(1)}k</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RAKPageFrame>);

}

function AdminActivityIcon({ type }) {
  const map = {
    signup: { name: 'user', color: 'rgb(0,114,152)', bg: 'rgb(230,244,247)' },
    listing: { name: 'building', color: 'rgb(146,99,0)', bg: 'rgb(254,243,199)' },
    booking: { name: 'calendar', color: 'rgb(31,121,77)', bg: 'rgb(220,243,228)' },
    dispute: { name: 'flag', color: 'rgb(222,13,13)', bg: 'rgb(254,232,232)' },
    payout: { name: 'dollar', color: 'rgb(0,114,152)', bg: 'rgb(230,244,247)' }
  };
  const m = map[type] || map.signup;
  return (
    <span style={{
      width: 32, height: 32, borderRadius: '50%', background: m.bg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {m.name === 'user' && <PerformIcon name="user" size={14} color={m.color} />}
      {m.name !== 'user' && <RAKIcon name={m.name} size={14} color={m.color} />}
    </span>);

}

function AdminAttentionCard({ count, label, detail, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'grid', gridTemplateColumns: '52px 1fr auto',
      gap: 14, alignItems: 'center',
      background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
      padding: '14px 18px', cursor: 'pointer',
      transition: 'background 120ms'
    }}
    onMouseEnter={(e) => {e.currentTarget.style.background = 'rgb(248,247,247)';}}
    onMouseLeave={(e) => {e.currentTarget.style.background = '#fff';}}>

      <span style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'rgb(230,244,247)', color: 'rgb(0,114,152)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Varela Round', sans-serif", fontSize: 22
      }}>{count}</span>
      <div>
        <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{label}</span>
        <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{detail}</span>
      </div>
      <PerformIcon name="chevron-right" size={12} color="rgb(95,99,104)" />
    </div>);

}

function AdminBookingsChart() {
  const months = [
  { m: 'Dec', a: 240, b: 110 },
  { m: 'Jan', a: 290, b: 130 },
  { m: 'Feb', a: 305, b: 145 },
  { m: 'Mar', a: 345, b: 175 },
  { m: 'Apr', a: 380, b: 195 },
  { m: 'May', a: 421, b: 220 }];

  const max = Math.max(...months.map((x) => x.a));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 18, marginBottom: 4 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgb(0,114,152)' }} />
          Sydney
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgb(0,145,179)' }} />
          Melbourne
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, alignItems: 'flex-end', height: 180 }}>
        {months.map((mo) =>
        <div key={mo.m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(32,33,36)', fontWeight: 600 }}>{mo.a + mo.b}</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 130, width: '100%', justifyContent: 'center' }}>
              <div style={{ width: '28%', height: `${mo.a / max * 130}px`, background: 'rgb(0,114,152)', borderRadius: '3px 3px 0 0' }} />
              <div style={{ width: '28%', height: `${mo.b / max * 130}px`, background: 'rgb(0,145,179)', borderRadius: '3px 3px 0 0' }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        {months.map((mo) =>
        <span key={mo.m} style={{ textAlign: 'center', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{mo.m}</span>
        )}
      </div>
    </div>);

}

/* ============================================================
   ADMIN — USERS
   ============================================================ */
export function AdminUsers({ onOpenUser }) {
  const [filter, setFilter] = React.useState('all');
  const filtered = filter === 'all' ? RAK_USERS : RAK_USERS.filter((u) => u.role === filter);
  return (
    <RAKPageFrame>
      <RAKPageHeader title="Users" subtitle={`${RAK_USERS.length} total accounts`}
      right={<PerformButton variant="brand-outline">Invite an admin</PerformButton>} />

      <div style={{ padding: '20px 32px 60px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
          { id: 'all', label: 'All' },
          { id: 'chef', label: 'Chefs' },
          { id: 'owner', label: 'Kitchen owners' },
          { id: 'admin', label: 'Admins' }].
          map((tab) =>
          <button key={tab.id} type="button" onClick={() => setFilter(tab.id)} style={{
            height: 34, padding: '0 16px', borderRadius: 4,
            border: '1px solid ' + (filter === tab.id ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
            background: filter === tab.id ? 'rgb(230,244,247)' : '#fff',
            color: filter === tab.id ? 'rgb(0,114,152)' : 'rgb(32,33,36)',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>{tab.label} ({tab.id === 'all' ? RAK_USERS.length : RAK_USERS.filter((u) => u.role === tab.id).length})</button>
          )}
          <div style={{ flex: 1 }} />
          <div style={{
            height: 34, padding: '0 12px', borderRadius: 4, border: '1px solid rgb(221,219,218)',
            background: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8, width: 280
          }}>
            <RAKIcon name="search" size={14} color="rgb(95,99,104)" />
            <input placeholder="Search by name or email" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Open Sans', sans-serif", fontSize: 14 }} />
          </div>
        </div>

        <PerformTable
          columns={[
          { key: 'user', label: 'User', width: '1.5fr', render: (r) =>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{r.avatar}</div>
                <div>
                  <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{r.name}</span>
                  <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{r.email}</span>
                </div>
              </div>
          },
          { key: 'role', label: 'Role', width: '0.7fr', render: (r) =>
            <span style={{ textTransform: 'capitalize' }}>{r.role}</span>
          },
          { key: 'city', label: 'City', width: '0.7fr' },
          { key: 'verified', label: 'Status', width: '0.8fr', render: (r) => <RAKStatusChip status={r.verified ? 'verified' : 'unverified'} /> },
          { key: 'detail', label: 'Activity', width: '1fr', render: (r) =>
            r.role === 'chef' ?
            `${r.bookings || 0} bookings · ${r.specialty || ''}` :
            r.role === 'owner' ?
            `${r.listings || 0} listing${r.listings === 1 ? '' : 's'} · ${r.businessName || ''}` :
            'Platform admin'
          },
          { key: 'joinedAt', label: 'Joined', width: '0.7fr' },
          { key: 'actions', label: '', width: '60px', render: () => <PerformIcon name="chevron-right" size={12} color="rgb(95,99,104)" /> }]
          }
          rows={filtered}
          onRowClick={(r) => onOpenUser && onOpenUser(r.id)} />

      </div>
    </RAKPageFrame>);

}

/* ============================================================
   ADMIN — LISTINGS MODERATION
   ============================================================ */
export function AdminModeration({ onPreviewListing, onOpenUser }) {
  const pending = RAK_KITCHENS.filter((k) => k.status === 'pending');
  const active = RAK_KITCHENS.filter((k) => k.status === 'active');
  const [approveTarget, setApproveTarget] = React.useState(null);
  const [changesTarget, setChangesTarget] = React.useState(null);
  const [declineTarget, setDeclineTarget] = React.useState(null);
  const [approvedToast, setApprovedToast] = React.useState(null);

  return (
    <RAKPageFrame>
      <RAKPageHeader title="Listings moderation" subtitle="Review and approve new kitchen submissions before they go live." />
      <div style={{ padding: '24px 32px 60px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Awaiting review ({pending.length})</h2>
          {pending.length === 0 &&
          <PerformInfoPanel>Nothing in the queue right now.</PerformInfoPanel>
          }
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pending.map((k) =>
            <AdminModerationCard
              key={k.id}
              kitchen={k}
              onPreview={() => onPreviewListing && onPreviewListing(k.id)}
              onApprove={() => setApproveTarget(k)}
              onRequestChanges={() => setChangesTarget(k)}
              onDecline={() => setDeclineTarget(k)} />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>Active listings ({active.length})</h2>
          <PerformTable
            columns={[
            { key: 'name', label: 'Listing', width: '1.6fr', render: (r) =>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={r.photo} alt="" style={{ width: 56, height: 42, borderRadius: 4, objectFit: 'cover' }} />
                  <div>
                    <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{r.name}</span>
                    <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{r.suburb}, {r.city}</span>
                  </div>
                </div>
            },
            { key: 'ownerName', label: 'Owner', width: '1fr' },
            { key: 'hourlyRate', label: 'Rate', width: '0.7fr', render: (r) => `$${r.hourlyRate}/hr` },
            { key: 'rating', label: 'Rating', width: '0.7fr', render: (r) =>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <RAKIcon name="star" size={12} color="rgb(234,186,0)" /> {r.rating} ({r.reviewCount})
                </span>
            },
            { key: 'listedAt', label: 'Listed', width: '0.8fr' },
            { key: 'status', label: 'Status', width: '0.8fr', render: (r) => <RAKStatusChip status={r.status} /> },
            { key: 'a', label: '', width: '60px', render: (r) =>
              <AdminListingRowMenu kitchen={r} onPreview={() => onPreviewListing && onPreviewListing(r.id)} onMessageOwner={() => onOpenUser && onOpenUser(r.ownerId)} />
            }]
            }
            rows={active} />

        </div>
      </div>

      {approveTarget &&
      <ApproveListingModal
        kitchen={approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={() => {setApprovedToast(approveTarget);setApproveTarget(null);}} />
      }
      {changesTarget &&
      <RequestChangesModal
        kitchen={changesTarget}
        onClose={() => setChangesTarget(null)}
        onSubmit={() => setChangesTarget(null)} />
      }
      {declineTarget &&
      <RAKConfirmModal
        title={`Decline "${declineTarget.name}"?`}
        message={`The listing will be rejected and removed from the moderation queue. ${declineTarget.ownerName || 'The owner'} will be notified by email with the reason you provide. This cannot be undone from this screen.`}
        primary={{ label: 'Decline listing', onClick: () => setDeclineTarget(null) }}
        secondary={{ label: 'Cancel', onClick: () => setDeclineTarget(null) }}
        onClose={() => setDeclineTarget(null)} />
      }
      {approvedToast &&
      <ApprovedToast kitchen={approvedToast} onDismiss={() => setApprovedToast(null)} />
      }
    </RAKPageFrame>);

}

function AdminModerationCard({ kitchen, onPreview, onApprove, onRequestChanges, onDecline }) {
  const owner = RAK_USERS.find((u) => u.id === kitchen.ownerId);
  return (
    <div style={{
      background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
      display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, padding: 16
    }} data-comment-anchor="805c6db79e-div-364-5">
      <img src={kitchen.photo} alt="" style={{ width: 120, height: 90, borderRadius: 4, objectFit: 'cover' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 700, color: 'rgb(32,33,36)' }}>{kitchen.name}</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{kitchen.suburb}, {kitchen.city} · {kitchen.sqm} m² · {kitchen.capacity} chefs · ${kitchen.hourlyRate}/hr</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Submitted by {owner?.name || kitchen.ownerName} {!owner?.verified && '· unverified owner'} · {kitchen.listedAt}</span>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {kitchen.certifications.map((c) =>
          <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 9999, background: 'rgb(248,247,247)', fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(32,33,36)' }}>
              <RAKIcon name="shield" size={10} color="rgb(95,99,104)" />
              {c}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="eye" size={14} color="rgb(0,114,152)" />} onClick={onPreview}>Preview</PerformButton>
        <PerformButton variant="brand" onClick={onApprove}>Approve</PerformButton>
        <PerformButton variant="base" onClick={onRequestChanges}>Request changes</PerformButton>
        <button type="button" onClick={onDecline}
          style={{
            padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
            border: '1px solid rgb(244,210,210)', background: '#fff',
            color: 'rgb(222,13,13)',
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
          Decline
        </button>
      </div>
    </div>);

}

/* ============================================================
   ADMIN — PAYOUTS
   ============================================================ */
export function AdminPayouts() {
  const totalPending = RAK_PAYOUTS.filter((p) => p.status === 'pending').reduce((s, p) => s + p.net, 0);
  const totalPaid = RAK_PAYOUTS.filter((p) => p.status === 'paid').reduce((s, p) => s + p.net, 0);
  return (
    <RAKPageFrame>
      <RAKPageHeader title="Payouts" subtitle="Owner earnings disbursed by the platform. Fortnightly cycle." />
      <div style={{ padding: '20px 32px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <RAKKpiTile label="Pending payouts" value={`$${totalPending.toLocaleString()}`} sub="2 owners · next run May 31" />
          <RAKKpiTile label="Paid this cycle" value={`$${totalPaid.toLocaleString()}`} sub="3 owners · May 16" />
          <RAKKpiTile label="Platform revenue" value="$1,770" sub="15% on $11,800 gross" />
          <RAKKpiTile label="Avg payout" value="$2,006" sub="across 5 owners" />
        </div>

        <PerformTable
          columns={[
          { key: 'owner', label: 'Owner', width: '1.4fr', render: (r) => {
              const o = RAK_USERS.find((u) => u.id === r.ownerId);
              const k = RAK_KITCHENS.find((x) => x.ownerId === r.ownerId);
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{o?.avatar || '·'}</div>
                  <div>
                    <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{o?.businessName || k?.name || r.ownerId}</span>
                    <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{o?.name}</span>
                  </div>
                </div>);

            } },
          { key: 'period', label: 'Period', width: '1fr' },
          { key: 'gross', label: 'Gross', width: '0.7fr', render: (r) => `$${r.gross.toLocaleString()}` },
          { key: 'fees', label: 'Fees', width: '0.7fr', render: (r) => `−$${r.fees.toLocaleString()}` },
          { key: 'net', label: 'Net payout', width: '0.7fr', render: (r) => <span style={{ fontWeight: 700 }}>${r.net.toLocaleString()}</span> },
          { key: 'status', label: 'Status', width: '0.7fr', render: (r) => <RAKStatusChip status={r.status} /> },
          { key: 'a', label: '', width: '160px', render: (r) => r.status === 'pending' ?
            <PerformButton variant="brand">Approve payout</PerformButton> :
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Paid {r.paidAt}</span>
          }]
          }
          rows={RAK_PAYOUTS} />

      </div>
    </RAKPageFrame>);

}

/* ============================================================
   ADMIN — REPORTS
   ============================================================ */
export function AdminReports() {
  const reports = [
  { id: 'r-1', name: 'Marketplace summary', desc: 'GMV, bookings, take rate, average order value', last: 'Generated yesterday' },
  { id: 'r-2', name: 'Listings performance', desc: 'Bookings, revenue, occupancy by listing', last: 'Generated 3 days ago' },
  { id: 'r-3', name: 'Chef cohort analysis', desc: 'Retention and booking frequency by sign-up month', last: 'Generated 1 week ago' },
  { id: 'r-4', name: 'Disputes & cancellations', desc: 'Disputes opened, resolution time, refund value', last: 'Generated 2 weeks ago' },
  { id: 'r-5', name: 'Owner earnings statement', desc: 'Gross, fees, net by owner — for tax purposes', last: 'Generated monthly' },
  { id: 'r-6', name: 'Geographic distribution', desc: 'Bookings and revenue by city and suburb', last: 'Generated 1 week ago' }];


  return (
    <RAKPageFrame>
      <RAKPageHeader title="Reports" subtitle="Pre-built reports across the marketplace. Schedule or download as CSV." />

      <div style={{ padding: '24px 32px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {reports.map((r) =>
          <div key={r.id} style={{
            background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
            padding: 20, display: 'flex', flexDirection: 'column', gap: 10,
            cursor: 'pointer', transition: 'border-color 120ms'
          }}
          onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'rgb(0,114,152)';}}
          onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgb(190,191,193)';}}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>{r.name}</h3>
                <RAKIcon name="download" size={18} color="rgb(0,114,152)" />
              </div>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', lineHeight: 1.5 }}>{r.desc}</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', marginTop: 'auto', paddingTop: 8 }}>{r.last}</span>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <PerformButton variant="brand-outline">Run now</PerformButton>
                <PerformButton variant="base">Schedule</PerformButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </RAKPageFrame>);

}

/* ============================================================
   ADMIN — DISPUTES
   ============================================================ */
export function AdminDisputes() {
  const open = RAK_DISPUTES.filter((d) => d.status === 'open');
  const resolved = RAK_DISPUTES.filter((d) => d.status === 'resolved');
  const [selected, setSelected] = React.useState(open[0]?.id || resolved[0]?.id);
  const sel = RAK_DISPUTES.find((d) => d.id === selected);

  return (
    <RAKPageFrame padding={0} scroll={false}>
      <RAKPageHeader title="Disputes" subtitle={`${open.length} open · ${resolved.length} resolved`} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar list */}
        <div style={{ width: 320, borderRight: '1px solid rgb(238,235,234)', overflowY: 'auto', flexShrink: 0 }}>
          {[...open, ...resolved].map((d) => {
            const opener = RAK_USERS.find((u) => u.id === d.opener);
            const booking = RAK_BOOKINGS.find((b) => b.id === d.bookingId);
            return (
              <div key={d.id} onClick={() => setSelected(d.id)}
              onMouseEnter={(e) => {if (d.id !== selected) e.currentTarget.style.background = 'rgb(248,247,247)';}}
              onMouseLeave={(e) => {if (d.id !== selected) e.currentTarget.style.background = '#fff';}}
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgb(238,235,234)',
                borderLeft: d.id === selected ? '3px solid rgb(0,114,152)' : '3px solid transparent',
                background: d.id === selected ? 'rgb(230,244,247)' : '#fff',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 4
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)' }}>{d.id.toUpperCase()}</span>
                  <RAKStatusChip status={d.status} />
                </div>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)' }}>{opener?.name}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.reason}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>Opened {d.opened} · ${d.amount}</span>
              </div>);

          })}
        </div>

        {/* Detail */}
        {sel && <AdminDisputeDetail dispute={sel} />}
      </div>
    </RAKPageFrame>);

}

function AdminDisputeDetail({ dispute }) {
  const booking = RAK_BOOKINGS.find((b) => b.id === dispute.bookingId);
  const kitchen = RAK_KITCHENS.find((k) => k.id === booking?.listingId);
  const opener = RAK_USERS.find((u) => u.id === dispute.opener);
  const other = RAK_USERS.find((u) => u.id === (dispute.opener.startsWith('chef') ? kitchen?.ownerId : booking?.chefId));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 28, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.05 }}>Dispute {dispute.id.toUpperCase()}</h2>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>Booking {booking?.id.toUpperCase()} · {kitchen?.name}</span>
        </div>
        <RAKStatusChip status={dispute.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{opener?.avatar}</div>
              <div>
                <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{opener?.name}</span>
                <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{opener?.role === 'chef' ? 'Chef' : 'Kitchen owner'} · {dispute.opened}</span>
              </div>
            </div>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.55 }}>{dispute.reason}</p>
          </div>

          {dispute.status === 'open' &&
          <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(95,99,104)', margin: 0 }}>Resolution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <PerformRadio name="reso" checked label={`Refund chef in full ($${dispute.amount})`} />
                <PerformRadio name="reso" checked={false} label="Partial refund (specify amount)" />
                <PerformRadio name="reso" checked={false} label="No refund — close as resolved" />
                <PerformRadio name="reso" checked={false} label="Escalate to management" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <PerformFieldLabel>Note for both parties</PerformFieldLabel>
                <textarea rows={3} placeholder="Briefly explain your decision…" style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 15, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <PerformButton variant="base">Save draft</PerformButton>
                <PerformButton variant="brand">Resolve dispute</PerformButton>
              </div>
            </div>
          }
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: 0 }}>Booking</h3>
            {booking && kitchen &&
            <div style={{ display: 'flex', gap: 12 }}>
                <img
                  src={kitchen.photo}
                  alt={kitchen.name}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80'; }}
                  style={{ width: 64, height: 48, borderRadius: 4, objectFit: 'cover', background: 'rgb(238,235,234)', display: 'block' }}
                  data-comment-anchor="eb3fc2d405-img-590-17" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)' }}>{kitchen.name}</span>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_formatDate(booking.date)} · {booking.start} – {booking.end}</span>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>Total ${booking.total}</span>
                </div>
              </div>
            }
          </div>
          <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 18 }}>
            <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: '0 0 10px' }}>Other party</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgb(95,99,104)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{other?.avatar || '—'}</div>
              <div>
                <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{other?.name || '—'}</span>
                <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{other?.role === 'chef' ? 'Chef' : 'Owner'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

/* ============================================================
   ADMIN — LISTING ROW MENU (active listings table)
   ============================================================ */
function AdminListingRowMenu({ kitchen, onPreview, onMessageOwner }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="More"
        aria-label="More actions"
        style={{
          width: 32, height: 32, borderRadius: 4,
          border: '1px solid ' + (open ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
          background: open ? 'rgb(230,244,247)' : '#fff',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
        }}>
        <RAKIcon name="more-vertical" size={16} color="rgb(95,99,104)" />
      </button>

      {open &&
      <div style={{
        position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 20,
        background: '#fff', borderRadius: 4,
        border: '1px solid rgb(190,191,193)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.14)',
        minWidth: 180, padding: 4,
        display: 'flex', flexDirection: 'column'
      }}>
          <AdminMenuItem icon="eye" label="Access listing" onClick={() => {setOpen(false);onPreview && onPreview();}} />
          <AdminMenuItem icon="message" label="Message owner" onClick={() => {setOpen(false);onMessageOwner && onMessageOwner();}} />
        </div>
      }
    </div>);

}

function AdminMenuItem({ icon, label, onClick, danger, disabled }) {
  const color = disabled ? 'rgb(190,191,193)' : danger ? 'rgb(193,49,49)' : 'rgb(32,33,36)';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={(e) => {if (!disabled) e.currentTarget.style.background = 'rgb(248,247,247)';}}
      onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';}}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px', borderRadius: 3,
        background: 'transparent', border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'Open Sans', sans-serif", fontSize: 14,
        color, textAlign: 'left'
      }}>
      <RAKIcon name={icon} size={14} color={color} />
      <span>{label}</span>
    </button>);

}

/* ============================================================
   ADMIN — APPROVE LISTING MODAL
   ============================================================ */
function ApproveListingModal({ kitchen, onClose, onConfirm }) {
  const owner = RAK_USERS.find((u) => u.id === kitchen.ownerId);
  return (
    <ModalShell onClose={onClose} maxWidth={460}>
      <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgb(220,243,228)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 4
        }}>
          <RAKIcon name="shield" size={22} color="rgb(31,121,77)" />
        </div>
        <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.2 }}>Approve this listing?</h3>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>{kitchen.name} · {kitchen.suburb}, {kitchen.city}</span>
      </div>
      <div style={{ padding: '14px 24px 4px' }}>
        <PerformInfoPanel tone="info">
          The listing will go live immediately and {owner?.name || 'the owner'} will receive a confirmation email at <strong>{owner?.email || 'their address'}</strong>.
        </PerformInfoPanel>
      </div>
      <div style={{ padding: '16px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <PerformButton variant="base" onClick={onClose}>Cancel</PerformButton>
        <PerformButton variant="brand" onClick={onConfirm}>Approve listing</PerformButton>
      </div>
    </ModalShell>);

}

/* ============================================================
   ADMIN — APPROVED TOAST (post-confirm)
   ============================================================ */
function ApprovedToast({ kitchen, onDismiss }) {
  const owner = RAK_USERS.find((u) => u.id === kitchen.ownerId);
  React.useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 90,
      background: '#fff', borderLeft: '4px solid rgb(31,121,77)',
      borderRadius: 4,
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      padding: '14px 18px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      maxWidth: 380, minWidth: 320
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'rgb(220,243,228)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <RAKIcon name="shield" size={14} color="rgb(31,121,77)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{kitchen.name} approved</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', lineHeight: 1.4 }}>
          Confirmation email sent to {owner?.name || 'owner'} ({owner?.email || ''}).
        </span>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss" style={{
        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <PerformIcon name="close" size={12} color="rgb(95,99,104)" />
      </button>
    </div>);

}

/* ============================================================
   ADMIN — REQUEST CHANGES MODAL
   ============================================================ */
const REQUEST_CHANGES_REASONS = [
{ id: 'insurance', label: 'Out-of-date public liability insurance' },
{ id: 'price', label: 'Hourly rate is too high for the market' },
{ id: 'photos', label: 'Photos are low quality or unrepresentative' },
{ id: 'description', label: 'Description lacks detail (equipment, access, rules)' },
{ id: 'address', label: 'Address or location details unclear' },
{ id: 'food-safety', label: 'Food safety supervisor certificate missing or expired' },
{ id: 'equipment', label: 'Equipment list incomplete or inaccurate' },
{ id: 'capacity', label: 'Capacity / size claims need verification' }];


function RequestChangesModal({ kitchen, onClose, onSubmit }) {
  const owner = RAK_USERS.find((u) => u.id === kitchen.ownerId);
  const [selected, setSelected] = React.useState({});
  const [note, setNote] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const toggle = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const anySelected = Object.values(selected).some(Boolean);
  const canSubmit = anySelected || note.trim().length > 0;

  if (submitted) {
    return (
      <ModalShell onClose={onClose} maxWidth={460}>
        <div style={{ padding: '32px 28px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgb(230,244,247)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <RAKIcon name="send" size={26} color="rgb(0,114,152)" />
          </div>
          <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: 0 }}>Changes requested</h3>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.55 }}>
            We've emailed {owner?.name || 'the owner'} a list of items to update. The listing will move to <strong>pending revision</strong> until they resubmit.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <PerformButton variant="brand" onClick={onSubmit}>Done</PerformButton>
          </div>
        </div>
      </ModalShell>);

  }

  return (
    <ModalShell onClose={onClose} maxWidth={540}>
      <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.2 }}>Request changes</h3>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>{kitchen.name} · submitted by {owner?.name || kitchen.ownerName}</span>
      </div>

      <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>Common issues</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
          {REQUEST_CHANGES_REASONS.map((r) =>
          <PerformCheckbox
            key={r.id}
            checked={!!selected[r.id]}
            onChange={() => toggle(r.id)}
            label={<span style={{ fontSize: 14 }}>{r.label}</span>} />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 4 }}>
          <PerformFieldLabel>Additional notes for the owner</PerformFieldLabel>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any extra context — what to fix, what evidence we need, etc."
            rows={4}
            style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>The owner sees both the checked items and your notes verbatim.</span>
        </div>
      </div>

      <div style={{ padding: '16px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <PerformButton variant="base" onClick={onClose}>Cancel</PerformButton>
        <PerformButton variant="brand" disabled={!canSubmit} onClick={() => setSubmitted(true)}>Send to owner</PerformButton>
      </div>
    </ModalShell>);

}

/* ============================================================
   ADMIN — LISTING PREVIEW (read-only listing detail)
   ============================================================ */
export function AdminListingPreview({ listingId, onBack }) {
  const k = RAK_KITCHENS.find((x) => x.id === listingId);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [changesOpen, setChangesOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  if (!k) return null;

  const isPending = k.status === 'pending';

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{
        background: 'rgb(254,243,199)',
        borderBottom: '1px solid rgb(238,235,234)',
        padding: '10px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RAKIcon name="eye" size={14} color="rgb(146,99,0)" />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(146,99,0)' }}>
            Admin preview — this is how chefs see the listing.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isPending &&
          <>
              <PerformButton variant="base" onClick={() => setChangesOpen(true)}>Request changes</PerformButton>
              <PerformButton variant="brand" iconLeft={<RAKIcon name="shield" size={14} color="#fff" />} onClick={() => setApproveOpen(true)}>Approve listing</PerformButton>
            </>
          }
          <span onClick={onBack} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgb(146,99,0)', fontFamily: "'Open Sans', sans-serif", fontSize: 13, cursor: 'pointer', fontWeight: 700
          }}>
            <RAKIcon name="arrow-left" size={12} color="rgb(146,99,0)" />
            Back to moderation
          </span>
        </div>
      </div>

      <ChefListingDetail
        kitchenId={listingId}
        onBack={onBack}
        onBook={() => {}}
        adminPreview
        onAdminApprove={() => setApproveOpen(true)}
        onAdminRequestChanges={() => setChangesOpen(true)} />

      {/* Sticky bottom action bar — also pending only */}
      {isPending &&
      <div style={{
        position: 'sticky', bottom: 0, zIndex: 5,
        background: '#fff', borderTop: '1px solid rgb(190,191,193)',
        padding: '12px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.06)'
      }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RAKStatusChip status={k.status} />
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>
              Submitted {k.listedAt} · {k.ownerName}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <PerformButton variant="base" onClick={() => setChangesOpen(true)}>Request changes</PerformButton>
            <PerformButton variant="brand" iconLeft={<RAKIcon name="shield" size={14} color="#fff" />} onClick={() => setApproveOpen(true)}>Approve listing</PerformButton>
          </div>
        </div>
      }

      {approveOpen &&
      <ApproveListingModal
        kitchen={k}
        onClose={() => setApproveOpen(false)}
        onConfirm={() => {setApproveOpen(false);setToast(k);setTimeout(onBack, 1500);}} />
      }
      {changesOpen &&
      <RequestChangesModal
        kitchen={k}
        onClose={() => setChangesOpen(false)}
        onSubmit={() => {setChangesOpen(false);onBack();}} />
      }
      {toast &&
      <ApprovedToast kitchen={toast} onDismiss={() => setToast(null)} />
      }
    </div>);

}

/* ============================================================
   ADMIN — USER PROFILE / DETAIL
   ============================================================ */
export function AdminUserDetail({ userId, onBack }) {
  const u = RAK_USERS.find((x) => x.id === userId);
  if (!u) return null;

  const ownedListings = u.role === 'owner' ? RAK_KITCHENS.filter((k) => k.ownerId === userId) : [];
  const bookings = u.role === 'chef' ? RAK_BOOKINGS.filter((b) => b.chefId === userId) : [];

  const [deactivated, setDeactivated] = React.useState(false);
  const [deactivateOpen, setDeactivateOpen] = React.useState(false);
  const [messageOpen, setMessageOpen] = React.useState(false);

  return (
    <RAKPageFrame padding={0}>
      {/* Title header */}
      <div style={{ padding: '20px 32px 18px', borderBottom: '1px solid rgb(238,235,234)' }}>
        <span onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 14, cursor: 'pointer'
        }}>
          <RAKIcon name="arrow-left" size={14} color="rgb(0,145,179)" />
          Back to users
        </span>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
              color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Varela Round', sans-serif", fontSize: 26
            }}>{u.avatar}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 32, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.05 }}>{u.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <RAKStatusChip status={deactivated ? 'suspended' : u.verified ? 'verified' : 'unverified'} />
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', textTransform: 'capitalize' }}>{u.role}</span>
                {u.city && <><span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>·</span>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{u.city}</span></>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="message" size={14} color="rgb(0,114,152)" />} onClick={() => setMessageOpen(true)}>Message {u.role === 'chef' ? 'chef' : u.role === 'owner' ? 'owner' : 'user'}</PerformButton>
            {!deactivated ?
            <PerformButton variant="base" iconLeft={<RAKIcon name="x" size={14} color="rgb(193,49,49)" />} onClick={() => setDeactivateOpen(true)} style={{ color: 'rgb(193,49,49)', borderColor: 'rgb(232,170,170)' }}>Deactivate account</PerformButton> :
            <PerformButton variant="brand" onClick={() => setDeactivated(false)}>Reactivate account</PerformButton>}
          </div>
        </div>
      </div>

      {deactivated &&
      <div style={{ padding: '12px 32px', background: 'rgb(254,232,232)', borderBottom: '1px solid rgb(238,235,234)' }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(193,49,49)', fontWeight: 600 }}>
            Account deactivated. {ownedListings.length > 0 ? `${ownedListings.length} listing${ownedListings.length === 1 ? '' : 's'} have been taken offline.` : 'The user can no longer sign in.'}
          </span>
        </div>
      }

      <div style={{ padding: '24px 32px 60px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <ListingSection title="Account">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <DetailField label="Email" value={u.email} />
              <DetailField label="User ID" value={u.id.toUpperCase()} />
              <DetailField label="Joined" value={u.joinedAt} />
              <DetailField label="Verified" value={u.verified ? 'Yes' : 'No'} />
              {u.role === 'chef' && <DetailField label="Specialty" value={u.specialty || '—'} />}
              {u.role === 'owner' && <DetailField label="Business" value={u.businessName || '—'} />}
            </div>
          </ListingSection>

          {u.role === 'owner' && ownedListings.length > 0 &&
          <ListingSection title={`Listings (${ownedListings.length})`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ownedListings.map((k) =>
              <div key={k.id} style={{
                display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 14,
                padding: 10, border: '1px solid rgb(238,235,234)', borderRadius: 4,
                alignItems: 'center',
                opacity: deactivated ? 0.55 : 1
              }}>
                    <img src={k.photo} alt="" style={{ width: 64, height: 48, borderRadius: 4, objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>{k.name}</span>
                      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k.suburb}, {k.city} · ${k.hourlyRate}/hr</span>
                    </div>
                    <RAKStatusChip status={deactivated ? 'suspended' : k.status} />
                  </div>
              )}
              </div>
            </ListingSection>
          }

          {u.role === 'chef' &&
          <ListingSection title={`Bookings (${bookings.length})`}>
              {bookings.length === 0 ?
            <PerformInfoPanel>No bookings yet.</PerformInfoPanel> :
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {bookings.map((b) => {
                const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
                return (
                  <div key={b.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14,
                    padding: 10, border: '1px solid rgb(238,235,234)', borderRadius: 4,
                    alignItems: 'center'
                  }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>{k?.name}</span>
                            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start}–{b.end} · ${b.total}</span>
                          </div>
                          <RAKStatusChip status={b.status} />
                        </div>);
              })}
                  </div>
            }
            </ListingSection>
          }
        </div>

        {/* RIGHT — quick actions */}
        <div style={{
          background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
          padding: 18, display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 16
        }}>
          <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: 0 }}>Admin actions</h3>
          <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="message" size={14} color="rgb(0,114,152)" />} onClick={() => setMessageOpen(true)} style={{ width: '100%' }}>Message user</PerformButton>
          {!deactivated ?
          <PerformButton variant="base" iconLeft={<RAKIcon name="x" size={14} color="rgb(193,49,49)" />} onClick={() => setDeactivateOpen(true)} style={{ width: '100%', color: 'rgb(193,49,49)', borderColor: 'rgb(232,170,170)' }}>Deactivate account</PerformButton> :
          <PerformButton variant="brand" onClick={() => setDeactivated(false)} style={{ width: '100%' }}>Reactivate account</PerformButton>}
          <PerformInfoPanel tone="note">
            Deactivating {u.role === 'owner' ? 'an owner also takes all their listings offline immediately.' : 'a chef cancels any pending booking requests and signs them out.'}
          </PerformInfoPanel>
        </div>
      </div>

      {deactivateOpen &&
      <DeactivateAccountModal
        user={u}
        listingCount={ownedListings.length}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={() => {setDeactivated(true);setDeactivateOpen(false);}} />
      }
      {messageOpen &&
      <AdminMessageModal user={u} onClose={() => setMessageOpen(false)} onSend={() => setMessageOpen(false)} />
      }
    </RAKPageFrame>);

}

function DetailField({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{label}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)' }}>{value}</span>
    </div>);

}

function DeactivateAccountModal({ user, listingCount, onClose, onConfirm }) {
  return (
    <ModalShell onClose={onClose} maxWidth={460}>
      <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgb(254,232,232)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 4
        }}>
          <RAKIcon name="flag" size={22} color="rgb(193,49,49)" />
        </div>
        <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.2 }}>Deactivate {user.name}?</h3>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>{user.email}</span>
      </div>

      <div style={{ padding: '14px 24px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.55 }}>
          The user will be signed out immediately and won't be able to sign back in.
        </p>
        {listingCount > 0 &&
        <PerformInfoPanel tone="warning">
            This account owns <strong>{listingCount} active listing{listingCount === 1 ? '' : 's'}</strong>. They will be taken offline and any future bookings cancelled.
          </PerformInfoPanel>
        }
      </div>

      <div style={{ padding: '16px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <PerformButton variant="base" onClick={onClose}>Cancel</PerformButton>
        <PerformButton variant="brand" onClick={onConfirm} style={{ background: 'rgb(193,49,49)', borderColor: 'rgb(193,49,49)' }}>Deactivate</PerformButton>
      </div>
    </ModalShell>);

}

function AdminMessageModal({ user, onClose, onSend }) {
  const [body, setBody] = React.useState('');
  return (
    <ModalShell onClose={onClose} maxWidth={520}>
      <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.2 }}>Message {user.name}</h3>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>Sent from RAK admin · {user.email}</span>
      </div>
      <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <PerformFieldLabel>Message</PerformFieldLabel>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Hi ${user.name.split(' ')[0]} — just following up on…`}
          rows={6}
          style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>The user receives this in their RAK inbox and as an email.</span>
      </div>
      <div style={{ padding: '16px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <PerformButton variant="base" onClick={onClose}>Cancel</PerformButton>
        <PerformButton variant="brand" disabled={!body.trim()} onClick={onSend} iconLeft={<RAKIcon name="send" size={14} color="#fff" />}>Send message</PerformButton>
      </div>
    </ModalShell>);

}

/* ============================================================
   Generic modal shell (centred, dimmed backdrop)
   ============================================================ */
function ModalShell({ onClose, maxWidth = 480, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(32,33,36,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 6, width: '100%', maxWidth,
          boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh', overflow: 'hidden'
        }}>
        {children}
      </div>
    </div>);

}

function ListingSection({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(95,99,104)', margin: 0 }}>{title}</h2>
      <div style={{ background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5, padding: 18 }}>
        {children}
      </div>
    </div>
  );
}
