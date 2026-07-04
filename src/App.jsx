import './App.css'
import { useState, useEffect, useRef } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Badge } from './components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './components/ui/accordion'
import {
  Phone,
  MapPin,
  Clock,
  ChefHat,
  Truck,
  Snowflake,
  Package,
  Menu as MenuIcon,
  X,
  Sun,
  Moon,
  ArrowUpRight,
} from 'lucide-react'

import morfiLogo from './assets/morfi-logo.png'
import heroImage from './assets/hero_meal_prep.jpg'
import healthyTuppersImage from './assets/healthy_tuppers.jpg'
import mealOrganizationImage from './assets/meal_organization.jpg'
import corporateCateringImage from './assets/corporate_catering.jpg'
import officeLunchImage from './assets/office_lunch.jpg'

/* ────────────────────────────────────────────────────────────
   Enlaces externos. Las tiendas viven en la plataforma propia,
   por ciudad. El pedido y el menú completo se resuelven ahí.
──────────────────────────────────────────────────────────────*/
const STORE_URL = {
  caba: 'https://morfiviandas.com.ar/caba',
  laplata: 'https://morfiviandas.com.ar/laplata',
}
const CITY_LABEL = { caba: 'CABA', laplata: 'La Plata' }
const WSP_DIARIAS = 'https://wa.me/5492216044455'
const WSP_CONGELADAS = 'https://wa.me/5492215613886'

const NAV_LINKS = [
  { href: '#viandas', label: 'Viandas' },
  { href: '#empresas', label: 'Empresas' },
  { href: '#performance', label: 'Performance', soon: true },
  { href: '#market', label: 'Market', soon: true },
  { href: '#gaucho-pet', label: 'Gaucho Pet', soon: true },
]

const UNITS = [
  { key: 'viandas', name: 'Viandas', desc: 'Menú diario y packs semanales.', color: 'var(--u-viandas)', soon: false },
  { key: 'empresas', name: 'Empresas', desc: 'Catering y almuerzos de oficina.', color: 'var(--u-empresas)', soon: false },
  { key: 'performance', name: 'Performance', desc: 'Línea proteica y keto.', color: 'var(--u-performance)', soon: true },
  { key: 'market', name: 'Market', desc: 'Almacén natural y snacks.', color: 'var(--u-market)', soon: true },
  { key: 'gaucho-pet', name: 'Gaucho Pet', desc: 'Alimento natural para mascotas.', color: 'var(--u-pet)', soon: true },
]

const MENU_ITEMS = [
  { name: 'Pollo al verdeo con papas al horno', price: '$7.500', tag: 'Más pedido', img: healthyTuppersImage },
  { name: 'Wok de pollo y vegetales con soja', price: '$7.500', tag: 'Principal', img: mealOrganizationImage },
  { name: 'Suprema napolitana con puré mixto', price: '$7.500', tag: 'Principal', img: heroImage },
  { name: 'Ensaladas variadas de estación', price: '$6.500', tag: 'Fresco', img: officeLunchImage },
]

const STEPS = [
  { icon: Package, title: 'Elegí tu plan', desc: 'Menú diario o pack semanal, a tu medida, en la tienda de tu ciudad.' },
  { icon: ChefHat, title: 'Cocinamos fresco', desc: 'Ingredientes de calidad, envasado termosellado que conserva todo.' },
  { icon: Truck, title: 'Recibí y calentá', desc: 'Retirás o te lo llevamos. Listo para calentar y morfar.' },
]

const WHY = [
  { icon: Snowflake, title: 'Termosellado', desc: 'Frescura hasta 5 días en heladera o 3 meses congelado.' },
  { icon: Package, title: 'Pack semanal', desc: 'Armá tu semana a medida. Descuentos en compras grandes.' },
  { icon: Clock, title: 'Siempre atentos', desc: 'Atención todos los días. Pedís cuando te queda cómodo.' },
]

