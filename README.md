# Morfi Alimentación — Sitio

Sitio institucional (escaparate) de **Morfi Alimentación**, el ecosistema de
alimentación de Morfi: viandas, empresas y, próximamente, performance, market y
Gaucho Pet.

El sitio **informa y deriva**: no procesa pagos ni stock. El pedido y el menú
completo se resuelven en las tiendas por ciudad (plataforma propia), y el
contacto comercial va por WhatsApp.

## 🧭 Enfoque

- **Escaparate, no tienda.** Los botones de pedido derivan a la tienda de la
  ciudad elegida (CABA / La Plata). El sitio nunca finge ser un checkout.
- **Marca madre + unidades.** Viandas y Empresas están activas; Performance,
  Market y Gaucho Pet aparecen como "próximamente" con captura de interés.
- **Selección de ciudad** persistente (se recuerda) que define a qué tienda
  apuntan los enlaces.

## 🔗 Enlaces (fuente única de verdad)

Definidos en `src/App.jsx`:

- **Tienda CABA:** https://morfiviandas.com.ar/caba
- **Tienda La Plata:** https://morfiviandas.com.ar/laplata
- **WhatsApp viandas diarias:** https://wa.me/5492216044455
- **WhatsApp viandas congeladas:** https://wa.me/5492215613886

> La antigua plataforma *pedidosporwhatsapp.com.ar* quedó discontinuada — no se
> usa más en ningún lado del sitio.

## 🛠️ Tecnologías

- React 19 + Vite
- Tailwind CSS 4 + shadcn/ui
- lucide-react (íconos)
- Tipografía: Bricolage Grotesque (títulos), Hanken Grotesk (texto),
  Fraunces (acentos editoriales)

## 💻 Desarrollo

```bash
pnpm install        # o npm install
pnpm run dev        # servidor de desarrollo (http://localhost:5173)
pnpm run build      # build de producción
pnpm run preview    # preview del build
```

## 📁 Estructura

```
src/
├── components/ui/   # componentes shadcn/ui
├── assets/          # imágenes y logo
├── lib/ · hooks/    # utilidades
├── App.jsx          # la landing completa (secciones + estado)
├── App.css          # tema (tokens de marca, claro/oscuro) + base
└── main.jsx         # punto de entrada
public/
└── favicon.ico · morfi-logo.png
```

## 🎨 Marca

- **Turquesa** `#008CA2` — color señal (primario)
- **Amarillo** `#FFD144` — chispa, uso puntual
- **Teal-night** `#0B2A30` — profundidad y modo oscuro
- Acentos por unidad: Viandas (turquesa), Empresas (azul), Performance (verde),
  Market (oro), Gaucho Pet (arcilla)

## 📞 Locales

- Marcelo T. de Alvear 628 — CABA
- Calle 8 665, entre 45 y 46 — La Plata
