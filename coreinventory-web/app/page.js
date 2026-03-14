import Link from 'next/link';
import {
  Shield,
  Package,
  Warehouse,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  Truck,
  Layers,
  Zap,
} from 'lucide-react';
import MobileNav from './MobileNav';

export default function HomePage() {
  return (
    <div className="ci-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,700&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ci-root {
          font-family: 'DM Sans', 'Nunito', sans-serif;
          min-height: 100vh;
          background: white;
          overflow-x: hidden;
        }

        .display-font { font-family: 'Syne', sans-serif; }

        .blob-yellow { background: #FFD93D; border-radius: 60% 40% 50% 70% / 50% 60% 40% 55%; }
        .blob-purple { background: #7C3AED; border-radius: 50% 60% 40% 70% / 60% 40% 70% 50%; }
        .blob-soft   { background: #EDE9FE; border-radius: 65% 35% 55% 45% / 45% 65% 35% 55%; }

        .float-1 { animation: floatA 4s ease-in-out infinite; }
        .float-2 { animation: floatB 5s ease-in-out infinite 0.8s; }
        .float-3 { animation: floatA 6s ease-in-out infinite 1.5s; }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(-4deg)} }

        .pill-tag {
          background: #FFD93D; color: #1a1a2e;
          border-radius: 999px; padding: 6px 18px;
          font-weight: 700; font-size: 13px; display: inline-block;
        }

        .btn-primary {
          background: #7C3AED; color: white; border-radius: 999px;
          padding: 14px 32px; font-weight: 700; font-size: 15px;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          text-decoration: none; border: none; cursor: pointer;
        }
        .btn-primary:hover { background: #6d28d9; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(124,58,237,0.35); }

        .btn-yellow {
          background: #FFD93D; color: #1a1a2e; border-radius: 999px;
          padding: 14px 32px; font-weight: 700; font-size: 15px;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s, transform 0.2s;
          text-decoration: none; border: none; cursor: pointer;
        }
        .btn-yellow:hover { background: #fcc800; transform: translateY(-2px); }

        .btn-ghost {
          background: transparent; color: #7C3AED;
          border: 2px solid #7C3AED; border-radius: 999px;
          padding: 12px 28px; font-weight: 700; font-size: 15px;
          display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.2s; text-decoration: none;
        }
        .btn-ghost:hover { background: #7C3AED; color: white; }

        .btn-ghost-light {
          background: transparent; color: rgba(255,255,255,0.8);
          border: 2px solid rgba(255,255,255,0.3); border-radius: 999px;
          padding: 12px 28px; font-weight: 700; font-size: 15px;
          display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.2s; text-decoration: none;
        }
        .btn-ghost-light:hover { background: rgba(255,255,255,0.1); }

        .squiggle-underline {
          text-decoration: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='12'%3E%3Cpath d='M0 8 Q25 2 50 8 Q75 14 100 8 Q125 2 150 8 Q175 14 200 8' fill='none' stroke='%23FFD93D' stroke-width='4'/%3E%3C/svg%3E");
          background-repeat: repeat-x; background-position: bottom;
          background-size: 80px 10px; padding-bottom: 8px;
        }

        /* NAV */
        .nav-wrap { border-bottom: 1px solid #F3F0FF; background: white; position: sticky; top: 0; z-index: 50; }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 72px; }
        .nav-links-desktop { display: flex; gap: 32px; }
        .nav-auth-desktop  { display: flex; align-items: center; gap: 16px; }
        .nav-link { font-weight: 500; color: #374151; font-size: 15px; transition: color 0.2s; text-decoration: none; }
        .nav-link:hover { color: #7C3AED; }
        .nav-signin { font-weight: 600; color: #374151; font-size: 15px; text-decoration: none; }
        .hamburger-wrap { display: none; }

        /* HERO */
        .hero-section { background: white; padding: 80px 24px 0; position: relative; overflow: hidden; }
        .hero-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .hero-h1 { font-size: 62px; line-height: 1.05; color: #1a1a2e; margin: 20px 0 24px; }
        .hero-cta-row { display: flex; gap: 16px; margin-bottom: 40px; flex-wrap: wrap; }
        .hero-trust   { display: flex; align-items: center; gap: 16px; }
        .hero-dashboard { background: #1a1a2e; border-radius: 32px; padding: 28px; box-shadow: 0 32px 64px rgba(26,26,46,0.25); position: relative; z-index: 1; }
        .hero-kpi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .kpi-card { background: white; border-radius: 20px; padding: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .hashtag-pill { background: #F3F0FF; color: #7C3AED; border-radius: 999px; padding: 6px 16px; font-size: 13px; font-weight: 600; display: inline-block; }
        .hero-floats { position: absolute; z-index: 2; pointer-events: none; }

        /* FEATURES */
        .features-section { background: #F9F7FF; padding: 80px 24px; }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-heading { text-align: center; margin-bottom: 64px; }
        .section-h2 { font-size: 46px; color: #1a1a2e; margin: 16px 0; line-height: 1.15; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .feature-card { border-radius: 24px; padding: 32px; transition: transform 0.25s ease, box-shadow 0.25s ease; position: relative; overflow: hidden; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(124,58,237,0.15); }
        .card-purple { background: #7C3AED; color: white; }
        .card-yellow { background: #FFD93D; color: #1a1a2e; }
        .card-light  { background: #F3F0FF; color: #1a1a2e; }
        .card-dark   { background: #1a1a2e; color: white; }
        .card-white  { background: white; color: #1a1a2e; border: 2px solid #EDE9FE; }
        .card-purple-grad { background: #7C3AED; background-image: radial-gradient(circle at 80% 20%, #9f67ff 0%, #7C3AED 60%); color: white; border: none; }
        .check-item { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; margin-bottom: 10px; }
        .icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; flex-shrink: 0; }

        /* STEPS */
        .steps-section { background: white; padding: 80px 24px; }
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; align-items: start; }
        .ledger-note { margin-top: 48px; padding: 20px 32px; background: #F9F7FF; border-radius: 16px; display: inline-flex; align-items: center; gap: 10px; position: relative; left: 50%; transform: translateX(-50%); white-space: nowrap; }

        /* CTA */
        .cta-section { background: #1a1a2e; padding: 80px 24px; position: relative; overflow: hidden; }
        .cta-inner { max-width: 720px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
        .cta-h2 { font-size: 52px; color: white; margin: 16px 0 20px; line-height: 1.1; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        /* FOOTER */
        .footer-wrap { background: #111827; padding: 60px 24px 32px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .footer-bottom { border-top: 1px solid #1F2937; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .footer-link { color: #6B7280; font-size: 14px; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: #FFD93D; }

        /* ── TABLET ≤ 1024px ── */
        @media (max-width: 1024px) {
          .hero-inner { grid-template-columns: 1fr; gap: 48px; }
          .hero-h1 { font-size: 48px; }
          .hero-floats { display: none !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .section-h2 { font-size: 38px; }
          .cta-h2 { font-size: 42px; }
          .ledger-note { white-space: normal; }
        }

        /* ── MOBILE ≤ 640px ── */
        @media (max-width: 640px) {
          .nav-links-desktop { display: none; }
          .nav-auth-desktop  { display: none; }
          .hamburger-wrap    { display: flex !important; }

          .hero-section { padding: 48px 20px 0; }
          .hero-h1 { font-size: 36px; margin: 14px 0 16px; }
          .hero-inner { gap: 36px; }
          .hero-kpi-grid { grid-template-columns: 1fr 1fr; }
          .hero-kpi-grid > div:last-child { grid-column: span 2; }
          .hero-dashboard { padding: 18px; border-radius: 22px; }
          .hero-cta-row { flex-direction: column; }
          .hero-cta-row a, .hero-cta-row .btn-primary, .hero-cta-row .btn-ghost { width: 100%; justify-content: center; }
          .hero-trust { flex-direction: column; align-items: flex-start; gap: 10px; }

          .features-section { padding: 56px 20px; }
          .features-grid { grid-template-columns: 1fr; }
          .section-heading { margin-bottom: 40px; }
          .section-h2 { font-size: 28px; }

          .steps-section { padding: 56px 20px; }
          .steps-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
          .ledger-note { padding: 14px 18px; font-size: 13px; white-space: normal; left: 0; transform: none; display: flex; }

          .cta-section { padding: 60px 20px; }
          .cta-h2 { font-size: 30px; }
          .cta-btns { flex-direction: column; }
          .cta-btns a { width: 100%; justify-content: center; }

          .footer-wrap { padding: 48px 20px 24px; }
          .footer-grid { grid-template-columns: 1fr; gap: 28px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }

          .pill-tag { font-size: 12px; padding: 5px 14px; }
          .btn-primary, .btn-yellow { padding: 13px 22px; font-size: 14px; }
        }

        @media (max-width: 380px) {
          .hero-h1 { font-size: 28px; }
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav className="nav-wrap">
        <div className="nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: '#7C3AED', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <span className="display-font" style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>CoreInventory</span>
              <span style={{ display: 'block', fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: -2 }}>Enterprise IMS</span>
            </div>
          </div>

          <div className="nav-links-desktop">
            {['Features', 'Solutions', 'Pricing', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
            ))}
          </div>

          <div className="nav-auth-desktop">
            <Link href="/auth/login" className="nav-signin">Sign In</Link>
            <Link href="/auth/signup" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>
              Get Started <ArrowRight size={16} />
            </Link>
          </div>

          <div className="hamburger-wrap" style={{ display: 'none' }}>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero-section">
        <div className="blob-soft float-1" style={{ position: 'absolute', width: 320, height: 320, top: -60, right: -80, opacity: 0.5, pointerEvents: 'none' }} />
        <div className="blob-yellow float-2" style={{ position: 'absolute', width: 160, height: 160, bottom: 40, left: -50, opacity: 0.35, pointerEvents: 'none' }} />

        <div className="hero-inner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="pill-tag">🚀 Launching 2026</span>

            <h1 className="display-font hero-h1">
              Digitize Your<br />
              <span className="squiggle-underline" style={{ color: '#7C3AED' }}>Inventory</span><br />
              Operations
            </h1>

            <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>
              Replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time inventory management system.
            </p>

            <div className="hero-cta-row">
              <Link href="/auth/signup" className="btn-primary">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <a href="#demo" className="btn-ghost">Watch Demo</a>
            </div>

            <div className="hero-trust">
              <div style={{ display: 'flex' }}>
                {['#7C3AED', '#FFD93D', '#10B981', '#F59E0B'].map((c, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: c, border: '3px solid white', marginLeft: i === 0 ? 0 : -10, flexShrink: 0 }} />
                ))}
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
                <strong style={{ color: '#1a1a2e' }}>2,500+</strong> businesses trust us
              </p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="hero-floats" style={{ top: 0, right: 20 }}>
              <span className="hashtag-pill float-1">#realtime</span>
            </div>
            <div className="hero-floats" style={{ top: 52, right: -10 }}>
              <span className="hashtag-pill float-2" style={{ background: '#FFD93D', color: '#1a1a2e' }}>#multiwarehouse</span>
            </div>
            <div className="hero-floats" style={{ bottom: 90, right: -18 }}>
              <span className="hashtag-pill float-3">#autotrack</span>
            </div>

            <div className="hero-dashboard">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span className="display-font" style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>Dashboard</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
              </div>

              <div className="hero-kpi-grid">
                <div className="kpi-card">
                  <Package size={16} color="#7C3AED" style={{ marginBottom: 6 }} />
                  <div className="display-font" style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>2,847</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Products</div>
                </div>
                <div className="kpi-card" style={{ background: '#FFD93D' }}>
                  <Clock size={16} color="#92400e" style={{ marginBottom: 6 }} />
                  <div className="display-font" style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>12</div>
                  <div style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>Low Stock</div>
                </div>
                <div className="kpi-card">
                  <Truck size={16} color="#10B981" style={{ marginBottom: 6 }} />
                  <div className="display-font" style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>8</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Pending</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 14 }}>
                {[
                  { label: 'Steel Rods', pct: 72, color: '#7C3AED' },
                  { label: 'Aluminum Sheets', pct: 45, color: '#FFD93D' },
                  { label: 'Carbon Fiber', pct: 88, color: '#10B981' },
                ].map(b => (
                  <div key={b.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{b.label}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{b.pct}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 5 }}>
                      <div style={{ background: b.color, width: `${b.pct}%`, height: 5, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, background: '#10B981', borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Live · Updated just now</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 64 }}>
          <svg viewBox="0 0 1200 60" style={{ width: '100%', display: 'block' }}>
            <path d="M0,30 Q300,60 600,30 Q900,0 1200,30 L1200,60 L0,60 Z" fill="#F9F7FF" />
          </svg>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="features-section">
        <div className="section-inner">
          <div className="section-heading">
            <span className="pill-tag" style={{ background: '#EDE9FE', color: '#7C3AED' }}>Features</span>
            <h2 className="display-font section-h2">
              Everything You Need to<br />
              <span style={{ color: '#7C3AED' }}>Manage Inventory</span>
            </h2>
            <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 520, margin: '0 auto' }}>
              Streamline your entire inventory workflow with powerful features designed for modern businesses.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                cls: 'card-purple',
                iconBg: 'rgba(255,255,255,0.2)', icon: <Package size={24} color="white" />,
                title: 'Product Management',
                desc: 'Create and manage products with SKU, categories, and reordering rules. Track stock across all locations.',
                checks: ['SKU/Code management', 'Category organization', 'Reorder rules & alerts'],
                checkColor: 'rgba(255,255,255,0.9)', checkIcon: '#FFD93D',
              },
              {
                cls: 'card-yellow',
                iconBg: 'rgba(26,26,46,0.12)', icon: <Truck size={24} color="#1a1a2e" />,
                title: 'Receipts & Deliveries',
                desc: 'Handle incoming stock from vendors and outgoing shipments with automatic stock updates.',
                checks: ['Vendor receipts', 'Customer deliveries', 'Automatic stock updates'],
                checkColor: '#374151', checkIcon: '#7C3AED',
              },
              {
                cls: 'card-light',
                iconBg: '#7C3AED', icon: <Layers size={24} color="white" />,
                title: 'Internal Transfers',
                desc: 'Move stock between warehouses, racks, or production floors with full ledger tracking.',
                checks: ['Warehouse transfers', 'Location tracking', 'Complete audit trail'],
                checkColor: '#374151', checkIcon: '#7C3AED',
              },
              {
                cls: 'card-dark',
                iconBg: 'rgba(255,217,61,0.15)', icon: <BarChart3 size={24} color="#FFD93D" />,
                title: 'Stock Adjustments',
                desc: 'Fix mismatches between recorded and physical stock with automated ledger updates.',
                checks: ['Physical count reconciliation', 'Damage tracking', 'Automatic logging'],
                checkColor: 'rgba(255,255,255,0.85)', checkIcon: '#FFD93D',
              },
              {
                cls: 'card-white',
                iconBg: '#EDE9FE', icon: <Warehouse size={24} color="#7C3AED" />,
                title: 'Multi-Warehouse',
                desc: 'Support for multiple warehouses, racks, and locations with real-time visibility.',
                checks: ['Multiple locations', 'Location-specific stock', 'Transfer scheduling'],
                checkColor: '#374151', checkIcon: '#7C3AED',
              },
              {
                cls: 'card-purple-grad',
                iconBg: '#FFD93D', icon: <TrendingUp size={24} color="#1a1a2e" />,
                title: 'Analytics & Reports',
                desc: 'Real-time KPIs, low stock alerts, and comprehensive movement history.',
                checks: ['Dashboard KPIs', 'Low stock alerts', 'Stock ledger history'],
                checkColor: 'rgba(255,255,255,0.9)', checkIcon: '#FFD93D',
              },
            ].map((card) => (
              <div key={card.title} className={`feature-card ${card.cls}`}>
                <div className="icon-box" style={{ background: card.iconBg }}>{card.icon}</div>
                <h3 className="display-font" style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, marginTop: 0 }}>{card.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16, opacity: 0.85 }}>{card.desc}</p>
                {card.checks.map(t => (
                  <div key={t} className="check-item" style={{ color: card.checkColor }}>
                    <CheckCircle size={15} color={card.checkIcon} style={{ flexShrink: 0 }} /> {t}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="steps-section">
        <div className="section-inner">
          <div className="section-heading">
            <span className="pill-tag">How it works</span>
            <h2 className="display-font section-h2">
              Simple <span style={{ color: '#7C3AED' }}>Inventory</span> Flow
            </h2>
            <p style={{ fontSize: 16, color: '#6B7280' }}>From receiving to delivery — every movement tracked automatically</p>
          </div>

          <div className="steps-grid">
            {[
              { num: '01', color: '#7C3AED', bg: '#EDE9FE', icon: <Truck size={20} />, title: 'Receive from Vendor', desc: 'Receive 100 kg Steel', sub: 'Stock +100', iconColor: '#7C3AED' },
              { num: '02', color: '#FFD93D', bg: '#FFFBEB', icon: <Layers size={20} />, title: 'Internal Transfer', desc: 'Main Store → Production Rack', sub: 'Location updated', iconColor: '#D97706' },
              { num: '03', color: '#10B981', bg: '#ECFDF5', icon: <Package size={20} />, title: 'Deliver Goods', desc: 'Deliver 20 steel frames', sub: 'Stock −20', iconColor: '#059669' },
              { num: '04', color: '#7C3AED', bg: '#F3F0FF', icon: <Zap size={20} />, title: 'Adjust Damaged', desc: '3 kg damaged items', sub: 'Stock −3, logged', iconColor: '#7C3AED' },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: `3px solid ${step.color}`, position: 'relative' }}>
                  <span style={{ color: step.iconColor }}>{step.icon}</span>
                  <div className="display-font" style={{ position: 'absolute', top: -11, right: -11, width: 26, height: 26, borderRadius: '50%', background: step.color, color: step.color === '#FFD93D' ? '#1a1a2e' : 'white', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {step.num}
                  </div>
                </div>
                <h3 className="display-font" style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 6, marginTop: 0 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>{step.desc}</p>
                <span style={{ background: step.bg, color: step.iconColor, borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>{step.sub}</span>
              </div>
            ))}
          </div>

          <div className="ledger-note">
            <BarChart3 size={17} color="#7C3AED" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: '#4B5563', fontWeight: 600 }}>Everything logged in the Stock Ledger — complete audit trail forever</span>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="cta-section">
        <div className="blob-purple float-1" style={{ position: 'absolute', width: 340, height: 340, top: -80, right: -80, opacity: 0.22, pointerEvents: 'none' }} />
        <div className="blob-yellow float-2" style={{ position: 'absolute', width: 160, height: 160, bottom: -50, left: 60, opacity: 0.18, pointerEvents: 'none' }} />

        <div className="cta-inner">
          <span className="pill-tag">Get started today</span>
          <h2 className="display-font cta-h2">
            Ready to Digitize Your<br />
            <span style={{ color: '#FFD93D' }}>Inventory?</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 36 }}>
            Join thousands of businesses that trust CoreInventory
          </p>
          <div className="cta-btns">
            <Link href="/auth/signup" className="btn-yellow">
              Get Started for Free <ArrowRight size={18} />
            </Link>
            <a href="#demo" className="btn-ghost-light">Watch Demo</a>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', marginTop: 20 }}>
            No credit card required · Free 14-day trial
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer-wrap">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, background: '#7C3AED', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={18} color="white" />
                </div>
                <span className="display-font" style={{ color: 'white', fontSize: 18, fontWeight: 800 }}>CoreInventory</span>
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
                Enterprise-grade inventory management for modern businesses.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Demo'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="display-font" style={{ color: 'white', fontSize: 15, fontWeight: 700, marginBottom: 18, marginTop: 0 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.links.map(link => (
                    <li key={link} style={{ marginBottom: 12 }}>
                      <a href={`#${link.toLowerCase()}`} className="footer-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-bottom">
            <p style={{ fontSize: 13, color: '#4B5563', margin: 0 }}>© 2026 CoreInventory. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="hashtag-pill" style={{ background: '#1F2937', color: '#6B7280', fontSize: 12 }}>#inventory</span>
              <span className="hashtag-pill" style={{ background: '#1F2937', color: '#6B7280', fontSize: 12 }}>#enterprise</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}