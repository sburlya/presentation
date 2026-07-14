'use client'

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Car,
  FileStack,
  Mail,
  Pause,
  Phone,
  Play,
  ShieldCheck,
  Users,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

const TOTAL = 5
const AUTOPLAY_MS = 9000

const steps = [
  { n: '01', label: 'Analiză', text: 'Evaluarea portofoliului' },
  { n: '02', label: 'Contact', text: 'Dialog profesionist' },
  { n: '03', label: 'Soluție', text: 'Plan individualizat' },
  { n: '04', label: 'Recuperare', text: 'Rezultate măsurabile' },
]

const ease = [0.22, 1, 0.36, 1] as const

function Logo({ large = false }: { large?: boolean }) {
  return (
    <div className={`brand-lockup ${large ? 'brand-lockup--large' : ''}`} aria-label="PFB Collection">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand-logo-img"
        src="/brand/pfb-logo-transparent.png"
        alt="PFB Collection"
        draggable={false}
      />
    </div>
  )
}

function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <motion.div
      className="eyebrow"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease }}
    >
      <span>{index}</span>
      <i />
      {children}
    </motion.div>
  )
}

function CountUp({
  value,
  suffix = '',
  active,
}: {
  value: number
  suffix?: string
  active: boolean
}) {
  const [text, setText] = useState('0')

  useEffect(() => {
    if (!active) {
      setText('0')
      return
    }

    let raf = 0
    let lastShown = -1
    let lastFrame = 0
    const duration = value >= 100_000 ? 3600 : value >= 1_000 ? 3000 : 2400
    const minStep = value >= 100_000 ? Math.ceil(value / 40) : value >= 1_000 ? Math.ceil(value / 50) : 1

    const delay = window.setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 4)
        const current = Math.round(value * eased)
        const shouldPaint =
          t === 1 || Math.abs(current - lastShown) >= minStep || now - lastFrame > 90

        if (shouldPaint) {
          lastShown = current
          lastFrame = now
          setText((t === 1 ? value : current).toLocaleString('ro-RO'))
        }

        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, 450)

    return () => {
      window.clearTimeout(delay)
      cancelAnimationFrame(raf)
    }
  }, [active, value])

  return (
    <>
      {text}
      {suffix}
    </>
  )
}

function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18 })
  const sy = useSpring(y, { stiffness: 220, damping: 18 })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.22)
        y.set((e.clientY - r.top - r.height / 2) * 0.22)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

function CursorGlow({ mx, my }: { mx: MotionValue<number>; my: MotionValue<number> }) {
  const background = useMotionTemplate`
    radial-gradient(520px circle at ${mx}px ${my}px, rgba(201,165,106,0.11), transparent 42%)
  `
  return <motion.div className="cursor-glow" style={{ background }} aria-hidden="true" />
}

function BrandMark({ variant = 'hero' }: { variant?: 'hero' | 'final' }) {
  return (
    <div className={`brand-mark-draw brand-mark-draw--${variant}`} aria-hidden="true">
      <svg className="brand-mark-draw-svg" viewBox="0 0 420 300" fill="none">
        <motion.path
          d="M52 68 L82 28 H300"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.05, delay: 0.15, ease }}
        />
        <motion.path
          d="M190 178 H340"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.75, ease }}
        />
      </svg>
      <motion.img
        className="brand-mark-draw-img"
        src="/brand/pfb-logo-transparent.png"
        alt=""
        draggable={false}
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.35 }}
        animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        transition={{ duration: 1.35, delay: 0.28, ease }}
      />
    </div>
  )
}

function HeroEmblem() {
  return (
    <div className="hero-emblem">
      <div className="hero-emblem-frame layer-mid">
        <BrandMark variant="hero" />
      </div>
      <motion.p
        className="hero-emblem-caption"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1 }}
      >
        Partener de încredere în gestionarea creanțelor debitoare
      </motion.p>
    </div>
  )
}

