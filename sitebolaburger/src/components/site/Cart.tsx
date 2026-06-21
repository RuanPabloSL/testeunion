import { useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatBRL } from "@/lib/menu-data";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "5535984450645";
const DELIVERY_FEE = 7;
const DELIVERY_OPTIONS = [
  { label: "Taxa de entrega - R$ 7,00", value: "delivery", fee: DELIVERY_FEE },
  { label: "Retirar sem taxa de entrega", value: "pickup", fee: 0 },
] as const;
const PAYMENT_OPTIONS = ["PIX", "Cartão", "Dinheiro"] as const;
type DeliveryMethod = (typeof DELIVERY_OPTIONS)[number]["value"] | "";
type PaymentMethod = (typeof PAYMENT_OPTIONS)[number] | "";

const FIELD_LIMITS = {
  name: 60,
  address: 160,
  notes: 200,
} as const;

export function Cart() {
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const selectedDelivery = DELIVERY_OPTIONS.find((option) => option.value === deliveryMethod);
  const deliveryFee = selectedDelivery?.fee ?? 0;
  const finalTotal = total + deliveryFee;

  const checkout = () => {
    if (items.length === 0) return;

    const customerName = name.trim();
    const customerAddress = address.trim();
    const orderNotes = notes.trim();

    if (!customerName) return toast.error("Informe seu nome");
    if (!customerAddress) return toast.error("Informe seu endereço");
    if (!deliveryMethod) return toast.error("Selecione entrega ou retirada");
    if (!paymentMethod) return toast.error("Selecione a forma de pagamento");

    const NL = "\n";
    const lines = items
      .map((item) => `${item.qty}x ${item.name} - ${formatBRL(item.price * item.qty)}`)
      .join(NL);

    const message =
      `Olá Bola Burguer! Quero fazer um pedido:${NL}${NL}` +
      `Itens:${NL}${lines}${NL}${NL}` +
      `Subtotal: ${formatBRL(total)}${NL}` +
      `Taxa de entrega: ${formatBRL(deliveryFee)}${NL}` +
      `Total: ${formatBRL(finalTotal)}${NL}${NL}` +
      `Cliente:${NL}` +
      `Nome: ${customerName}${NL}` +
      `Endereço: ${customerAddress}${NL}` +
      `Entrega/retirada: ${selectedDelivery?.label}${NL}` +
      `Pagamento: ${paymentMethod}` +
      (orderNotes ? `${NL}${NL}Observação: ${orderNotes}` : "");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-card border-l border-border shadow-card-premium flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-2xl font-black">Seu Pedido</h3>
            <p className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-secondary"
            aria-label="Fechar carrinho"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-6xl mb-4">🍔</div>
              <p>Seu carrinho está vazio.</p>
              <p className="text-xs mt-1">Adicione um lanche delicioso!</p>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 bg-background rounded-xl p-3 border border-border"
            >
              <img src={item.image} alt={item.name} className="size-20 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold truncate">{item.name}</h4>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remover ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="text-gold font-bold text-sm mt-1">{formatBRL(item.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setQty(item.id, item.qty - 1)}
                    className="size-7 rounded-md bg-secondary hover:bg-muted flex items-center justify-center"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-8 text-center font-bold">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.id, item.qty + 1)}
                    className="size-7 rounded-md bg-secondary hover:bg-muted flex items-center justify-center"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <div className="space-y-4 pt-2">
              <Field label="Nome *">
                <input
                  className="input"
                  value={name}
                  onChange={(event) => setName(event.target.value.slice(0, FIELD_LIMITS.name))}
                  placeholder="Seu nome"
                  autoComplete="name"
                  maxLength={FIELD_LIMITS.name}
                />
              </Field>

              <Field label="Endereço *">
                <textarea
                  className="input min-h-[88px]"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value.slice(0, FIELD_LIMITS.address))
                  }
                  placeholder="Rua, número, bairro e complemento"
                  autoComplete="street-address"
                  maxLength={FIELD_LIMITS.address}
                />
              </Field>

              <Field label="Observação">
                <textarea
                  className="input min-h-[76px]"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value.slice(0, FIELD_LIMITS.notes))}
                  placeholder="Ex: sem cebola, ponto da carne, troco..."
                  maxLength={FIELD_LIMITS.notes}
                />
              </Field>

              <Field label="Entrega ou retirada *">
                <div className="grid gap-2">
                  {DELIVERY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDeliveryMethod(option.value)}
                      className={`rounded-lg border px-3 py-3 text-left text-sm font-bold transition-colors ${
                        deliveryMethod === option.value
                          ? "border-gold bg-gold text-black"
                          : "border-border bg-background hover:bg-secondary"
                      }`}
                      aria-pressed={deliveryMethod === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Forma de pagamento *">
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPaymentMethod(option)}
                      className={`rounded-lg border px-2 py-3 text-sm font-bold transition-colors ${
                        paymentMethod === option
                          ? "border-gold bg-gold text-black"
                          : "border-border bg-background hover:bg-secondary"
                      }`}
                      aria-pressed={paymentMethod === option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-border p-5 space-y-3 bg-background/50">
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatBRL(total)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Taxa de entrega</span>
                <span>{formatBRL(deliveryFee)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-black text-gradient-fire">
                {formatBRL(finalTotal)}
              </span>
            </div>
            <button
              onClick={checkout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-fire text-white font-black py-4 shadow-glow hover:scale-[1.02] transition-transform"
            >
              <WhatsAppIcon className="size-5" /> Finalizar no WhatsApp
            </button>
            <button
              onClick={clear}
              className="w-full text-xs text-muted-foreground hover:text-destructive"
            >
              Limpar carrinho
            </button>
          </footer>
        )}
      </aside>

      <style>{`.input{width:100%;background:hsl(var(--background));border:1px solid hsl(var(--border));border-radius:0.6rem;padding:0.55rem 0.75rem;font-size:0.875rem;outline:none}.input:focus{border-color:hsl(var(--ring))}`}</style>
    </>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.34 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 5.45 17.5 2 12.04 2Zm0 18.16h-.01a8.22 8.22 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.17c-.25-.12-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.98-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1">{label}</span>
      {children}
    </label>
  );
}
