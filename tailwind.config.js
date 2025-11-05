/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
   extend: {
      fontFamily: {
        // Đặt tên cho font của bạn (ví dụ: 'font-signature')
        'signature': ['"Dancing Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
