import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";
import { colleges } from "@/lib/mock-data";
import { FadeIn, SectionLabel } from "@/components/site/Motion";

export const Route = createFileRoute("/colleges")({
  head: () => ({
    meta: [
      { title: "College Explorer — Eduvo Careers" },
      { name: "description", content: "Browse 350+ partner colleges across India. Filter by stream, rating, location and fees." },
      { property: "og:title", content: "College Explorer — Eduvo Careers" },
      { property: "og:description", content: "Find the right college from India's top engineering, medical, arts and law institutions." },
    ],
  }),
  component: CollegesPage,
});

const types = ["All", "Engineering", "Medical", "Arts & Science", "Management", "Law"] as const;

function CollegesPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("All");

  const filtered = useMemo(
    () => colleges.filter(
      (c) =>
        (type === "All" || c.type === type) &&
        (c.name.toLowerCase().includes(q.toLowerCase()) || c.location.toLowerCase().includes(q.toLowerCase()))
    ),
    [q, type]
  );

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionLabel>College Explorer</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl">Find your <span className="text-gradient-gold">campus</span></h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Search across 350+ trusted institutions in Kerala and across India.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 glass rounded-2xl p-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-input/60">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or city..."
                className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    type === t ? "bg-gradient-gold text-primary-foreground font-semibold" : "glass hover:glass-gold"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6 }}
              className="group relative glass rounded-2xl p-6 overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition" />
              <div className="relative">
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
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground glass rounded-2xl">
              No colleges match your filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
