import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Brain, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import { FadeIn, SectionLabel } from "@/components/site/Motion";

export const Route = createFileRoute("/aptitude")({
  head: () => ({
    meta: [
      { title: "Career Aptitude Test — Eduvo Careers" },
      { name: "description", content: "A 6-question scientific aptitude snapshot to point you toward the right career stream." },
      { property: "og:title", content: "Career Aptitude Test — Eduvo Careers" },
      { property: "og:description", content: "Discover your strongest career direction in under 3 minutes." },
    ],
  }),
  component: AptitudePage,
});

type Trait = "logic" | "bio" | "creative" | "people" | "business";

const questions: { q: string; opts: { label: string; trait: Trait }[] }[] = [
  { q: "On a free Sunday, you'd most enjoy...", opts: [
    { label: "Solving a tough puzzle", trait: "logic" },
    { label: "Watching a documentary on the human body", trait: "bio" },
    { label: "Sketching or designing something", trait: "creative" },
    { label: "Hosting a small get-together", trait: "people" },
  ]},
  { q: "In a school project, your role usually is...", opts: [
    { label: "Building the technical part", trait: "logic" },
    { label: "Researching the science", trait: "bio" },
    { label: "Designing the final presentation", trait: "creative" },
    { label: "Pitching it confidently", trait: "business" },
  ]},
  { q: "Which subject feels easiest to you?", opts: [
    { label: "Mathematics", trait: "logic" },
    { label: "Biology", trait: "bio" },
    { label: "Art / Languages", trait: "creative" },
    { label: "Economics / Commerce", trait: "business" },
  ]},
  { q: "A magazine you'd flip through first...", opts: [
    { label: "Wired or MIT Tech Review", trait: "logic" },
    { label: "National Geographic", trait: "bio" },
    { label: "Vogue or Architectural Digest", trait: "creative" },
    { label: "Forbes or HBR", trait: "business" },
  ]},
  { q: "Your dream workplace looks like...", opts: [
    { label: "An R&D lab", trait: "logic" },
    { label: "A hospital or research clinic", trait: "bio" },
    { label: "A studio with great light", trait: "creative" },
    { label: "A bustling office overlooking the city", trait: "people" },
  ]},
  { q: "Which compliment means the most?", opts: [
    { label: "“You're so logical.”", trait: "logic" },
    { label: "“You really care about people.”", trait: "bio" },
    { label: "“You have great taste.”", trait: "creative" },
    { label: "“You make things happen.”", trait: "business" },
  ]},
];

const results: Record<Trait, { title: string; track: string; suggestion: string }> = {
  logic:    { title: "The Analytical Builder", track: "Engineering / Data Science / Computer Science", suggestion: "B.Tech CSE, B.Sc Data Science, IIT/NIT pathways" },
  bio:      { title: "The Healer Scientist",   track: "Medical / Life Sciences / Biotech",            suggestion: "MBBS, BDS, B.Sc Nursing, Biotech" },
  creative: { title: "The Visual Storyteller", track: "Design / Architecture / Communication",         suggestion: "B.Des, B.Arch, BFA, Mass Communication" },
  people:   { title: "The People-First Leader",track: "Psychology / HR / Hospitality / Education",     suggestion: "BA Psychology, BBA HR, Hotel Management" },
  business: { title: "The Strategic Operator", track: "Commerce / Business / Law",                     suggestion: "B.Com (H), BBA, BA LLB, CA pathway" },
};

function AptitudePage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Trait, number>>({ logic: 0, bio: 0, creative: 0, people: 0, business: 0 });
  const [done, setDone] = useState(false);

  const pick = (trait: Trait) => {
    const next = { ...scores, [trait]: scores[trait] + 1 };
    setScores(next);
    if (step + 1 < questions.length) setStep(step + 1);
    else setDone(true);
  };

  const reset = () => { setScores({ logic: 0, bio: 0, creative: 0, people: 0, business: 0 }); setStep(0); setDone(false); };

  const winner = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "logic") as Trait;
  const r = results[winner];
  const progress = ((step + (done ? 1 : 0)) / questions.length) * 100;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionLabel>Career Aptitude</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl">Find your <span className="text-gradient-gold">strength</span></h1>
          <p className="mt-4 text-muted-foreground">Six honest questions. Three minutes. One direction.</p>
        </FadeIn>

        <div className="mt-10 glass rounded-3xl p-7 sm:p-10 shadow-elevated">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-primary" /> {done ? "Complete" : `Question ${step + 1} of ${questions.length}`}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
            <motion.div className="h-full bg-gradient-gold" animate={{ width: `${progress}%` }} transition={{ ease: "easeOut" }} />
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                <h2 className="font-display text-2xl sm:text-3xl">{questions[step].q}</h2>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {questions[step].opts.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => pick(o.trait)}
                      className="text-left glass hover:glass-gold transition rounded-xl p-4 text-sm"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center"
              >
                <div className="inline-flex items-center gap-2 glass-gold rounded-full px-3 py-1 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Your result
                </div>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl text-gradient-gold">{r.title}</h2>
                <p className="mt-3 text-muted-foreground">Best-fit track: <span className="text-foreground">{r.track}</span></p>
                <p className="mt-1 text-sm text-muted-foreground">Suggested degrees: {r.suggestion}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link to="/courses" className="px-5 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold inline-flex items-center gap-2">
                    Explore matching courses <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button onClick={reset} className="px-5 py-2.5 rounded-xl glass hover:glass-gold text-sm inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Retake
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
