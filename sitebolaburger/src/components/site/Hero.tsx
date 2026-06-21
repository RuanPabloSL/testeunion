import heroFallback from "@/assets/hero-burger.jpg";
import { Flame, ArrowRight } from "lucide-react";

type HeroData = {
  badge?: string;
  title_part1?: string;
  title_highlight?: string;
  title_part2?: string;
  subtitle?: string;
  cta_primary?: string;
  cta_secondary?: string;
  stat1_n?: string;
  stat1_l?: string;
  stat2_n?: string;
  stat2_l?: string;
  stat3_n?: string;
  stat3_l?: string;
  image_url?: string;
};

const DEFAULTS: Required<HeroData> = {
  badge: "Artesanal · Premium · Bold",
  title_part1: "O verdadeiro",
  title_highlight: "sabor artesanal",
  title_part2: "da cidade",
  subtitle:
    "Hambúrgueres preparados na hora, ingredientes selecionados e aquele toque que vicia. Em São José do Alegre.",
  cta_primary: "Peça Agora",
  cta_secondary: "Conheça a história",
  stat1_n: "",
  stat1_l: "",
  stat2_n: "Qualidade",
  stat2_l: "",
  stat3_n: "100%",
  stat3_l: "Artesanal",
  image_url: "",
};

export function Hero() {
  const d = DEFAULTS;
  const img = d.image_url || heroFallback;

  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden grain">
      <div className="absolute inset-0">
        <img
          src={img}
          alt="Hambúrguer artesanal premium"
          width={1920}
          height={1080}
          className="w-full h-full object-cover scale-110"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, oklch(0.68 0.21 45 / 0.25), transparent 60%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 md:pt-36 md:pb-24 w-full">
        <div className="max-w-2xl animate-float-up">
          {d.badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              <Flame className="size-3.5" /> {d.badge}
            </span>
          )}
          <h1 className="mt-6 text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] text-foreground">
            {d.title_part1} <span className="text-gradient-fire">{d.title_highlight}</span>{" "}
            {d.title_part2}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-xl">{d.subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            {d.cta_primary && (
              <a
                href="#cardapio"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-fire px-8 py-4 text-base font-bold text-white shadow-glow hover:scale-105 transition-transform"
              >
                {d.cta_primary}
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
            {d.cta_secondary && (
              <a
                href="#sobre"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/30 backdrop-blur px-8 py-4 text-base font-semibold text-foreground hover:bg-background/60 transition-colors"
              >
                {d.cta_secondary}
              </a>
            )}
          </div>
          <div className="mt-12 flex flex-wrap gap-8 text-sm">
            {d.stat1_n && <Stat n={d.stat1_n} l={d.stat1_l} />}
            {d.stat2_n && <Stat n={d.stat2_n} l={d.stat2_l} />}
            {d.stat3_n && <Stat n={d.stat3_n} l={d.stat3_l} />}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-foreground/50 text-xs uppercase tracking-[0.3em] animate-bounce">
        role para baixo
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-3xl font-black text-gradient-fire">{n}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
    </div>
  );
}
