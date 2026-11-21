import React from 'react';

/*
 * The type scale of student-frontend, same variants and same sizes, so `variant="h1"` is the
 * screen heading and `variant="small"` is a field label here as it is there.
 */
const CLASS = {
    h1: 'text-[2.75rem] leading-[140%]',
    h2: 'text-[2rem] leading-[140%]',
    h3: 'text-[1.5rem] leading-[140%]',
    h4: 'text-[1.25rem] leading-[140%]',
    h5: 'text-[1rem] leading-[140%]',
    h6: 'text-[0.875rem] leading-[140%]',
    small: 'text-[0.75rem] leading-[140%]',
    p: 'text-[0.875rem] leading-[140%]',
};

export default function Typography({ children, variant, className = '', ...props }) {
    const Tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)
        ? variant
        : variant === 'small'
        ? 'span'
        : 'p';

    return (
        <Tag className={`${CLASS[variant] || CLASS.p} ${className}`} {...props}>
            {children}
        </Tag>
    );
}
