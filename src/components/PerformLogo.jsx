import React from 'react';

const MARK_STAR_D = 'M 8.478 6.475 C 8.478 6.236 8.701 5.971 8.858 5.837 C 9.015 5.704 11.916 3.237 11.916 3.237 C 11.916 3.237 8.207 4.366 7.994 4.43 C 7.782 4.495 7.454 4.55 7.218 4.421 C 6.997 4.301 6.865 3.987 6.821 3.792 C 6.777 3.598 5.958 0 5.958 0 C 5.958 0 5.141 3.587 5.095 3.793 C 5.048 3.998 4.934 4.293 4.698 4.421 C 4.478 4.541 4.123 4.491 3.921 4.43 C 3.72 4.369 0 3.237 0 3.237 C 0 3.237 2.892 5.696 3.058 5.837 C 3.224 5.978 3.438 6.218 3.438 6.475 C 3.438 6.714 3.215 6.979 3.058 7.113 C 2.901 7.246 0 9.712 0 9.712 C 0 9.712 3.709 8.584 3.921 8.52 C 4.134 8.455 4.462 8.4 4.698 8.529 C 4.918 8.648 5.05 8.963 5.095 9.157 C 5.139 9.352 5.958 12.95 5.958 12.95 C 5.958 12.95 6.774 9.363 6.821 9.157 C 6.868 8.952 6.981 8.657 7.218 8.529 C 7.438 8.409 7.793 8.458 7.995 8.52 C 8.196 8.581 11.916 9.712 11.916 9.712 C 11.916 9.712 9.023 7.253 8.858 7.112 C 8.692 6.972 8.478 6.732 8.478 6.475';

const MARK_LEAF_D = 'M 17.5 0 C 7.84 0 0 7.84 0 17.5 C 0 22.7 2.28 27.4 5.9 30.6 L 5.9 17.5 C 5.9 11.1 11.1 5.9 17.5 5.9 L 30.6 5.9 C 27.4 2.28 22.7 0 17.5 0 Z';

function LogoMark({ size = 22, color = '#ffffff' }) {
  return (
    <svg
      width={size}
      height={size * (28 / 22)}
      viewBox="0 0 22.054 27.572"
      fill={color}
      aria-label="NABERS"
      style={{ flexShrink: 0, display: 'inline-block' }}
    >
      <g transform="translate(0 6.473) scale(0.6)">
        <path d={MARK_LEAF_D} fillRule="evenodd" />
      </g>
      <g transform="translate(10.139 0)">
        <path d={MARK_STAR_D} fillRule="evenodd" />
      </g>
    </svg>
  );
}

function LogoFull({ height = 28 }) {
  return (
    <img
      src="/logo.svg"
      alt="NABERS"
      style={{ height, width: 'auto', display: 'inline-block' }}
    />
  );
}

export const PerformLogoMark = LogoMark;
export const PerformLogoFull = LogoFull;
