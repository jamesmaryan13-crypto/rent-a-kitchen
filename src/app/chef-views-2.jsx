// Rent a kitchen — CHEF views part 2
// Listing detail, booking flow, profile, my bookings, messages.

import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformRadio, PerformCheckbox, PerformSelect, PerformFieldLabel } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { RAKIcon, RAK_ICON_PATHS } from './icons';
import { RAK_KITCHENS, RAK_USERS, RAK_BOOKINGS, RAK_THREADS, RAK_lookup } from './data';
import { RAK_formatDate, RAKPageFrame, RAKPageHeader, RAKStatusChip, RAKConfirmModal, RAKShareModal, RAKKpiTile, rakGetSaved, rakSetSaved, rakToggleSaved, useSavedListings } from './shell';
import { ChefListingCard, FakeMap, RAK_EQUIPMENT_OPTIONS, RAK_CERT_OPTIONS, RAKDropdownChip } from './chef-views-1';

/* ============================================================
   LISTING DETAIL
   ============================================================ */
export function ChefListingDetail({ kitchenId, onBack, onBook, adminPreview = false, onAdminApprove, onAdminRequestChanges, onAdminDeactivate }) {
  const k = RAK_KITCHENS.find((x) => x.id === kitchenId);
  if (!k) return null;
  const [imgIdx, setImgIdx] = React.useState(0);
  const saved = useSavedListings();
  const [shareOpen, setShareOpen] = React.useState(false);
  const [deactivateOpen, setDeactivateOpen] = React.useState(false);
  const isSaved = saved.isSaved(kitchenId);
  const shareUrl = `https://rentakitchen.com.au/l/${kitchenId}`;

  return (
    <RAKPageFrame padding={0}>
      <div style={{ padding: '20px 32px 0' }}>
        <span onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 14, cursor: 'pointer'
        }}>
          <RAKIcon name="arrow-left" size={14} color="rgb(0,145,179)" />
          Back to results
        </span>
      </div>

      <div style={{ padding: '14px 32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 39, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.05 }}>{k.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, color: 'rgb(95,99,104)', fontFamily: "'Open Sans', sans-serif", fontSize: 14 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <RAKIcon name="star" size={14} color="rgb(234,186,0)" />
                <span style={{ fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.rating}</span> · {k.reviewCount} reviews
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <RAKIcon name="map-pin" size={14} color="rgb(95,99,104)" />
                {k.suburb}, {k.city}
              </span>
              <span>Hosted by {k.ownerName}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <PerformButton
              variant={isSaved ? 'brand-outline' : 'base'}
              iconLeft={<RAKIcon name={isSaved ? 'heart' : 'heart-outline'} size={14} color={isSaved ? 'rgb(0,114,152)' : 'rgb(32,33,36)'} />}
              onClick={() => saved.toggle(kitchenId)}>
              {isSaved ? 'Saved' : 'Save'}
            </PerformButton>
            <PerformButton variant="base" onClick={() => setShareOpen(true)}>Share</PerformButton>
          </div>
        </div>
      </div>

      <RAKShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={k.name}
        url={shareUrl} />

      {deactivateOpen && (
        <RAKConfirmModal
          title={`Deactivate "${k.name}"?`}
          message={`The listing will be removed from chef search results immediately and any pending booking requests will be auto-declined. The owner will be notified. You can reactivate it later from the admin listings table.`}
          primary={{ label: 'Deactivate listing', onClick: () => { setDeactivateOpen(false); onAdminDeactivate && onAdminDeactivate(k.id); } }}
          secondary={{ label: 'Cancel', onClick: () => setDeactivateOpen(false) }}
          onClose={() => setDeactivateOpen(false)} />
      )}

      {/* Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gridTemplateRows: '160px 160px',
        gap: 8,
        margin: '0 32px',
        height: 328
      }}>
        <div style={{ gridRow: 'span 2', overflow: 'hidden', borderRadius: 4, background: 'rgb(238,235,234)', cursor: 'pointer' }}
        onClick={() => setImgIdx(0)}>
          <img src={k.photos[0]} alt={k.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        {[1, 2, 3, 4].map((i) =>
        <div key={i} style={{ overflow: 'hidden', borderRadius: 4, background: 'rgb(238,235,234)', cursor: 'pointer', position: 'relative' }}>
            {k.photos[i] && <img src={k.photos[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
            {i === 4 &&
          <button type="button" style={{
            position: 'absolute', bottom: 12, right: 12,
            background: '#fff', border: '1px solid rgb(32,33,36)', borderRadius: 4,
            padding: '6px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6
          }}>
                <RAKIcon name="camera" size={12} color="rgb(32,33,36)" />
                Show all photos
              </button>
          }
          </div>
        )}
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <ListingSection title="About this kitchen">
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)', lineHeight: 1.55, margin: 0 }}>
              {k.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginTop: 16 }}>
              <ListingFact label="Size" value={`${k.sqm} m²`} />
              <ListingFact label="Capacity" value={`Up to ${k.capacity} chefs`} />
              <ListingFact label="Hours of operation" value={k.hours} />
              <ListingFact label="Cancellation" value={k.cancellation} />
            </div>
          </ListingSection>

          <ListingSection title="Equipment & features">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
              {k.equipment.map((eq) =>
              <div key={eq} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PerformIcon name="check" size={12} color="rgb(0,114,152)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)' }}>{eq}</span>
                </div>
              )}
            </div>
          </ListingSection>

          <ListingSection title="Certifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {k.certifications.map((c) =>
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RAKIcon name="shield" size={16} color="rgb(0,114,152)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)' }}>{c}</span>
                </div>
              )}
            </div>
          </ListingSection>

          <ListingSection title="Location">
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', margin: '0 0 12px' }}>{k.address}</p>
            <div style={{ position: 'relative', height: 220, borderRadius: 4, overflow: 'hidden', border: '1px solid rgb(238,235,234)' }}>
              <FakeMap kitchens={[k]} hoveredId={k.id} onHover={() => {}} onPinClick={() => {}} city={k.city} />
            </div>
          </ListingSection>

          <ListingSection title={`${k.reviewCount} reviews`} accessory={<RAKIcon name="star" size={16} color="rgb(234,186,0)" />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {SAMPLE_REVIEWS.map((r) =>
              <ListingReview key={r.id} review={r} />
              )}
            </div>
            <span style={{ display: 'inline-flex', marginTop: 16, color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Show all {k.reviewCount} reviews
            </span>
          </ListingSection>
        </div>

        {/* Sticky booking panel */}
        <div style={{ position: 'relative' }} data-comment-anchor="35d9c68644-div-135-9">
          <div style={{
            position: 'sticky', top: 16,
            background: '#fff', border: '1px solid rgb(190,191,193)',
            borderRadius: 5, padding: 24,
            display: 'flex', flexDirection: 'column', gap: 16
          }}>
            <div>
              <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 28, color: 'rgb(32,33,36)' }}>${k.hourlyRate}</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}> / hour</span>
              <span style={{ display: 'block', fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', marginTop: 2 }}>or ${k.dailyRate} for a full day</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid rgb(221,219,218)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ padding: '10px 12px', borderRight: '1px solid rgb(221,219,218)' }} data-comment-anchor="2c81a98c5c-div-148-15">
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3 }} data-comment-anchor="6bb7077755-div-149-17">Date</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', marginTop: 2 }} data-comment-anchor="810f7974b7-div-150-17">22 May 2026</div>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3 }}>Hours</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', marginTop: 2 }}>6am – 2pm (8h)</div>
              </div>
            </div>
            {!adminPreview && <PerformButton variant="brand" onClick={() => onBook(k.id)} style={{ width: '100%', height: 42, fontSize: 16, justifyContent: 'center' }}>Request to book</PerformButton>}
            {!adminPreview && <span style={{ textAlign: 'center', fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>You won't be charged yet</span>}

            {adminPreview &&
            <div style={{
              marginTop: 4, padding: 14,
              background: 'rgb(254,243,199)',
              border: '1px solid rgb(245,222,151)',
              borderRadius: 4,
              display: 'flex', flexDirection: 'column', gap: 10
            }} data-comment-anchor="7ef882ccf9-div-176-15">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RAKIcon name="shield" size={14} color="rgb(146,99,0)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(146,99,0)' }}>
                    Admin review
                  </span>
                </div>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)', lineHeight: 1.5 }}>
                  {k.status === 'pending' ?
                'This listing is waiting on your decision.' :
                `Status: ${k.status}. You can still request changes.`}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <PerformButton variant="brand" iconLeft={<RAKIcon name="shield" size={14} color="#fff" />} onClick={() => onAdminApprove && onAdminApprove(k.id)} style={{ width: '100%', justifyContent: 'center' }}>Approve listing</PerformButton>
                  <PerformButton variant="base" onClick={() => onAdminRequestChanges && onAdminRequestChanges(k.id)} style={{ width: '100%', justifyContent: 'center' }}>Request changes</PerformButton>
                  <button type="button" onClick={() => setDeactivateOpen(true)}
                    style={{
                      width: '100%', padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
                      border: '1px solid rgb(244,210,210)', background: '#fff',
                      color: 'rgb(222,13,13)',
                      fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                    Deactivate listing
                  </button>
                </div>
              </div>
            }
            <div style={{ borderTop: '1px solid rgb(238,235,234)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>
                <span>${k.hourlyRate} × 8 hours</span>
                <span>${k.hourlyRate * 8}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>
                <span>Service fee</span>
                <span>${Math.round(k.hourlyRate * 8 * 0.08)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 700, color: 'rgb(32,33,36)', marginTop: 6, borderTop: '1px solid rgb(238,235,234)', paddingTop: 12 }}>
                <span>Total (AUD)</span>
                <span>${k.hourlyRate * 8 + Math.round(k.hourlyRate * 8 * 0.08)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RAKPageFrame>);

}

function ListingSection({ title, children, accessory = null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 24, borderBottom: '1px solid rgb(238,235,234)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 25, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1 }}>{title}</h3>
        {accessory}
      </div>
      <div>{children}</div>
    </div>);

}

function ListingFact({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{label}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)' }}>{value}</span>
    </div>);

}

export const SAMPLE_REVIEWS = [
{ id: 1, name: 'Sofia C.', when: 'May 2026', text: 'Spotless, well-stocked, and the host let me in at 5am for a catering job. Everything worked perfectly.' },
{ id: 2, name: 'David O.', when: 'April 2026', text: 'Used the cool room for 3 days. Plenty of space and Eleanor was very responsive over messages.' },
{ id: 3, name: 'Tom W.', when: 'March 2026', text: 'Great equipment but the loading dock can be busy on Saturdays. Plan accordingly.' },
{ id: 4, name: 'Priya K.', when: 'February 2026', text: 'Booked for a recipe shoot. The natural light in the morning is fantastic.' }];


export function ListingReview({ review }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgb(0,114,152)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
          {review.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{review.name}</span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{review.when}</span>
        </div>
      </div>
      <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.5 }}>{review.text}</p>
    </div>);

}

/* ============================================================
   BOOKING FLOW
   ============================================================ */
export function ChefBookingFlow({ kitchenId, onBack, onConfirm }) {
  const k = RAK_KITCHENS.find((x) => x.id === kitchenId);
  const [step, setStep] = React.useState(1);
  const [details, setDetails] = React.useState({
    date: '22 May 2026',
    startTime: '6:00 am',
    endTime: '2:00 pm',
    note: '',
    cardName: 'Mia Tanaka',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '08 / 27',
    cardCvc: '123'
  });
  const set = (key, v) => setDetails((d) => ({ ...d, [key]: v }));

  const hours = 8;
  const subtotal = k.hourlyRate * hours;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  return (
    <RAKPageFrame>
      <div style={{ maxWidth: 1080, margin: '24px auto 80px', padding: '0 40px', width: '100%', boxSizing: 'border-box' }}>
        <span onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 14, cursor: 'pointer'
        }}>
          <RAKIcon name="arrow-left" size={14} color="rgb(0,145,179)" />
          Back to listing
        </span>
        <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 39, color: 'rgb(95,99,104)', margin: '14px 0 0', lineHeight: 1.05 }}>Confirm your booking</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, marginTop: 28, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <BookingStepCard step={1} title="When you need the kitchen" open={step === 1} done={step > 1} onEdit={() => setStep(1)} summary={`${details.date} · ${details.startTime} – ${details.endTime}`}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 24px' }}>
                <PerformField label="Date" required value={details.date} onChange={(v) => set('date', v)} width="100%" />
                <PerformField label="Start time" required value={details.startTime} onChange={(v) => set('startTime', v)} width="100%" />
                <PerformField label="End time" required value={details.endTime} onChange={(v) => set('endTime', v)} width="100%" />
              </div>
              <PerformInfoPanel tone="info">
                Your booking covers 8 hours. The kitchen is available from {k.hours.toLowerCase()}.
              </PerformInfoPanel>
              <PerformButton variant="brand" onClick={() => setStep(2)}>Continue</PerformButton>
            </BookingStepCard>

            <BookingStepCard step={2} title="A message to the host" open={step === 2} done={step > 2} onEdit={() => setStep(2)} summary={details.note ? details.note.slice(0, 60) + (details.note.length > 60 ? '…' : '') : 'No message yet'}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <PerformFieldLabel>Tell Eleanor what you'll be cooking</PerformFieldLabel>
                <textarea
                  value={details.note}
                  onChange={(e) => set('note', e.target.value)}
                  placeholder="I'm prepping for a 60-person omakase event on Saturday evening. Mostly knife work and braising — I'll use the gas range and the cool room."
                  rows={4}
                  style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />

                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>The host has 24 hours to accept or decline.</span>
              </div>
              <PerformButton variant="brand" onClick={() => setStep(3)}>Continue</PerformButton>
            </BookingStepCard>

            <BookingStepCard step={3} title="Payment details" open={step === 3} done={false} onEdit={() => setStep(3)} summary="">
              <PerformInfoPanel tone="info">
                Your card is authorised now but only charged once the host accepts your booking.
              </PerformInfoPanel>
              <PerformField label="Name on card" required value={details.cardName} onChange={(v) => set('cardName', v)} width="100%" />
              <PerformField label="Card number" required value={details.cardNumber} onChange={(v) => set('cardNumber', v)} width="100%" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <PerformField label="Expiry" required value={details.cardExpiry} onChange={(v) => set('cardExpiry', v)} width="100%" />
                <PerformField label="CVC" required value={details.cardCvc} onChange={(v) => set('cardCvc', v)} width="100%" />
              </div>
              <PerformCheckbox checked label="Save this card for future bookings" />
              <PerformButton variant="brand" onClick={onConfirm} style={{ marginTop: 4 }}>
                Confirm and request booking
              </PerformButton>
            </BookingStepCard>
          </div>

          {/* Summary side panel */}
          <div style={{
            background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
            padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
            position: 'sticky', top: 16
          }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <img src={k.photo} alt="" style={{ width: 90, height: 80, borderRadius: 4, objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)', lineHeight: 1.3 }}>{k.name}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k.suburb}, {k.city}</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <RAKIcon name="star" size={11} color="rgb(234,186,0)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>{k.rating}</span>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>({k.reviewCount})</span>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgb(238,235,234)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h4 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', margin: 0 }}>Price details</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>
                <span>${k.hourlyRate} × {hours} hours</span>
                <span>${subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)', marginTop: 6, borderTop: '1px solid rgb(238,235,234)', paddingTop: 10 }}>
                <span>Total (AUD)</span>
                <span>${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RAKPageFrame>);

}

