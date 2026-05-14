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
              {[
                { Icon: Instagram, href: "https://instagram.com/eduvocareers" },
                { Icon: Facebook, href: "https://facebook.com/eduvocareers" },
                { Icon: Youtube, href: "https://youtube.com/@eduvocareers" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" /> Opp. DUHSS Panakkad &amp; IKTHSS Cherukulamba, Malappuram</li>
              <li><a href="tel:+916238995581" className="flex items-start gap-2 hover:text-foreground"><Phone className="w-4 h-4 mt-0.5 text-primary" /> +91 6238995581 · Office</a></li>
              <li><a href="tel:+919074445804" className="flex items-start gap-2 hover:text-foreground"><Phone className="w-4 h-4 mt-0.5 text-primary" /> +91 9074445804 · Support</a></li>
              <li><a href="https://wa.me/918592866008" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-foreground"><Phone className="w-4 h-4 mt-0.5 text-primary" /> +91 8592866008 · Admissions</a></li>
              <li><a href="mailto:hello@eduvocareers.in" className="flex items-start gap-2 hover:text-foreground"><Mail className="w-4 h-4 mt-0.5 text-primary" /> hello@eduvocareers.in</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Eduvo Careers × Dr ACE. Crafted in Kochi.</p>
          <div className="flex items-center gap-4">
            <p>Empowering 12,000+ Kerala students.</p>
            <Link to="/login" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
