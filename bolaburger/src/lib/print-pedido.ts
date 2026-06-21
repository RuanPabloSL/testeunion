import type { Pedido } from "./pedidos-types";
import { formatBRL, FORMA_PAGAMENTO_META } from "./pedidos-types";

export function printPedido(pedido: Pedido, nomeLoja = "Burger Dashboard") {
  const data = new Date(pedido.created_at).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const itensHtml = pedido.itens.map((it) => `
    <tr>
      <td class="qtd">${it.quantidade}x</td>
      <td class="nome">${escapeHtml(it.nome)}</td>
      <td class="val">${formatBRL(it.preco * it.quantidade)}</td>
    </tr>
    ${it.observacao?.trim() ? `
      <tr>
        <td class="qtd"></td>
        <td class="obs" colspan="2">Obs: ${escapeHtml(it.observacao)}</td>
      </tr>
    ` : ""}
  `).join("");

  const taxaHtml = pedido.taxa_entrega > 0 ? `
    <tr>
      <td class="qtd"></td>
      <td class="nome">Taxa de entrega</td>
      <td class="val">${formatBRL(pedido.taxa_entrega)}</td>
    </tr>
  ` : "";

  const tipoLabel = pedido.tipo_entrega === "entrega" ? "ENTREGA" : "RETIRADA";
  const formaLabel = FORMA_PAGAMENTO_META[pedido.forma_pagamento]?.label ?? "—";
  const pagoLabel = pedido.pago ? "PAGO" : "A PAGAR";

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Pedido #${pedido.id}</title>
<style>
  @page { size: 80mm auto; margin: 4mm; }
  * { box-sizing: border-box; }
  body { font-family: ui-monospace, "SF Mono", Menlo, monospace; color: #000; margin: 0; padding: 8px; font-size: 12px; line-height: 1.45; }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: 700; }
  .lg { font-size: 16px; }
  .xl { font-size: 18px; }
  .muted { color: #444; }
  .sep { border: none; border-top: 1px dashed #000; margin: 8px 0; }
  .row { display: flex; justify-content: space-between; gap: 8px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 3px 0; vertical-align: top; }
  td.qtd { width: 28px; font-weight: 700; }
  td.val { text-align: right; white-space: nowrap; }
  td.obs { color: #444; font-size: 11px; padding-top: 0; }
  .badge { display: inline-block; border: 1px solid #000; padding: 2px 8px; border-radius: 999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
  .total { font-size: 20px; font-weight: 800; }
  .footer { margin-top: 12px; text-align: center; font-size: 11px; }
  @media screen {
    body { max-width: 320px; margin: 24px auto; box-shadow: 0 4px 24px rgba(0,0,0,.12); background: #fff; }
  }
</style>
</head>
<body>
  <div class="center bold xl">${escapeHtml(nomeLoja)}</div>
  <div class="center muted">Comprovante de Pedido</div>
  <hr class="sep" />

  <div class="row"><span class="muted">Pedido</span><span class="bold">#${pedido.id}</span></div>
  <div class="row"><span class="muted">Data</span><span>${data}</span></div>
  <div class="row"><span class="muted">Tipo</span><span class="badge">${tipoLabel}</span></div>

  <hr class="sep" />
  <div class="bold">Cliente</div>
  <div>${escapeHtml(pedido.cliente)}</div>
  ${pedido.telefone ? `<div class="muted">Tel: ${escapeHtml(pedido.telefone)}</div>` : ""}
  ${pedido.endereco ? `<div class="muted">${escapeHtml(pedido.endereco)}</div>` : ""}

  <hr class="sep" />
  <div class="bold" style="margin-bottom:4px;">Itens</div>
  <table>${itensHtml}${taxaHtml}</table>

  <hr class="sep" />
  <div class="row total"><span>TOTAL</span><span>${formatBRL(Number(pedido.total))}</span></div>

  <div class="row" style="margin-top:8px;">
    <span class="muted">Pagamento</span>
    <span class="bold">${escapeHtml(formaLabel)}</span>
  </div>
  <div class="center" style="margin-top:6px;">
    <span class="badge">${pagoLabel}</span>
  </div>

  <div class="footer">
    Obrigado pela preferência!<br/>
    ${new Date().toLocaleString("pt-BR")}
  </div>

  <script>
    window.addEventListener("load", () => {
      setTimeout(() => { window.print(); }, 150);
      window.addEventListener("afterprint", () => window.close());
    });
  </script>
</body>
</html>`;

  const w = window.open("", "_blank", "width=380,height=720");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
