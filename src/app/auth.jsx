import React from 'react';
import { PerformIcon } from '../components/PerformIcons';
import { PerformButton } from '../components/PerformButtons';
import { PerformField, PerformCheckbox, PerformFieldLabel } from '../components/PerformForms';
import { PerformInfoPanel } from '../components/PerformDisplay';
import { RAKIcon } from './icons';
import { RAKLogoMark, RAKWordmark } from './shell';
import { supabase } from '../lib/supabase';

/* ============================================================
   AUTHENTICATION — shared login + sign-up gate
   - Login: email + password, single screen for chef & owner.
   - Sign up: persona tiles → basic details form.
   - After success, calls onSignIn(persona) so RAKApp can
     route to the right view.
   ============================================================ */

export function AuthScreen({ onSignIn, isMobile }) {
  const [mode, setMode] = React.useState('signin'); // 'signin' | 'signup'
  // After Save, we hold the pending signup until the user clicks the email link.
  // { firstName, lastName, email, phone, password, persona, verified }
  const [pendingSignup, setPendingSignup] = React.useState(null);
  const [verifyModalOpen, setVerifyModalOpen] = React.useState(false);

  const handleSignupSave = (data) => {
    if (data.directSignIn) {
      // Supabase signUp succeeded + email confirmation off — sign in directly
      onSignIn(data.persona);
      return;
    }
    setPendingSignup({ ...data, verified: false });
    setVerifyModalOpen(true);
  };
  const handleVerifyClick = () => {
    setPendingSignup((p) => p ? { ...p, verified: true } : p);
  };
  const handleVerifyContinue = () => {
    setVerifyModalOpen(false);
    setMode('signin');
  };
  const handleBackToSignIn = () => {
    setVerifyModalOpen(false);
    setMode('signin');
  };
  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)',
      background: '#fff', overflow: 'hidden',
    }}>
      {/* LEFT — form panel */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        overflow: 'auto',
      }}>
        <div style={{ padding: isMobile ? '20px 24px' : '24px 56px', borderBottom: '1px solid rgb(238,235,234)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <RAKLogoMark size={28} />
          <RAKWordmark />
        </div>

        <div style={{
          flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: isMobile ? '24px 20px 48px' : '48px 56px 64px',
        }}>
          <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Tab toggle */}
            <div style={{
              display: 'inline-flex',
              background: 'rgb(248,247,247)',
              borderRadius: 4, padding: 4, alignSelf: 'flex-start',
              border: '1px solid rgb(221,219,218)'
            }}>
              <AuthTab active={mode === 'signin'} onClick={() => setMode('signin')}>Sign in</AuthTab>
              <AuthTab active={mode === 'signup'} onClick={() => setMode('signup')}>Create account</AuthTab>
            </div>

            {mode === 'signin'
              ? <SignInForm
                  onSignIn={onSignIn}
                  onSwitch={() => setMode('signup')}
                  pendingSignup={pendingSignup}
                  onResendVerify={() => setVerifyModalOpen(true)} />
              : <SignUpForm onComplete={handleSignupSave} onSwitch={() => setMode('signin')} onDirectSignIn={onSignIn} />
            }
          </div>
        </div>

        <div style={{
          padding: '16px 56px', borderTop: '1px solid rgb(238,235,234)',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)'
        }}>
          <span>©NABERS 2026 · Rent a Kitchen</span>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="#" style={{ color: 'rgb(0,145,179)', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'rgb(0,145,179)', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'rgb(0,145,179)', textDecoration: 'none' }}>Help</a>
          </div>
        </div>
      </div>

      {/* RIGHT — brand panel (hidden on mobile) */}
      {!isMobile && <AuthBrandPanel />}

      {/* Verify email modal */}
      {verifyModalOpen && pendingSignup &&
        <VerifyEmailModal
          signup={pendingSignup}
          onVerify={handleVerifyClick}
          onContinue={handleVerifyContinue}
          onBackToSignIn={handleBackToSignIn} />
      }
    </div>
  );
}

function AuthTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 18px', borderRadius: 3,
        border: 'none',
        background: active ? '#fff' : 'transparent',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
        fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
        color: active ? 'rgb(0,114,152)' : 'rgb(95,99,104)',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}>
      {children}
    </button>);

}

/* ============================================================
   SIGN IN
   ============================================================ */
