// tailwind.config.js
module.exports = {
  content: [
    "./app//*.{js,ts,jsx,tsx}",
    "./components//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tertiary: {
          0: "#98C7F3",
          10: "#6AADEB",
          20: "#54A2EA",
        },
        neutral: {
          0: "#FFFFFF",
          10: "#F8FBFF",
          20: "#F2F8FF",
          30: "#E5EEFA",
          40: "#D2DBE7",
          50: "#A6AEBA",
          60: "#717984",
          70: "#484D52",
          80: "#282B2E",
          90: "#1B1D20",
        },
        success: {
          0: "#ACE588",
          10: "#7CCC4B",
          20: "#61BB29",
        },
        danger: {
          0: "#FF6969",
          10: "#FF4646",
          30: "#E42D2D",
        },
        alert: {
          0: "#FFB774",
          10: "#EE8A2E",
          30: "#DE7514",
        },
      },
    },
  },
  plugins: [],
}