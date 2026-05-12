import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, TrendingUp, Clock, GraduationCap } from "lucide-react";
import { courses } from "@/lib/mock-data";
import { FadeIn, SectionLabel } from "@/components/site/Motion";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Course Explorer — Eduvo Careers" },
      { name: "description", content: "Discover the right course before you pick a college. Engineering, medical, design, commerce and law." },
      { property: "og:title", content: "Course Explorer — Eduvo Careers" },
      { property: "og:description", content: "Salary insights, eligibility and duration for India's most-pursued degrees." },
    ],
  }),
  component: CoursesPage,
});

const cats = ["All", "Engineering", "Medical", "Commerce", "Arts", "Design", "Law"] as const;

function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");

  const filtered = useMemo(
    () => courses.filter(
      (c) =>
        (cat === "All" || c.category === cat) &&
        c.name.toLowerCase().includes(q.toLowerCase())
    ),
    [q, cat]
  );

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionLabel>Course Explorer</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl">Pick the <span className="text-gradient-gold">right path</span></h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Compare degrees on salary, duration and eligibility — then find the colleges that offer them.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 glass rounded-2xl p-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-input/60">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses..."
                className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {cats.map((t) => (
                <button
                  key={t}
                  onClick={() => setCat(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    cat === t ? "bg-gradient-gold text-primary-foreground font-semibold" : "glass hover:glass-gold"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center text-primary-foreground">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-primary">{c.category}</span>
              </div>
              <h3 className="mt-4 font-display text-xl leading-tight">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{c.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="glass rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> Duration</div>
                  <div className="mt-0.5 font-medium">{c.duration}</div>
                </div>
                <div className="glass rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-muted-foreground"><TrendingUp className="w-3 h-3" /> Avg salary</div>
                  <div className="mt-0.5 font-medium text-gradient-gold">{c.avgSalary}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="text-foreground">Eligibility:</span> {c.eligibility}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground glass rounded-2xl">
              No courses match your filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