function SignInForm({ onSignIn, onSwitch, pendingSignup, onResendVerify }) {
  const prefilledEmail = pendingSignup ? pendingSignup.email : '';
  const [email, setEmail] = React.useState(prefilledEmail);
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (pendingSignup) {
      setEmail(pendingSignup.email);
      setError(null);
    }
  }, [pendingSignup && pendingSignup.email, pendingSignup && pendingSignup.verified]);

  const inferPersona = (e) => {
    const v = (e || '').toLowerCase();
    if (v.includes('owner') || v.includes('eleanor') || v.includes('ben')) return 'owner';
    if (v.includes('admin') || v.includes('nabers')) return 'admin';
    return 'chef';
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !password) { setError('Enter both email and password to sign in.'); return; }

    if (pendingSignup && pendingSignup.email.toLowerCase() === email.toLowerCase() && !pendingSignup.verified) {
      setError('Please verify your email address before signing in. Check your inbox for the link we sent.');
      return;
    }
    if (pendingSignup && pendingSignup.email.toLowerCase() === email.toLowerCase() && pendingSignup.verified) {
      onSignIn(pendingSignup.persona);
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    const role = data.user?.user_metadata?.role || inferPersona(email);
    onSignIn(role);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 39, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.05 }}>Welcome back</h1>
        <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(95,99,104)', margin: '8px 0 0', lineHeight: 1.5 }}>
          Sign in to rent a kitchen by the hour or manage your bookings.
        </p>
      </div>

      {pendingSignup && pendingSignup.verified &&
        <SignInBanner
          tone="success"
          icon="check"
          title="Email verified — you're ready to sign in"
          body={`Welcome, ${pendingSignup.firstName}. Use the password you set during sign-up.`} />
      }
      {pendingSignup && !pendingSignup.verified &&
        <SignInBanner
          tone="warning"
          icon="warning"
          title="Almost there — verify your email"
          body={`We sent a verification link to ${pendingSignup.email}. Click it before signing in.`}
          actionLabel="Resend / open email"
          onAction={onResendVerify} />
      }

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <PerformField label="Email" required value={email} onChange={(v) => { setEmail(v); setError(null); }} placeholder="you@example.com" width="100%" />
        <PerformField label="Password" required type="password" value={password} onChange={(v) => { setPassword(v); setError(null); }} placeholder="••••••••" width="100%" />

        {error && <PerformInfoPanel tone="warning">{error}</PerformInfoPanel>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <PerformCheckbox checked={remember} label="Remember me on this device" onChange={setRemember} />
          <a href="#" onClick={(e) => e.preventDefault()} style={{
            fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 600,
            color: 'rgb(0,145,179)', textDecoration: 'none'
          }}>Forgot password?</a>
        </div>
      </div>

      <PerformButton variant="brand" onClick={handleSubmit} disabled={loading} style={{ height: 44, fontSize: 16 }}>
        {loading ? 'Signing in…' : 'Sign in'}
      </PerformButton>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)'
      }}>
        <span style={{ flex: 1, height: 1, background: 'rgb(238,235,234)' }} />
        <span>or use a demo account</span>
        <span style={{ flex: 1, height: 1, background: 'rgb(238,235,234)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <DemoButton icon="cooking" label="Chef" sub="Mia T." onClick={() => onSignIn('chef')} />
        <DemoButton icon="building" label="Owner" sub="Eleanor K." onClick={() => onSignIn('owner')} />
        <DemoButton icon="shield" label="Admin" sub="NABERS" onClick={() => onSignIn('admin')} />
      </div>

      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', textAlign: 'center' }}>
        New here? <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }} style={{ color: 'rgb(0,145,179)', fontWeight: 700, textDecoration: 'none' }}>Create an account</a>
      </span>
    </form>);

}

function SignInBanner({ tone, icon, title, body, actionLabel, onAction }) {
  const palette = tone === 'success'
    ? { bg: 'rgb(220,243,228)', fg: 'rgb(31,121,77)', dot: 'rgb(31,121,77)' }
    : tone === 'warning'
    ? { bg: 'rgb(254,243,199)', fg: 'rgb(146,99,0)', dot: 'rgb(146,99,0)' }
    : { bg: 'rgb(230,244,247)', fg: 'rgb(0,114,152)', dot: 'rgb(0,114,152)' };
  return (
    <div style={{
      background: palette.bg, borderRadius: 4,
      padding: '12px 14px',
      display: 'flex', alignItems: 'flex-start', gap: 12
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <RAKIcon name={icon === 'warning' ? 'flag' : 'shield'} size={14} color={palette.dot} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: palette.fg }}>{title}</span>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)', lineHeight: 1.5 }}>{body}</span>
        {actionLabel &&
          <a href="#" onClick={(e) => { e.preventDefault(); onAction && onAction(); }} style={{
            marginTop: 4, fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 700,
            color: 'rgb(0,145,179)', textDecoration: 'none', alignSelf: 'flex-start'
          }}>{actionLabel} →</a>
        }
      </div>
    </div>);

}

