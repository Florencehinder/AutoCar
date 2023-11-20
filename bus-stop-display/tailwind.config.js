module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // more paths where Tailwind should look for classes
  ],
  theme: {
    extend: {
      fontSize: {
        "9xl": "9rem",
        "10xl": "10rem",
        // Add more sizes as needed
      },
    },
  },
  plugins: [require("daisyui")],
};
