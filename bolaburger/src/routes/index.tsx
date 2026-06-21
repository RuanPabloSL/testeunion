import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  TrendingUp,
  ClipboardList,
  ChefHat,
  Wallet,
  Flame,
  CircleDashed,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "sonner";
import { FechamentoSection } from "@/components/fechamento/FechamentoSection";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { getSupabaseConfigErrorMessage } from "@/lib/supabase-env";
import { rowToFechamento, type FechamentoDiario } from "@/lib/fechamento-types";
import { filterPedidosDoTurno, resumoHojeFromPedidos } from "@/lib/fechamento-stats";
import { rowToTurno, formatTurnoHorario, type Turno } from "@/lib/turno-types";
import type { Pedido, PedidoStatus, PedidoItem, TipoEntrega, FormaPagamento } from "@/lib/pedidos-types";
import { formatBRL, STATUS_META } from "@/lib/pedidos-types";
import { PedidoCard } from "@/components/pedidos/PedidoCard";
import { PedidoForm } from "@/components/pedidos/PedidoForm";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — Hamburgueria" },
      { name: "description", content: "Painel de pedidos da hamburgueria — registre, acompanhe e gerencie pedidos em tempo real." },
    ],
  }),
  component: Dashboard,
});

type Filter = "todos" | PedidoStatus;
type ViewTab = "pedidos" | "relatorios";

function Dashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [fechamentos, setFechamentos] = useState<FechamentoDiario[]>([]);
  const [turnoAtivo, setTurnoAtivo] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(true);
  const [iniciandoDia, setIniciandoDia] = useState(false);
  const [filter, setFilter] = useState<Filter>("todos");
  const [viewTab, setViewTab] = useState<ViewTab>("pedidos");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Pedido | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const pedidosTurno = useMemo(
    () => (turnoAtivo ? filterPedidosDoTurno(pedidos, turnoAtivo.iniciado_em) : []),
    [pedidos, turnoAtivo],
  );

  const loadFechamentos = useCallback(async () => {
    const { data, error } = await supabase
      .from("fechamentos_diarios")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setFechamentos((data ?? []).map(rowToFechamento));
  }, []);

  const loadTurnoAtivo = useCallback(async () => {
    const { data, error } = await supabase
      .from("turnos")
      .select("*")
      .is("encerrado_em", null)
      .order("iniciado_em", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error(error);
      return;
    }
    setTurnoAtivo(data ? rowToTurno(data) : null);
  }, []);

  const reloadOperacao = useCallback(async () => {
    await Promise.all([loadFechamentos(), loadTurnoAtivo()]);
  }, [loadFechamentos, loadTurnoAtivo]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConfigError(getSupabaseConfigErrorMessage());
      setLoading(false);
      return;
    }

    let active = true;
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("pedidos")
          .select("*")
          .order("created_at", { ascending: false });
        if (!active) return;
        if (error) {
          toast.error("Erro ao carregar pedidos");
          setLoading(false);
          return;
        }
        setPedidos((data ?? []) as unknown as Pedido[]);
        await reloadOperacao();
        setLoading(false);
      } catch (err) {
        if (!active) return;
        setConfigError(err instanceof Error ? err.message : getSupabaseConfigErrorMessage());
        setLoading(false);
      }
    };
    load();

    let ch: ReturnType<typeof supabase.channel> | undefined;
    try {
      ch = supabase
        .channel("pedidos-rt")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "pedidos" },
          (payload) => {
            setPedidos((prev) => {
              if (payload.eventType === "INSERT") {
                const novo = payload.new as unknown as Pedido;
                if (prev.some((p) => p.id === novo.id)) return prev;
                return [novo, ...prev];
              }
              if (payload.eventType === "UPDATE") {
                const atualizado = payload.new as unknown as Pedido;
                return prev.map((p) => (p.id === atualizado.id ? atualizado : p));
              }
              if (payload.eventType === "DELETE") {
                const removido = payload.old as unknown as { id: number };
                return prev.filter((p) => p.id !== removido.id);
              }
              return prev;
            });
          },
        )
        .subscribe();
    } catch {
      // Realtime opcional
    }

    return () => {
      active = false;
      if (ch) supabase.removeChannel(ch);
    };
  }, [reloadOperacao]);

  const handleIniciarDia = async () => {
    setIniciandoDia(true);
    try {
      const { data: aberto } = await supabase
        .from("turnos")
        .select("id")
        .is("encerrado_em", null)
        .limit(1)
        .maybeSingle();

      if (aberto) {
        toast.error("Já existe um turno aberto.");
        await loadTurnoAtivo();
        return;
      }

      const { data, error } = await supabase.from("turnos").insert({}).select().single();
      if (error) {
        toast.error("Erro ao iniciar dia. Rode a migration de turnos no Supabase.");
        console.error(error);
        return;
      }
      setTurnoAtivo(rowToTurno(data));
      toast.success("Dia iniciado! Pode registrar pedidos.");
      setViewTab("pedidos");
    } finally {
      setIniciandoDia(false);
    }
  };

  const { faturado: faturadoTurno, recebido: recebidoTurno, a_receber: aReceberTurno } =
    resumoHojeFromPedidos(pedidosTurno);
  const emPreparacao = pedidosTurno.filter((p) => p.status === "em-preparacao").length;
  const pendentes = pedidosTurno.filter((p) => p.status === "pendente").length;

  const filtered = useMemo(
    () => (filter === "todos" ? pedidosTurno : pedidosTurno.filter((p) => p.status === filter)),
    [pedidosTurno, filter],
  );

  const patchLocal = (id: number, patch: Partial<Pedido>) =>
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const handleStatus = async (id: number, status: PedidoStatus) => {
    const prev = pedidos.find((p) => p.id === id);
    patchLocal(id, { status });
    const { error } = await supabase.from("pedidos").update({ status }).eq("id", id);
    if (error) {
      if (prev) patchLocal(id, { status: prev.status });
      toast.error("Não foi possível atualizar");
    } else {
      toast.success(`Pedido #${id} → ${STATUS_META[status].label}`);
    }
  };

  const handleTogglePago = async (id: number, pago: boolean) => {
    patchLocal(id, { pago });
    const { error } = await supabase.from("pedidos").update({ pago }).eq("id", id);
    if (error) {
      patchLocal(id, { pago: !pago });
      toast.error("Não foi possível atualizar pagamento");
    } else {
      toast.success(pago ? `Pedido #${id} marcado como pago` : `Pedido #${id} marcado como pendente`);
    }
  };

  const handleSubmit = async (data: {
    cliente: string; telefone: string; endereco: string; itens: PedidoItem[]; total: number; tipo_entrega: TipoEntrega; taxa_entrega: number; forma_pagamento: FormaPagamento; pago: boolean;
  }) => {
    const payload = {
      cliente: data.cliente,
      telefone: data.telefone || null,
      endereco: data.endereco || null,
      itens: data.itens as unknown as never,
      total: data.total,
      tipo_entrega: data.tipo_entrega,
      taxa_entrega: data.taxa_entrega,
      forma_pagamento: data.forma_pagamento,
      pago: data.pago,
    };

    if (editing) {
      const { error } = await supabase.from("pedidos").update(payload).eq("id", editing.id);
      if (error) toast.error("Erro ao salvar"); else toast.success("Pedido atualizado");
    } else {
      const { error } = await supabase.from("pedidos").insert({ ...payload, status: "pendente" });
      if (error) toast.error("Erro ao criar"); else toast.success("Pedido criado");
    }
    setEditing(null);
  };

  const stats = [
    { label: "Faturado (turno)", value: formatBRL(faturadoTurno), icon: TrendingUp, accent: "text-info", bg: "bg-info/10" },
    { label: "Recebido (turno)", value: formatBRL(recebidoTurno), icon: Wallet, accent: "text-success", bg: "bg-success/10" },
    { label: "A receber", value: formatBRL(aReceberTurno), icon: CircleDashed, accent: "text-warning", bg: "bg-warning/15" },
    { label: "Em preparação", value: emPreparacao, icon: ChefHat, accent: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="min-h-screen bg-[var(--gradient-surface)]">
      <Toaster position="top-right" richColors />

      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-glow)]">
              <Flame className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">BolaBurguer Dashboard</h1>
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                {turnoAtivo ? ` · ${formatTurnoHorario(turnoAtivo)}` : " · Turno fechado"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs value={viewTab} onValueChange={(v) => setViewTab(v as ViewTab)}>
              <TabsList>
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
                <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              </TabsList>
            </Tabs>
            {!turnoAtivo ? (
              <Button
                size="lg"
                className="gap-2 shadow-[var(--shadow-glow)]"
                onClick={handleIniciarDia}
                disabled={iniciandoDia || !!configError}
              >
                <PlayCircle className="size-4" />
                {iniciandoDia ? "Abrindo…" : "Iniciar dia"}
              </Button>
            ) : (
              <Button
                onClick={() => { setEditing(null); setFormOpen(true); }}
                size="lg"
                className="shadow-[var(--shadow-glow)]"
              >
                <Plus className="size-4" /> Novo pedido
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {viewTab === "pedidos" && (
          <>
            {!turnoAtivo && !configError && !loading && (
              <Card className="p-10 text-center border-primary/30 bg-primary/5">
                <PlayCircle className="size-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold">Turno fechado</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Clique em <strong>Iniciar dia</strong> quando abrir a loja. Ao encerrar, o registro
                  vai para o histórico e você pode iniciar de novo quando quiser.
                </p>
                <Button className="mt-6 gap-2" size="lg" onClick={handleIniciarDia} disabled={iniciandoDia}>
                  <PlayCircle className="size-4" />
                  {iniciandoDia ? "Abrindo…" : "Iniciar dia"}
                </Button>
              </Card>
            )}

            {turnoAtivo && (
              <>
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <Card key={s.label} className="p-5 border-border/60">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
                          <p className="text-3xl font-bold mt-2 tabular-nums">{s.value}</p>
                        </div>
                        <div className={`size-10 rounded-xl grid place-items-center ${s.bg}`}>
                          <s.icon className={`size-5 ${s.accent}`} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </section>

                <section className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Pedidos do turno</h2>
                    <p className="text-sm text-muted-foreground">
                      {filtered.length} {filtered.length === 1 ? "pedido" : "pedidos"}
                      {pendentes > 0 && filter === "todos" && (
                        <span className="ml-2 inline-flex items-center gap-1 text-warning font-medium">
                          • {pendentes} aguardando
                        </span>
                      )}
                    </p>
                  </div>
                  <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                    <TabsList>
                      <TabsTrigger value="todos">Todos</TabsTrigger>
                      <TabsTrigger value="pendente">Pendentes</TabsTrigger>
                      <TabsTrigger value="em-preparacao">Preparo</TabsTrigger>
                      <TabsTrigger value="saiu-para-entrega">Saiu</TabsTrigger>
                      <TabsTrigger value="entregue">Entregues</TabsTrigger>
                      <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </section>
              </>
            )}

            {configError ? (
              <Card className="p-8 border-destructive/40 bg-destructive/5">
                <h3 className="font-semibold text-lg text-destructive">Configuração pendente</h3>
                <p className="text-sm text-muted-foreground mt-2">{configError}</p>
              </Card>
            ) : loading ? (
              <p className="text-center text-muted-foreground py-20">Carregando...</p>
            ) : turnoAtivo && filtered.length === 0 ? (
              <Card className="p-16 text-center border-dashed">
                <div className="size-14 rounded-2xl bg-muted mx-auto grid place-items-center mb-4">
                  <ClipboardList className="size-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Nenhum pedido neste turno</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-5">
                  Crie o primeiro pedido ou encerre o dia na aba Relatórios.
                </p>
                <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
                  <Plus className="size-4" /> Novo pedido
                </Button>
              </Card>
            ) : turnoAtivo ? (
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <PedidoCard
                    key={p.id}
                    pedido={p}
                    onStatusChange={handleStatus}
                    onTogglePago={handleTogglePago}
                    onEdit={(ped) => { setEditing(ped); setFormOpen(true); }}
                  />
                ))}
              </section>
            ) : null}
          </>
        )}

        {viewTab === "relatorios" && !configError && (
          <FechamentoSection
            pedidosTurno={pedidosTurno}
            fechamentos={fechamentos}
            turnoAtivo={turnoAtivo}
            onFechamentoSalvo={reloadOperacao}
            onIniciarDia={handleIniciarDia}
            iniciandoDia={iniciandoDia}
          />
        )}
      </main>

      <PedidoForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null); }}
        initial={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
