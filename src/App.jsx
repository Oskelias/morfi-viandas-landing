import './App.css'
import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
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
  Home,
  Building2,
  CheckCircle2,
  ChefHat,
  Truck,
  Snowflake,
  Package,
  Menu as MenuIcon,
  X,
  Sparkles,
} from 'lucide-react'

import heroImage from './assets/hero_meal_prep.jpg'
import healthyTuppersImage from './assets/healthy_tuppers.jpg'
import mealOrganizationImage from './assets/meal_organization.jpg'
import corporateCateringImage from './assets/corporate_catering.jpg'
import officeLunchImage from './assets/office_lunch.jpg'
import morfiLogo from './assets/morfi-logo-nuevo.png'

const MENU_URL = 'https://www.pedidosporwhatsapp.com.ar/MorfiSemanal'
const WHATSAPP_DIARIAS_URL = 'https://wa.me/5492216044455'
const WHATSAPP_CONGELADAS_URL = 'https://wa.me/5492215613886'

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#menu', label: 'Menú' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contacto', label: 'Contacto' },
]

const menuItems = [
  { name: 'Albóndigas a la portuguesa con puré de papas', price: '$7500', category: 'Principal' },
  { name: 'Wok de pollo y vegetales con salsa de soja', price: '$7500', category: 'Principal' },
  { name: 'Pechuga a la mostaza con papas al horno', price: '$7500', category: 'Principal' },
  { name: 'Pollo al verdeo con crema y papas al horno', price: '$7500', category: 'Principal' },
  { name: 'Pastel de papas', price: '$7500', category: 'Principal' },
  { name: 'Suprema napolitana con puré mixto', price: '$7500', category: 'Principal' },
  { name: 'Guiso de lentejas con carne', price: '$7500', category: 'Principal' },
  { name: 'Ensaladas variadas', price: '$6500', category: 'Ensaladas' },
]

const faqs = [
  {
    question: '¿Cuánto duran las viandas?',
    answer:
      'Nuestras viandas con sistema termosellado se pueden refrigerar hasta 5 días en heladera o congelar hasta 3 meses.',
  },
  {
    question: '¿Hacen entregas a empresas?',
    answer:
      'Sí, ofrecemos servicios especializados para empresas con menús grupales y horarios de entrega flexibles.',
  },
  {
    question: '¿Cuál es el pedido mínimo?',
    answer:
      'Para packs semanales, ofrecemos descuentos en compras superiores a $50.000 con el cupón PACK.',
  },
]

const trustBar = [
  { icon: Snowflake, label: 'Termosellado', detail: '5 días en heladera' },
  { icon: MapPin, label: '2 locales', detail: 'CABA y La Plata' },
  { icon: Clock, label: 'Atención', detail: 'Todos los días, 24hs' },
  { icon: Sparkles, label: 'Experiencia', detail: '+10 años en viandas' },
]