function DemoButton({ icon, label, sub, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '12px 8px', borderRadius: 4,
        border: '1px solid ' + (hover ? 'rgb(0,114,152)' : 'rgb(221,219,218)'),
        background: hover ? 'rgb(230,244,247)' : '#fff',
        cursor: 'pointer',
        transition: 'border-color 120ms, background 120ms'
      }}>
      <RAKIcon name={icon} size={20} color="rgb(0,114,152)" />
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgb(32,33,36)' }}>{label}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgb(95,99,104)' }}>{sub}</span>
    </button>);

}

/* ============================================================
   SIGN UP — step 1 persona tiles, step 2 details
   ============================================================ */
function SignUpForm({ onComplete, onDirectSignIn, onSwitch }) {
  const [step, setStep] = React.useState(1);
  const [persona, setPersona] = React.useState(null);
  const [form, setForm] = React.useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', agree: false
  });
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePickPersona = (p) => {
    setPersona(p);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.firstName || !form.lastName) return setError('Enter your first and last name.');
    if (!form.email || !form.email.includes('@')) return setError('Enter a valid email address.');
    if (!form.phone) return setError('Enter a phone number we can reach you on.');
    if (!form.password || form.password.length < 8) return setError('Choose a password with at least 8 characters.');
    if (!form.agree) return setError('You need to accept the terms before continuing.');

    setLoading(true);
    setError(null);
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          role: persona,
        }
      }
    });
    setLoading(false);

    if (authError) { setError(authError.message); return; }

    if (data.session) {
      // Email confirmation is disabled — session is live, sign in directly
      onDirectSignIn(persona);
    } else {
      // Email confirmation is on — show verify modal
      onComplete({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password, persona });
    }
  };

  if (step === 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 39, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.05 }}>Join Rent a Kitchen</h1>
          <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(95,99,104)', margin: '8px 0 0', lineHeight: 1.5 }}>
            First — tell us which side of the marketplace you're on. You can always change later.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <PersonaTile
            icon="cooking"
            title="I'm a chef"
            blurb="Looking to rent a kitchen by the hour for prep, events, pop-ups or production."
            bullets={['Browse kitchens by suburb', 'Book by the hour or day', 'Pay only when host accepts']}
            onClick={() => handlePickPersona('chef')} />
          <PersonaTile
            icon="building"
            title="I'm a kitchen owner"
            blurb="Ready to lease your commercial kitchen out to chefs when it sits idle."
            bullets={['List your space in minutes', 'Set your own hourly rate', 'Get paid 24h after each booking']}
            onClick={() => handlePickPersona('owner')} />
        </div>

        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', textAlign: 'center' }}>
          Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }} style={{ color: 'rgb(0,145,179)', fontWeight: 700, textDecoration: 'none' }}>Sign in</a>
        </span>
      </div>);

  }

  // Step 2 — details form
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span onClick={() => setStep(1)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
          color: 'rgb(0,145,179)', fontFamily: "'Open Sans', sans-serif", fontSize: 14, cursor: 'pointer'
        }}>
          <RAKIcon name="arrow-left" size={14} color="rgb(0,145,179)" />
          Back to account type
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 4,
            background: 'rgb(230,244,247)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <RAKIcon name={persona === 'chef' ? 'cooking' : 'building'} size={22} color="rgb(0,114,152)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 28, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>
              {persona === 'chef' ? 'Tell us about you' : 'Tell us about your business'}
            </h1>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)' }}>
              Signing up as a {persona === 'chef' ? 'chef' : 'kitchen owner'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <PerformField label="First name" required value={form.firstName} onChange={(v) => set('firstName', v)} placeholder="Mia" width="100%" />
          <PerformField label="Last name" required value={form.lastName} onChange={(v) => set('lastName', v)} placeholder="Tanaka" width="100%" />
        </div>
        <PerformField label="Email" required type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="you@example.com" width="100%" helper="We'll send a link here to verify your account." />
        <PerformField label="Phone" required value={form.phone} onChange={(v) => set('phone', v)} placeholder="+61 412 345 678" width="100%" />
        <PerformField label="Password" required type="password" value={form.password} onChange={(v) => set('password', v)} placeholder="At least 8 characters" width="100%" />

        {error && <PerformInfoPanel tone="warning">{error}</PerformInfoPanel>}

        <div style={{ marginTop: 4 }}>
          <PerformCheckbox checked={form.agree} onChange={(v) => set('agree', v)} label={<span>I agree to the <a href="#" style={{ color: 'rgb(0,145,179)' }}>Terms of Service</a> and <a href="#" style={{ color: 'rgb(0,145,179)' }}>Privacy Policy</a>.</span>} />
        </div>
      </div>

      <PerformButton variant="brand" onClick={handleSubmit} disabled={loading} style={{ height: 44, fontSize: 16 }}>
        {loading ? 'Creating account…' : 'Create account'}
      </PerformButton>

      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', textAlign: 'center', lineHeight: 1.5 }}>
        We'll email you a link to verify your address before you can sign in.
      </span>
    </form>);

}

