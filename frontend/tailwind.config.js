/*
 * The palette tokens the auth screens of student-frontend use, and only those — `primary` and
 * its alpha steps, `red`, `disabled`, `muted`, `hotlightgreen`. Class names are kept identical
 * so markup copied from there renders the same here.
 */
module.exports = {
    content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#1254FF',
                'primary-64': 'rgba(18, 84, 255, 0.64)',
                'primary-16': 'rgba(18, 84, 255, 0.16)',
                'primary-8': 'rgba(18, 84, 255, 0.08)',
                secondary: '#E06A19',
                white: '#FCFCFC',
                black: '#121212',
                red: '#F03D3E',
                green: '#27AE60',
                gray: '#6D6D6D',
                disabled: '#D8D8D8',
                muted: '#6E6D7A',
                hotlightgreen: '#F8F8F8',
            },
        },
    },
    plugins: [],
};