function App() {
  const [activeService, setActiveService] = useState('particulares')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-10">
            <img src={morfiLogo} alt="Morfi Viandas" className="h-14 w-auto" />
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a href={WHATSAPP_DIARIAS_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
              <Button>
                <Phone className="h-4 w-4" />
                Pedir por WhatsApp
              </Button>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground"
              aria-label="Abrir menú"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-border/60 bg-background px-4 py-4 flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-foreground/70 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <a href={WHATSAPP_DIARIAS_URL} target="_blank" rel="noopener noreferrer">
              <Button className="w-full">
                <Phone className="h-4 w-4" />
                Pedir por WhatsApp
              </Button>
            </a>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Badge className="mb-5 bg-[var(--tint-primary)] text-primary hover:bg-[var(--tint-primary)]">
                +10 años preparando viandas saludables
              </Badge>
              <h1 className="mb-6 text-4xl font-semibold leading-tight text-foreground md:text-6xl">
                Comé rico y saludable, sin cocinar.
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                Viandas frescas y nutritivas para particulares y empresas, con entrega en
                CABA y La Plata. Más de 10 años de experiencia brindando soluciones
                alimentarias de calidad.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={MENU_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="text-base">
                    Ver el menú
                  </Button>
                </a>
                <a href={WHATSAPP_DIARIAS_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="text-base">
                    <Phone className="h-4 w-4" />
                    Pedir por WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-[var(--tint-secondary)]" />
              <img
                src={heroImage}
                alt="Viandas saludables Morfi"
                className="w-full rounded-[2rem] object-cover shadow-xl"
              />
              <div className="absolute -bottom-6 left-1/2 w-[calc(100%-3rem)] -translate-x-1/2 rounded-2xl bg-card px-6 py-4 shadow-lg sm:left-auto sm:right-6 sm:w-auto sm:translate-x-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tint-primary)] text-primary">
                    <Snowflake className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sistema termosellado</p>
                    <p className="text-xs text-muted-foreground">Frescura hasta 5 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border/60 bg-muted/60 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {trustBar.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-5xl">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-muted-foreground">Soluciones alimentarias para cada necesidad</p>
          </div>

          <div className="mb-10 flex justify-center">
            <div className="inline-flex rounded-full border border-border bg-card p-1.5 shadow-sm">
              <button
                onClick={() => setActiveService('particulares')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeService === 'particulares'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Home className="h-4 w-4" />
                Particulares
              </button>
              <button
                onClick={() => setActiveService('empresas')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeService === 'empresas'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Building2 className="h-4 w-4" />
                Empresas
              </button>
            </div>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            {activeService === 'particulares' ? (
              <>
                <div>
                  <h3 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">Para Particulares</h3>
                  <div className="space-y-5">
                    {[
                      ['Entrega a domicilio', 'Recibí tus viandas en la comodidad de tu hogar'],
                      ['Planes semanales', 'Organizá tu semana con nuestros packs personalizados'],
                      ['Variedad de opciones', 'Menú principal, vegetariano, ensaladas y más'],
                    ].map(([title, desc]) => (
                      <div key={title} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">{title}</p>
                          <p className="text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href={MENU_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="mt-8">Ver planes particulares</Button>
                  </a>
                </div>
                <img
                  src={healthyTuppersImage}
                  alt="Viandas para particulares"
                  className="w-full rounded-2xl object-cover shadow-lg"
                />
              </>
            ) : (
              <>
                <div>
                  <h3 className="mb-6 text-2xl font-semibold text-foreground md:text-3xl">Para Empresas</h3>
                  <div className="space-y-5">
                    {[
                      ['Catering corporativo', 'Soluciones alimentarias para tu equipo de trabajo'],
                      ['Menús grupales', 'Opciones variadas para satisfacer todos los gustos'],
                      ['Entrega coordinada', 'Horarios flexibles adaptados a tu empresa'],
                    ].map(([title, desc]) => (
                      <div key={title} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">{title}</p>
                          <p className="text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href={WHATSAPP_DIARIAS_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="mt-8">Solicitar cotización empresarial</Button>
                  </a>
                </div>
                <img
                  src={corporateCateringImage}
                  alt="Catering empresarial"
                  className="w-full rounded-2xl object-cover shadow-lg"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-muted/60 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <img
              src={mealOrganizationImage}
              alt="Organización semanal de viandas"
              className="w-full rounded-2xl object-cover shadow-lg md:order-2"
            />
            <div className="md:order-1">
              <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-5xl">Cómo Funciona</h2>
              <p className="mb-10 text-lg text-muted-foreground">Simple, rápido y conveniente</p>

              <div className="space-y-8">
                {[
                  {
                    icon: Package,
                    title: '1. Elegí tu plan',
                    desc: 'Seleccioná entre nuestros planes para particulares o empresas, y personalizá tu menú según tus preferencias.',
                  },
                  {
                    icon: ChefHat,
                    title: '2. Preparamos tu comida',
                    desc: 'Nuestros chefs preparan tus viandas frescas con ingredientes de calidad, envasadas con sistema termosellado.',
                  },
                  {
                    icon: Truck,
                    title: '3. Recibí en tiempo',
                    desc: 'Entrega puntual en fecha y horario coordinado. Listo para calentar y disfrutar.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--tint-primary)] text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
                      <p className="text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">¿Por qué elegir Morfi Viandas?</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Snowflake,
                title: 'Sistema Termosellado',
                desc: 'Envasado especial que mantiene la frescura hasta 5 días en heladera o 3 meses congelado.',
              },
              {
                icon: Package,
                title: 'Pack Semanal',
                desc: 'Armá tu pack semanal a medida. Descuentos especiales en compras superiores a $50.000.',
              },
              {
                icon: Clock,
                title: 'Atención 24/7',
                desc: 'Horario de atención de lunes a domingo las 24 horas. Siempre disponibles para vos.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tint-primary)] text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner empresas */}
      <section className="relative py-24 md:py-32">
        <img
          src={officeLunchImage}
          alt="Viandas en la oficina"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/85" />
        <div className="container relative mx-auto px-4 text-center text-secondary-foreground">
          <h2 className="mb-4 text-3xl font-semibold md:text-5xl">Llevamos viandas a tu oficina</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg opacity-90">
            Catering corporativo con menús grupales y entrega coordinada para que tu
            equipo coma bien todos los días.
          </p>
          <a href={WHATSAPP_DIARIAS_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Solicitar cotización empresarial
            </Button>
          </a>
        </div>
      </section>

      {/* Menú */}
      <section id="menu" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-5xl">Nuestro Menú</h2>
            <p className="text-lg text-muted-foreground">Variedad y sabor en cada vianda</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <Card key={item.name} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base leading-snug">{item.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">{item.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-primary">{item.price}</span>
                    <a href={MENU_URL} target="_blank" rel="noopener noreferrer">
                      <Button size="sm">Pedir</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href={MENU_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">Ver menú completo</Button>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-muted/60 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Preguntas Frecuentes</h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="bg-secondary py-20 text-secondary-foreground md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-semibold md:text-5xl">Empezá hoy con Morfi Viandas</h2>
            <p className="text-lg opacity-90">Contactanos y descubrí la comodidad de comer bien sin cocinar</p>
          </div>

          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="opacity-90">221 604 4455 (Viandas diarias)</p>
                  <p className="opacity-90">221 561 3886 (Viandas congeladas)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">Locales</p>
                  <p className="opacity-90">Marcelo T de Alvear 628 - CABA</p>
                  <p className="opacity-90">Calle 8 665, entre 45 y 46 - La Plata</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="mt-1 h-6 w-6 shrink-0" />
                <div>
                  <p className="font-semibold">Horarios</p>
                  <p className="opacity-90">Lunes a Domingo, las 24 horas</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="mb-4 text-2xl font-semibold">¿Listo para empezar?</h3>
              <p className="mb-6 opacity-90">
                Hacé tu primer pedido y descubrí por qué somos la mejor opción en viandas
                saludables.
              </p>
              <div className="space-y-4">
                <a href={WHATSAPP_DIARIAS_URL} target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" className="w-full bg-white text-secondary hover:bg-white/90">
                    <Phone className="h-4 w-4" />
                    Viandas diarias por WhatsApp
                  </Button>
                </a>
                <a href={WHATSAPP_CONGELADAS_URL} target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10">
                    <Phone className="h-4 w-4" />
                    Viandas congeladas por WhatsApp
                  </Button>
                </a>
                <a href={MENU_URL} target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10">
                    Ver menú completo
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#201C18] py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Morfi Viandas. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