/* ============================================================
   VERIFY EMAIL MODAL
   Shown after the user saves their signup. Mimics a transactional
   email so the user can "click the link" to complete verification.
   ============================================================ */
function VerifyEmailModal({ signup, onVerify, onContinue, onBackToSignIn }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(32,33,36,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: '#fff', borderRadius: 6, width: '100%', maxWidth: 520,
        boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', overflow: 'hidden'
      }}>
        {!signup.verified
          ? <VerifyEmailPending signup={signup} onVerify={onVerify} onBackToSignIn={onBackToSignIn} />
          : <VerifyEmailSuccess signup={signup} onContinue={onContinue} />}
      </div>
    </div>);

}

function VerifyEmailPending({ signup, onVerify, onBackToSignIn }) {
  return (
    <>
      <div style={{ padding: '24px 28px 0' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgb(230,244,247)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16
        }}>
          <RAKIcon name="send" size={26} color="rgb(0,114,152)" />
        </div>
        <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 28, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>
          Check your inbox
        </h2>
        <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', margin: '10px 0 0', lineHeight: 1.55 }}>
          We've sent a verification link to <strong>{signup.email}</strong>. Click the link in the email to activate your account, then come back here to sign in.
        </p>
      </div>

      {/* Simulated email preview — the user clicks the button inside to "open the link" */}
      <div style={{
        margin: '20px 28px 0',
        background: 'rgb(248,247,247)',
        border: '1px solid rgb(221,219,218)',
        borderRadius: 5, overflow: 'hidden'
      }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgb(221,219,218)', display: 'flex', alignItems: 'center', gap: 8, background: '#fff' }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
            color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Open Sans', sans-serif", fontSize: 10, fontWeight: 700
          }}>RAK</div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgb(32,33,36)' }}>Rent a Kitchen · noreply@rentakitchen.com.au</span>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)' }}>Verify your email address</span>
          </div>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)' }}>just now</span>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)', lineHeight: 1.55 }}>
            Hi {signup.firstName || 'there'} — confirm this is your email so we can finish setting up your account.
          </span>
          <button
            type="button"
            onClick={onVerify}
            style={{
              alignSelf: 'flex-start',
              padding: '10px 18px', borderRadius: 4,
              background: 'rgb(0,114,152)', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700
            }}>
            Verify email address
          </button>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: 'rgb(95,99,104)' }}>
            This link will expire in 24 hours. If you didn't sign up, you can ignore this email.
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 8 }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={{
          fontFamily: "'Open Sans', sans-serif", fontSize: 13, fontWeight: 600,
          color: 'rgb(0,145,179)', textDecoration: 'none'
        }}>Resend email</a>
        <PerformButton variant="base" onClick={onBackToSignIn}>Back to sign in</PerformButton>
      </div>
    </>);

}

