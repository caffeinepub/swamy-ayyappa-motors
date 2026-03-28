import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Shield, Star, Wrench } from "lucide-react";
import { motion } from "motion/react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/hypercar-hero.dim_1600x700.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/80 via-charcoal-dark/60 to-charcoal-dark" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-accent text-sm font-medium tracking-[0.3em] uppercase mb-4">
              Est. Karimnagar, Telangana
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
              Swamy Ayyappa
              <span className="block text-accent">Motors</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Your Trusted Four-Wheeler Workshop in Karimnagar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book-service" data-ocid="hero.primary_button">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-maroon-light text-primary-foreground shadow-maroon px-8"
                >
                  Book Service
                </Button>
              </Link>
              <Link to="/track" data-ocid="hero.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8"
                >
                  Track Service
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-secondary border-y border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Star,
                title: "Trusted Workshop",
                desc: "Serving Karimnagar for over a decade",
              },
              {
                icon: Shield,
                title: "Genuine Parts",
                desc: "Authorized spare parts & accessories",
              },
              {
                icon: Wrench,
                title: "Expert Service",
                desc: "Skilled technicians for all four-wheelers & hypercars",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="flex items-center gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hypercar Showcase */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-4xl font-bold text-foreground mb-2">
            Our <span className="text-accent">Showcase</span>
          </h2>
          <p className="text-muted-foreground">
            Premium cars & expert workshop services
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              src: "/assets/generated/hypercar-service.dim_800x500.jpg",
              caption: "Expert Workshop Service",
            },
            {
              src: "/assets/generated/hypercar-showroom.dim_800x500.jpg",
              caption: "Premium Showroom",
            },
          ].map(({ src, caption }, i) => (
            <motion.div
              key={caption}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 * i, duration: 0.6 }}
              className="relative rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={src}
                alt={caption}
                className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-foreground font-semibold text-lg">
                  {caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-6">
              About <span className="text-accent">Us</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Swamy Ayyappa Motors is a premier four-wheeler workshop located in
              the heart of Karimnagar, Telangana. We specialize in servicing all
              types of cars — from everyday vehicles to high-performance
              hypercars. Our dedicated team of expert technicians ensures your
              vehicle gets the best care with genuine parts.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Located at Rampur, Karimnagar, Telangana 505001 — we have been the
              go-to destination for four-wheeler enthusiasts and everyday
              commuters alike.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-secondary border-t border-border/50" id="contact">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-2">
              Visit <span className="text-accent">Us</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Address</p>
                  <p className="text-muted-foreground">
                    Rampur, Karimnagar,
                    <br />
                    Telangana 505001
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <p className="text-muted-foreground">+91 97042 60666</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/ihfQd8tSsKdy2unR9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline"
                data-ocid="contact.link"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>
            <div className="rounded-lg overflow-hidden border border-border h-48 md:h-auto bg-muted flex items-center justify-center">
              <a
                href="https://maps.app.goo.gl/ihfQd8tSsKdy2unR9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-6"
              >
                <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="text-foreground font-medium">
                  Swamy Ayyappa Motors
                </p>
                <p className="text-muted-foreground text-sm">
                  Rampur, Karimnagar
                </p>
                <p className="text-accent text-sm mt-2 hover:underline">
                  Open in Google Maps →
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
