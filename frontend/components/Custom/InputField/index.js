import React, { useState, forwardRef } from 'react';

/*
 * The bordered field of student-frontend: border turns red with `errorText` and green with
 * `successText`, a password field carries its own show/hide toggle, and the message renders
 * under the box. `...props` is spread onto the <input> on purpose — `name`, `id`,
 * `autoComplete`, `required` and `enterKeyHint` are all passed through by the login screen, and
 * the autofill attributes in particular are load-bearing rather than polish: without `name` and
 * `autocomplete` Chrome cannot classify a sign-in form locally and falls back to heuristics
 * before it will offer a saved password.
 *
 * `forwardRef` because the login screen holds a ref to the username box.
 */
const InputField = forwardRef(function InputField(
    {
        type = 'text',
        placeholder = 'Enter',
        style,
        rootStyle,
        rootClassName = '',
        inputClassName = '',
        disabled,
        helpText,
        errorText,
        successText,
        minWidth,
        onChange,
        ...props
    },
    ref
) {
    const [inputType, setInputType] = useState(type);

    const handelShowPass = () => setInputType((current) => (current === 'password' ? 'text' : 'password'));

    return (
        <>
            <div
                className={`w-full border bg-white ${
                    errorText ? 'border-red' : successText ? 'border-green' : 'border-disabled focus-within:border-black'
                } flex items-center justify-between gap-[10px] rounded-lg px-5 py-3 ${rootClassName}`}
                style={{
                    minWidth: minWidth ? minWidth : null,
                    maxHeight: '3.375em',
                    minHeight: '3.375em',
                    ...rootStyle,
                }}
            >
                <input
                    ref={ref}
                    type={inputType}
                    className={`flex-1 bg-white text-black placeholder-disabled focus:outline-none ${inputClassName}`}
                    style={style}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={onChange}
                    {...props}
                />
                {type === 'password' ? (
                    <button
                        type="button"
                        onClick={handelShowPass}
                        className="text-[0.75rem] font-bold text-primary focus:outline-none"
                        aria-label={inputType === 'password' ? 'Show password' : 'Hide password'}
                    >
                        {inputType === 'password' ? 'SHOW' : 'HIDE'}
                    </button>
                ) : null}
            </div>
            {errorText && errorText !== '' && <div className="mt-1 text-[0.875rem] text-red">{errorText}</div>}
            {successText && successText !== '' && <div className="mt-1 text-[0.875rem] text-green">{successText}</div>}
            {helpText && helpText !== '' && <div className="mt-1 text-[0.875rem] text-black">{helpText}</div>}
        </>
    );
});

export default InputField;
