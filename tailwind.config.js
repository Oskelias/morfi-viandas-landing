/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fondo-suave': '#F9F4F2',
        'blanco-puro': '#FFFFFF',
        'gris-profundo': '#444444',
        'negro': '#000000',
        'amarillo-vibrante': '#FFD144',
        'turquesa-oscuro': '#008CA2',
        'turquesa-pastel': '#A1D3D2',
        'celeste-vibrante': '#0D99B9',
        'primary': '#008CA2', // Usando turquesa oscuro como color primario
        'turquesa-oscuro-hover': '#006B7A', // Un tono más oscuro para el hover
        'turquesa-pastel-claro': '#E0F2F2', // Un tono más claro para fondos
        'accent': '#FFD144', // Usando amarillo vibrante como acento
        'accent-foreground': '#444444', // Color de texto para el acento
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        headings: ['Baloo Bhai', 'cursive'],
      },
    },
  },
  plugins: [],
}