function HeroOpening() {
  const title = ['Transformăm', 'creanțele', 'în rezultate.']

  return (
    <div className="hero-v2">
      <div className="hero-v2-copy">
        <motion.div
          className="hero-ribbon"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.95, ease }}
        >
          <span>Partener de încredere în gestionarea creanțelor debitoare</span>
        </motion.div>

        <h1 className="hero-v2-title">
          {title.map((line, i) => (
            <motion.span
              key={line}
              className={i === 2 ? 'hero-v2-accent-line' : undefined}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.28 + i * 0.16, ease }}
            >
              {i === 2 ? (
                <>
                  în <em>rezultate.</em>
                </>
              ) : (
                line
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="hero-v2-lead"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease }}
        >
          Abordare profesionistă, tehnologie și expertiză umană pentru gestionarea eficientă a
          creanțelor debitoare.
        </motion.p>
      </div>

      <motion.div
        className="hero-v2-visual layer-mid"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.15, delay: 0.25, ease }}
      >
        <div className="hero-v2-shaft" aria-hidden="true" />
        <HeroEmblem />
      </motion.div>

      <motion.div
        className="hero-v2-meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.15 }}
      >
        <span>Chișinău · Moldova</span>
        <span>01 — Company profile</span>
      </motion.div>
    </div>
  )
}

function RadialGauge({ label, active = true }: { label: string; active?: boolean }) {
  const r = 46
  const c = 2 * Math.PI * r

  return (
    <div className="gauge" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="gauge-svg">
        <circle cx="60" cy="60" r={r} className="gauge-track" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          className="gauge-progress"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ transformOrigin: '60px 60px', rotate: -90 }}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: active ? 0 : c }}
          transition={{ duration: 2.1, ease, delay: 0.35 }}
        />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          className="gauge-progress gauge-progress--seal"
          fill="none"
          strokeWidth="7"
          strokeDasharray="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.25, delay: 2.35 }}
        />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          className="gauge-glow"
          fill="none"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={
            active
              ? {
                  opacity: [0.15, 0.55, 0.15],
                  scale: [0.96, 1.06, 0.96],
                }
              : { opacity: 0, scale: 0.92 }
          }
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2.5,
          }}
          style={{ transformOrigin: '60px 60px' }}
        />
      </svg>
      <motion.span
        className="gauge-label"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 5 }}
        transition={{ delay: 0.9, duration: 0.55, ease }}
      >
        {label}
      </motion.span>
    </div>
  )
}

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="metric-visual waveform" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.i
          key={i}
          initial={{ scaleY: 0.15 }}
          animate={
            active
              ? {
                  scaleY: [0.2, 0.35 + ((i * 17) % 70) / 100, 0.25, 0.55 + ((i * 11) % 40) / 100],
                }
              : { scaleY: 0.15 }
          }
          transition={{
            duration: 2.8 + (i % 5) * 0.25,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  )
}

function MailSend({ active }: { active: boolean }) {
  return (
    <div className="metric-visual mail-send" aria-hidden="true">
      <svg className="mail-send-svg" viewBox="0 0 240 48" fill="none">
        <motion.path
          d="M8 24 H232"
          className="mail-send-trail"
          strokeDasharray="3 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.35 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
        />
        {[0, 1, 2].map((i) => (
          <motion.g
            key={i}
            initial={{ x: 12, opacity: 0 }}
            animate={
              active
                ? {
                    x: [12, 220],
                    opacity: [0, 1, 1, 0],
                  }
                : { opacity: 0 }
            }
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: 0.35 + i * 0.55,
              ease: 'easeInOut',
            }}
          >
            <rect x="0" y="14" width="28" height="20" rx="2.5" className="mail-send-letter" />
            <path d="M3 16.5 L14 24 L25 16.5" className="mail-send-letter-flap" />
          </motion.g>
        ))}
      </svg>
    </div>
  )
}