function BookingStepCard({ step, title, open, done, onEdit, summary, children }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid rgb(190,191,193)',
      borderRadius: 5, padding: 24,
      display: 'flex', flexDirection: 'column', gap: open ? 16 : 0,
      opacity: !open && !done ? 0.6 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            width: 28, height: 28, borderRadius: '50%',
            background: done ? 'rgb(0,114,152)' : '#fff',
            border: done ? 'none' : '2px solid ' + (open ? 'rgb(0,114,152)' : 'rgb(190,191,193)'),
            color: done ? '#fff' : open ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700
          }}>{done ? <PerformIcon name="check" size={12} color="#fff" /> : step}</span>
          <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1 }}>{title}</h3>
        </div>
        {done &&
        <span onClick={onEdit} style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(0,145,179)', cursor: 'pointer', fontWeight: 600 }}>Edit</span>
        }
      </div>
      {!open && done && summary &&
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', marginTop: 8, marginLeft: 42 }}>{summary}</span>
      }
      {open && children}
    </div>);

}

/* ============================================================
   CHEF — MY BOOKINGS
   ============================================================ */
export function ChefBookings({ onOpenListing, onOpenBooking, onEditBooking }) {
  const myBookings = RAK_BOOKINGS.filter((b) => b.chefId === 'chef-001');
  const upcoming = myBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending' || b.status === 'in-progress');
  const past = myBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const [cancelTarget, setCancelTarget] = React.useState(null);

  return (
    <RAKPageFrame>
      <RAKPageHeader title="My bookings" subtitle="Track your kitchen rentals — upcoming, in-progress, and past." />

      <div style={{ padding: '24px 32px 60px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <ChefBookingsSection title={`Upcoming (${upcoming.length})`} bookings={upcoming} onOpenListing={onOpenListing} onOpenBooking={onOpenBooking} onEditBooking={onEditBooking} onCancel={setCancelTarget} />
        <ChefBookingsSection title={`Past (${past.length})`} bookings={past} onOpenListing={onOpenListing} onOpenBooking={onOpenBooking} onEditBooking={onEditBooking} onCancel={setCancelTarget} />
      </div>

      {cancelTarget &&
      <CancelBookingModal
        booking={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => setCancelTarget(null)} />
      }
    </RAKPageFrame>);

}

function CancelBookingModal({ booking, onClose, onConfirm }) {
  const k = RAK_KITCHENS.find((x) => x.id === booking.listingId);
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
          background: '#fff', borderRadius: 6, width: '100%', maxWidth: 460,
          boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column'
        }}>
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.2 }}>Cancel this booking?</h3>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>Booking {booking.id.toUpperCase()} · {k && k.name}</span>
        </div>
        <div style={{ padding: '14px 24px 4px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.5 }}>
            {RAK_formatDate(booking.date)} · {booking.start} – {booking.end}
          </p>
          <PerformInfoPanel tone="warning">
            Cancelling within 48 hours of your booking incurs a 50% fee. Your card will be refunded the remaining balance within 5–7 business days.
          </PerformInfoPanel>
        </div>
        <div style={{ padding: '16px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <PerformButton variant="base" onClick={onClose}>Keep booking</PerformButton>
          <PerformButton variant="brand" onClick={onConfirm}>Cancel booking</PerformButton>
        </div>
      </div>
    </div>);

}

function ChefBookingsSection({ title, bookings, onOpenListing, onOpenBooking, onEditBooking, onCancel }) {
  if (bookings.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(95,99,104)', margin: 0 }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bookings.map((b) => {
          const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
          const cancellable = b.status === 'confirmed' || b.status === 'pending';
          return (
            <ChefBookingRow
              key={b.id}
              booking={b}
              kitchen={k}
              cancellable={cancellable}
              onOpen={() => onOpenBooking ? onOpenBooking(b.id) : onOpenListing(b.listingId)}
              onViewListing={() => onOpenListing(b.listingId)}
              onEditBooking={onEditBooking}
              onCancel={onCancel} />);

        })}
      </div>
    </div>);

}

