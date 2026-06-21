import { Star, Quote } from "lucide-react";

const items = [
  {
    n: "Mariana S.",
    t: "Melhor hambúrguer da região, sem exagero! Pão macio, carne suculenta. Vicia.",
    r: 5,
  },
  {
    n: "Rafael O.",
    t: "Atendimento rápido, lanche chegou quente e perfeito. Já virou tradição em casa.",
    r: 5,
  },
  {
    n: "Juliana M.",
    t: "O combo família é generoso e delicioso. Preço justo pela qualidade.",
    r: 5,
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 md:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
            Depoimentos
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black">
            O que dizem <span className="text-gradient-fire">nossos clientes</span>
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.n}
              className="relative bg-card border border-border rounded-2xl p-8 hover:border-gold/40 hover:-translate-y-1 transition-all shadow-card-premium"
            >
              <Quote className="absolute top-4 right-4 size-8 text-gold/20" />
              <div className="flex gap-1 text-gold mb-4">
                {Array.from({ length: it.r }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed">"{it.t}"</p>
              <div className="mt-6 pt-6 border-t border-border font-bold">{it.n}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