function FieldRoutes({ active }: { active: boolean }) {
  const paths = [
    'M10 30 C 48 30, 70 18, 110 22 S 160 38, 210 28',
    'M10 38 C 55 34, 95 42, 140 32 S 180 24, 210 34',
    'M10 22 C 60 26, 100 14, 150 20 S 185 30, 210 24',
  ]

  return (
    <div className="metric-visual field-routes" aria-hidden="true">
      <svg className="field-routes-svg" viewBox="0 0 220 48" fill="none">
        {paths.map((d, i) => (
          <g key={i}>
            <motion.path
              d={d}
              className="field-routes-line"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.5 : 0 }}
              transition={{ duration: 1.3, delay: 0.2 + i * 0.12, ease }}
            />
            {active && (
              <circle r="2.6" className="field-routes-dot">
                <animateMotion
                  dur={`${2.5 + i * 0.35}s`}
                  begin={`${0.4 + i * 0.3}s`}
                  repeatCount="indefinite"
                  path={d}
                />
              </circle>
            )}
          </g>
        ))}
        {[
          [10, 30],
          [110, 22],
          [210, 28],
          [140, 32],
          [210, 34],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={2.2}
            className="field-routes-node"
            initial={{ scale: 0 }}
            animate={{ scale: active ? 1 : 0 }}
            transition={{ delay: 0.35 + i * 0.07, type: 'spring', stiffness: 240, damping: 16 }}
          />
        ))}
      </svg>
    </div>
  )
}