function ChefBookingRow({ booking: b, kitchen: k, cancellable, onOpen, onViewListing, onEditBooking, onCancel }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <div onClick={onOpen}
    onMouseEnter={(e) => {e.currentTarget.style.background = 'rgb(248,247,247)';}}
    onMouseLeave={(e) => {e.currentTarget.style.background = '#fff';}}
    style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr auto auto auto auto',
      gap: 20, alignItems: 'center',
      background: '#fff',
      border: '1px solid rgb(190,191,193)', borderRadius: 5,
      padding: '14px 18px', cursor: 'pointer',
      transition: 'background 120ms'
    }}>
      <img src={k.photo} alt="" style={{ width: 80, height: 64, borderRadius: 4, objectFit: 'cover' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.name}</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{k.suburb}, {k.city}</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>Booking {b.id.toUpperCase()}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Date</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)' }}>{RAK_formatDate(b.date)}</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{b.start} – {b.end}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Total</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 700, color: 'rgb(32,33,36)' }}>${b.total}</span>
      </div>
      <RAKStatusChip status={b.status} />

      {/* 3-dot menu */}
      <div ref={menuRef} style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          title="More"
          aria-label="More actions"
          style={{
            width: 32, height: 32, borderRadius: 4,
            border: '1px solid ' + (menuOpen ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
            background: menuOpen ? 'rgb(230,244,247)' : '#fff',
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
          <RAKIcon name="more-vertical" size={16} color="rgb(95,99,104)" />
        </button>

        {menuOpen &&
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 20,
          background: '#fff', borderRadius: 4,
          border: '1px solid rgb(190,191,193)',
          boxShadow: '0 6px 18px rgba(0,0,0,0.14)',
          minWidth: 180, padding: 4,
          display: 'flex', flexDirection: 'column'
        }}>
            <MenuItem
            icon="eye"
            label="View kitchen"
            onClick={() => {setMenuOpen(false);if (onViewListing) onViewListing();}} />
            <MenuItem
            icon="edit"
            label="Edit booking"
            disabled={!cancellable}
            onClick={() => {setMenuOpen(false);if (cancellable && onEditBooking) onEditBooking(b.listingId);}} />
            <MenuItem
            icon="x"
            label="Cancel"
            danger
            disabled={!cancellable}
            onClick={() => {setMenuOpen(false);if (cancellable && onCancel) onCancel(b);}} />
          </div>
        }
      </div>
    </div>);

}

