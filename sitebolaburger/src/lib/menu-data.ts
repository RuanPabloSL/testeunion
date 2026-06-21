import burger1 from "@/assets/burger-1.jpg";
import burger2 from "@/assets/burger-2.jpg";
import burger3 from "@/assets/burger-3.jpg";
import combo from "@/assets/combo.jpg";
import fries from "@/assets/fries.jpg";
import onionRings from "@/assets/onion-rings.jpg";
import drink from "@/assets/drink.jpg";
import burgerSalada from "@/assets/burger-salada.jpg";
import burgerTriploCalabresa from "@/assets/burger-triplo-calabresa.jpg";
import burgerCatupiryFritas from "@/assets/burger-catupiry-fritas.jpg";
import burgerCatupiryBacon from "@/assets/burger-catupiry-bacon.jpg";
import burgerBaconCheddar from "@/assets/burger-bacon-cheddar.jpg";
import burgerMegaTriplo from "@/assets/burger-mega-triplo.jpg";
import burgerClassico from "@/assets/burger-classico.jpg";
import friesPalito from "@/assets/fries-palito.jpg";
import friesRustica from "@/assets/fries-rustica.jpg";
import coca350ml from "@/assets/coca350ml.png";
import coca600ml from "@/assets/coca600ml.jpg";
import cocapadrao from "@/assets/cocapadrao.png";

export const IMAGE_MAP: Record<string, string> = {
  "burger-1": burger1,
  "burger-2": burger2,
  "burger-3": burger3,
  combo: combo,
  fries: fries,
  "onion-rings": onionRings,
  drink: drink,
  "burger-salada": burgerSalada,
  "burger-triplo-calabresa": burgerTriploCalabresa,
  "burger-catupiry-fritas": burgerCatupiryFritas,
  "burger-catupiry-bacon": burgerCatupiryBacon,
  "burger-bacon-cheddar": burgerBaconCheddar,
  "burger-mega-triplo": burgerMegaTriplo,
  "burger-classico": burgerClassico,
  "fries-palito": friesPalito,
  "fries-rustica": friesRustica,
  "coca350ml": coca350ml,
  "coca600ml": coca600ml,
  "cocapadrao": cocapadrao,
}

export const IMAGE_OPTIONS = Object.keys(IMAGE_MAP);

export const DEFAULT_CATEGORIES = ["Hambúrgueres", "Combos", "Porções", "Bebidas"];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  price: number;
  image: string;
  image_key: string;
  category: string;
  position: number;
  active: boolean;
}

