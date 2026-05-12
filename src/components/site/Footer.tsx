import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/40">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-gold rounded-lg p-2">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">
                Eduvo<span className="text-gradient-gold"> Careers</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
              Kerala's most trusted career consultancy — guiding students into
              India's top colleges through personalised mentorship by Dr ACE
              and our 14-year-strong admissions team.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:glass-gold transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gradient-gold mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/colleges" className="text-muted-foreground hover:text-foreground">Colleges</Link></li>
              <li><Link to="/courses" className="text-muted-foreground hover:text-foreground">Courses</Link></li>
              <li><Link to="/aptitude" className="text-muted-foreground hover:text-foreground">Aptitude Test</Link></li>
              <li><Link to="/expo" className="text-muted-foreground hover:text-foreground">Expo 2026</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-gradient-gold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" /> Kochi, Kerala</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary" /> +91 98 4747 4747</li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary" /> hello@eduvocareers.in</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Eduvo Careers × Dr ACE. Crafted in Kochi.</p>
          <p>Empowering 12,000+ Kerala students into India's top institutions.</p>
        </div>
      </div>
    </footer>
  );
}
