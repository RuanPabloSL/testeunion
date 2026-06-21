import { useState } from "react";
import { Plus } from "lucide-react";
import { formatBRL, DEFAULT_CATEGORIES, MENU_ITEMS } from "@/lib/menu-data";
import { useCart } from "@/lib/cart-context";

export function Menu() {
  const items = MENU_ITEMS.filter((item) => item.active).sort((a, b) => a.position - b.position);
  const [active, setActive] = useState<string>(DEFAULT_CATEGORIES[0]);
  const { add } = useCart();

  const categories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...items.map((i) => i.category)]),
  ).filter((c) => items.some((i) => i.category === c));

  const visible = items.filter((m) => m.category === active);

  return (
    <section id="cardapio" className="relative py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
            Nosso Cardápio
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black">
            Escolha sua <span className="text-gradient-fire">obra-prima</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Preparados na hora, com ingredientes que você sente em cada mordida.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${active === c ? "bg-gradient-fire text-white shadow-glow" : "bg-card text-foreground/70 hover:bg-secondary border border-border"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visible.map((item, i) => (
            <article
              key={item.id}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-card-premium hover:shadow-glow transition-all duration-500 hover:-translate-y-2 animate-float-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-gold font-black text-sm border border-gold/30">
                  {formatBRL(item.price)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black tracking-wide">{item.name}</h3>
                <p className="mt-1 text-sm text-foreground/80">{item.description}</p>
                <p className="mt-3 text-xs text-muted-foreground italic">{item.ingredients}</p>
                <button
                  onClick={() => add(item)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-fire text-white font-bold py-3 hover:scale-[1.02] active:scale-95 transition-transform shadow-glow"
                >
                  <Plus className="size-4" /> Adicionar ao Carrinho
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
