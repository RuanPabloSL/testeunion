import restaurant from "@/assets/restaurant.jpg";
import { Beef, Flame, Heart, Award } from "lucide-react";
import { useSiteContent } from "@/lib/use-site-content";

const features = [
  { icon: Beef, t: "Carne nobre", d: "Blend exclusivo, moído na hora." },
  { icon: Flame, t: "Na chapa quente", d: "Selada para preservar o suco." },
  { icon: Heart, t: "Feito com amor", d: "Receita de família, paixão pelo ofício." },
  { icon: Award, t: "Premiado", d: "Eleita melhor da região." },
];

type AboutData = {
  eyebrow: string;
  title_part1: string;
  title_highlight: string;
  paragraph1: string;
  paragraph2: string;
  badge_number: string;
  badge_label: string;
  image_url: string;
};

const DEFAULTS: AboutData = {
  eyebrow: "Nossa História",
  title_part1: "Mais que um lanche,",
  title_highlight: "uma experiência",
  paragraph1:
    "A BolaBurguer nasceu em São José do Alegre da paixão pelo verdadeiro hambúrguer artesanal. Cada lanche é montado na hora, com pão fresquinho, carne selecionada e ingredientes que fazem a diferença.",
  paragraph2: "Aqui, qualidade é regra, sabor é obsessão e atendimento é tradição.",
  badge_number: "",
  badge_label: "desde 2026 servindo a cidade",
  image_url: "",
};

export function About() {
  const d = useSiteContent<AboutData>("about", DEFAULTS);
  const img = d.image_url || restaurant;
  return (
    <section id="sobre" className="relative py-24 md:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-card-premium aspect-[4/5]">
            <img
              src={img}
              alt="Ambiente da BolaBurguer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          {(d.badge_number || d.badge_label) && (
            <div className="absolute -bottom-6 -right-6 bg-gradient-fire text-white p-6 rounded-2xl shadow-glow max-w-[180px] hidden md:block">
              <div className="text-4xl font-black">{d.badge_number}</div>
              <div className="text-xs uppercase tracking-wider opacity-90">{d.badge_label}</div>
            </div>
          )}
        </div>

        <div>
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
            {d.eyebrow}
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black leading-tight">
            {d.title_part1} <span className="text-gradient-fire">{d.title_highlight}</span>
          </h2>
          {d.paragraph1 && (
            <p className="mt-6 text-foreground/80 leading-relaxed">{d.paragraph1}</p>
          )}
          {d.paragraph2 && (
            <p className="mt-4 text-foreground/80 leading-relaxed">{d.paragraph2}</p>
          )}

          <div className="mt-10 grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.t}
                className="bg-card border border-border rounded-xl p-5 hover:border-gold/40 transition-colors"
              >
                <f.icon className="size-6 text-gold mb-2" />
                <div className="font-bold">{f.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
