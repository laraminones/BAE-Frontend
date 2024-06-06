/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-datepicker/**/*.js"
  ],
  theme: {
    fontFamily: {
      display: ['Blinker', 'IBM\\ Plex\\ Mono', 'Menlo', 'monospace'],
      body: ['Blinker', 'IBM\\ Plex\\ Mono', 'Menlo', 'monospace'],
    },
    extend: {
      colors: {
        primary: {
          //Primary light
          50: '#00add3',
          //Primary dark
          100: '#2d58a7',
        },
        secondary: {
          //Secondary light
          50: '#dde6f6',
          //Secondary dark
          100: '#14274a',
          //Color they use as bg when dark theme
          200: '#0c1c38'
        },
      },
      transitionProperty: {
        width: "width"
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
        '2500': '2500ms',
        '3000': '3000ms',
      },
      gridTemplateColumns:
      {
        '60/40': '60% 40%',
        '80/20': '80% 20%',
        '20/80': '20% 80%',
        '10/90': '10% 90%'
      },
      gridTemplateRows:
      {
        '60/40': '60% 40%',
        '80/20': '80% 20%',
        '20/80': '20% 80%',
        '10/90': '10% 90%'
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class'
}