function MenuItem({ icon, label, onClick, danger, disabled }) {
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
   CHEF BOOKING DETAIL (confirmation page)
   ============================================================ */
export function ChefBookingDetail({ bookingId, onBack, onOpenListing, onEdit }) {
  const b = RAK_BOOKINGS.find((x) => x.id === bookingId);
  if (!b) return null;
  const k = RAK_KITCHENS.find((x) => x.id === b.listingId);
  const owner = RAK_USERS.find((u) => u.id === k.ownerId) || { name: 'Eleanor Khoury', avatar: 'EK' };
  const subtotal = k.hourlyRate * b.hours;
  const serviceFee = b.total - subtotal;
  const cancellable = b.status === 'confirmed' || b.status === 'pending';
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const statusCopy = {
    confirmed: { title: 'Booking confirmed', body: `${owner.name} has accepted your booking. You'll receive kitchen access instructions 24 hours before your start time.`, tone: 'success' },
    pending: { title: 'Waiting on the host', body: `${owner.name} has 24 hours to accept or decline. Your card has been authorised but not yet charged.`, tone: 'info' },
    'in-progress': { title: 'Booking in progress', body: "You're currently in the kitchen. Reach out to the host via Messages if anything needs attention.", tone: 'info' },
    completed: { title: 'Booking completed', body: 'Thanks for using Rent a Kitchen — leave a review to help future chefs.', tone: 'success' },
    cancelled: { title: 'Booking cancelled', body: 'This booking was cancelled. If applicable, refunds appear on your statement within 5–7 business days.', tone: 'warning' }
  }[b.status] || { title: 'Booking', body: '', tone: 'info' };

  const handleDownload = (kind) => {
    const html = renderInvoiceHtml({ booking: b, kitchen: k, owner, subtotal, serviceFee, kind });
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => {try {w.focus();w.print();} catch (_) {}}, 300);
  };

  return (
    <RAKPageFrame padding={0}>
      {/* Title strip */}
      <div style={{ padding: '24px 32px 18px', borderBottom: '1px solid rgb(238,235,234)', background: '#fff' }}>
        <span onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 14, cursor: 'pointer'
        }}>
          <RAKIcon name="arrow-left" size={14} color="rgb(0,145,179)" />
          Back to bookings
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700 }}>Booking {b.id.toUpperCase()}</span>
            <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 36, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>{k.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
              <RAKStatusChip status={b.status} />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>·</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{RAK_formatDate(b.date)} · {b.start} – {b.end}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <PerformButton variant="base" iconLeft={<RAKIcon name="download" size={14} color="rgb(32,33,36)" />} onClick={() => handleDownload('invoice')}>Invoice (PDF)</PerformButton>
            <PerformButton variant="base" iconLeft={<RAKIcon name="download" size={14} color="rgb(32,33,36)" />} onClick={() => handleDownload('receipt')}>Receipt (PDF)</PerformButton>
            {cancellable &&
            <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="edit" size={14} color="rgb(0,114,152)" />} onClick={() => onEdit && onEdit(b.listingId)}>Edit booking</PerformButton>
            }
            {cancellable &&
            <PerformButton variant="brand" iconLeft={<RAKIcon name="x" size={14} color="#fff" />} onClick={() => setCancelOpen(true)}>Cancel booking</PerformButton>
            }
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 32px 60px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Status banner */}
          <BookingStatusBanner copy={statusCopy} />

          {/* Kitchen card */}
          <div style={{
            background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
            padding: 0, overflow: 'hidden',
            display: 'grid', gridTemplateColumns: '200px 1fr'
          }}>
            <img src={k.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(32,33,36)' }}>{k.name}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>
                    <RAKIcon name="map-pin" size={12} color="rgb(95,99,104)" />
                    {k.address}
                  </span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <RAKIcon name="star" size={13} color="rgb(234,186,0)" />
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700 }}>{k.rating}</span>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>({k.reviewCount})</span>
                </div>
              </div>
              <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.5 }}>
                {k.sqm} m² · capacity {k.capacity} chefs · ${k.hourlyRate}/hr
              </p>
              <span onClick={() => onOpenListing && onOpenListing(k.id)} style={{
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
                color: 'rgb(0,145,179)', cursor: 'pointer', marginTop: 4
              }}>View kitchen →</span>
            </div>
          </div>

          {/* Schedule + access */}
          <ListingSection title="Schedule">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              <BookingDetailField icon="calendar" label="Date" value={RAK_formatDate(b.date)} />
              <BookingDetailField icon="clock" label="Hours" value={`${b.start} – ${b.end}`} sub={`${b.hours} hours`} />
              <BookingDetailField icon="map-pin" label="Access" value={b.status === 'confirmed' || b.status === 'in-progress' ? 'Door code sent' : '—'} sub={b.status === 'confirmed' || b.status === 'in-progress' ? 'Sent 24h before start' : 'Available after host accepts'} />
            </div>
          </ListingSection>

          {/* Host */}
          <ListingSection title="Host">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontFamily: "'Varela Round', sans-serif", fontSize: 20
              }}>{owner.avatar || (owner.name || 'H').split(' ').map((s) => s[0]).slice(0, 2).join('')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700 }}>{owner.name}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>Typically responds within 2 hours</span>
              </div>
              <PerformButton variant="base" iconLeft={<RAKIcon name="message" size={14} color="rgb(32,33,36)" />}>Message host</PerformButton>
            </div>
          </ListingSection>

          {/* Note */}
          <ListingSection title="Note to host">
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>
              "I'm prepping for a 60-person omakase event on Saturday evening. Mostly knife work and braising — I'll use the gas range and the cool room."
            </p>
          </ListingSection>

          {/* Activity */}
          <ListingSection title="Booking activity">
            <BookingActivity booking={b} ownerName={owner.name} />
          </ListingSection>
        </div>

        {/* RIGHT SIDE — payment summary */}
        <div style={{
          background: '#fff', border: '1px solid rgb(190,191,193)', borderRadius: 5,
          padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
          position: 'sticky', top: 16
        }}>
          <h3 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 20, color: 'rgb(32,33,36)', margin: 0 }}>Payment</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PriceRow label={`$${k.hourlyRate} × ${b.hours} hours`} value={`$${subtotal}`} />
            <PriceRow label="Service fee (8%)" value={`$${serviceFee}`} />
            <div style={{ borderTop: '1px solid rgb(238,235,234)', paddingTop: 10 }}>
              <PriceRow label="Total" value={`$${b.total}`} bold />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: 'rgb(248,247,247)', borderRadius: 4, marginTop: 4 }}>
            <div style={{
              width: 32, height: 22, borderRadius: 3,
              background: 'linear-gradient(135deg, rgb(0,114,152), rgb(0,145,179))',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: 9, fontWeight: 700
            }}>VISA</div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgb(32,33,36)' }}>Visa •••• 4242</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>
                {b.status === 'pending' ? 'Authorised — not yet charged' : b.status === 'cancelled' ? 'Refunded' : 'Charged'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <PerformButton variant="base" iconLeft={<RAKIcon name="download" size={14} color="rgb(32,33,36)" />} onClick={() => handleDownload('invoice')} style={{ width: '100%' }}>Download invoice</PerformButton>
            <PerformButton variant="base" iconLeft={<RAKIcon name="download" size={14} color="rgb(32,33,36)" />} onClick={() => handleDownload('receipt')} style={{ width: '100%' }}>Download receipt</PerformButton>
          </div>

          <PerformInfoPanel tone="info">
            Need to change something? Edit the booking before the host's acceptance window closes — no fees if updated 48h+ in advance.
          </PerformInfoPanel>
        </div>
      </div>

      {cancelOpen &&
      <CancelBookingModal
        booking={b}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => {setCancelOpen(false);onBack();}} />
      }
    </RAKPageFrame>);

}

