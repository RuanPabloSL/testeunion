import logo from "@/assets/logo.png";
import { Instagram, MessageCircle } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";

type FooterData = { tagline: string; whatsapp_url: string; instagram_url: string };
const DEFAULTS: FooterData = {
  tagline:
    "Hambúrgueres artesanais premium\nem São José do Alegre.\nSabor que vicia, qualidade que conquista.",
  whatsapp_url: "https://wa.me/5535984450645",
  instagram_url: "https://instagram.com/bolaburguer1",
};

export function Footer() {
  const d = useSiteContent<FooterData>("footer", DEFAULTS);
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <img src={logo} alt="BolaBurguer" className="h-16 w-auto" />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs whitespace-pre-line">{d.tagline}</p>
        </div>
        <div>
          <h4 className="font-black text-lg mb-4">Links rápidos</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#cardapio" className="hover:text-gold">
                Cardápio
              </a>
            </li>
            <li>
              <a href="#sobre" className="hover:text-gold">
                Sobre
              </a>
            </li>
            <li>
              <a href="#galeria" className="hover:text-gold">
                Galeria
              </a>
            </li>
            <li>
              <a href="#contato" className="hover:text-gold">
                Contato
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-black text-lg mb-4">Siga a gente</h4>
          <div className="flex gap-3">
            {d.whatsapp_url && (
              <a
                href={d.whatsapp_url}
                target="_blank"
                rel="noreferrer"
                className="size-11 rounded-full bg-gradient-fire flex items-center justify-center shadow-glow hover:scale-110 transition-transform"
              >
                <MessageCircle className="size-5 text-white" />
              </a>
            )}
            {d.instagram_url && (
              <a
                href={d.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="size-11 rounded-full bg-gradient-fire flex items-center justify-center shadow-glow hover:scale-110 transition-transform"
              >
                <Instagram className="size-5 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BolaBurguer · Todos os direitos reservados.
      </div>
    </footer>
  );
}
