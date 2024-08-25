/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/**/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { "50": "#92B5F8", "100": "#76A2F6", "200": "#5B90F4", "300": "#407DF3", "400": "#246BF1", "500": "#0958EF", "600": "#084ED4", "700": "#0744BA", "800": "#063B9F", "900": "#010128" }
      }
    }
  },
};