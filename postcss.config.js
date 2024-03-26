module.exports = {
  // plugins: {
  //   tailwindcss: {},
  //   autoprefixer: {},
  // },
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-nested'), // 确保 'postcss-nested' 在 'tailwindcss' 后面
    require('autoprefixer'),
  ],
}