function BookingStatusBanner({ copy }) {
  const palette = copy.tone === 'success' ?
  { bg: 'rgb(220,243,228)', fg: 'rgb(31,121,77)', icon: 'shield' } :
  copy.tone === 'warning' ?
  { bg: 'rgb(254,243,199)', fg: 'rgb(146,99,0)', icon: 'flag' } :
  { bg: 'rgb(230,244,247)', fg: 'rgb(0,114,152)', icon: 'shield' };
  return (
    <div style={{
      background: palette.bg, borderRadius: 5,
      padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <RAKIcon name={palette.icon} size={18} color={palette.fg} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: palette.fg }}>{copy.title}</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', lineHeight: 1.5 }}>{copy.body}</span>
      </div>
    </div>);

}

function BookingDetailField({ icon, label, value, sub }) {
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

function BookingActivity({ booking, ownerName }) {
  const steps = [];
  steps.push({ when: '14 May 2026 · 9:32 am', label: 'Booking requested', detail: 'You sent the request to ' + ownerName + '.', done: true });
  if (booking.status !== 'pending') {
    steps.push({ when: '14 May 2026 · 11:08 am', label: 'Host accepted', detail: ownerName + ' confirmed the booking and your card was charged.', done: true });
  }
  if (booking.status === 'in-progress' || booking.status === 'completed') {
    steps.push({ when: booking.date + ' · ' + booking.start, label: 'Booking started', detail: 'Door code unlocked at start time.', done: true });
  }
  if (booking.status === 'completed') {
    steps.push({ when: booking.date + ' · ' + booking.end, label: 'Booking completed', detail: 'Final charge confirmed. Leave a review to help future chefs.', done: true });
  }
  if (booking.status === 'cancelled') {
    steps.push({ when: booking.date, label: 'Booking cancelled', detail: 'Refund issued to original payment method.', done: true });
  }
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {steps.map((s, i) =>
      <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'rgb(0,114,152)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
              <RAKIcon name="shield" size={10} color="#fff" />
            </span>
            {i < steps.length - 1 && <span style={{ flex: 1, width: 2, background: 'rgb(221,219,218)', minHeight: 18 }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: i < steps.length - 1 ? 8 : 0 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{s.label}</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{s.when}</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(32,33,36)', lineHeight: 1.5, marginTop: 2 }}>{s.detail}</span>
          </div>
        </li>
      )}
    </ol>);

}

function PriceRow({ label, value, bold }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: bold ? 16 : 14,
      fontWeight: bold ? 700 : 400,
      color: bold ? 'rgb(32,33,36)' : 'rgb(32,33,36)'
    }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>);

}