export const resolveImage = (key: string) => IMAGE_MAP[key] ?? burger1;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "burger-salada",
    name: "Bola Salada Bacon",
    description: "Pão, hambúrguer 120g, queijo prata, bacon, tomate, alface, cebola roxa, maionese da casa.",
    ingredients: "",
    price: 28.0,
    image_key: "burger-salada",
    image: resolveImage("burger-salada"),
    category: "Hambúrgueres",
    position: 1,
    active: true,
  },
  {
    id: "burger-catupiry-fritas",
    name: "Bola Catupiry com Fritas",
    description: "Pão, hambúrguer 120g, catupiry, 100g de fritas, maionese da casa.",
    ingredients: "",
    price: 25.0,
    image_key: "burger-catupiry-fritas",
    image: resolveImage("burger-catupiry-fritas"),
    category: "Hambúrgueres",
    position: 2,
    active: true,
  },
  {
    id: "burger-catupiry-bacon",
    name: "Bola Catupiry com Bacon",
    description: "Pão, hambúrguer 120g, bacon, alho frito, alface, tomate, maionese da casa, Queijo prato.",
    ingredients: "",
    price: 28.0,
    image_key: "burger-catupiry-bacon",
    image: resolveImage("burger-catupiry-bacon"),
    category: "Hambúrgueres",
    position: 3,
    active: true,
  },
  {
    id: "burger-bacon-cheddar",
    name: "Bola Bacon Cheddar",
    description: "Pão, hambúrguer 120g, bacon, cheddar, cebola roxa, maionese da casa.",
    ingredients: "",
    price: 29.0,
    image_key: "burger-bacon-cheddar",
    image: resolveImage("burger-bacon-cheddar"),
    category: "Hambúrgueres",
    position: 4,
    active: true,
  },
  {
    id: "burger-mega-triplo",
    name: "Bola Mega Triplo",
    description: "Pão, 3 hambúrgueres 120g, bacon, cheddar, catupiry, calabresa, cebola roxa, maionese da casa.",
    ingredients: "",
    price: 44.0,
    image_key: "burger-mega-triplo",
    image: resolveImage("burger-mega-triplo"),
    category: "Hambúrgueres",
    position: 5,
    active: true,
  },
  {
    id: "burger-classico",
    name: "Bola Salada",
    description: "Pão, hambúrguer 120g, queijo prato, alface, tomate.",
    ingredients: "",
    price: 25.0,
    image_key: "burger-classico",
    image: resolveImage("burger-classico"),
    category: "Hambúrgueres",
    position: 6,
    active: true,
  },
  {
    id: "fries-palito",
    name: "Batata Palito 200g",
    description: "Crocante por fora, macia por dentro.",
    ingredients: "Batata palito frita, sal.",
    price: 16.9,
    image_key: "fries-palito",
    image: resolveImage("fries-palito"),
    category: "Porções",
    position: 7,
    active: true,
  },
  {
    id: "fries-palito-400g",
    name: "Batata Palito 400g",
    description: "Porção família para compartilhar.",
    ingredients: "Batata palito frita, sal.",
    price: 26.9,
    image_key: "fries-palito",
    image: resolveImage("fries-palito"),
    category: "Porções",
    position: 8,
    active: true,
  },
  {
    id: "fries-rustica-200g",
    name: "Batata Rústica 200g",
    description: "Com casca e temperos especiais.",
    ingredients: "Batata rústica frita, sal, ervas.",
    price: 19.9,
    image_key: "fries-rustica",
    image: resolveImage("fries-rustica"),
    category: "Porções",
    position: 8,
    active: true,
  },
  {
    id: "fries-rustica-400g",
    name: "Batata Rústica 400g",
    description: "Porção família para compartilhar.",
    ingredients: "Batata rústica frita, sal, ervas.",
    price: 18.9,
    image_key: "fries-rustica",
    image: resolveImage("fries-rustica"),
    category: "Porções",
    position: 10,
    active: true,
  },
  {
    id: "coca350ml",
    name: "Coca-Cola 350ml Latinha",
    description: "Bebida gelada para acompanhar.",
    ingredients: "Consulte os sabores disponíveis pelo WhatsApp.",
    price: 6.9,
    image_key: "coca350ml",
    image: resolveImage("coca350ml"),
    category: "Bebidas",
    position: 11,
    active: true,
  },
  {
    id: "coca500ml",
    name: "Coca-Cola 600ml",
    description: "Bebida gelada para acompanhar.",
    ingredients: "Consulte os sabores disponíveis pelo WhatsApp.",
    price: 6.9,
    image_key: "coca600ml",
    image: resolveImage("coca600ml"),
    category: "Bebidas",
    position: 12,
    active: true,
  },
  {
    id: "coca1L",
    name: "Coca-Cola 1 Litro",
    description: "Bebida gelada para acompanhar.",
    ingredients: "Consulte os sabores disponíveis pelo WhatsApp.",
    price: 6.9,
    image_key: "cocapadrao",
    image: resolveImage("cocapadrao"),
    category: "Bebidas",
    position: 13,
    active: true,
  },
  {
    id: "coca2L",
    name: "Coca-Cola 2 Litros",
    description: "Bebida gelada para acompanhar.",
    ingredients: "Consulte os sabores disponíveis pelo WhatsApp.",
    price: 6.9,
    image_key: "cocapadrao",
    image: resolveImage("cocapadrao"),
    category: "Bebidas",
    position: 14,
    active: true,
  },
];

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
