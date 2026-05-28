import React from 'react';

import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } from '../tweaks-panel';
import { AuthScreen } from './auth';
import {
  RAKHeader, RAKFooter, RAKLogoMark, RAKWordmark, RAKPersonaSwitcher,
} from './shell';
import { IOSDevice } from '../ios-frame';

import { MChefBrowse, MChefListingDetail, MChefBookingFlow, MChefBookings, MMessagesView, MChefProfile } from './mobile-chef';
import { MOwnerDashboard, MOwnerRequests, MOwnerListingEditor } from './mobile-owner';
import { RAKMobileTabBar, RAK_MOBILE_TABS } from './mobile-shell';

import { ChefSignup, ChefBrowse } from './chef-views-1';
import { ChefListingDetail, ChefBookingFlow, ChefBookings, MessagesView, ChefProfile, ChefBookingDetail } from './chef-views-2';

import { OwnerSignup, OwnerDashboard, OwnerRequests } from './owner-views';
import { OwnerListings, OwnerListingDetail } from './owner-listings';

import {
  AdminDashboard, AdminUsers, AdminModeration, AdminPayouts, AdminReports, AdminDisputes,
  AdminUserDetail, AdminListingPreview,
} from './admin-views';

const TWEAK_DEFAULTS = {
  signedIn: false,
  showOnboarding: false,
  browseLayout: 'split',
  density: 'comfortable',
  device: 'desktop',
};

function useRealMobile() {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < 768);
  React.useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