const FAQS = [
  { q: '¿Cuánto duran las viandas?', a: 'Con sistema termosellado, hasta 5 días en heladera o 3 meses congeladas.' },
  { q: '¿Hacen entregas a empresas?', a: 'Sí. Tenemos catering, coffee breaks y convenios corporativos con entrega coordinada.' },
  { q: '¿Cómo hago el pedido?', a: 'Elegís tu ciudad (CABA o La Plata) y te llevamos a la tienda online para pedir el menú completo.' },
  { q: '¿Dónde están los locales?', a: 'Marcelo T. de Alvear 628 (CABA) y Calle 8 665, entre 45 y 46 (La Plata).' },
]

/* ── hooks ── */
function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(document.querySelectorAll('.reveal'))
    // Aplicar el estado oculto solo ahora que el JS corre: si esto no ejecuta,
    // el contenido permanece visible.
    els.forEach((el) => el.classList.add('reveal-pre'))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove('reveal-pre'); io.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function MonoLabel({ children, className = '' }) {
  return <span className={`font-mono-label text-muted-foreground ${className}`}>{children}</span>
}

function App() {
  const [city, setCity] = useState(() => localStorage.getItem('morfi-city') || 'caba')
  const [theme, setTheme] = useState(() => localStorage.getItem('morfi-theme') || 'light')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('morfi-theme', theme)
  }, [theme])
  useEffect(() => { localStorage.setItem('morfi-city', city) }, [city])

  useReveal()

  const store = STORE_URL[city]
  const toggleCity = () => setCity((c) => (c === 'caba' ? 'laplata' : 'caba'))

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ Header ═══ */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
          <a href="#top" className="flex items-center gap-2.5 shrink-0">
            <img src={morfiLogo} alt="Morfi" className="h-11 w-11 rounded-full" />
            <span className="font-mono-label text-muted-foreground hidden sm:block">Alimentación</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="flex items-center gap-1.5 text-foreground/70 transition-colors hover:text-primary">
                {l.label}
                {l.soon && <span className="font-mono-label text-[0.55rem] rounded-full border border-border px-1.5 py-px text-muted-foreground">pronto</span>}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleCity} className="hidden sm:flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono-label text-muted-foreground transition-colors hover:border-primary hover:text-primary" title="Cambiar ciudad">
              <MapPin className="h-3.5 w-3.5" />{CITY_LABEL[city]}
            </button>
            <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:text-primary" aria-label="Cambiar tema">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a href={store} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
              <Button className="rounded-full">Pedir ahora</Button>
            </a>
            <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border" aria-label="Menú">
              {menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-border/70 bg-background px-4 py-4 flex flex-col gap-3 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-foreground/75">
                {l.label}
                {l.soon && <span className="font-mono-label text-[0.55rem] rounded-full border border-border px-1.5 py-px text-muted-foreground">pronto</span>}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <button onClick={toggleCity} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono-label text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />{CITY_LABEL[city]}
              </button>
              <a href={store} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full rounded-full">Pedir ahora</Button>
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        {/* ═══ Hero ═══ */}
        <section id="viandas" className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-stretch gap-0 px-4 py-10 md:grid-cols-2 md:gap-10 md:py-16">
            <div className="reveal flex flex-col justify-center">
              <span className="font-mono-label mb-5 flex items-center gap-2.5 text-muted-foreground">
                <span className="inline-block h-[3px] w-6 rounded bg-[var(--u-viandas)]" />
                Viandas · lo de siempre, rico
              </span>
              <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-tight text-balance">
                Comé como en casa,{' '}
                <span className="font-editorial text-primary">sin cocinar</span> en casa.
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                Viandas frescas, termoselladas y de verdad ricas. Elegís, te las llevás, las calentás. Listo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={store} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full text-base">Ver el menú <ArrowUpRight className="h-4 w-4" /></Button>
                </a>
                <a href="#como-funciona">
                  <Button size="lg" variant="outline" className="rounded-full text-base">Cómo funciona</Button>
                </a>
              </div>
            </div>

            <div className="reveal relative mt-8 md:mt-0">
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-secondary" />
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-[1.6rem] bg-[var(--teal-night)] shadow-xl">
                <img src={heroImage} alt="Viandas frescas Morfi" className="h-full w-full object-cover" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-2xl bg-[var(--teal-night)]/85 px-3.5 py-2.5 text-white backdrop-blur-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--spark)]" />
                  <span className="font-mono-label opacity-80">Frescura</span>
                  <span className="text-sm font-semibold">5 días en heladera</span>
                </div>
              </div>
            </div>
          </div>

          {/* unit strip */}
          <div className="border-y border-border/70 bg-muted/50">
            <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-5">
              {UNITS.map((u) => (
                <a key={u.key} href={`#${u.key}`} className="flex flex-col gap-2 border-r border-border/70 p-4 last:border-r-0 transition-colors hover:bg-muted">
                  <span className="h-[3px] w-6 rounded" style={{ background: u.color }} />
                  <span className="font-semibold tracking-tight">{u.name}</span>
                  {u.soon
                    ? <span className="font-mono-label w-fit rounded-full border border-border px-2 py-px text-[0.55rem] text-muted-foreground">Pronto</span>
                    : <span className="text-xs text-muted-foreground leading-snug">{u.desc}</span>}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Cómo funciona ═══ */}
        <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="reveal grid items-center gap-12 md:grid-cols-2">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-secondary" />
              <img src={mealOrganizationImage} alt="Organización semanal de viandas" className="w-full rounded-[1.6rem] object-cover shadow-lg" />
            </div>
            <div className="order-1 md:order-2">
              <MonoLabel>Cómo funciona</MonoLabel>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-balance">Simple, rápido, rico.</h2>
              <div className="mt-8 flex flex-col gap-6">
                {STEPS.map(({ icon: Icon, title, desc }, i) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--tint-teal)] text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold"><span className="text-primary">{i + 1}.</span> {title}</h3>
                      <p className="text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Por qué Morfi ═══ */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal mb-12 text-center">
              <MonoLabel>Por qué Morfi</MonoLabel>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight text-balance">Comer bien no debería costar tiempo.</h2>
            </div>
            <div className="reveal grid gap-6 md:grid-cols-3">
              {WHY.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-3xl border border-border bg-card p-7 text-center shadow-sm">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tint-teal)] text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Menú destacado ═══ */}
        <section id="menu" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <MonoLabel>Menú de muestra · {CITY_LABEL[city]}</MonoLabel>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight">Algunos de esta semana.</h2>
            </div>
            <a href={store} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full">Ver menú completo <ArrowUpRight className="h-4 w-4" /></Button>
            </a>
          </div>
          <div className="reveal grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MENU_ITEMS.map((item) => (
              <Card key={item.name} className="overflow-hidden rounded-3xl border-border p-0 transition-shadow hover:shadow-md gap-0">
                <div className="relative h-40 overflow-hidden bg-[var(--teal-night)]">
                  <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                  <Badge className="absolute left-3 top-3 rounded-full">{item.tag}</Badge>
                </div>
                <CardContent className="p-4">
                  <p className="mb-3 min-h-[2.5rem] font-semibold leading-snug">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-semibold tabular-nums text-primary">{item.price}</span>
                    <a href={store} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="rounded-full text-xs">Pedir <ArrowUpRight className="h-3 w-3" /></Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ═══ Empresas ═══ */}
        <section id="empresas" className="relative py-20 md:py-28">
          <img src={corporateCateringImage} alt="Catering para empresas" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(14,38,56,0.94) 0%, rgba(14,38,56,0.80) 100%)' }} />
          <div className="reveal relative mx-auto max-w-6xl px-4 text-white">
            <div className="max-w-xl">
              <span className="font-mono-label flex items-center gap-2.5 text-white/70">
                <span className="inline-block h-[3px] w-6 rounded bg-[var(--spark)]" /> Morfi Empresas
              </span>
              <h2 className="mt-4 text-[clamp(1.9rem,4.5vw,3rem)] font-bold tracking-tight text-balance text-white">
                Llevamos viandas a tu oficina.
              </h2>
              <p className="mt-4 text-lg text-white/85">
                Catering, coffee breaks, eventos y convenios corporativos. Menús grupales y entrega coordinada para que tu equipo coma bien todos los días.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={WSP_DIARIAS} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full bg-[var(--spark)] text-[var(--spark-ink)] hover:bg-[var(--spark)]/90">
                    Solicitar cotización
                  </Button>
                </a>
                <a href={WSP_DIARIAS} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10">
                    <Phone className="h-4 w-4" /> WhatsApp empresas
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Próximamente ═══ */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="reveal mb-10">
            <MonoLabel>Lo que viene</MonoLabel>
            <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight text-balance">Morfi es más que viandas.</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">Estamos armando el resto del ecosistema. Dejanos tu contacto y te avisamos apenas esté.</p>
          </div>
          <div className="reveal grid gap-5 md:grid-cols-3">
            {UNITS.filter((u) => u.soon).map((u) => (
              <div key={u.key} id={u.key} className="rounded-3xl border border-dashed border-border bg-muted/40 p-6">
                <span className="font-mono-label w-fit rounded-full border px-2.5 py-0.5" style={{ borderColor: u.color, color: u.color }}>
                  {u.name} · pronto
                </span>
                <p className="mt-4 mb-4 text-muted-foreground">{u.desc}</p>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" required placeholder="tu@email.com" aria-label={`Avisame sobre ${u.name}`}
                    className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" />
                  <Button type="submit" className="rounded-full" style={{ background: u.color }}>Avisame</Button>
                </form>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <div className="reveal mb-10 text-center">
              <MonoLabel>Preguntas frecuentes</MonoLabel>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.4rem)] font-bold tracking-tight">Lo que te estás preguntando.</h2>
            </div>
            <div className="reveal rounded-3xl border border-border bg-card px-6">
              <Accordion type="single" collapsible>
                {FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`f-${i}`}>
                    <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ Footer ═══ */}
      <footer id="contacto" className="bg-[var(--teal-night)] text-white/85">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <img src={morfiLogo} alt="Morfi" className="h-14 w-14 rounded-full" />
              <p className="mt-4 max-w-xs text-sm text-white/65">
                Comé rico y saludable, sin cocinar. Viandas frescas para particulares y empresas en CABA y La Plata.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-mono-label mb-3 text-white/50">Locales</p>
              <p className="flex items-start gap-2 text-white/80"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Marcelo T. de Alvear 628 — CABA</p>
              <p className="mt-2 flex items-start gap-2 text-white/80"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Calle 8 665, e/ 45 y 46 — La Plata</p>
              <p className="mt-3 flex items-start gap-2 text-white/80"><Clock className="mt-0.5 h-4 w-4 shrink-0" /> Todos los días</p>
            </div>
            <div className="text-sm">
              <p className="font-mono-label mb-3 text-white/50">Pedidos</p>
              <a href={WSP_DIARIAS} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/80 hover:text-white"><Phone className="h-4 w-4" /> 221 604 4455 · diarias</a>
              <a href={WSP_CONGELADAS} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-white/80 hover:text-white"><Phone className="h-4 w-4" /> 221 561 3886 · congeladas</a>
              <a href={STORE_URL.caba} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-white/80 hover:text-white"><ArrowUpRight className="h-4 w-4" /> Tienda CABA</a>
              <a href={STORE_URL.laplata} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-white/80 hover:text-white"><ArrowUpRight className="h-4 w-4" /> Tienda La Plata</a>
            </div>
          </div>
          <div className="mt-12 border-t border-white/15 pt-6 text-xs text-white/45">
            © {new Date().getFullYear()} Morfi Alimentación. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