function ParticleField({ active }: { active: boolean }) {
  return (
    <div className="particle-field" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.i
          key={i}
          className="particle-field-dot"
          style={
            {
              '--x': `${8 + ((i * 37) % 84)}%`,
              '--y': `${10 + ((i * 53) % 80)}%`,
              '--s': `${1.2 + (i % 4) * 0.55}px`,
            } as CSSProperties
          }
          initial={{ opacity: 0 }}
          animate={
            active
              ? {
                  opacity: [0, 0.55, 0.2, 0.6, 0],
                  y: [8, -18, -6, -28],
                  x: [0, (i % 2 === 0 ? 10 : -8), 4],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 7 + (i % 6),
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function ProcessFlow({ active }: { active: boolean }) {
  return (
    <div className="process-flow">
      <svg className="process-connector" viewBox="0 0 800 8" preserveAspectRatio="none" aria-hidden="true">
        <motion.line
          x1="0"
          y1="4"
          x2="800"
          y2="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 1.4, ease, delay: 0.45 }}
        />
      </svg>
      <div className="step-grid">
        {steps.map((step, i) => (
          <motion.article
            key={step.n}
            initial={{ opacity: 0, y: 28 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.7, delay: 0.55 + i * 0.12, ease }}
          >
            <b>{step.n}</b>
            <span>{step.label}</span>
            <small>{step.text}</small>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

function Stagger({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function SlideShell({
  index,
  children,
}: {
  index: number
  children: ReactNode
}) {
  return (
    <motion.section
      className={`slide slide-${index}`}
      initial={{ opacity: 0, scale: 0.985, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.01, y: -10 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.section>
  )
}

function ActiveSlide({ active }: { active: number }) {
  switch (active) {
    case 0:
      return (
        <SlideShell index={0}>
          <HeroOpening />
        </SlideShell>
      )
    case 1:
      return (
        <SlideShell index={1}>
          <Stagger>
            <div className="slide-head">
              <Eyebrow index="02">Anvergură demonstrată</Eyebrow>
              <h2>
                Încredere construită
                <br />
                prin <em>rezultate.</em>
              </h2>
            </div>
          </Stagger>
          <div className="scale-layout">
            <Stagger delay={0.2} className="mega-stat">
              <div className="stat-icon">
                <Users />
              </div>
              <strong>
                <CountUp value={300} suffix="+" active />
              </strong>
              <span>
                clienți mulțumiți
                <br />
                în portofoliul companiei
              </span>
              <RadialGauge label="portofoliu" />
            </Stagger>
            <Stagger delay={0.35} className="case-visual">
              <div className="case-rings">
                <FileStack />
                <span className="ring r1" />
                <span className="ring r2" />
                <span className="ring r3" />
              </div>
              <div>
                <strong>
                  <CountUp value={1450000} suffix="+" active />
                </strong>
                <span>cauze de recuperare procesate</span>
              </div>
            </Stagger>
          </div>
          <p className="side-note">PFB Collection în cifre</p>
        </SlideShell>
      )
    case 2:
      return (
        <SlideShell index={2}>
          <Stagger>
            <div className="slide-head">
              <Eyebrow index="03">Echipa noastră</Eyebrow>
              <h2>
                Oameni conectați.
                <br />
                <em>Un singur obiectiv.</em>
              </h2>
            </div>
          </Stagger>
          <div className="process-stage">
            <Stagger delay={0.2}>
              <Magnetic>
                <div className="team-core">
                  <Users />
                  <strong>
                    <CountUp value={100} suffix="+" active />
                  </strong>
                  <span>
                    specialiști
                    <br />
                    implicați
                  </span>
                </div>
              </Magnetic>
            </Stagger>
            <ProcessFlow active />
          </div>
          <Stagger delay={1} className="bottom-statement">
            Expertiză juridică, negociere și tehnologie — într-un proces coordonat.
          </Stagger>
        </SlideShell>
      )
    case 3:
      return (
        <SlideShell index={3}>
          <Stagger>
            <div className="slide-head">
              <Eyebrow index="04">Activitate lunară</Eyebrow>
              <h2>
                Prezență constantă.
                <br />
                <em>Acțiune la scară.</em>
              </h2>
            </div>
          </Stagger>
          <div className="metric-grid">
            <motion.article
              className="metric-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease }}
            >
              <div className="metric-copy">
                <div className="metric-top">
                  <Phone />
                  <span>01</span>
                </div>
                <strong>
                  <CountUp value={100000} suffix="+" active />
                </strong>
                <h3>apeluri telefonice</h3>
                <p>efectuate lunar debitorilor</p>
              </div>
              <Waveform active />
            </motion.article>
            <motion.article
              className="metric-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease }}
            >
              <div className="metric-copy">
                <div className="metric-top">
                  <Mail />
                  <span>02</span>
                </div>
                <strong>
                  <CountUp value={50000} suffix="+" active />
                </strong>
                <h3>notificări expediate</h3>
                <p>lunar în adresa debitorilor</p>
              </div>
              <MailSend active />
            </motion.article>
            <motion.article
              className="metric-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease }}
            >
              <div className="metric-copy">
                <div className="metric-top">
                  <Car />
                  <span>03</span>
                </div>
                <strong>
                  <CountUp value={1000} suffix="+" active />
                </strong>
                <h3>deplasări în teren</h3>
                <p>lunar la adresele debitorilor</p>
              </div>
              <FieldRoutes active />
            </motion.article>
          </div>
        </SlideShell>
      )
      default:
      return (
        <SlideShell index={4}>
          <div className="final-layout">
            <Stagger delay={0.1}>
              <div className="iso-stage layer-mid">
                <ParticleField active />
                <Magnetic>
                  <div className="iso-seal">
                    <div>
                      <ShieldCheck />
                      <span>
                        Certified
                        <br />
                        ISO Company
                      </span>
                      <strong>9001:2015</strong>
                    </div>
                  </div>
                </Magnetic>
              </div>
            </Stagger>
            <div className="final-copy">
              <Eyebrow index="05">Standard de calitate</Eyebrow>
              <Stagger delay={0.25}>
                <h2>
                  Un partener pe care
                  <br />
                  vă puteți <em>baza.</em>
                </h2>
              </Stagger>
              <Stagger delay={0.4}>
                <p>Procese certificate. Echipă dedicată. Rezultate măsurabile.</p>
              </Stagger>
              <Stagger delay={0.55} className="final-logo">
                <BrandMark variant="final" />
              </Stagger>
            </div>
          </div>
          <Stagger delay={0.7} className="final-line">
            <span>Partener de încredere în gestionarea creanțelor debitoare</span>
            <a href="mailto:office@pfbc.md">office@pfbc.md</a>
          </Stagger>
        </SlideShell>
      )
  }
}

export function CollectionPresentation() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [tick, setTick] = useState(0)
  const touchStart = useRef(0)
  const touchStartY = useRef(0)
  const wheelLock = useRef(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const go = useCallback((next: number) => {
    setActive((current) => {
      const normalized = ((next % TOTAL) + TOTAL) % TOTAL
      return normalized === current ? current : normalized
    })
    setTick((k) => k + 1)
  }, [])

  const next = useCallback(() => go(active + 1), [active, go])
  const prev = useCallback(() => go(active - 1), [active, go])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault()
        next()
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(next, AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [active, playing, next, tick])

  return (
    <main
      className="presentation"
      data-slide={active}
      onPointerMove={(e) => {
        mx.set(e.clientX)
        my.set(e.clientY)
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        e.currentTarget.style.setProperty('--mx', x.toFixed(3))
        e.currentTarget.style.setProperty('--my', y.toFixed(3))
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty('--mx', '0')
        e.currentTarget.style.setProperty('--my', '0')
      }}
      onWheel={(e) => {
        if (wheelLock.current || Math.abs(e.deltaY) < 24) return
        wheelLock.current = true
        e.deltaY > 0 ? next() : prev()
        window.setTimeout(() => {
          wheelLock.current = false
        }, 850)
      }}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
      }}
      onTouchEnd={(e) => {
        const dx = touchStart.current - e.changedTouches[0].clientX
        const dy = touchStartY.current - e.changedTouches[0].clientY
        if (Math.abs(dx) < 56) return
        if (Math.abs(dx) < Math.abs(dy) * 1.2) return

        const target = e.target as HTMLElement
        const metricGrid = target.closest('.metric-grid') as HTMLElement | null
        if (metricGrid && metricGrid.scrollWidth > metricGrid.clientWidth + 4) {
          if (dx > 0 && metricGrid.scrollLeft < metricGrid.scrollWidth - metricGrid.clientWidth - 6) {
            return
          }
          if (dx < 0 && metricGrid.scrollLeft > 6) return
        }

        dx > 0 ? next() : prev()
      }}
    >
      <div className="mesh layer-far" aria-hidden="true" />
      <div className="mesh-shift" aria-hidden="true" />
      <div className="ambient-grid layer-far" aria-hidden="true" />
      <div className="float-orbs" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <CursorGlow mx={mx} my={my} />
      <div className="light-wipe" key={`wipe-${tick}`} aria-hidden="true" />
      <div className="noise" aria-hidden="true" />

      <header className="topbar">
        <Logo />
        <div className="top-meta">
          <span>Company profile</span>
          <b>
            {String(active + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </b>
        </div>
      </header>

      <div className="slides">
        <AnimatePresence mode="wait">
          <ActiveSlide key={active} active={active} />
        </AnimatePresence>
      </div>

      <nav className="controls" aria-label="Navigare prezentare">
        <button type="button" onClick={prev} aria-label="Slide precedent">
          <ArrowLeft />
        </button>
        <div className="dots">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className={active === i ? 'active' : ''}
              aria-label={`Mergi la slide ${i + 1}`}
              aria-current={active === i ? 'step' : undefined}
            >
              <span />
              {active === i && playing && (
                <motion.i
                  className="dot-progress"
                  key={`dot-${tick}-${i}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
        <button type="button" onClick={next} aria-label="Slide următor">
          <ArrowRight />
        </button>
        <button
          type="button"
          className="play-toggle"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Oprește redarea automată' : 'Pornește redarea automată'}
        >
          {playing ? <Pause /> : <Play />}
        </button>
      </nav>

      <div className="progress" aria-hidden="true">
        <motion.i
          key={`${tick}-${playing}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: playing ? 1 : 0 }}
          transition={
            playing ? { duration: AUTOPLAY_MS / 1000, ease: 'linear' } : { duration: 0.2 }
          }
          style={{ transformOrigin: 'left center' } as CSSProperties}
        />
      </div>
    </main>
  )
}
