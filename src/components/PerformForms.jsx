import React from 'react';
import { PerformIcon } from './PerformIcons';

function FieldLabel({ children, required = false, bold = false, info = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', paddingBottom: 4 }}>
      <span style={{
        fontFamily: "'Open Sans', sans-serif",
        fontSize: 16,
        fontWeight: bold ? 700 : 400,
        color: 'rgb(32,33,36)',
        lineHeight: 1.2,
      }}>
        {children}{required && <span style={{ color: 'rgb(222,13,13)', marginLeft: 4 }}>*</span>}
      </span>
      {info && <PerformIcon name="info" size={14} color="rgb(0,145,179)" />}
    </div>
  );
}

function Field({
  label,
  placeholder = 'Placeholder',
  value,
  onChange = () => {},
  unit = null,
  required = false,
  info = false,
  error = null,
  helper = null,
  type = 'text',
  width = 268,
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldWidth = unit
    ? (typeof width === 'number' ? width - 48 : `calc(${width} - 48px)`)
    : width;
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', gap: 9 }}>
      {label && <FieldLabel required={required} info={info}>{label}</FieldLabel>}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 9, alignItems: 'center' }}>
        <div style={{
          width: fieldWidth,
          height: 38,
          borderRadius: 4,
          background: '#fff',
          border: `1px solid ${error ? 'rgb(222,13,13)' : (focus ? 'rgb(0,114,152)' : 'rgb(221,219,218)')}`,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          transition: 'border-color 120ms',
        }}>
          <input
            type={type}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 16,
              color: 'rgb(32,33,36)',
              width: '100%',
              padding: 0,
            }}
          />
        </div>
        {unit && (
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)' }}>{unit}</span>
        )}
      </div>
      {error && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: -3 }}>
          <PerformIcon name="warning" size={14} color="rgb(222,13,13)" />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(222,13,13)' }}>{error}</span>
        </div>
      )}
      {!error && helper && (
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 13, color: 'rgb(95,99,104)', marginTop: -3 }}>{helper}</span>
      )}
    </div>
  );
}

function Radio({ checked, onChange = () => {}, label, disabled = false, name }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)',
      opacity: disabled ? 0.5 : 1, userSelect: 'none',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `2px solid ${checked ? 'rgb(0,114,152)' : 'rgb(147,149,151)'}`,
        background: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box',
        transition: 'border-color 120ms',
      }}>
        {checked && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgb(0,114,152)' }} />}
      </span>
      <input type="radio" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} style={{ display: 'none' }} />
      {label}
    </label>
  );
}

function Checkbox({ checked, onChange = () => {}, label, disabled = false }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)',
      opacity: disabled ? 0.5 : 1, userSelect: 'none',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: 2,
        border: `2px solid ${checked ? 'rgb(0,114,152)' : 'rgb(147,149,151)'}`,
        background: checked ? 'rgb(0,114,152)' : '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box',
        transition: 'background 120ms, border-color 120ms',
      }}>
        {checked && <PerformIcon name="check" size={12} color="#ffffff" />}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} style={{ display: 'none' }} />
      {label}
    </label>
  );
}

function Select({ label, value, onChange = () => {}, options = [], placeholder = 'Select…', width = 268, required = false }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ width, position: 'relative', display: 'flex', flexDirection: 'column', gap: 9 }}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', height: 38,
          borderRadius: 4, background: '#fff',
          border: `1px solid ${open ? 'rgb(0,114,152)' : 'rgb(221,219,218)'}`,
          padding: '8px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: "'Open Sans', sans-serif", fontSize: 16,
          color: value ? 'rgb(32,33,36)' : 'rgb(95,99,104)',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span>{value || placeholder}</span>
        <PerformIcon name="chevron-down" size={12} color="rgb(95,99,104)" />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: '#fff', border: '1px solid rgb(221,219,218)', borderRadius: 4,
          boxShadow: '0 2px 6px rgba(0,0,0,0.16)', zIndex: 20, overflow: 'hidden',
        }}>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgb(230,244,247)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
              style={{ padding: '8px 12px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", fontSize: 16, color: 'rgb(32,33,36)' }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const PerformField = Field;
export const PerformRadio = Radio;
export const PerformCheckbox = Checkbox;
export const PerformSelect = Select;
export const PerformFieldLabel = FieldLabel;