function renderInvoiceHtml({ booking, kitchen, owner, subtotal, serviceFee, kind }) {
  const isReceipt = kind === 'receipt';
  const title = isReceipt ? 'Receipt' : 'Tax Invoice';
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${title} — ${booking.id.toUpperCase()}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Open Sans', Helvetica, Arial, sans-serif; color: #202124; margin: 0; padding: 32px; line-height: 1.5; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #007298; padding-bottom: 20px; }
  .brand { font-family: 'Varela Round', sans-serif; font-size: 28px; color: #007298; }
  .meta { text-align: right; font-size: 13px; color: #5f6368; }
  h1 { font-family: 'Varela Round', sans-serif; font-size: 24px; margin: 24px 0 0; }
  .sub { font-size: 13px; color: #5f6368; margin-top: 4px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 28px; }
  .block h3 { font-family: 'Varela Round', sans-serif; font-size: 14px; color: #5f6368; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .block p { margin: 2px 0; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin-top: 32px; }
  th, td { text-align: left; padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #eeebea; }
  th { background: #f8f7f7; font-weight: 700; }
  td.num, th.num { text-align: right; }
  .totals { width: 320px; margin-left: auto; margin-top: 12px; }
  .totals tr td { border: none; padding: 6px 12px; }
  .totals tr.total td { border-top: 2px solid #202124; font-size: 16px; font-weight: 700; padding-top: 12px; }
  .stamp { display: inline-block; margin-top: 28px; padding: 8px 16px; border: 2px solid ${isReceipt ? '#1f794d' : '#007298'}; color: ${isReceipt ? '#1f794d' : '#007298'}; font-weight: 700; letter-spacing: 1px; transform: rotate(-4deg); border-radius: 4px; }
  .footer { margin-top: 48px; border-top: 1px solid #eeebea; padding-top: 16px; font-size: 12px; color: #5f6368; }
</style></head>
<body>
  <div class="head">
    <div>
      <div class="brand">Rent a Kitchen</div>
      <div class="sub">RAK Marketplace Pty Ltd · ABN 99 100 200 300<br>Level 4, 1 Bligh Street, Sydney NSW 2000</div>
    </div>
    <div class="meta">
      <div style="font-size:20px;font-weight:700;color:#202124;">${title}</div>
      <div>${title} #${booking.id.toUpperCase()}</div>
      <div>Issued: ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
    </div>
  </div>

  <h1>${title} for booking ${booking.id.toUpperCase()}</h1>
  <div class="sub">${kitchen.name} · ${booking.date} · ${booking.start} – ${booking.end}</div>

  <div class="grid">
    <div class="block">
      <h3>Billed to</h3>
      <p><strong>Mia Tanaka</strong></p>
      <p>Mia's Omakase Pty Ltd</p>
      <p>ABN 51 824 753 556</p>
      <p>mia.tanaka@example.com</p>
    </div>
    <div class="block">
      <h3>Host</h3>
      <p><strong>${owner.name}</strong></p>
      <p>${kitchen.address}</p>
      <p>Booking ID: ${booking.id.toUpperCase()}</p>
    </div>
  </div>

  <table>
    <thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead>
    <tbody>
      <tr>
        <td>Kitchen rental — ${kitchen.name}<br><span style="font-size:12px;color:#5f6368;">${booking.date}, ${booking.start} – ${booking.end}</span></td>
        <td class="num">${booking.hours} hrs</td>
        <td class="num">$${kitchen.hourlyRate}.00</td>
        <td class="num">$${subtotal}.00</td>
      </tr>
      <tr>
        <td>RAK service fee (8%)</td>
        <td class="num">1</td>
        <td class="num">$${serviceFee}.00</td>
        <td class="num">$${serviceFee}.00</td>
      </tr>
    </tbody>
  </table>

  <table class="totals">
    <tr><td>Subtotal (excl. GST)</td><td class="num">$${Math.round(booking.total / 1.1)}.00</td></tr>
    <tr><td>GST (10%)</td><td class="num">$${booking.total - Math.round(booking.total / 1.1)}.00</td></tr>
    <tr class="total"><td>Total (AUD)</td><td class="num">$${booking.total}.00</td></tr>
  </table>

  <div class="stamp">${isReceipt ? 'PAID' : 'DUE ON ACCEPTANCE'}</div>

  <div class="footer">
    ${isReceipt ?
  'Payment received in full. This receipt is your proof of payment. Funds settled to host within 24 hours of booking completion.' :
  'Your card has been authorised. The total will be charged to Visa •••• 4242 upon host acceptance. No further action required.'}
    <br>Questions? Contact billing@rentakitchen.com.au or +61 2 9000 0000.
  </div>
</body></html>`;
}

/* ============================================================
   CHEF PROFILE
   ============================================================ */
export const RAK_CHEF_CREDENTIALS = [
  {
    key: 'food-safety',
    title: 'Food Safety Supervisor (NSW)',
    subtitle: 'Statutory requirement for handling food in NSW commercial kitchens.',
    required: true,
    seeded: {
      name: 'FoodSafetySupervisor-Tanaka.pdf',
      sizeKb: 184,
      uploadedAt: '2025-03-08',
      expiresAt: '2027-03-08',
      issuer: 'NSW Food Authority',
    },
  },
  {
    key: 'abn',
    title: 'ABN registration',
    subtitle: 'Australian Business Number for invoicing kitchen owners.',
    required: true,
    seeded: {
      name: 'ABN-MiasOmakase.pdf',
      sizeKb: 96,
      uploadedAt: '2024-06-12',
      expiresAt: null,
      issuer: 'Australian Business Register',
    },
  },
  {
    key: 'public-liability',
    title: 'Public liability insurance',
    subtitle: 'Minimum $20M cover required for most listings.',
    required: true,
    seeded: {
      name: 'PL-Insurance-CertOfCurrency.pdf',
      sizeKb: 268,
      uploadedAt: '2026-02-04',
      expiresAt: '2027-02-04',
      issuer: 'CGU Insurance',
    },
  },
  {
    key: 'product-liability',
    title: 'Product liability insurance',
    subtitle: 'Optional. Helpful for chefs producing for retail or markets.',
    required: false,
    seeded: null,
  },
];

const RAK_CHEF_CREDS_KEY = 'rak-chef-credentials';

export function useChefCredentials() {
  const [docs, setDocs] = React.useState(() => {
    try {
      const raw = localStorage.getItem(RAK_CHEF_CREDS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return Object.fromEntries(RAK_CHEF_CREDENTIALS.map((t) => [t.key, t.seeded]));
  });
  const persist = (next) => {
    setDocs(next);
    try { localStorage.setItem(RAK_CHEF_CREDS_KEY, JSON.stringify(next)); } catch (_) {}
  };
  return {
    docs,
    setDoc: (key, doc) => persist({ ...docs, [key]: doc }),
    removeDoc: (key) => persist({ ...docs, [key]: null }),
  };
}

export function ChefProfile() {
  const me = RAK_USERS.find((u) => u.id === 'chef-001');
  const [editing, setEditing] = React.useState(false);
  const { docs } = useChefCredentials();
  const [previewKey, setPreviewKey] = React.useState(null);
  if (editing) {
    return <ChefProfileEdit user={me} onCancel={() => setEditing(false)} onSave={() => setEditing(false)} />;
  }

  return (
    <RAKPageFrame>
      <RAKPageHeader title="Your profile" subtitle="What kitchen owners see when you request to book." right={<PerformButton variant="brand-outline" iconLeft={<RAKIcon name="edit" size={14} color="rgb(0,114,152)" />} onClick={() => setEditing(true)}>Edit profile</PerformButton>} />
      <div style={{ padding: '24px 32px 60px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: 160, height: 160, borderRadius: '50%',
            background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: "'Varela Round', sans-serif", fontSize: 60
          }}>{me.avatar}</div>
          <div>
            <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 28, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>{me.name}</h2>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>Chef · {me.specialty}</span>
          </div>
          {me.verified &&
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 9999, background: 'rgb(230,244,247)' }}>
              <RAKIcon name="shield" size={13} color="rgb(0,114,152)" />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(0,114,152)', fontWeight: 700 }}>Verified chef</span>
            </div>
          }
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
            width: '100%', textAlign: 'left',
            border: '1px solid rgb(238,235,234)', borderRadius: 4, padding: 16
          }}>
            <ProfileStat label="Bookings" value={me.bookings} />
            <ProfileStat label="Member since" value="Jun 2024" />
            <ProfileStat label="Response rate" value="100%" />
            <ProfileStat label="Avg. response" value="< 1 hour" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <ListingSection title="About">
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)', lineHeight: 1.55, margin: 0 }}>{me.bio}</p>
          </ListingSection>

          <ListingSection title="Credentials">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RAK_CHEF_CREDENTIALS.map((t) => {
                const doc = docs[t.key];
                const onFile = !!doc;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => onFile && setPreviewKey(t.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                      borderRadius: 4,
                      border: onFile ? '1px solid rgb(221,219,218)' : '1px dashed rgb(221,219,218)',
                      background: onFile ? '#fff' : 'rgb(248,247,247)',
                      cursor: onFile ? 'pointer' : 'default',
                      textAlign: 'left',
                      fontFamily: "'Open Sans', sans-serif",
                    }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 4, flexShrink: 0,
                      background: onFile ? 'rgb(220,243,228)' : 'rgb(238,235,234)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <RAKIcon
                        name={onFile ? 'shield' : 'file'}
                        size={16}
                        color={onFile ? 'rgb(31,121,77)' : 'rgb(95,99,104)'} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{t.title}</span>
                        {onFile && <RAKStatusChip status="verified" />}
                      </div>
                      {onFile ? (
                        <span style={{ fontSize: 12, color: 'rgb(95,99,104)' }}>
                          {doc.name} · {doc.sizeKb} KB
                          {doc.expiresAt && <> · current to {RAK_formatDate(doc.expiresAt)}</>}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'rgb(95,99,104)' }}>Not uploaded yet</span>
                      )}
                    </div>
                    {onFile && (
                      <PerformIcon name="chevron-right" size={10} color="rgb(95,99,104)" />
                    )}
                  </button>
                );
              })}
            </div>
          </ListingSection>

          <ListingSection title="Portfolio">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {['photo-1546069901-ba9599a7e63c', 'photo-1565299624946-b28f40a0ae38', 'photo-1565958011703-44f9829ba187', 'photo-1543353071-873f17a7a088'].map((id) =>
              <div key={id} style={{ aspectRatio: '1 / 1', borderRadius: 4, overflow: 'hidden', background: 'rgb(238,235,234)' }}>
                  <img src={`https://images.unsplash.com/${id}?w=400&q=80`} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </ListingSection>

          <ListingSection title="What hosts say">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <ListingReview review={{ id: 1, name: 'Eleanor K.', when: 'May 2026', text: 'Mia left the kitchen cleaner than she found it. Very communicative throughout the booking.' }} />
              <ListingReview review={{ id: 2, name: 'Ben H.', when: 'March 2026', text: 'A pleasure to host. Knows the equipment and asks the right questions in advance.' }} />
            </div>
          </ListingSection>
        </div>
      </div>

      {previewKey && (
        <RAKCredentialPreviewModal
          credential={RAK_CHEF_CREDENTIALS.find((t) => t.key === previewKey)}
          doc={docs[previewKey]}
          owner={me?.name}
          onClose={() => setPreviewKey(null)} />
      )}
    </RAKPageFrame>);

}

/* Inline credential uploader for the chef profile edit page. */
function ChefCredentialUploader() {
  const { docs, setDoc, removeDoc } = useChefCredentials();
  const [previewKey, setPreviewKey] = React.useState(null);
  const me = RAK_USERS.find((u) => u.id === 'chef-001');

  const onFile = (key, file) => {
    if (!file) return;
    setDoc(key, {
      name: file.name,
      sizeKb: Math.round(file.size / 1024) || 1,
      uploadedAt: new Date().toISOString().slice(0, 10),
      expiresAt: null,
      issuer: 'Uploaded just now',
    });
    setPreviewKey(key);
  };

  const uploadedCount = Object.values(docs).filter(Boolean).length;
  const requiredMissing = RAK_CHEF_CREDENTIALS.filter((t) => t.required && !docs[t.key]).length;

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {requiredMissing > 0 ? (
        <PerformInfoPanel tone="warning">
          {requiredMissing} required document{requiredMissing === 1 ? '' : 's'} missing. Kitchen owners may decline bookings until you upload them.
        </PerformInfoPanel>
      ) : (
        <PerformInfoPanel tone="info">
          All required documents on file ({uploadedCount}/{RAK_CHEF_CREDENTIALS.length} categories complete).
        </PerformInfoPanel>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RAK_CHEF_CREDENTIALS.map((t) => {
          const doc = docs[t.key];
          return (
            <div key={t.key}
              style={{
                border: '1px solid rgb(221,219,218)',
                background: '#fff',
                borderRadius: 4, padding: 14,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                  background: doc ? 'rgb(220,243,228)' : 'rgb(238,235,234)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <RAKIcon
                    name={doc ? 'shield' : 'file'}
                    size={16}
                    color={doc ? 'rgb(31,121,77)' : 'rgb(95,99,104)'} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{t.title}</span>
                    {t.required && (
                      <span style={{
                        fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 700,
                        color: 'rgb(146,99,0)', background: 'rgb(254,243,199)',
                        padding: '2px 8px', borderRadius: 9999,
                      }}>Required</span>
                    )}
                    {doc && <RAKStatusChip status="verified" />}
                  </div>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', lineHeight: 1.4 }}>{t.subtitle}</span>
                  {doc && (
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>
                      {doc.name} · {doc.sizeKb} KB · uploaded {RAK_formatDate(doc.uploadedAt)}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                  border: '1px solid rgb(0,114,152)', background: '#fff',
                  color: 'rgb(0,114,152)',
                  fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700,
                }}>
                  <RAKIcon name="upload" size={12} color="rgb(0,114,152)" />
                  {doc ? 'Replace' : 'Upload document'}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => onFile(t.key, e.target.files && e.target.files[0])}
                    style={{ display: 'none' }} />
                </label>
                {doc && (
                  <React.Fragment>
                    <button type="button" onClick={() => setPreviewKey(t.key)}
                      style={{
                        padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                        border: '1px solid rgb(221,219,218)', background: '#fff',
                        color: 'rgb(32,33,36)',
                        fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
                      }}>View</button>
                    <button type="button" onClick={() => removeDoc(t.key)}
                      style={{
                        padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                        border: 'none', background: 'transparent',
                        color: 'rgb(222,13,13)',
                        fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
                      }}>Remove</button>
                  </React.Fragment>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {previewKey && (
        <RAKCredentialPreviewModal
          credential={RAK_CHEF_CREDENTIALS.find((t) => t.key === previewKey)}
          doc={docs[previewKey]}
          owner={me?.name}
          onClose={() => setPreviewKey(null)} />
      )}
    </div>
  );
}

/* Modal that previews a single credential document. */
export function RAKCredentialPreviewModal({ credential, doc, owner, onClose }) {
  if (!credential || !doc) return null;
  return (
    <div onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 95,
        background: 'rgba(32,33,36,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: 480, maxWidth: '100%', background: '#fff', borderRadius: 6,
          boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
          fontFamily: "'Open Sans', sans-serif",
          overflow: 'hidden',
        }}>
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid rgb(238,235,234)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)' }}>{credential.title}</span>
            <span style={{ fontSize: 12, color: 'rgb(95,99,104)' }}>{doc.name} · {doc.sizeKb} KB</span>
          </div>
          <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="download" size={12} color="rgb(0,114,152)" />}>Download</PerformButton>
        </div>

        <div style={{ padding: 18, background: 'rgb(248,247,247)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '100%', maxWidth: 360, aspectRatio: '8.5 / 11',
            background: '#fff', border: '1px solid rgb(221,219,218)', borderRadius: 4,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            padding: '22px 26px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 4, background: 'rgb(0,114,152)', color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
              }}>PDF</div>
              <span style={{ fontSize: 11, color: 'rgb(95,99,104)', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 700 }}>{doc.issuer}</span>
            </div>
            <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 18, color: 'rgb(32,33,36)', lineHeight: 1.2 }}>{credential.title}</span>
            <div style={{ height: 1, background: 'rgb(238,235,234)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <DocMetaRow label="Issued to" value={owner || ''} />
              <DocMetaRow label="File" value={doc.name} />
              <DocMetaRow label="Uploaded" value={RAK_formatDate(doc.uploadedAt)} />
              {doc.expiresAt && <DocMetaRow label="Expires" value={RAK_formatDate(doc.expiresAt)} />}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: 0.55 }}>
              <div style={{ height: 6, background: 'rgb(238,235,234)', borderRadius: 2 }} />
              <div style={{ height: 6, background: 'rgb(238,235,234)', borderRadius: 2, width: '88%' }} />
              <div style={{ height: 6, background: 'rgb(238,235,234)', borderRadius: 2, width: '94%' }} />
              <div style={{ height: 6, background: 'rgb(238,235,234)', borderRadius: 2, width: '70%' }} />
            </div>
          </div>
        </div>

        <div style={{
          padding: '12px 18px', borderTop: '1px solid rgb(238,235,234)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button type="button" onClick={onClose}
            style={{
              padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
              border: '1px solid rgb(221,219,218)', background: '#fff',
              fontSize: 14, fontWeight: 600, color: 'rgb(32,33,36)',
              fontFamily: "'Open Sans', sans-serif",
            }}>Close</button>
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

function ProfileStat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', lineHeight: 1.1 }}>{value}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{label}</span>
    </div>);

}

/* ============================================================
   CHEF PROFILE — EDIT MODE
   ============================================================ */
function ChefProfileEdit({ user, onCancel, onSave }) {
  const initial = {
    name: user.name,
    specialty: user.specialty,
    bio: user.bio,
    email: 'mia.tanaka@example.com',
    phone: '+61 412 555 037',
    abn: '51 824 753 556',
    businessName: "Mia's Omakase Pty Ltd",
    foodSafetyCert: 'Food Safety Supervisor (NSW) — current to Mar 2027',
    insurance: 'Public liability insurance — $20M cover, renewed Feb 2026'
  };
  const [form, setForm] = React.useState(initial);
  const set = (key, v) => setForm((f) => ({ ...f, [key]: v }));
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  return (
    <RAKPageFrame>
      <RAKPageHeader
        title="Edit your profile"
        subtitle="Changes are visible to kitchen owners the moment you save."
        onBack={onCancel}
        confirmBack={dirty ? {
          title: 'Save changes before leaving?',
          message: 'You have unsaved edits to your profile. Would you like to save them, discard them, or stay here?',
          primaryLabel: 'Save & exit',
          secondaryLabel: 'Discard changes',
          onSave,
        } : null}
        right={
        <div style={{ display: 'flex', gap: 8 }}>
            <PerformButton variant="base" onClick={onCancel}>Cancel</PerformButton>
            <PerformButton variant="brand" onClick={onSave}>Save changes</PerformButton>
          </div>
        } />

      <div style={{ padding: '24px 32px 60px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: 160, height: 160, borderRadius: '50%',
            background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: "'Varela Round', sans-serif", fontSize: 60,
            position: 'relative'
          }}>
            {user.avatar}
            <button
              type="button"
              title="Change photo"
              style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 36, height: 36, borderRadius: '50%',
                border: '2px solid #fff', background: 'rgb(0,114,152)',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
              }}>
              <RAKIcon name="camera" size={16} color="#fff" />
            </button>
          </div>
          <PerformButton variant="brand-outline" iconLeft={<RAKIcon name="camera" size={14} color="rgb(0,114,152)" />}>Upload new photo</PerformButton>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', lineHeight: 1.4 }}>
            JPG or PNG, square, at least 400×400px. Visible on every booking request.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <ListingSection title="Public details">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              <PerformField label="Full name" required value={form.name} onChange={(v) => set('name', v)} width="100%" />
              <PerformField label="Specialty" required value={form.specialty} onChange={(v) => set('specialty', v)} width="100%" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 16 }}>
              <PerformFieldLabel>About you</PerformFieldLabel>
              <textarea
                value={form.bio}
                onChange={(e) => set('bio', e.target.value)}
                placeholder="Tell owners about your cooking style, experience, and what kind of events you typically prep for."
                rows={5}
                style={{ width: '100%', borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '10px 12px', fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)' }}>{form.bio.length} / 600 characters</span>
            </div>
          </ListingSection>

          <ListingSection title="Contact (private to RAK)">
            <PerformInfoPanel tone="info">
              We never share your phone or email with owners. They reach you via in-app messaging.
            </PerformInfoPanel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginTop: 12 }}>
              <PerformField label="Email" required value={form.email} onChange={(v) => set('email', v)} width="100%" />
              <PerformField label="Phone" required value={form.phone} onChange={(v) => set('phone', v)} width="100%" />
            </div>
          </ListingSection>

          <ListingSection title="Credentials">
            <PerformField label="Business name" value={form.businessName} onChange={(v) => set('businessName', v)} width="100%" />
            <div style={{ marginTop: 16, marginBottom: 8 }}>
              <PerformField label="ABN" value={form.abn} onChange={(v) => set('abn', v)} width="100%" />
            </div>
            <ChefCredentialUploader />
          </ListingSection>

          <ListingSection title="Portfolio">
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', display: 'block', marginBottom: 12 }}>
              Up to 8 photos of your past work. Owners often check these before accepting.
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {['photo-1546069901-ba9599a7e63c', 'photo-1565299624946-b28f40a0ae38', 'photo-1565958011703-44f9829ba187', 'photo-1543353071-873f17a7a088'].map((id) =>
              <div key={id} style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 4, overflow: 'hidden', background: 'rgb(238,235,234)' }}>
                  <img src={`https://images.unsplash.com/${id}?w=400&q=80`} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                  type="button"
                  title="Remove photo"
                  style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 24, height: 24, borderRadius: '50%',
                    border: 'none', background: 'rgba(32,33,36,0.78)',
                    cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <RAKIcon name="x" size={12} color="#fff" />
                  </button>
                </div>
              )}
              <button
                type="button"
                style={{
                  aspectRatio: '1 / 1', borderRadius: 4,
                  border: '2px dashed rgb(221,219,218)',
                  background: 'rgb(248,247,247)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 6, color: 'rgb(95,99,104)',
                  fontFamily: "'Open Sans', sans-serif", fontSize: 13
                }}>
                <RAKIcon name="plus" size={20} color="rgb(95,99,104)" />
                Add photo
              </button>
            </div>
          </ListingSection>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid rgb(238,235,234)', paddingTop: 20 }}>
            <PerformButton variant="base" onClick={onCancel}>Cancel</PerformButton>
            <PerformButton variant="brand" onClick={onSave}>Save changes</PerformButton>
          </div>
        </div>
      </div>
    </RAKPageFrame>);

}

/* ============================================================
   MESSAGES (chef + owner share same UI)
   ============================================================ */
export function MessagesView({ persona }) {
  const myId = persona === 'chef' ? 'chef-001' : 'own-001';
  const otherKey = persona === 'chef' ? 'ownerId' : 'chefId';
  const myThreads = RAK_THREADS.filter((t) => persona === 'chef' ? t.chefId === myId : t.ownerId === myId);
  const [activeId, setActiveId] = React.useState(myThreads[0]?.id);
  const [draft, setDraft] = React.useState('');
  const active = myThreads.find((t) => t.id === activeId);

  return (
    <RAKPageFrame padding={0} scroll={false}>
      <RAKPageHeader title="Messages" subtitle={persona === 'chef' ? 'Chats with kitchen owners about your bookings.' : 'Chats with chefs who have booked your kitchen.'} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Thread list */}
        <div style={{ width: 320, borderRight: '1px solid rgb(238,235,234)', overflowY: 'auto', flexShrink: 0 }}>
          {myThreads.map((t) => {
            const k = RAK_KITCHENS.find((x) => x.id === t.listingId);
            const otherUser = RAK_USERS.find((u) => u.id === t[otherKey]);
            const last = t.messages[t.messages.length - 1];
            return (
              <div key={t.id} onClick={() => setActiveId(t.id)}
              onMouseEnter={(e) => {if (t.id !== activeId) e.currentTarget.style.background = 'rgb(248,247,247)';}}
              onMouseLeave={(e) => {if (t.id !== activeId) e.currentTarget.style.background = '#fff';}}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgb(238,235,234)',
                borderLeft: t.id === activeId ? '3px solid rgb(0,114,152)' : '3px solid transparent',
                background: t.id === activeId ? 'rgb(230,244,247)' : '#fff',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 4
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{otherUser?.name || '—'}</span>
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)', flexShrink: 0 }}>{t.updatedAt.split(' ')[0].slice(5)}</span>
                </div>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k?.name}</span>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last?.text}</span>
              </div>);

          })}
        </div>

        {/* Thread detail */}
        {active && <MessagesThread thread={active} myId={myId} draft={draft} setDraft={setDraft} />}
      </div>
    </RAKPageFrame>);

}