export function RAKApp() {
  const [persona, setPersona] = React.useState('chef');
  const [chefView, setChefView] = React.useState('browse');
  const [ownerView, setOwnerView] = React.useState('dashboard');
  const [adminView, setAdminView] = React.useState('dashboard');

  const [openListingId, setOpenListingId] = React.useState(null);
  const [bookingListingId, setBookingListingId] = React.useState(null);
  const [openBookingId, setOpenBookingId] = React.useState(null);

  const [filters, setFilters] = React.useState({
    query: '', city: 'Sydney', dates: null, dateDays: [],
    priceMin: 40, priceMax: 120, capacity: 1,
    equipment: [], cert: null, savedOnly: false,
  });

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const isRealMobile = useRealMobile();

  const handleSignIn = (p) => {
    setPersona(p);
    if (p === 'chef')  setChefView('browse');
    if (p === 'owner') setOwnerView('dashboard');
    if (p === 'admin') setAdminView('dashboard');
    setOpenListingId(null);
    setBookingListingId(null);
    setOpenBookingId(null);
    setTweak('signedIn', true);
  };
  const handleSignOut = () => setTweak('signedIn', false);

  if (!t.signedIn) {
    return <AuthScreen onSignIn={handleSignIn} isMobile={isRealMobile} />;
  }

  if (isRealMobile && persona !== 'admin') {
    return (
      <div className="rak-mobile-root" style={{ display: 'flex', flexDirection: 'column', background: 'rgb(238,235,234)', overflow: 'hidden' }}>
        <div className="rak-mobile-topbar" style={{
          flexShrink: 0,
          background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RAKLogoMark size={20} />
            <RAKWordmark />
          </div>
          <button onClick={handleSignOut} style={{
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 6, padding: '5px 12px', color: '#fff',
            fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Sign out</button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <MobileRouter
            persona={persona}
            chefView={chefView} setChefView={setChefView}
            ownerView={ownerView} setOwnerView={setOwnerView}
            openListingId={openListingId} setOpenListingId={setOpenListingId}
            bookingListingId={bookingListingId} setBookingListingId={setBookingListingId}
            openBookingId={openBookingId} setOpenBookingId={setOpenBookingId}
            filters={filters} setFilters={setFilters}
            showOnboarding={false}
          />
        </div>
      </div>
    );
  }

  const effectiveDevice = (t.device === 'mobile' && persona === 'admin') ? 'desktop' : t.device;

  const handleSwitchPersona = (p) => {
    setPersona(p);
    setOpenListingId(null);
    setBookingListingId(null);
    setOpenBookingId(null);
  };

  const handleNav = (id) => {
    setOpenListingId(null);
    setBookingListingId(null);
    setOpenBookingId(null);
    if (persona === 'chef') setChefView(id);
    if (persona === 'owner') setOwnerView(id);
    if (persona === 'admin') setAdminView(id);
  };

  const activeNav = persona === 'chef' ? chefView : persona === 'owner' ? ownerView : adminView;

  if (effectiveDevice === 'mobile') {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        background: 'rgb(238,235,234)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: 55, flexShrink: 0,
          background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RAKLogoMark size={22} />
            <RAKWordmark />
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.85)', marginLeft: 12 }}>· Mobile preview</span>
          </div>
          <RAKPersonaSwitcher persona={persona} onSwitchPersona={handleSwitchPersona} />
        </div>

        <div style={{
          flex: 1, minHeight: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, overflow: 'auto',
        }}>
          <IOSDevice width={402} height={874}>
            <MobileRouter
              persona={persona}
              chefView={chefView} setChefView={setChefView}
              ownerView={ownerView} setOwnerView={setOwnerView}
              openListingId={openListingId} setOpenListingId={setOpenListingId}
              bookingListingId={bookingListingId} setBookingListingId={setBookingListingId}
              openBookingId={openBookingId} setOpenBookingId={setOpenBookingId}
              filters={filters} setFilters={setFilters}
              showOnboarding={t.showOnboarding}
            />
          </IOSDevice>
        </div>

        <TweaksPanel>
          <TweakSection label="Device" />
          <TweakRadio label="Device" value={t.device}
            options={['desktop', 'mobile']}
            onChange={(v) => setTweak('device', v)} />
          <TweakSection label="Demo state" />
          <TweakToggle label="Signed in" value={t.signedIn}
            onChange={(v) => setTweak('signedIn', v)} />
          <TweakToggle label="Show sign-up flow" value={t.showOnboarding}
            onChange={(v) => setTweak('showOnboarding', v)} />
        </TweaksPanel>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      background: '#fff',
      overflow: 'hidden',
    }}>
      <RAKHeader persona={persona} activeNav={activeNav} onNav={handleNav} onSwitchPersona={handleSwitchPersona} onSignOut={handleSignOut} />

      {persona === 'chef' && <ChefRouter
        view={chefView} setView={setChefView}
        openListingId={openListingId} setOpenListingId={setOpenListingId}
        bookingListingId={bookingListingId} setBookingListingId={setBookingListingId}
        openBookingId={openBookingId} setOpenBookingId={setOpenBookingId}
        filters={filters} setFilters={setFilters}
        showOnboarding={t.showOnboarding}
      />}

      {persona === 'owner' && <OwnerRouter
        view={ownerView} setView={setOwnerView}
        showOnboarding={t.showOnboarding}
        openListingId={openListingId} setOpenListingId={setOpenListingId}
      />}

      {persona === 'admin' && <AdminRouter
        view={adminView} setView={setAdminView}
      />}

      <RAKFooter />

      <TweaksPanel>
        <TweakSection label="Device" />
        <TweakRadio label="Device" value={t.device}
          options={['desktop', 'mobile']}
          onChange={(v) => setTweak('device', v)} />
        <TweakSection label="Demo state" />
        <TweakToggle label="Signed in" value={t.signedIn}
          onChange={(v) => setTweak('signedIn', v)} />
        <TweakToggle label="Show sign-up flow" value={t.showOnboarding}
          onChange={(v) => setTweak('showOnboarding', v)} />
        <TweakSection label="Browse layout" />
        <TweakRadio label="Map placement" value={t.browseLayout}
          options={['split', 'grid', 'map-first']}
          onChange={(v) => setTweak('browseLayout', v)} />
      </TweaksPanel>
    </div>
  );
}

function MobileRouter({ persona, chefView, setChefView, ownerView, setOwnerView, openListingId, setOpenListingId, bookingListingId, setBookingListingId, filters, setFilters, showOnboarding }) {
  if (showOnboarding && persona === 'chef') return <MChefSignupWrap />;
  if (showOnboarding && persona === 'owner') return <MOwnerSignupWrap />;

  if (persona === 'chef') {
    if (bookingListingId) {
      return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <MChefBookingFlow kitchenId={bookingListingId}
            onBack={() => setBookingListingId(null)}
            onConfirm={() => { setBookingListingId(null); setChefView('bookings'); }} />
        </div>
      );
    }
    if (openListingId) {
      return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <MChefListingDetail kitchenId={openListingId}
            onBack={() => setOpenListingId(null)}
            onBook={(id) => { setOpenListingId(null); setBookingListingId(id); }} />
        </div>
      );
    }
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {chefView === 'browse'   && <MChefBrowse filters={filters} setFilters={setFilters} onOpenListing={setOpenListingId} />}
        {chefView === 'bookings' && <MChefBookings onOpenListing={setOpenListingId} />}
        {chefView === 'messages' && <MMessagesView persona="chef" />}
        {chefView === 'profile'  && <MChefProfile />}
        <RAKMobileTabBar tabs={RAK_MOBILE_TABS.chef} activeId={chefView} onTap={setChefView} />
      </div>
    );
  }

  if (persona === 'owner') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {ownerView === 'dashboard'       && <MOwnerDashboard />}
        {ownerView === 'requests'        && <MOwnerRequests />}
        {ownerView === 'listing-editor'  && <MOwnerListingEditor />}
        {ownerView === 'messages'        && <MMessagesView persona="owner" />}
        <RAKMobileTabBar tabs={RAK_MOBILE_TABS.owner} activeId={ownerView} onTap={setOwnerView} />
      </div>
    );
  }

  return null;
}

