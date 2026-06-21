import b1 from "@/assets/burger-1.jpg";
import b2 from "@/assets/burger-2.jpg";
import b3 from "@/assets/burger-3.jpg";
import f from "@/assets/fries.jpg";
import o from "@/assets/onion-rings.jpg";
import c from "@/assets/combo.jpg";
import { useSiteContent } from "@/lib/use-site-content";

const FALLBACK = [b3, f, b1, c, b2, o];

type GalleryData = { items: { url: string }[] };

export function Gallery() {
  const d = useSiteContent<GalleryData>("gallery", { items: [] });
  const imgs = d.items.length > 0 ? d.items.map((i) => i.url) : FALLBACK;
  return (
    <section id="galeria" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">Galeria</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black">
            Visualmente <span className="text-gradient-fire">irresistível</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {imgs.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`relative overflow-hidden rounded-2xl group ${i === 0 || i === 4 ? "row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square"}`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
