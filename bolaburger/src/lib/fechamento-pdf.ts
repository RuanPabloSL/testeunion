import { jsPDF } from "jspdf";

import type { FechamentoDiario } from "@/lib/fechamento-types";
import { formatDateBR } from "@/lib/fechamento-stats";
import { formatBRL } from "@/lib/pedidos-types";
import { FORMA_PAGAMENTO_META, STATUS_META } from "@/lib/pedidos-types";
import type { FormaPagamento, PedidoStatus } from "@/lib/pedidos-types";

const STORE = "Bola Burguer";

function statusLabel(status: string) {
  return STATUS_META[status as PedidoStatus]?.label ?? status;
}

function formaLabel(forma: string) {
  return FORMA_PAGAMENTO_META[forma as FormaPagamento]?.label ?? forma;
}

export function downloadFechamentoPdf(fechamento: FechamentoDiario) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margem = 14;
  let y = margem;

  const line = (text: string, size = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 182);
    for (const ln of lines) {
      if (y > 280) {
        doc.addPage();
        y = margem;
      }
      doc.text(ln, margem, y);
      y += size * 0.45 + 2;
    }
  };

  line(STORE, 16, true);
  line(`Fechamento — ${formatDateBR(fechamento.data)}`, 12, true);
  if (fechamento.iniciado_em && fechamento.encerrado_em) {
    const ini = new Date(fechamento.iniciado_em).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
    const fim = new Date(fechamento.encerrado_em).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
    line(`Turno: ${ini} – ${fim}`, 10);
  }
  y += 2;

  line(`Faturado: ${formatBRL(fechamento.faturado)}`, 11, true);
  line(`Recebido: ${formatBRL(fechamento.recebido)}`);
  line(`A receber: ${formatBRL(fechamento.a_receber)}`);
  line(
    `Pedidos: ${fechamento.total_pedidos} total · ${fechamento.pedidos_entregues} entregues · ${fechamento.pedidos_cancelados} cancelados`,
  );
  y += 4;

  line("Detalhamento", 12, true);
  y += 1;

  if (fechamento.detalhes.length === 0) {
    line("Nenhum pedido registrado neste dia.");
  } else {
    for (const p of fechamento.detalhes) {
      line(
        `#${p.id} · ${p.hora} · ${p.cliente} · ${statusLabel(p.status)} · ${formaLabel(p.forma_pagamento)} · ${p.pago ? "Pago" : "Pendente"} · ${formatBRL(p.total)}`,
        9,
      );
    }
  }

  y += 6;
  line(
    `Gerado em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
    8,
  );

  doc.save(`fechamento-${fechamento.data}-bolaburguer.pdf`);
}

export function downloadPeriodoPdf(
  titulo: string,
  resumo: { faturado: number; recebido: number; a_receber: number; total_pedidos: number; dias_registrados: number },
  fechamentos: FechamentoDiario[],
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margem = 14;
  let y = margem;

  const line = (text: string, size = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 182);
    for (const ln of lines) {
      if (y > 280) {
        doc.addPage();
        y = margem;
      }
      doc.text(ln, margem, y);
      y += size * 0.45 + 2;
    }
  };

  line(STORE, 16, true);
  line(titulo, 12, true);
  y += 2;
  line(`Faturado: ${formatBRL(resumo.faturado)}`, 11, true);
  line(`Recebido: ${formatBRL(resumo.recebido)}`);
  line(`A receber: ${formatBRL(resumo.a_receber)}`);
  line(`Pedidos: ${resumo.total_pedidos} · Dias fechados: ${resumo.dias_registrados}`);
  y += 4;

  if (fechamentos.length === 0) {
    line("Nenhum fechamento registrado no período.");
  } else {
    line("Por dia", 12, true);
    for (const f of fechamentos) {
      line(
        `${formatDateBR(f.data)} — Faturado ${formatBRL(f.faturado)} · Recebido ${formatBRL(f.recebido)} · ${f.total_pedidos} pedidos`,
        9,
      );
    }
  }

  doc.save(`relatorio-${titulo.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
