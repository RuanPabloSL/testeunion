import type { Pedido } from "@/lib/pedidos-types";

export interface FechamentoPedidoDetalhe {
  id: number;
  cliente: string;
  total: number;
  status: string;
  pago: boolean;
  forma_pagamento: string;
  hora: string;
}

export interface FechamentoDiario {
  id: number;
  data: string;
  faturado: number;
  recebido: number;
  a_receber: number;
  total_pedidos: number;
  pedidos_entregues: number;
  pedidos_cancelados: number;
  detalhes: FechamentoPedidoDetalhe[];
  created_at: string;
  turno_id: number | null;
  iniciado_em: string | null;
  encerrado_em: string | null;
}

export interface ResumoPeriodo {
  label: string;
  faturado: number;
  recebido: number;
  a_receber: number;
  total_pedidos: number;
  dias_registrados: number;
}

export type FechamentoDiarioInsert = Omit<FechamentoDiario, "id" | "created_at">;

export function rowToFechamento(row: {
  id: number;
  data: string;
  faturado: number;
  recebido: number;
  a_receber: number;
  total_pedidos: number;
  pedidos_entregues: number;
  pedidos_cancelados: number;
  detalhes: unknown;
  created_at: string;
  turno_id?: number | null;
  iniciado_em?: string | null;
  encerrado_em?: string | null;
}): FechamentoDiario {
  return {
    ...row,
    faturado: Number(row.faturado),
    recebido: Number(row.recebido),
    a_receber: Number(row.a_receber),
    detalhes: (row.detalhes ?? []) as FechamentoPedidoDetalhe[],
    turno_id: row.turno_id ?? null,
    iniciado_em: row.iniciado_em ?? null,
    encerrado_em: row.encerrado_em ?? null,
  };
}

export function pedidosToDetalhes(pedidos: Pedido[]): FechamentoPedidoDetalhe[] {
  return pedidos.map((p) => ({
    id: p.id,
    cliente: p.cliente,
    total: Number(p.total),
    status: p.status,
    pago: p.pago,
    forma_pagamento: p.forma_pagamento,
    hora: new Date(p.created_at).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    }),
  }));
}

export function buildFechamentoFromPedidos(
  data: string,
  pedidos: Pedido[],
  turno?: { id: number; iniciado_em: string; encerrado_em: string },
): FechamentoDiarioInsert {
  const ativos = pedidos.filter((p) => p.status !== "cancelado");
  return {
    data,
    faturado: ativos.reduce((s, p) => s + Number(p.total), 0),
    recebido: ativos.filter((p) => p.pago).reduce((s, p) => s + Number(p.total), 0),
    a_receber: ativos.filter((p) => !p.pago).reduce((s, p) => s + Number(p.total), 0),
    total_pedidos: pedidos.length,
    pedidos_entregues: pedidos.filter((p) => p.status === "entregue").length,
    pedidos_cancelados: pedidos.filter((p) => p.status === "cancelado").length,
    detalhes: pedidosToDetalhes(pedidos),
    turno_id: turno?.id ?? null,
    iniciado_em: turno?.iniciado_em ?? null,
    encerrado_em: turno?.encerrado_em ?? null,
  };
}
