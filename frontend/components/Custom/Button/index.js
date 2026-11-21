import React from 'react';

/*
 * `btn` + a colour + a size, exactly as student-frontend composes them; the classes themselves
 * live in styles/global.css. Defaults to `type="submit"` because every use here is the submit of
 * the form it sits in — the login form and each signup step.
 *
 * THE TWO MAPS ARE WHY THE BUTTON HAS A BACKGROUND.
 *
 * Written as `btn-${color}` the class name never appears literally in any file, and Tailwind
 * decides what to emit by scanning source text: the `@layer components` rules for `btn-primary`
 * and `btn-lg` were dropped from the stylesheet as unused, so every button rendered as bare text
 * with no fill and no height. Spelling the names out here puts them back in front of the scanner.
 * Anything added to styles/global.css must be added to a map here too, not interpolated.
 */
const COLOR = {
    primary: 'btn-primary',
    link: 'btn-link',
};

const SIZE = {
    sm: 'btn-sm',
    lg: 'btn-lg',
};

export default function Button({
    children,
    onClick,
    size = 'sm',
    type = 'submit',
    className = '',
    disabled,
    color = 'primary',
    icon,
}) {
    return (
        <button
            type={type}
            className={`btn ${COLOR[color] || COLOR.primary} ${SIZE[size] || SIZE.sm} ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
            {icon === 'rightArrowIcon' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : null}
        </button>
    );
}
