import { Car, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-charcoal-dark border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-foreground">
                Swamy Ayyappa Motors
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted four-wheeler workshop in Karimnagar. Quality
              vehicles, expert service, lasting relationships.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>
                  Rampur, Karimnagar,
                  <br />
                  Telangana 505001
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>+91 97042 60666</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="space-y-1 text-sm">
              <a
                href="/vehicles"
                className="block text-muted-foreground hover:text-accent transition-colors"
              >
                Browse Vehicles
              </a>
              <a
                href="/book-service"
                className="block text-muted-foreground hover:text-accent transition-colors"
              >
                Book a Service
              </a>
              <a
                href="/track"
                className="block text-muted-foreground hover:text-accent transition-colors"
              >
                Track Service
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
