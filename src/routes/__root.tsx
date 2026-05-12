import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { FloatingOrbs, ScrollProgress, PageLoader } from "@/components/site/Atmosphere";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-10">
        <h1 className="text-7xl font-display text-gradient-gold">404</h1>
        <p className="mt-3 text-muted-foreground">This page took an unscheduled gap year.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold">
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-10">
        <h1 className="font-display text-2xl">Something went sideways</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 px-5 py-2.5 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Eduvo Careers × Dr ACE — Kerala's Premier Career Consultancy" },
      { name: "description", content: "Personalised admissions guidance, India's top colleges, aptitude testing & the Eduvo Expo. 12,000+ Kerala students placed since 2011." },
      { name: "author", content: "Eduvo Careers" },
      { property: "og:title", content: "Eduvo Careers × Dr ACE — Kerala's Premier Career Consultancy" },
      { property: "og:description", content: "Personalised admissions guidance, India's top colleges, aptitude testing & the Eduvo Expo. 12,000+ Kerala students placed since 2011." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Eduvo Careers × Dr ACE — Kerala's Premier Career Consultancy" },
      { name: "twitter:description", content: "Personalised admissions guidance, India's top colleges, aptitude testing & the Eduvo Expo. 12,000+ Kerala students placed since 2011." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6aad2a56-0d35-44ac-9b74-121f653df1e0/id-preview-71ceaa3e--df16d142-ff88-4e89-9973-8003613e081d.lovable.app-1778559759768.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6aad2a56-0d35-44ac-9b74-121f653df1e0/id-preview-71ceaa3e--df16d142-ff88-4e89-9973-8003613e081d.lovable.app-1778559759768.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <PageLoader />
      <ScrollProgress />
      <FloatingOrbs />
      <div className="min-h-screen flex flex-col relative z-10">
        <Navbar />
        <main className="flex-1 pt-24">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFab />
      </div>
    </QueryClientProvider>
  );
}