function VerifyEmailSuccess({ signup, onContinue }) {
  return (
    <div style={{ padding: '32px 28px 28px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgb(220,243,228)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <RAKIcon name="shield" size={32} color="rgb(31,121,77)" />
      </div>
      <div>
        <h2 style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 28, color: 'rgb(95,99,104)', margin: 0, lineHeight: 1.1 }}>
          Email verified
        </h2>
        <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: 'rgb(32,33,36)', margin: '10px 0 0', lineHeight: 1.55 }}>
          Thanks, {signup.firstName}. Your account is now active — sign in with the password you set and you'll land on your{' '}
          {signup.persona === 'chef' ? 'chef dashboard' : 'kitchen owner dashboard'}.
        </p>
      </div>
      <PerformButton variant="brand" onClick={onContinue} style={{ alignSelf: 'stretch', height: 44, fontSize: 16 }}>
        Continue to sign in
      </PerformButton>
    </div>);

}

function PersonaTile({ icon, title, blurb, bullets, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left',
        background: hover ? 'rgb(230,244,247)' : '#fff',
        border: '1px solid ' + (hover ? 'rgb(0,114,152)' : 'rgb(190,191,193)'),
        borderRadius: 5, padding: 22,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'border-color 120ms, background 120ms, transform 120ms',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'
      }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <RAKIcon name={icon} size={24} color="#fff" />
      </div>
      <span style={{ fontFamily: "'Varela Round', sans-serif", fontSize: 22, color: 'rgb(32,33,36)', lineHeight: 1.1 }}>{title}</span>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: 'rgb(95,99,104)', lineHeight: 1.5 }}>{blurb}</span>

      <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bullets.map((b, i) =>
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(32,33,36)' }}>
            <span style={{
              flexShrink: 0, marginTop: 2,
              width: 16, height: 16, borderRadius: '50%',
              background: 'rgb(220,243,228)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <RAKIcon name="shield" size={9} color="rgb(31,121,77)" />
            </span>
            <span>{b}</span>
          </li>
        )}
      </ul>

      <span style={{
        marginTop: 8,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700,
        color: 'rgb(0,114,152)'
      }}>
        Continue
        <RAKIcon name="arrow-right" size={14} color="rgb(0,114,152)" />
      </span>
    </button>);

}

function StateSelect({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <PerformFieldLabel required>State</PerformFieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 38, borderRadius: 4,
          border: '1px solid rgb(221,219,218)',
          padding: '8px 12px',
          fontFamily: "'Open Sans', sans-serif", fontSize: 16,
          color: 'rgb(32,33,36)', background: '#fff',
          outline: 'none', cursor: 'pointer',
          boxSizing: 'border-box'
        }}>
        {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>);

}

/* ============================================================
   BRAND PANEL — right side
   ============================================================ */
function AuthBrandPanel() {
  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, rgb(0,145,179) 0%, rgb(0,114,152) 100%)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
    }}>
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          opacity: 0.55, mixBlendMode: 'multiply'
        }} />

      {/* Dark gradient overlay for legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,73,99,0.45) 0%, rgba(0,73,99,0.85) 100%)'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', padding: '56px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{
          display: 'inline-flex', alignSelf: 'flex-start',
          padding: '6px 14px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.18)',
          fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700,
          color: '#fff', letterSpacing: 0.5
        }}>AUSTRALIA · 412 KITCHENS · 1,840 CHEFS</div>

        <h2 style={{
          fontFamily: "'Varela Round', sans-serif", fontSize: 48, lineHeight: 1.05,
          color: '#fff', margin: 0, textWrap: 'balance'
        }}>
          The kitchen sitting idle next door is your next prep space.
        </h2>

        <p style={{
          fontFamily: "'Open Sans', sans-serif", fontSize: 17, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.92)', margin: 0, maxWidth: 480
        }}>
          Commercial kitchens across Australia open up by the hour. Chefs save on overheads, owners earn from quiet days, and every booking is insured.
        </p>

        <div style={{
          marginTop: 12, padding: 20,
          background: 'rgba(255,255,255,0.10)',
          borderRadius: 5,
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column', gap: 10,
          maxWidth: 480
        }}>
          <div style={{
            fontFamily: "'Open Sans', sans-serif", fontSize: 15, lineHeight: 1.6,
            color: '#fff', fontStyle: 'italic'
          }}>
            "We listed our kitchen on a Tuesday and had three chefs booked for the weekend. It's covering more of our overheads than I expected."
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: "'Varela Round', sans-serif", fontSize: 14, fontWeight: 700
            }}>EK</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>Eleanor Khoury</span>
              <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.78)' }}>Owner · Surry Hills, NSW</span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
