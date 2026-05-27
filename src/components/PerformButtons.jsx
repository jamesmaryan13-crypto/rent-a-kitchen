import React from 'react';

function Button({
  variant = 'brand',
  children,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  onClick = () => {},
  style = {},
}) {
  const base = {
    height: 32,
    padding: '1px 16px',
    borderRadius: 4,
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent',
    boxSizing: 'border-box',
    transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
    opacity: disabled ? 0.5 : 1,
  };

  const variants = {
    brand: {
      background: 'rgb(0,114,152)',
      color: '#fff',
      borderColor: 'rgb(0,114,152)',
    },
    'brand-outline': {
      background: '#fff',
      color: 'rgb(0,114,152)',
      borderColor: 'rgb(0,114,152)',
    },
    base: {
      background: '#fff',
      color: 'rgb(32,33,36)',
      borderColor: 'rgb(190,191,193)',
    },
  };

  const hoverHandlers = !disabled && variant === 'brand'
    ? {
        onMouseEnter: (e) => { e.currentTarget.style.background = 'rgb(0,145,179)'; e.currentTarget.style.borderColor = 'rgb(0,145,179)'; },
        onMouseLeave: (e) => { e.currentTarget.style.background = 'rgb(0,114,152)'; e.currentTarget.style.borderColor = 'rgb(0,114,152)'; },
      }
    : !disabled && variant === 'brand-outline'
    ? {
        onMouseEnter: (e) => { e.currentTarget.style.background = 'rgb(230,244,247)'; },
        onMouseLeave: (e) => { e.currentTarget.style.background = '#fff'; },
      }
    : !disabled && variant === 'base'
    ? {
        onMouseEnter: (e) => { e.currentTarget.style.background = 'rgb(248,247,247)'; },
        onMouseLeave: (e) => { e.currentTarget.style.background = '#fff'; },
      }
    : {};

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      {...hoverHandlers}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

export const PerformButton = Button;