function MessagesThread({ thread, myId, draft, setDraft }) {
  const k = RAK_KITCHENS.find((x) => x.id === thread.listingId);
  const [messages, setMessages] = React.useState(thread.messages);
  React.useEffect(() => {setMessages(thread.messages);}, [thread.id]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages([...messages, { from: myId, text: draft, at: 'Just now' }]);
    setDraft('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{
        padding: '14px 24px', borderBottom: '1px solid rgb(238,235,234)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={k.photo} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, fontWeight: 700, color: 'rgb(32,33,36)' }}>{k.name}</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{k.suburb}, {k.city}</span>
          </div>
        </div>
        <PerformButton variant="brand-outline">View booking</PerformButton>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => {
          const me = m.from === myId;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '65%',
                background: me ? 'rgb(0,114,152)' : 'rgb(248,247,247)',
                color: me ? '#fff' : 'rgb(32,33,36)',
                padding: '10px 14px', borderRadius: me ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                fontFamily: "'Open Sans', sans-serif", fontSize: 14, lineHeight: 1.45
              }}>
                {m.text}
                <div style={{
                  fontSize: 11, marginTop: 4,
                  color: me ? 'rgba(255,255,255,0.75)' : 'rgb(95,99,104)'
                }}>{m.at.split(' ').slice(-1)[0] || m.at}</div>
              </div>
            </div>);

        })}
      </div>

      <div style={{ borderTop: '1px solid rgb(238,235,234)', padding: '14px 24px', display: 'flex', gap: 10 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') send();}}
        placeholder="Type a message"
        style={{ flex: 1, height: 40, borderRadius: 4, border: '1px solid rgb(221,219,218)', padding: '0 14px', fontFamily: "'Open Sans', sans-serif", fontSize: 14, outline: 'none' }} />
        <PerformButton variant="brand" onClick={send} iconLeft={<RAKIcon name="send" size={14} color="#fff" />}>Send</PerformButton>
      </div>
    </div>);

}