function MChefSignupWrap() {
  return (
    <div style={{ height: '100%', overflow: 'auto', paddingTop: 50, background: '#fff' }}>
      <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '167%' }}>
        <ChefSignup onComplete={() => {}} />
      </div>
    </div>
  );
}

function MOwnerSignupWrap() {
  return (
    <div style={{ height: '100%', overflow: 'auto', paddingTop: 50, background: '#fff' }}>
      <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '167%' }}>
        <OwnerSignup onComplete={() => {}} />
      </div>
    </div>
  );
}

function ChefRouter({ view, setView, openListingId, setOpenListingId, bookingListingId, setBookingListingId, openBookingId, setOpenBookingId, filters, setFilters, showOnboarding }) {
  if (showOnboarding) return <ChefSignup onComplete={() => {}} />;
  if (bookingListingId) return <ChefBookingFlow kitchenId={bookingListingId} onBack={() => setBookingListingId(null)} onConfirm={() => { setBookingListingId(null); setView('bookings'); }} />;
  if (openBookingId) return <ChefBookingDetail bookingId={openBookingId} onBack={() => setOpenBookingId(null)} onOpenListing={(id) => { setOpenBookingId(null); setOpenListingId(id); }} onEdit={(id) => { setOpenBookingId(null); setBookingListingId(id); }} />;
  if (openListingId) return <ChefListingDetail kitchenId={openListingId} onBack={() => setOpenListingId(null)} onBook={(id) => { setOpenListingId(null); setBookingListingId(id); }} />;

  switch (view) {
    case 'browse': return <ChefBrowse filters={filters} setFilters={setFilters} onOpenListing={setOpenListingId} />;
    case 'bookings': return <ChefBookings onOpenListing={setOpenListingId} onOpenBooking={setOpenBookingId} onEditBooking={setBookingListingId} />;
    case 'messages': return <MessagesView persona="chef" />;
    case 'profile': return <ChefProfile />;
    default: return <ChefBrowse filters={filters} setFilters={setFilters} onOpenListing={setOpenListingId} />;
  }
}

function OwnerRouter({ view, setView, showOnboarding, openListingId, setOpenListingId }) {
  if (showOnboarding) return <OwnerSignup onComplete={() => {}} />;
  if (view === 'listing-editor' && openListingId) {
    return <OwnerListingDetail listingId={openListingId} onBack={() => setOpenListingId(null)} />;
  }
  switch (view) {
    case 'dashboard': return <OwnerDashboard />;
    case 'listing-editor': return <OwnerListings onOpen={(id) => setOpenListingId(id)} onAdd={() => {}} />;
    case 'requests': return <OwnerRequests />;
    case 'messages': return <MessagesView persona="owner" />;
    default: return <OwnerDashboard />;
  }
}

function AdminRouter({ view, setView }) {
  const [openUserId, setOpenUserId] = React.useState(null);
  const [previewListingId, setPreviewListingId] = React.useState(null);

  React.useEffect(() => {
    setOpenUserId(null);
    setPreviewListingId(null);
  }, [view]);

  if (openUserId) {
    return <AdminUserDetail userId={openUserId} onBack={() => setOpenUserId(null)} />;
  }
  if (previewListingId) {
    return <AdminListingPreview listingId={previewListingId} onBack={() => setPreviewListingId(null)} />;
  }

  switch (view) {
    case 'dashboard': return <AdminDashboard onNav={setView} />;
    case 'users': return <AdminUsers onOpenUser={setOpenUserId} />;
    case 'moderation': return <AdminModeration onPreviewListing={setPreviewListingId} onOpenUser={setOpenUserId} />;
    case 'payouts': return <AdminPayouts />;
    case 'reports': return <AdminReports />;
    case 'disputes': return <AdminDisputes />;
    default: return <AdminDashboard onNav={setView} />;
  }
}
