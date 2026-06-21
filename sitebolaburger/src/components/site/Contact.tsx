import { MessageCircle, Instagram, MapPin, Clock } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";

type ContactData = {
  eyebrow: string;
  title_part1: string;
  title_highlight: string;
  whatsapp_number: string;
  whatsapp_label: string;
  instagram_user: string;
  address: string;
  hours: string;
  map_query: string;
};

const DEFAULTS: ContactData = {
  eyebrow: "Contato",
  title_part1: "Vem pra",
  title_highlight: "BolaBurger",
  whatsapp_number: "5535984450645",
  whatsapp_label: "(35) 98445-0645",
  instagram_user: "BolaBurguer1",
  address: "São José do Alegre — MG",
  hours: "Ter – Dom · 18h às 23h",
  map_query: "São José do Alegre MG",
};

export function Contact() {
  const d = useSiteContent<ContactData>("contact", DEFAULTS);
  return (
    <section id="contato" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
            {d.eyebrow}
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black">
            {d.title_part1} <span className="text-gradient-fire">{d.title_highlight}</span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {d.whatsapp_number && (
              <a
                href={`https://wa.me/${d.whatsapp_number}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-gold/50 transition-colors group"
              >
                <div className="size-12 rounded-xl bg-gradient-fire flex items-center justify-center shadow-glow">
                  <MessageCircle className="size-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    WhatsApp
                  </div>
                  <div className="font-bold text-lg group-hover:text-gold transition-colors">
                    {d.whatsapp_label}
                  </div>
                </div>
              </a>
            )}
            {d.instagram_user && (
              <a
                href={`https://instagram.com/${d.instagram_user}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-gold/50 transition-colors group"
              >
                <div className="size-12 rounded-xl bg-gradient-fire flex items-center justify-center shadow-glow">
                  <Instagram className="size-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Instagram
                  </div>
                  <div className="font-bold text-lg group-hover:text-gold transition-colors">
                    @{d.instagram_user}
                  </div>
                </div>
              </a>
            )}
            {d.address && (
              <div className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border">
                <div className="size-12 rounded-xl bg-gradient-fire flex items-center justify-center shadow-glow">
                  <MapPin className="size-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Endereço
                  </div>
                  <div className="font-bold text-lg">{d.address}</div>
                </div>
              </div>
            )}
            {d.hours && (
              <div className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border">
                <div className="size-12 rounded-xl bg-gradient-fire flex items-center justify-center shadow-glow">
                  <Clock className="size-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Horário
                  </div>
                  <div className="font-bold text-lg">{d.hours}</div>
                </div>
              </div>
            )}
          </div>
          {d.map_query && (
            <div className="rounded-2xl overflow-hidden border border-border shadow-card-premium min-h-[400px]">
              <iframe
                title="Mapa BolaBurger"
                src={`https://www.google.com/maps?q=${encodeURIComponent(d.map_query)}&output=embed`}
                className="w-full h-full min-h-[400px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
