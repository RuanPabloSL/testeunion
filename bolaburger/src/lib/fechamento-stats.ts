import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import type { FechamentoDiario, ResumoPeriodo } from "@/lib/fechamento-types";
import type { Pedido } from "@/lib/pedidos-types";

const TZ = "America/Sao_Paulo";

/** Chave YYYY-MM-DD no fuso de São Paulo. */
export function toDateKey(date: Date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: TZ });
}

export function formatDateBR(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return format(new Date(y, m - 1, d), "dd/MM/yyyy", { locale: ptBR });
}

export function isPedidoDoDia(pedido: Pedido, dateKey: string = toDateKey()): boolean {
  return toDateKey(new Date(pedido.created_at)) === dateKey;
}

export function filterPedidosDoDia(pedidos: Pedido[], dateKey: string = toDateKey()): Pedido[] {
  return pedidos.filter((p) => isPedidoDoDia(p, dateKey));
}

export function filterPedidosDoTurno(pedidos: Pedido[], iniciadoEm: string): Pedido[] {
  const inicio = new Date(iniciadoEm).getTime();
  return pedidos.filter((p) => new Date(p.created_at).getTime() >= inicio);
}

function somarFechamentos(lista: FechamentoDiario[], label: string): ResumoPeriodo {
  return {
    label,
    faturado: lista.reduce((s, f) => s + f.faturado, 0),
    recebido: lista.reduce((s, f) => s + f.recebido, 0),
    a_receber: lista.reduce((s, f) => s + f.a_receber, 0),
    total_pedidos: lista.reduce((s, f) => s + f.total_pedidos, 0),
    dias_registrados: lista.length,
  };
}

export function resumoSemanal(fechamentos: FechamentoDiario[], ref: Date = new Date()): ResumoPeriodo {
  const { inicio, fim } = intervaloSemana(ref);
  const lista = fechamentos.filter((f) => f.data >= inicio && f.data <= fim);
  return somarFechamentos(
    lista,
    `Semana ${format(startOfWeek(ref, { weekStartsOn: 1 }), "dd/MM", { locale: ptBR })} – ${format(endOfWeek(ref, { weekStartsOn: 1 }), "dd/MM", { locale: ptBR })}`,
  );
}

export function resumoMensal(fechamentos: FechamentoDiario[], ref: Date = new Date()): ResumoPeriodo {
  const { inicio, fim } = intervaloMes(ref);
  const lista = fechamentos.filter((f) => f.data >= inicio && f.data <= fim);
  return somarFechamentos(lista, format(ref, "MMMM yyyy", { locale: ptBR }));
}

export function intervaloSemana(ref: Date = new Date()) {
  return {
    inicio: toDateKey(startOfWeek(ref, { weekStartsOn: 1 })),
    fim: toDateKey(endOfWeek(ref, { weekStartsOn: 1 })),
  };
}

export function intervaloMes(ref: Date = new Date()) {
  return {
    inicio: toDateKey(startOfMonth(ref)),
    fim: toDateKey(endOfMonth(ref)),
  };
}

export function fechamentosNoPeriodo(
  fechamentos: FechamentoDiario[],
  inicio: string,
  fim: string,
) {
  return fechamentos.filter((f) => f.data >= inicio && f.data <= fim);
}

export function resumoHojeFromPedidos(pedidos: Pedido[]): {
  faturado: number;
  recebido: number;
  a_receber: number;
} {
  const ativos = pedidos.filter((p) => p.status !== "cancelado");
  return {
    faturado: ativos.reduce((s, p) => s + Number(p.total), 0),
    recebido: ativos.filter((p) => p.pago).reduce((s, p) => s + Number(p.total), 0),
    a_receber: ativos.filter((p) => !p.pago).reduce((s, p) => s + Number(p.total), 0),
  };
}
