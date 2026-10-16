/** Konfigurasi Tailwind Siberinfo (sama dengan config di CDN sebelumnya). */
module.exports = {
  content: ['./index.html', './admin.html', './app.js', './admin.js'],
  darkMode: 'media', // mengikuti prefers-color-scheme sistem
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
