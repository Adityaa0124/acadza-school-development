import { useEffect, useState } from 'react';
import { SCREEN_SIZES } from '@utils/constants/screen_size';

const sizeOf = (width) => {
    if (width < 768) return SCREEN_SIZES.MOBILE;
    if (width < 1024) return SCREEN_SIZES.TABLET;
    return SCREEN_SIZES.DESKTOP;
};

/*
 * Which of the three bands the viewport is in. It starts at DESKTOP rather than measuring during
 * render, because there is no window on the server and a first render that disagreed with the
 * client's would hydrate mismatched; the effect corrects it before paint.
 */
export function useWindowSize() {
    const [screenSize, setScreenSize] = useState(SCREEN_SIZES.DESKTOP);

    useEffect(() => {
        const onResize = () => setScreenSize(sizeOf(window.innerWidth));
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return screenSize;
}
