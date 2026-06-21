import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Menu } from "@/components/site/Menu";
import { About } from "@/components/site/About";
import { Gallery } from "@/components/site/Gallery";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Cart } from "@/components/site/Cart";
import { WhatsFab } from "@/components/site/WhatsFab";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <Menu />
        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <Cart />
      <WhatsFab />
    </CartProvider>
  );
}
