import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, MapPin, Calendar, TrendingUp, Brain, Award, CheckCircle2, Quote } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { colleges, courses, testimonials, stats } from "@/lib/mock-data";
import { Counter, FadeIn, SectionLabel } from "@/components/site/Motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eduvo Careers × Dr ACE — Kerala's #1 Education Consultancy" },
      { name: "description", content: "Personalised college admissions, aptitude testing & the Eduvo Expo 2026. Trusted by 12,000+ Kerala students for India's top institutions." },
      { property: "og:title", content: "Eduvo Careers × Dr ACE" },
      { property: "og:description", content: "Kerala's premier education consultancy — colleges, courses, aptitude & expo registration." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedColleges />
      <PopularCourses />
      <CareerGuidance />
      <UpcomingExpo />
      <Testimonials />
      <FinalCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-28 sm:pt-24 sm:pb-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-1.5 text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Eduvo Expo 2026 — Registrations Open
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight"
        >
          Your future,<br />
          <span className="text-gradient-gold">brilliantly</span> guided.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Kerala's most trusted career consultancy. Personalised college admissions,
          aptitude science and the legendary <span className="text-foreground">Eduvo Expo</span> —
          mentored by <span className="text-foreground">Dr ACE</span> and a 14-year-strong team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/expo"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow hover:scale-[1.03] transition-transform"
          >
            Register for Expo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/aptitude"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass hover:glass-gold transition font-medium"
          >
            <Brain className="w-4 h-4" /> Take Aptitude Test
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground"
        >
          {["IIT & NIT Mentors", "NEET / KEAM Specialists", "350+ Partner Colleges", "Govt-Recognised"].map((t) => (
            <div key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" />{t}</div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </section>
  );
}

function StatsBar() {
  return (
    <section className="relative -mt-16 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="glass rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-elevated">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl sm:text-5xl text-gradient-gold font-semibold">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FeaturedColleges() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <SectionLabel>Featured Institutions</SectionLabel>
              <h2 className="font-display text-4xl sm:text-5xl">Where our students <span className="text-gradient-gold">thrive</span></h2>
            </div>
            <Link to="/colleges" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-gold-soft">
              Explore all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.slice(0, 6).map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative glass rounded-2xl p-6 h-full overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary">{c.type}</span>
                    <h3 className="mt-1 font-display text-xl">{c.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location}</p>
                  </div>
                  <div className="flex items-center gap-1 glass-gold px-2 py-1 rounded-md text-xs">
                    <Star className="w-3 h-3 fill-primary text-primary" /> {c.rating}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {c.highlights.map((h) => (
                    <span key={h} className="text-[10px] px-2 py-1 rounded-md bg-secondary/60 text-muted-foreground">{h}</span>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Est. {c.established}</span>
                  <span className="text-gradient-gold font-semibold">{c.fees}</span>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularCourses() {
  return (
    <section className="py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionLabel>Popular Courses</SectionLabel>
            <h2 className="font-display text-4xl sm:text-5xl">Find the path that <span className="text-gradient-gold">fits you</span></h2>
            <p className="mt-4 text-muted-foreground">From engineering to design — pick the right degree before you pick the college.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.slice(0, 4).map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 h-full flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center text-primary-foreground font-display text-sm">
                  {c.category[0]}
                </div>
                <h3 className="mt-4 font-display text-lg leading-tight">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{c.description}</p>
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.duration}</span>
                  <span className="flex items-center gap-1 text-gradient-gold font-semibold">
                    <TrendingUp className="w-3 h-3 text-primary" /> {c.avgSalary}
                  </span>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="text-center mt-10">
            <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:glass-gold transition text-sm font-medium">
              Explore all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function CareerGuidance() {
  const items = [
    { icon: Brain, title: "Aptitude Science", text: "Multi-dimensional psychometrics that pinpoint your true strengths — not what's trending." },
    { icon: Award, title: "Mentor Network", text: "Direct access to alumni from IITs, NITs, AIIMS, IIMs, NLUs and design schools." },
    { icon: TrendingUp, title: "Admissions Strategy", text: "Application timelines, scholarship hunting, document prep — handled end-to-end." },
  ];
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <SectionLabel>Career Guidance</SectionLabel>
            <h2 className="font-display text-4xl sm:text-5xl leading-tight">
              We don't just place students.<br />
              <span className="text-gradient-gold">We design careers.</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Backed by Dr ACE's 14 years of admissions science and a Kerala-rooted
              mentor network across India's top institutions, every Eduvo journey is
              one part data, one part craft, all care.
            </p>
            <Link
              to="/aptitude"
              className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow"
            >
              Start your aptitude test <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>

          <div className="grid gap-4">
            {items.map((it, i) => (
              <FadeIn key={it.title} delay={i * 0.1}>
                <motion.div whileHover={{ x: 6 }} className="glass rounded-2xl p-6 flex gap-4 items-start">
                  <div className="w-11 h-11 shrink-0 rounded-xl glass-gold flex items-center justify-center">
                    <it.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg">{it.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{it.text}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UpcomingExpo() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative glass-gold rounded-3xl p-8 sm:p-14 overflow-hidden shadow-elevated">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <SectionLabel>Upcoming Event</SectionLabel>
                <h2 className="font-display text-4xl sm:text-5xl">Eduvo Career Expo <span className="text-gradient-gold">2026</span></h2>
                <p className="mt-4 text-muted-foreground max-w-xl">
                  150+ colleges. 40+ courses. On-spot counselling, scholarship desks
                  and live aptitude analysis — all under one roof in Kochi.
                </p>
                <div className="mt-6 flex flex-wrap gap-5 text-sm">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> 14–15 February 2026</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Le Meridien, Kochi</div>
                </div>
              </div>
              <Link
                to="/expo"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow"
              >
                Get free QR ticket <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <SectionLabel>Student Stories</SectionLabel>
            <h2 className="font-display text-4xl sm:text-5xl">Loved by <span className="text-gradient-gold">Kerala's brightest</span></h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} className="glass rounded-2xl p-7 h-full relative">
                <Quote className="w-7 h-7 text-primary/40" />
                <p className="mt-3 text-sm text-foreground/90 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 pt-5 border-t border-border/50">
                  <div className="font-display text-base">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.course}</div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative glass rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="relative">
              <h2 className="font-display text-4xl sm:text-5xl">Ready when you are.</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Book a free 30-minute call with our admissions team. No obligations,
                just clarity.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="px-6 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow">
                  Book a free call
                </Link>
                <Link to="/colleges" className="px-6 py-3 rounded-xl glass hover:glass-gold transition font-medium">
                  Browse colleges
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
