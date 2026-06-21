import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarRange,
  Download,
  FileText,
  History,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { downloadFechamentoPdf, downloadPeriodoPdf } from "@/lib/fechamento-pdf";
import {
  formatDateBR,
  fechamentosNoPeriodo,
  intervaloMes,
  intervaloSemana,
  resumoMensal,
  resumoSemanal,
  toDateKey,
} from "@/lib/fechamento-stats";
import {
  buildFechamentoFromPedidos,
  rowToFechamento,
  type FechamentoDiario,
} from "@/lib/fechamento-types";
import { formatBRL } from "@/lib/pedidos-types";
import type { Pedido } from "@/lib/pedidos-types";
import { formatTurnoHorario, type Turno } from "@/lib/turno-types";

interface Props {
  pedidosTurno: Pedido[];
  fechamentos: FechamentoDiario[];
  turnoAtivo: Turno | null;
  onFechamentoSalvo: () => void;
  onIniciarDia: () => Promise<void>;
  iniciandoDia: boolean;
}

export function FechamentoSection({
  pedidosTurno,
  fechamentos,
  turnoAtivo,
  onFechamentoSalvo,
  onIniciarDia,
  iniciandoDia,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const hojeKey = toDateKey();
  const semana = useMemo(() => resumoSemanal(fechamentos), [fechamentos]);
  const mes = useMemo(() => resumoMensal(fechamentos), [fechamentos]);

  const fechamentosSemana = useMemo(() => {
    const { inicio, fim } = intervaloSemana();
    return fechamentosNoPeriodo(fechamentos, inicio, fim);
  }, [fechamentos]);

  const fechamentosMes = useMemo(() => {
    const { inicio, fim } = intervaloMes();
    return fechamentosNoPeriodo(fechamentos, inicio, fim);
  }, [fechamentos]);

  const handleEncerrarDia = async () => {
    if (!turnoAtivo) return;
    setSalvando(true);
    try {
      const encerradoEm = new Date().toISOString();
      const payload = buildFechamentoFromPedidos(hojeKey, pedidosTurno, {
        id: turnoAtivo.id,
        iniciado_em: turnoAtivo.iniciado_em,
        encerrado_em: encerradoEm,
      });

      const { data, error } = await supabase
        .from("fechamentos_diarios")
        .insert({
          ...payload,
          detalhes: payload.detalhes as unknown as never,
        })
        .select()
        .single();

      if (error) {
        toast.error("Erro ao salvar fechamento. Rode a migration de turnos no Supabase.");
        console.error(error);
        return;
      }

      const { error: turnoError } = await supabase
        .from("turnos")
        .update({ encerrado_em: encerradoEm })
        .eq("id", turnoAtivo.id);

      if (turnoError) {
        console.error(turnoError);
      }

      const fechamento = rowToFechamento(data);
      downloadFechamentoPdf(fechamento);
      toast.success("Dia encerrado! PDF baixado. Clique em Iniciar dia quando quiser reabrir.");
      onFechamentoSalvo();
    } finally {
      setSalvando(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CalendarCheck className="size-6" />
              Fechamento e relatórios
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {turnoAtivo
                ? `Turno aberto · ${formatTurnoHorario(turnoAtivo)}`
                : "Nenhum turno aberto — inicie o dia para registrar pedidos."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!turnoAtivo ? (
              <Button size="lg" className="gap-2" onClick={onIniciarDia} disabled={iniciandoDia}>
                <PlayCircle className="size-4" />
                {iniciandoDia ? "Abrindo…" : "Iniciar dia"}
              </Button>
            ) : (
              <Button size="lg" className="gap-2" onClick={() => setConfirmOpen(true)}>
                <CalendarCheck className="size-4" /> Encerrar dia
              </Button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-5 border-border/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <CalendarRange className="size-3.5" /> Semanal
                </p>
                <p className="text-2xl font-bold mt-2 tabular-nums">{formatBRL(semana.faturado)}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{semana.label}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Recebido {formatBRL(semana.recebido)} · {semana.total_pedidos} pedidos ·{" "}
                  {semana.dias_registrados} fechamento(s)
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={fechamentosSemana.length === 0}
                onClick={() =>
                  downloadPeriodoPdf(`Relatório semanal — ${semana.label}`, semana, fechamentosSemana)
                }
              >
                <Download className="size-4" /> PDF
              </Button>
            </div>
          </Card>

          <Card className="p-5 border-border/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <CalendarRange className="size-3.5" /> Mensal
                </p>
                <p className="text-2xl font-bold mt-2 tabular-nums">{formatBRL(mes.faturado)}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{mes.label}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Recebido {formatBRL(mes.recebido)} · {mes.total_pedidos} pedidos ·{" "}
                  {mes.dias_registrados} fechamento(s)
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={fechamentosMes.length === 0}
                onClick={() =>
                  downloadPeriodoPdf(`Relatório mensal — ${mes.label}`, mes, fechamentosMes)
                }
              >
                <Download className="size-4" /> PDF
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-5 border-border/60">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <History className="size-4" /> Histórico de fechamentos
          </h3>
          {fechamentos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum fechamento ainda. Inicie o dia, registre pedidos e encerre ao final.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Data</th>
                    <th className="pb-2 pr-4 font-medium">Turno</th>
                    <th className="pb-2 pr-4 font-medium">Faturado</th>
                    <th className="pb-2 pr-4 font-medium">Recebido</th>
                    <th className="pb-2 pr-4 font-medium">Pedidos</th>
                    <th className="pb-2 font-medium">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {fechamentos.map((f) => (
                    <tr key={f.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4">{formatDateBR(f.data)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {f.iniciado_em && f.encerrado_em
                          ? `${new Date(f.iniciado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })} – ${new Date(f.encerrado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}`
                          : "—"}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">{formatBRL(f.faturado)}</td>
                      <td className="py-3 pr-4 tabular-nums">{formatBRL(f.recebido)}</td>
                      <td className="py-3 pr-4">{f.total_pedidos}</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" onClick={() => downloadFechamentoPdf(f)}>
                          <FileText className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encerrar o dia?</DialogTitle>
            <DialogDescription>
              Será gerado o registro de <strong>{formatDateBR(hojeKey)}</strong> com{" "}
              {pedidosTurno.length} pedido(s) deste turno. O PDF será baixado. Depois, use{" "}
              <strong>Iniciar dia</strong> quando quiser reabrir.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
            <p>
              Faturado:{" "}
              <strong>{formatBRL(buildFechamentoFromPedidos(hojeKey, pedidosTurno).faturado)}</strong>
            </p>
            <p>Pedidos: {pedidosTurno.length}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEncerrarDia} disabled={salvando}>
              {salvando ? "Salvando…" : "Confirmar e baixar PDF"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
