import { useRef } from 'react';

/*
 * Six boxes, one digit each, reporting the joined value to `setMobileOtp` — the OTP control of
 * student-frontend's signup step 2.
 *
 * The three behaviours that matter and are easy to lose: focus advances on entry and retreats on
 * Backspace from an empty box, a pasted six-digit code fills all six rather than only the first,
 * and non-digits are dropped instead of being typed into the box.
 */
export default function OtpInputBox({ length = 6, onChange }) {
    const boxes = useRef([]);

    const report = () => {
        onChange(boxes.current.map((box) => box?.value || '').join(''));
    };

    const handleChange = (index) => (e) => {
        const digits = e.target.value.replace(/\D/g, '');

        if (digits.length > 1) {
            // A paste. Spread it across this box and the ones after it.
            digits.split('').forEach((digit, offset) => {
                const box = boxes.current[index + offset];
                if (box) box.value = digit;
            });
            const last = Math.min(index + digits.length, length - 1);
            boxes.current[last]?.focus();
        } else {
            e.target.value = digits;
            if (digits && index < length - 1) boxes.current[index + 1]?.focus();
        }

        report();
    };

    const handleKeyDown = (index) => (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            boxes.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-2">
            {Array.from({ length }).map((_, index) => (
                <input
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    ref={(node) => {
                        boxes.current[index] = node;
                    }}
                    type="tel"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={length}
                    aria-label={`Digit ${index + 1}`}
                    onChange={handleChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    className="h-12 w-11 rounded-lg border border-disabled bg-white text-center text-[1.25rem] text-black focus:border-black focus:outline-none"
                />
            ))}
        </div>
    );
}
